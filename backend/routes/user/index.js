const express = require("express");
const router = express.Router();

router.use("/stripe", require("./stripe"));
router.use("/paypal", require("./paypal"));

module.exports = router;
