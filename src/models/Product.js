import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        price: { type: Number, require: true },
        description: String,
        category: String,
        image: String,
        countInStock: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;