const express = require("express");
const router = express.Router();
const post_controller = require("../controllers/post_controller");
const passport = require("passport");

router.post(
  "/createPost",
  passport.checkAuthentication,
  post_controller.create
);
router.get(
  "/deletePost/:id",
  passport.checkAuthentication,
  post_controller.delete
);

module.exports = router;
