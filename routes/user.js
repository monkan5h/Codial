const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const passport = require("passport");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  userController.profile
);
router.post("/update/:id", passport.checkAuthentication, userController.update);
router.get("/sign-in", userController.signIn);
router.get("/sign-up", userController.signUp);
router.get("/sign-out", userController.signOut);
router.post("/create", userController.create);
router.post(
  "/createSession",
  passport.authenticate("local", { failureRedirect: "/user/sign-in" }),
  userController.createSession
);

module.exports = router;
