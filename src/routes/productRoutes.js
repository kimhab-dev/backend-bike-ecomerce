import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ Get all products with category filter + search
// ✅ Get all products with filter + search + pagination + sorting
router.get("/", async (req, res) => {
    try {
        let filter = {};

        // 🔎 Filter by category
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // 🔎 Search by name or description
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: "i" } },
                { description: { $regex: req.query.search, $options: "i" } },
            ];
        }

        // 💰 Price Range Filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};

            if (req.query.minPrice) {
                filter.price.$gte = Number(req.query.minPrice);
            }

            if (req.query.maxPrice) {
                filter.price.$lte = Number(req.query.maxPrice);
            }
        }

        // 📄 Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // 🔃 Sorting
        let sortOption = {};
        if (req.query.sort) {
            if (req.query.sort === "price_asc") {
                sortOption.price = 1;
            } else if (req.query.sort === "price_desc") {
                sortOption.price = -1;
            } else if (req.query.sort === "newest") {
                sortOption.createdAt = -1;
            }
        }

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .populate("category")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products,
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ Get product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // return only the product inside data wrapper
        res.json({
            data: product,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }
});

// ✅ Create product
router.post("/", async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: createdProduct,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
});

// ✅ Update product
router.put("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        Object.assign(product, req.body);

        const updatedProduct = await product.save();

        res.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }
});

// ✅ Delete product
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        await product.deleteOne();

        res.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }
});

export default router;