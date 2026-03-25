const express = require("express");
const router = express.Router();

router.use("/auth", require("./user/auth"));
router.use("/user", require("./user"));
router.use("/public", require("./public"));
router.use("/admin", require("./admin"));
router.use("/vendor", require("./vendor"));
router.use("/upload", require("./common/upload"));
router.use("/stripe", require("./user/stripe"));

module.exports = router;
