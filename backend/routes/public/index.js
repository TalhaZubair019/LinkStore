const express = require("express");
const ordersRouter = require("./orders");

const router = express.Router();

router.use("/content", require("./content"));
router.use("/orders", ordersRouter);
router.use("/", ordersRouter);
router.use("/reviews", require("./reviews"));
router.use("/cart", require("./cart"));
router.use("/vendors", require("./vendors"));
router.use("/products", require("./products"));

module.exports = router;
