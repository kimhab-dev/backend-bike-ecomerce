import express from "express"
import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"

const router = express.Router();


// register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const userExits = await User.findOne({ email });

    if (userExits) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: "invalid email or password" });
    }
});

export default router;