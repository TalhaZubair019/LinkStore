const express = require("express");
const router = express.Router();

router.use("/stats", require("./stats"));
router.use("/products", require("./products"));
router.use("/orders", require("./orders"));
router.use("/payouts", require("./payouts"));
router.use("/apply", require("./apply"));
router.use("/warehouses", require("./warehouses"));
router.use("/reviews", require("./reviews"));
router.use("/categories", require("./categories"));
router.use("/ai-description", require("./ai"));

module.exports = router;
