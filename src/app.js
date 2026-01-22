const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// route file
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const appointmentRoute = require("./routes/appointment.route");


// globle middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("server run...");
});

// all api
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/appointments", appointmentRoute);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: statusCode < 500 ? "fail" : "error",
        message: err.message || "Something went wrong"
    });
});

module.exports = app;