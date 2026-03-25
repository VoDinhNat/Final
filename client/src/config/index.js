export const registerFormControls = [
    {
        name: "userName",
        label: "User Name",
        placeholder: "Enter your user name",
        componentType: "input",
        type: "text",
    },
    {
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        componentType: "input",
        type: "email",
    },
    {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        componentType: "input",
        type: "password",
    },
];

export const loginFormControls = [
    {
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        componentType: "input",
        type: "email",
    },
    {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        componentType: "input",
        type: "password",
    },
];

export const addProductFormElements = [
    {
        label: "Product Name",
        name: "title",
        componentType: "input",
        type: "text",
        placeholder: "Enter product name (e.g., Organic Bananas)",
    },
    {
        label: "Description",
        name: "description",
        componentType: "textarea",
        placeholder: "Enter product description",
    },
    {
        label: "Category",
        name: "category",
        componentType: "select",
        options: [
            { id: "fruits-vegetables", label: "Fruits & Veggies" },
            { id: "meat-seafood", label: "Meat & Seafood" },
            { id: "dairy-eggs", label: "Dairy & Eggs" },
            { id: "beverages", label: "Beverages" },
            { id: "pantry", label: "Pantry & Dry Goods" },
            { id: "snacks", label: "Snacks" },
            { id: "household", label: "Household" },
        ],
    },
    {
        label: "Brand",
        name: "brand",
        componentType: "select",
        options: [
            { id: "local-farm", label: "Local Farm / Fresh" },
            { id: "vinamilk", label: "Vinamilk" },
            { id: "th-true-milk", label: "TH True Milk" },
            { id: "masan", label: "Masan (Chinsu/Nam Ngu)" },
            { id: "acecook", label: "Acecook (Hao Hao)" },
            { id: "coca-cola", label: "Coca-Cola" },
            { id: "pepsi", label: "PepsiCo" },
            { id: "nestle", label: "Nestlé" },
            { id: "unilever", label: "Unilever (Omo/Sunlight)" },
        ],
    },
    {
        label: "Price",
        name: "price",
        componentType: "input",
        type: "number",
        placeholder: "Enter product price",
    },
    {
        label: "Sale Price",
        name: "salePrice",
        componentType: "input",
        type: "number",
        placeholder: "Enter sale price (optional)",
    },
    {
        label: "Total Stock",
        name: "totalStock",
        componentType: "input",
        type: "number",
        placeholder: "Enter total stock",
    },
];

export const shoppingViewHeaderMenuItems = [
    { id: "home", label: "Home", path: "/shop/home" },
    { id: "fruits-vegetables", label: "Fruits & Veggies", path: "/shop/listing" },
    { id: "meat-seafood", label: "Meat & Seafood", path: "/shop/listing" },
    { id: "dairy-eggs", label: "Dairy & Eggs", path: "/shop/listing" },
    { id: "beverages", label: "Beverages", path: "/shop/listing" },
    { id: "pantry", label: "Pantry & Dry Goods", path: "/shop/listing" },
    { id: "snacks", label: "Snacks", path: "/shop/listing" },
    { id: "household", label: "Household", path: "/shop/listing" },
    { id: "search", label: "Search", path: "/shop/search" },
];

export const filterOptions = {
    category: [
        { id: "fruits-vegetables", label: "Fruits & Veggies" },
        { id: "meat-seafood", label: "Meat & Seafood" },
        { id: "dairy-eggs", label: "Dairy & Eggs" },
        { id: "beverages", label: "Beverages" },
        { id: "pantry", label: "Pantry & Dry Goods" },
        { id: "snacks", label: "Snacks" },
        { id: "household", label: "Household" },
    ],
    brand: [
        { id: "local-farm", label: "Local Farm / Fresh" },
        { id: "vinamilk", label: "Vinamilk" },
        { id: "th-true-milk", label: "TH True Milk" },
        { id: "masan", label: "Masan" },
        { id: "acecook", label: "Acecook" },
        { id: "coca-cola", label: "Coca-Cola" },
        { id: "pepsi", label: "PepsiCo" },
        { id: "nestle", label: "Nestlé" },
        { id: "unilever", label: "Unilever" },
    ],
};

export const sortOptions = [
    {id: "price-lowtohigh", label: "Price: Low to High"},
    {id: "price-hightolow", label: "Price: High to Low"},
    {id: "title-atoz", label: "Title: A to Z"},
    {id: "title-ztoa", label: "Title: Z to A"},
];

export const categoryOptionsMap = {
    "fruits-vegetables": "Fruits & Veggies",
    "meat-seafood": "Meat & Seafood",
    "dairy-eggs": "Dairy & Eggs",
    "beverages": "Beverages",
    "pantry": "Pantry & Dry Goods",
    "snacks": "Snacks",
    "household": "Household",
};

export const brandOptionsMap = {
    "local-farm": "Local Farm / Fresh",
    "vinamilk": "Vinamilk",
    "th-true-milk": "TH True Milk",
    "masan": "Masan",
    "acecook": "Acecook",
    "coca-cola": "Coca-Cola",
    "pepsi": "PepsiCo",
    "nestle": "Nestlé",
    "unilever": "Unilever",
};