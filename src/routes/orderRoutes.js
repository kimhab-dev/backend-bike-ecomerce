import express from "express";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";
import pkg from 'bakong-khqr';
const { KHQR, BakongKHQR, IndividualInfo } = pkg;
const router = express.Router();

// Create order + Generate Bakong KHQR

router.post("/", protect, async (req, res) => {
    try {
        const { orderItems, totalPrice } = req.body;

        const individualInfo = new IndividualInfo(
            "kimhab_sok@aba",   // bakongAccountID
            "BigBike Store",    // merchant name
            "Phnom Penh",       // merchant city
            "USD",              // currency
            totalPrice          // amount
        );

        individualInfo.mobileNumber = "85515867263";
        individualInfo.storeLabel = "BigBike Store";
        individualInfo.terminalLabel = "Cashier01";

        const haha = new BakongKHQR();
        const result = haha.generateIndividual(individualInfo);

        console.log(result);
        if (result.status.code !== 0) {
            return res.status(400).json({ message: "Cannot generate KHQR" });
        }

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            totalPrice,
            bakongMD5: result.data.md5,
            status: "PENDING"
        });

        res.status(201).json({
            order,
            qrString: result.data.qr
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Update order status ទៅជា Paid (សម្រាប់ប្រើពេល Demo)
router.put("/:id/pay", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'COMPLETED';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "រកមិនឃើញ Order ទេ" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get my orders
router.get("/", protect, async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("orderItems.product");

    res.json(orders);
});

export default router;