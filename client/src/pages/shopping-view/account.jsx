import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import accImg1 from "../../assets/nt1.png";
import accImg2 from "../../assets/nt2.jpg";
import accImg3 from "../../assets/nt3.jpg";
import accImg4 from "../../assets/nt4.jpg";
import accImg5 from "../../assets/nt5.jpg";
import accImg6 from "../../assets/nt6.jpg";
import accImg7 from "../../assets/nt7.jpg";
import accImg8 from "../../assets/nt8.jpg";
import accImg9 from "../../assets/nt9.jpg";
import accImg10 from "../../assets/nt10.jpg";

import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import {useEffect, useState} from "react";

function ShoppingAccount() {
    const images = [accImg1, accImg2, accImg3, accImg4, accImg5, accImg6, accImg7, accImg8, accImg9, accImg10];
    const [currentImage, setCurrentImage] = useState(images[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * images.length);
            setCurrentImage(images[randomIndex]);
        }, 60000);
        return () => clearInterval(interval);
    }, [images]);

    return (
        <div className="flex flex-col">
            <div className="relative w-full overflow-hidden">
                <img
                    src={currentImage}
                    className="w-full h-auto object-cover object-center aspect-[16/9]"
                    alt="Account background"
                />
            </div>
            <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
                <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                    <Tabs defaultValue="orders">
                        <TabsList>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="address">Address</TabsTrigger>
                        </TabsList>
                        <TabsContent value="orders">
                            <ShoppingOrders/>
                        </TabsContent>
                        <TabsContent value="address">
                            <Address/>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default ShoppingAccount;

