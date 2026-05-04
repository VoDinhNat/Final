import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {capturePayment} from "@/store/shop/order-slice";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {useToast} from "@/hooks/use-toast";
import {clearCart, fetchCartItems} from "@/store/shop/cart-slice";

function PaypalReturnPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const {toast} = useToast();
    const {user} = useSelector((state) => state.auth);
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");

    useEffect(() => {
        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

        if (!paymentId || !payerId || !orderId) {
            toast({
                title: "Payment was not completed. Please try checkout again.",
                variant: "destructive",
            });
            navigate("/shop/checkout");
            return;
        }

        dispatch(capturePayment({paymentId, payerId, orderId})).then((data) => {
            if (data?.payload?.success) {
                sessionStorage.removeItem("currentOrderId");
                dispatch(clearCart());
                if (user?.id) {
                    dispatch(fetchCartItems(user.id));
                }
                navigate("/shop/payment-success", {replace: true});
                return;
            }

            toast({
                title: data?.payload?.message || "Payment capture failed. Please try again.",
                variant: "destructive",
            });
            navigate("/shop/checkout");
        });
    }, [paymentId, payerId, dispatch, navigate, toast, user?.id]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Processing Payment...Please wait!</CardTitle>
            </CardHeader>
        </Card>
    );
}

export default PaypalReturnPage;
