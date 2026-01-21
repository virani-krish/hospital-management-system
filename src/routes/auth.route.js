const route = require("express").Router();
const { register, login, logout } = require("../controller/auth.controlle");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/register", register);
route.post("/login", login);
route.get("/profile", authMiddleware, (req, res) => {
    res.send(req.user);
});

module.exports = route;