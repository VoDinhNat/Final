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
    Home,
    Search,
    User,
} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllFilteredProducts, fetchProductDetails} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import {Link, useNavigate} from "react-router-dom";
import {addToCart, fetchCartItems} from "@/store/shop/cart-slice";
import {useToast} from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import {getFeatureImages} from "@/store/common-slice";

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

function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const {productList, productDetails} = useSelector((state) => state.shopProducts);
    const {featureImageList} = useSelector((state) => state.common);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();

    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem("filters");
        const currentFilter = {
            [section]: [getCurrentItem.id],
        };
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        navigate(`/auth/login`);
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    function handleAddtoCart(getCurrentProductId) {
        if (!user) {
            navigate("/auth/login");
            return;
        }

        dispatch(
            addToCart({
                userId: user?.id,
                productId: getCurrentProductId,
                quantity: 1,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({
                    title: "Product is added to cart",
                });
            }
        });
    }

    useEffect(() => {
        if (productDetails) setOpenDetailsDialog(true);
    }, [productDetails]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
        }, 15000);

        return () => clearInterval(timer);
    }, [featureImageList]);

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({filterParams: {}, sortParams: "price-lowtohigh"}));
    }, [dispatch]);

    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch]);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
                <div className="flex h-16 items-center justify-between px-4 md:px-6">
                    <Link to="/" className="flex items-center gap-2">
                        <Home className="h-6 w-6"/>
                        <span className="font-bold">GreenBasket Market</span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        {[...categoriesWithIcon]
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 11)
                            .map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/auth/login`}
                                    className="no-underline font-bold"
                                >
                                    {category.label}
                                </Link>
                            ))}
                    </nav>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon">
                            <Search className="w-4 h-4"/>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => navigate("/auth/login")}>
                            <User className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="relative w-full h-[600px] overflow-hidden">
                {featureImageList?.map((slide, index) => (
                    <img
                        src={slide?.image}
                        key={slide?._id || slide?.id || slide?.image || index}
                        className={`${
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                    />
                ))}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronLeftIcon className="w-4 h-4"/>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronRightIcon className="w-4 h-4"/>
                </Button>
            </div>

            <section className="py-12 bg-secondary/40">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Products by category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categoriesWithIcon.map((categoryItem) => (
                            <Card
                                key={categoryItem.id}
                                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
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

            <section className="py-12 bg-secondary/40">
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
                    <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
                        {productList?.map((productItem) => (
                            <ShoppingProductTile
                                key={productItem.id || productItem._id}
                                handleGetProductDetails={handleGetProductDetails}
                                product={productItem}
                                handleAddtoCart={handleAddtoCart}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />
        </div>
    );
}

export default HomePage;
