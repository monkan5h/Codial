const express = require("express");
const router = express.Router();

router.get("/", require("../../../controllers/api/v2/profile_api").index);

module.exports = router;
