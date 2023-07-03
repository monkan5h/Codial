const express = require("express");
const router = express.Router();
const comment_controller = require("../controllers/comment_controller");
const passport = require("passport");

router.post(
  "/createComment",
  passport.checkAuthentication,
  comment_controller.create
);
router.get(
  "/deleteComment/:id/:post",
  passport.checkAuthentication,
  comment_controller.destroy
);

module.exports = router;
