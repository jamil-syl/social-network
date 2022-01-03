const express = require("express");
const router = express.Router();

// @route....GET /api/posts
// @des...Tst route
// @access...public
router.get('/', (req, res) => res.send("User posts"));

module.exports = router;