import mongoose from "mongoose";
import Product from "./Product.js";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
},
    { timestamps: true }
);

// auto delete product when category was delete
categorySchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        await Product.deleteMany({ category: this._id });
        next;
    } catch (error) {
        next(error);
    }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;