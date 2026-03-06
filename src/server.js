import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"

import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cardRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Running...");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes)
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});