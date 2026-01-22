const router = require("express").Router();
const { register, login, logout, refreshToken } = require("../controller/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);


module.exports = router;