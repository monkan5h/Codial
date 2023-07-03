const express = require("express");
const router = express.Router();
const like_controller = require("../controllers/like_controller");
const passport = require("passport");

router.get("/toggle", passport.checkAuthentication, like_controller.toggleLike);

module.exports = router;
