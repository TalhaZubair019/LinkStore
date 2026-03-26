const express = require("express");
const router = express.Router();
router.use("/stripe", require("./stripe"));
module.exports = router;
