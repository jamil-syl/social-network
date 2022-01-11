const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../../models/User");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");

// @route....GET /api/auth
// @des...Tst route
// @access...public

router.get(
    "/",auth, async(req,res) =>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error");
      }
    }
);

router.post(
  "/",
  [
    check("email", "Please use valid a email").isEmail(),
    check("password", "Password is required").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //console.log(req.body);
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "User not found" }],
        });
      }

      const isMatch = await brcypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Password is no match" }],
        });
      }

      // Return jsonwebtoken
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get("secretToken"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
