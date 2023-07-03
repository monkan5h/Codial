const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");

module.exports.createSession = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user || user.password != req.body.password) {
      return res.status(402).json({
        message: "Invalid email/password",
      });
    }
    return res.status(200).json({
      message: "Sign in successful, here is youe token, plz keep it safe.",
      token: jwt.sign(user.toJSON(), env.jwtSecret, { expiresIn: 10000 }),
    });
  } catch (error) {
    return res.status(422).json({
      message: "Internal server error",
    });
  }
};
