const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        salePrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalStock: {
            type: Number,
            required: true,
            min: 0,
        },
        averageReview: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product", ProductSchema);
