const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");
const passport = require("passport");

router.get("/", homeController.home);
router.use("/user", require("./user"));
router.use("/post", require("./post"));
router.use("/comment", require("./comment"));
router.use("/api", require("./api/index"));
router.use("/like", require("./like"));
router.use("/friendship", require("./friendship"));

//Google-oAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback*",
  passport.authenticate("google", { failureRedirect: "/user/sign-in" }),
  require("../controllers/user_controller").createSession
);

module.exports = router;
