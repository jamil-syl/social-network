const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
	const token = req.header("x-auth-token");
	if (!token) {
		res.status(401).json({ msg: "No token generated" });
	}

	try {
		const decoded = jwt.verify(token, config.get("secretToken"));
		req.user = decoded.user;
		next();
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Internal Server error");
	}
};
