const express = require("express");

const router = express.Router();

router.use("/stats", require("./stats"));
router.use("/products", require("./products"));
router.use("/orders", require("./orders"));
router.use("/categories", require("./categories"));
router.use("/users", require("./users"));
router.use("/ai-description", require("./ai"));
router.use("/reviews", require("./reviews"));
router.use("/logs", require("./logs"));
router.use("/warehouses", require("./warehouses"));

module.exports = router;
