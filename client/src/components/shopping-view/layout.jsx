import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import ShoppingHeader from "./header";

function ShoppingLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get("paymentId");
        const payerId = params.get("PayerID");

        if (
            paymentId &&
            payerId &&
            location.pathname !== "/shop/paypal-return"
        ) {
            navigate(`/shop/paypal-return${location.search}`, {replace: true});
        }
    }, [location.pathname, location.search, navigate]);

    return (
        <div className="flex flex-col bg-white overflow-hidden">
            <ShoppingHeader/>
            <main className="flex flex-col w-full">
                <Outlet/>
            </main>
        </div>
    );
}

export default ShoppingLayout;
