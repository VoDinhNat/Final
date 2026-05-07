const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const CLIENT_BASE_URL = (process.env.CLIENT_BASE_URL || "http://localhost:5173").replace(
    /\/+$/,
    ""
);
const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];
const ALLOWED_RETURN_ORIGINS = new Set(
    [
        ...DEFAULT_ALLOWED_ORIGINS,
        ...(process.env.CORS_ORIGINS || "")
            .split(",")
            .map((origin) => origin.trim())
            .filter(Boolean),
        CLIENT_BASE_URL,
    ].filter(Boolean)
);

const normalizeOrigin = (value) => (value || "").trim().replace(/\/+$/, "");

const getPaypalReturnBaseUrl = (req, clientOrigin) => {
    const safeClientOrigin = normalizeOrigin(clientOrigin);
    if (safeClientOrigin && ALLOWED_RETURN_ORIGINS.has(safeClientOrigin)) {
        return safeClientOrigin;
    }

    const requestOrigin = normalizeOrigin(req.headers.origin);

    if (requestOrigin && ALLOWED_RETURN_ORIGINS.has(requestOrigin)) {
        return requestOrigin;
    }

    return CLIENT_BASE_URL;
};

const createOrder = async (req, res) => {
    try {
        if (process.env.NODE_ENV === "production" && !process.env.CLIENT_BASE_URL) {
            return res.status(500).json({
                success: false,
                message: "Server misconfigured: CLIENT_BASE_URL is required in production.",
            });
        }

        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId,
            clientOrigin,
        } = req.body;
        const paypalReturnBaseUrl = getPaypalReturnBaseUrl(req, clientOrigin);

        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: `${paypalReturnBaseUrl}/?paypal_return=1`,
                cancel_url: `${paypalReturnBaseUrl}/?paypal_cancel=1`,
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map((item) => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: "USD",
                            quantity: item.quantity,
                        })),
                    },
                    amount: {
                        currency: "USD",
                        total: totalAmount.toFixed(2),
                    },
                    description: "description",
                },
            ],
        };

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                // console.error("[PAYPAL_CREATE_ERROR]", error?.response || error);

                return res.status(500).json({
                    success: false,
                    message: "Error while creating paypal payment",
                });
            } else {
                const newlyCreatedOrder = new Order({
                    userId,
                    cartId,
                    cartItems,
                    addressInfo,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    totalAmount,
                    orderDate,
                    orderUpdateDate,
                    paymentId,
                    payerId,
                });

                await newlyCreatedOrder.save();

                const approvalURL = paymentInfo.links.find(
                    (link) => link.rel === "approval_url"
                ).href;

                // console.log("[PAYPAL_CREATE_SUCCESS]", {
                //     orderId: newlyCreatedOrder._id?.toString(),
                //     paymentId: paymentInfo?.id,
                //     totalAmount: newlyCreatedOrder?.totalAmount,
                // });
                res.status(201).json({
                    success: true,
                    approvalURL,
                    orderId: newlyCreatedOrder._id,
                });
            }
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const capturePayment = async (req, res) => {
    try {
        const {paymentId, payerId, orderId} = req.body;

        // console.log("[PAYPAL_CAPTURE_REQUEST]", {orderId, paymentId, payerId});

        // if (!paymentId || !payerId || !orderId) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Missing required payment fields",
        //     });
        // }
        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order can not be found",
            });
        }

        const executePaymentJson = {
            payer_id: payerId,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: Number(order.totalAmount).toFixed(2),
                    },
                },
            ],
        };

        const executedPayment = await new Promise((resolve, reject) => {
            paypal.payment.execute(
                paymentId,
                executePaymentJson,
                (error, paymentResult) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(paymentResult);
                }
            );
        });

        const paymentState = executedPayment?.state;
        const transaction = executedPayment?.transactions?.[0];
        const paidAmount = Number(transaction?.amount?.total);
        const paidCurrency = transaction?.amount?.currency;
        const isValidAmount =
            Number.isFinite(paidAmount) &&
            paidAmount === Number(order.totalAmount.toFixed(2));

        if (paymentState !== "approved" || !isValidAmount || paidCurrency !== "USD") {
            console.error("[PAYPAL_CAPTURE_VALIDATION_FAILED]", {
                orderId,
                paymentId,
                paymentState,
                paidAmount,
                paidCurrency,
                expectedAmount: Number(order.totalAmount.toFixed(2)),
                expectedCurrency: "USD",
            });
            return res.status(400).json({
                success: false,
                message: "Payment validation failed",
            });
        }

        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;

        for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
            //         message: "Product can not be found",
            //     });
            // }

            // if (product.totalStock < item.quantity) {
            //     return res.status(400).json({
            //         success: false,
                    message: `Not enough stock for this product ${product.title}`,
                });
            }

            product.totalStock -= item.quantity;

            await product.save();
        }

        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        // console.log("[PAYPAL_CAPTURE_SUCCESS]", {
        //     orderId: order._id?.toString(),
        //     paymentId,
        //     payerId,
        //     paidAmount,
        //     paidCurrency,
        // });
        res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getAllOrdersByUser = async (req, res) => {
    try {
        const {userId} = req.params;

        const orders = await Order.find({userId});

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found!",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const {id} = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found!",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

module.exports = {
    createOrder,
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails,
};
