const router = require("express").Router();
const { getUser } = require("../controller/user.controller");
const { protect } = require("../middleware/auth.middleware");
const { allowedTo } = require("../middleware/role.middleware");
const asyncHandler = require("../utils/asyncHandler");

router.get("/me", protect, allowedTo("doctor", "patient"), getUser);

module.exports = router;