import express from "express";
import Wishlist from "../models/Wishlist.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Add to wishlist
router.post("/", protect, async (req, res) => {
    const item = await Wishlist.create({
        user: req.user._id,
        product: req.body.productId,
    });

    res.json(item);
});

// Get wishlist
router.get("/", protect, async (req, res) => {
    try {
        const items = await Wishlist.find({ user: req.user._id })
            .populate("product");
        res.json(items);

    } catch (err) {
        res.send(err);
    }

});

export default router;