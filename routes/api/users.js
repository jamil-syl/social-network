const express = require("express");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const router = express.Router();
const User = require("../../models/User");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route....GET /api/users
// @des...Tst route
// @access...public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
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
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already exists with this email" }],
        });
      }
      // if an user exits
      // G et users gravatar
      const avatar = gravatar.url(email, {
        s: "400",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      // Encrypt password with brcyptjs
      const salt = await brcypt.genSaltSync(10);
      user.password = await brcypt.hash(password, salt);

      // Save the record into database
      await user.save();

      // Return jsonwebtoken
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get("secretToken"),
        { expiresIn: 36000 },
        (err, token) => {
            if(err) throw err;
            res.json({token});
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
