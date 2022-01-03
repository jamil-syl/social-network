const express = require("express");
const router = express.Router();

// @route....GET /api/auth
// @des...Tst route
// @access...public
router.get('/',(req,res) => res.send("User auth"));

module.exports = router;