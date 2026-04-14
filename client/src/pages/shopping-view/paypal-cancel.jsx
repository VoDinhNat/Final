import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useNavigate} from "react-router-dom";

function PaypalCancelPage() {
    const navigate = useNavigate();

    return (
        <Card className="p-10">
            <CardHeader className="p-0">
                <CardTitle className="text-3xl">Payment was cancelled</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 text-muted-foreground">
                You cancelled the PayPal payment before completing checkout.
            </CardContent>
            <Button className="mt-5" onClick={() => navigate("/shop/checkout")}>
                Back to Checkout
            </Button>
        </Card>
    );
}

export default PaypalCancelPage;
