import {Button} from "@/components/ui/button";
import { 
    Apple, 
    Fish, 
    Milk, 
    CupSoda, 
    Wheat, 
    Cookie, 
    Sparkles,
    Leaf, 
    Droplets, 
    Soup, 
    Coffee, 
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import {useNavigate} from "react-router-dom";

export const categoriesWithIcon = [
    { id: "fruits-vegetables", label: "Fruits & Veggies", icon: Apple },
    { id: "meat-seafood", label: "Meat & Seafood", icon: Fish },
    { id: "dairy-eggs", label: "Dairy & Eggs", icon: Milk },
    { id: "beverages", label: "Beverages", icon: CupSoda },
    { id: "pantry", label: "Pantry & Dry Goods", icon: Wheat }, 
    { id: "snacks", label: "Snacks", icon: Cookie },
    { id: "household", label: "Household", icon: Sparkles }, 
];

export const brandsWithIcon = [
    { id: "local-farm", label: "Local Farm", icon: Leaf },
    { id: "vinamilk", label: "Vinamilk", icon: Milk }, 
    { id: "th-true-milk", label: "TH True Milk", icon: Droplets },
    { id: "masan", label: "Masan", icon: Soup },
    { id: "acecook", label: "Acecook", icon: Soup },
    { id: "coca-cola", label: "Coca-Cola", icon: CupSoda },
    { id: "pepsi", label: "PepsiCo", icon: CupSoda },
    { id: "nestle", label: "Nestlé", icon: Coffee },
    { id: "unilever", label: "Unilever", icon: Sparkles },
];


function ShoppingHome() {
    // const [currentSlide, setCurrentSlide] = useState(0);
    const {productList} = useSelector(
        (state) => state.shopProducts
    );

    const {user} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem("filters");
        const currentFilter = {
            [section]: [getCurrentItem.id],
        };

        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        navigate(`/shop/listing`);
    }


    useEffect(() => {
        const timer = setInterval(() => {
        }, 15000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {

    }, [dispatch]);
    
    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[600px] overflow-hidden">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setCurrentSlide(
                            (prevSlide) =>
                                (prevSlide - 1 + 3) %
                                3
                        )
                    }
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronLeftIcon className="w-4 h-4"/>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setCurrentSlide(
                            (prevSlide) => (prevSlide + 1) % 3
                        )
                    }
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronRightIcon className="w-4 h-4"/>
                </Button>
            </div>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Products by category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categoriesWithIcon.map((categoryItem) => (
                            <Card
                                key={categoryItem.id}
                                onClick={() =>
                                    handleNavigateToListingPage(categoryItem, "category")
                                }
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary"/>
                                    <span className="font-bold">{categoryItem.label}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Products by Brand</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {brandsWithIcon.map((brandItem) => (
                            <Card
                                key={brandItem.id}
                                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <span className="font-bold">{brandItem.label}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Feature Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
                        {productList && productList.length > 0
                            ? productList.map((productItem) => (
                                <ShoppingProductTile
                                    key={productItem?._id ?? productItem?.id}
                                    product={productItem}
                                    handleAddtoCart={handleAddtoCart}
                                />
                            ))
                            : null}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ShoppingHome;