const route = require("express").Router();
const { register, login, logout } = require("../controller/auth.controlle");

route.post("/register", register);
route.post("/login", login);


module.exports = route;