import express from "express";
import Cart from "../models/Card.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Add to cart
router.post("/", protect, async (req, res) => {
    const { productId, quantity } = req.body;

    const cartItem = await Cart.create({
        user: req.user._id,
        product: productId,
        quantity,
    });

    res.json(cartItem);
});

// Get cart
router.get("/", protect, async (req, res) => {
    const items = await Cart.find({ user: req.user._id })
        .populate("product");

    res.json(items);
});

export default router;