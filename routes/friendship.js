const express = require("express");
const router = express.Router();
const passport = require("passport");
const friendship_controller = require("../controllers/friendship_controller");

router.get(
  "/toggle",
  passport.checkAuthentication,
  friendship_controller.toggleFriend
);
router.get(
  "/delete",
  passport.checkAuthentication,
  friendship_controller.deleteFriend
);

module.exports = router;
