import express from "express"
import Product from "../models/Product.js"

const router = express.Router();

// get all product
router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// create product
router.post("/", async (req, res) => {
    try {
        const product = new Product(req.body);
        const createProduct = await product.save();
        res.status(201).json(createProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;