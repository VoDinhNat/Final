import { Store, ShoppingCart } from "lucide-react"; 
import { Link } from "react-router-dom";
import { Sheet, SheetTrigger } from "../ui/sheet"; 
import { Button } from "../ui/button";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Label } from "../ui/label";

function MenuItems() {
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          className="text-sm font-bold cursor-pointer hover:text-green-600 transition-colors" 
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const cartItemsCount = 0; 

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet>
        <SheetTrigger asChild>
            <Button
            variant="outline"
            size="icon"
            className="relative border-green-200 hover:bg-green-50 hover:text-green-700"
            >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-[-5px] right-[2px] font-bold text-sm text-green-700">
                {cartItemsCount}
            </span>
            <span className="sr-only">User cart</span>
            </Button>
        </SheetTrigger>
        
      </Sheet>

    </div>
  );
}

function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <Store className="h-6 w-6 text-green-600" /> 
          <span className="font-bold text-xl text-green-700 tracking-tight">
          GreenBasket
          </span>
        </Link>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;