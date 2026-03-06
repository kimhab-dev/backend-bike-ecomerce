import express from "express";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order
router.post("/", protect, async (req, res) => {
    const { orderItems, totalPrice } = req.body;

    const order = await Order.create({
        user: req.user._id,
        orderItems,
        totalPrice,
    });

    res.json(order);
});

// Get my orders
router.get("/", protect, async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("orderItems.product");

    res.json(orders);
});

export default router;