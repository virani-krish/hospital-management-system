const route = require("express").Router();
const { getUser } = require("../controller/user.middleware");
const { protect } = require("../middleware/auth.middleware");
const { allowedTo } = require("../middleware/role.middleware");

route.get("/me", protect, allowedTo("doctor", "patient"), getUser);

module.exports = route;