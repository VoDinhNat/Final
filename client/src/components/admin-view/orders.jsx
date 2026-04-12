import {useEffect, useState} from "react";
import {CardContent, CardHeader, CardTitle} from "../ui/card";
import {Dialog} from "../ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import {useDispatch, useSelector} from "react-redux";
import {getAllOrdersForAdmin, resetOrderDetails,getOrderDetailsForAdmin} from "@/store/admin/order-slice";
import {Badge} from "../ui/badge";

function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const {orderList, orderDetails} = useSelector((state) => state.adminOrder);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrdersForAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails]);

    const handleFetchOrderDetails = (orderId) => {
        dispatch(getOrderDetailsForAdmin(orderId));
    };

    const totalOrderPrice = orderList.reduce((total, order) => total + (order?.totalAmount || 0), 0);

    return (
        <div>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="responsive-table">
                    <TableHeader>
                        <TableRow>
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
                                    <TableCell data-label="Order Date">
                                        {orderItem?.orderDate.split("T")[0]}
                                    </TableCell>
                                    <TableCell data-label="Order Status">
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
                                    <TableCell data-label="Order Price">
                                        ${orderItem?.totalAmount}
                                    </TableCell>
                                </TableRow>
                            ))
                            : null}
                        <TableRow className="font-bold">
                            <TableCell colSpan={2} className="text-right">
                                Total Price:
                            </TableCell>
                            <TableCell>${totalOrderPrice.toFixed(2)}</TableCell>
                        </TableRow>
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
                <AdminOrderDetailsView orderDetails={orderDetails}/>
            </Dialog>
        </div>
    );
}

export default AdminOrdersView;
