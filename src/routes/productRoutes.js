import express from "express"
import Product from "../models/Product.js"

const router = express.Router();

// get all product
router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// get product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(400).json({ message: "Invalid product ID" });
    }
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

// update product
router.put("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.name = req.body.name ?? product.name;
        product.price = req.body.price ?? product.price;
        product.description = req.body.description ?? product.description;
        product.category = req.body.category ?? product.category;
        product.image = req.body.image ?? product.image;
        product.countInStock = req.body.countInStock ?? product.countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } catch (err) {
        res.status(400).json({ message: "Invalid product ID" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.deleteOne();
        res.json({ message: "Product deleted successfully" });

    } catch (err) {
        res.status(400).json({ message: "Invalid product ID" });
    }
});

export default router;