const express = require("express");
const { check, validationResult } = require("express-validator");
const res = require("express/lib/response");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const router = express.Router();

// @route....GET /api/profile/me
// @des...Test route
// @access...private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			"user",
			["name", "avatar"]
		);
		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).json("Internal Server Error");
	}
});

router.post(
	"/",
	[
		auth,
		[
			check("status", "This field is required").not().isEmpty(),
			check("location", "This field is required").not().isEmpty(),
			check("skills", "This field is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			twitter,
			linkedin,
			facebook,
			instagram,
		} = req.body;

		// Build profile object
		const profileFields = {};

		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (bio) profileFields.bio = bio;
		if (location) profileFields.location = location;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;

		if (skills) {
			profileFields.skills = skills.split(",").map((skill) => skill.trim());
		}

		profileFields.social = {};

		if (youtube) profileFields.social.youtube = youtube;
		if (instagram) profileFields.social.instagram = instagram;
		if (facebook) profileFields.social.facebook = facebook;
		if (twitter) profileFields.social.twitter = twitter;
		if (linkedin) profileFields.social.linkedin = linkedin;

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			// Update user profile
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);
				return res.json(profile);
			}

			// Create profile
			profile = new Profile(profileFields);
			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).json("Internal Server Error");
		}
	}
);

module.exports = router;
