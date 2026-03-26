import express from "express";
import Cart from "../models/Card.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Add to cart
router.post("/", protect, async (req, res) => {
    const { productId } = req.body;

    const cartItem = await Cart.create({
        user: req.user._id,
        product: productId,
    });

    res.json({
        result: true,
        message: "Add to card successfully.",
        data: cartItem
    });
});

// Get cart
router.get("/", protect, async (req, res) => {
    const items = await Cart.find({ user: req.user._id })
        .populate("product");
    res.json({
        result: true,
        message: "Get all card successfully.",
        totalItems: items.length,
        data: items
    });
});

export default router;