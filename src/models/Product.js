import mongoose from "mongoose";

const technicalSpecsSchema = new mongoose.Schema({
    engineType: String,
    maxPower: String,
    maxTorque: String,
    dryWeight: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    description: String,

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    image: String,

    countInStock: {
        type: Number,
        default: 0,
    },

    topSpeed: String,

    technicalSpecs: technicalSpecsSchema,

}, { timestamps: true });


const Product = mongoose.model("Product", productSchema);

export default Product;