import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {Dialog} from "../ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import {useDispatch, useSelector} from "react-redux";
import {getAllOrdersByUserId, getOrderDetails, resetOrderDetails,} from "@/store/shop/order-slice";
import {Badge} from "../ui/badge";

function ShoppingOrders() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const {orderList, orderDetails} = useSelector((state) => state.shopOrder);

    function handleFetchOrderDetails(getId) {
        dispatch(getOrderDetails(getId));
    }

    useEffect(() => {
        dispatch(getAllOrdersByUserId(user?.id));
    }, [dispatch, user?.id]);

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails]);

    const totalOrderPrice = orderList?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead style={{color: "black"}}>Order ID</TableHead>
                            <TableHead style={{color: "black"}}>Order Date</TableHead>
                            <TableHead style={{color: "black"}}>Order Status</TableHead>
                            <TableHead style={{color: "black"}}>Order Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList && orderList.length > 0
                            ? orderList.map((orderItem) => (
                                <TableRow
                                    key={orderItem?._id}
                                    onClick={() => handleFetchOrderDetails(orderItem?._id)}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    <TableCell>{orderItem?._id}</TableCell>
                                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`py-1 px-3 ${
                                                orderItem?.orderStatus === "confirmed"
                                                    ? "bg-green-500"
                                                    : orderItem?.orderStatus === "rejected"
                                                        ? "bg-red-600"
                                                        : "bg-black"
                                            }`}
                                        >
                                            {orderItem?.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${orderItem?.totalAmount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                            : null}
                        {orderList && orderList.length > 0 && (
                            <TableRow className="font-bold">
                                <TableCell colSpan={3} className="text-right">Total Order Price:</TableCell>
                                <TableCell>${totalOrderPrice.toFixed(2)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog
                open={openDetailsDialog}
                onOpenChange={() => {
                    setOpenDetailsDialog(false);
                    dispatch(resetOrderDetails());
                }}
            >
                <ShoppingOrderDetailsView orderDetails={orderDetails}/>
            </Dialog>
        </Card>
    );
}

export default ShoppingOrders;
