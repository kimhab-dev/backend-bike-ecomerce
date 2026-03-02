import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (requestAnimationFrame, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// create category
router.post("/", async (req, res) => {
    try {
        const category = new Category(req.body);
        const createCategory = await category.save();
        res.status(201).json({ message: "Created Success", createCategory });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete category
router.delete("/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json();
    }

    await category.deleteOne();
    res.json({ message: "Category Deleted" });
});

// update category
router.put("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.name = req.body.name ?? category.name;

        const data = await category.save();
        res.json({ message: "Update category success", data });

    } catch (err) {
        res.status(400).json({ message: "Invalid category ID" });
    }
});


export default router;