const {imageUploadUtil} = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const normalizeString = (value = "") => value.trim();

const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);

        res.json({
            success: true,
            result,
        });
    } catch (error) {

        res.json({
            success: false,
            message: "Error occured",
        });
    }
};

//add a new product
const addProduct = async (req, res) => {
    try {
        let {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
        } = req.body;

        title = normalizeString(title);
        description = normalizeString(description);
        category = normalizeString(category);
        brand = normalizeString(brand);
        image = normalizeString(image);

        if (!image || !title || !description || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "Image, title, description, category and brand are required",
            });
        }

        const newlyCreatedProduct = new Product({
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
        });

        await newlyCreatedProduct.save();
        res.status(201).json({
            success: true,
            data: newlyCreatedProduct,
        });
    } catch (e) {

        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Product.find({});
        res.status(200).json({
            success: true,
            data: listOfProducts,
        });
    } catch (e) {

        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};

//edit a product
const editProduct = async (req, res) => {
    try {
        const {id} = req.params;
        let {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
        } = req.body;

        let findProduct = await Product.findById(id);
        if (!findProduct)
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });

        const normalizedTitle = typeof title === "string" ? normalizeString(title) : title;
        const normalizedDescription =
            typeof description === "string" ? normalizeString(description) : description;
        const normalizedCategory =
            typeof category === "string" ? normalizeString(category) : category;
        const normalizedBrand = typeof brand === "string" ? normalizeString(brand) : brand;
        const normalizedImage = typeof image === "string" ? normalizeString(image) : image;

        findProduct.title = normalizedTitle || findProduct.title;
        findProduct.description = normalizedDescription || findProduct.description;
        findProduct.category = normalizedCategory || findProduct.category;
        findProduct.brand = normalizedBrand || findProduct.brand;
        findProduct.price = price === "" ? 0 : price || findProduct.price;
        findProduct.salePrice =
            salePrice === "" ? 0 : salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.image = normalizedImage || findProduct.image;
        findProduct.averageReview = averageReview || findProduct.averageReview;

        await findProduct.save();
        res.status(200).json({
            success: true,
            data: findProduct,
        });
    } catch (e) {

        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};

//delete a product
const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product)
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });

        res.status(200).json({
            success: true,
            message: "Product delete successfully",
        });
    } catch (e) {

        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};

module.exports = {
    handleImageUpload,
    addProduct,
    fetchAllProducts,
    editProduct,
    deleteProduct,
};
