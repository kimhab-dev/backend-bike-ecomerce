import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: String,

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },

        image: String,
        countInStock: { type: Number, default: 0 },

        // ✅ Add these fields
        power: String,
        topSpeed: String,
        torque: String,
        weight: String,

        technicalSpecs: {
            engineType: String,
            maxPower: String,
            maxTorque: String,
            dryWeight: String,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;