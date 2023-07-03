const express = require("express");

const router = express.Router();
router.post(
  "/create-session",
  require("../../../controllers/api/v1/user_api").createSession
);
module.exports = router;
