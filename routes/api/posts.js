const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const auth = require("../../middleware/auth");

// @route. Post /api/posts
// @des... Create a post
// @access Private
router.post(
	"/",
	[auth, [check("text", "Text is required").not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select("-password");
			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			});
			const post = await newPost.save();
			res.json(post);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Internal Server Error");
		}
	}
);

// @route   GET /api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Internal Server Error");
	}
});

// @route   GET /api/posts/:id
// @desc    Get a single post
// @access  Private
router.get("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: "Post not found by that ID" });
		}
	} catch (err) {
		console.error(err.message);

		if (err.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found by this id" });
		}

		res.status(500).send("Internal Server Error");
	}
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post by ID
// @access  Private
router.delete("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: "Post not found for this id" });
		}

		// Check user
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		await post.remove();

		res.json({ msg: "Post removed" });
	} catch (err) {
		console.error(err.message);

		if (err.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found for this id" });
		}

		res.status(500).send("Internal Server Error");
	}
});

// @route   PUT /api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: "Post not found for this id" });
		}

		// Check if the post already liked
		if (
			post.likes.filter((like) => like.user.toString() === req.user.id).length >
			0
		) {
			return res.status(400).json({ msg: "Already liked" });
		}

		post.likes.unshift({ user: req.user.id });

		await post.save();
		res.json(json.likes);
	} catch (err) {
		console.error(err.message);

		if (err.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found for this id" });
		}

		res.status(500).send("Internal Server Error");
	}
});

// @route   PUT /api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: "Post not found for this id" });
		}

		// Check if the user likes
		if (
			post.likes.filter((like) => like.user.toString() == req.params.id)
				.length === 0
		) {
			return res.status(400).json({ msg: "Not liked yet" });
		}

		// Get remove index
		const removeIndex = await post.likes
			.map((like) => like.user.toString())
			.indexOf(req.user.id);

		if (removeIndex === 0) post.likes.splice(removeIndex, 1);

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);

		if (err.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found for this id" });
		}

		res.status(500).send("Internal server error");
	}
});

// @route   POST /api/posts/comment/:post_id
// @desc    Post a comment
// @access  Private
router.post(
	"/comment/:post_id",
	[auth, [check("text", "Text is required").not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id);
			const post = await Post.findById(req.params.post_id);

			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};

			post.comments.unshift(newComment);

			await post.save();
			res.json(post.comments);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Internal server error");
		}
	}
);

// @route   DELETE /api/posts/comment/:post_id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);

		// Get comment
		const comment = post.comments.find(
			(comment) => comment.id === req.params.comment_id
		);

		// Make sure if comment exists
		if (!comment) {
			return res.status(404).json({ msg: "Comment does not exist" });
		}

		// Check user
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		// Get remove index
		const removeIndex = post.comments
			.map((comment) => comment.id)
			.indexOf(req.params.comment_id);

		if (removeIndex === 0) post.comments.splice(removeIndex, 1);

		await post.save();

		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("internal server error");
	}
});

module.exports = router;
