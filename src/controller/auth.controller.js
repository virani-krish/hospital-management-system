const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");

module.exports.register = asyncHandler(async (req, res) => {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // check user role
    if (role !== "doctor" && role !== "patient") {
        return res.status(400).json({
            success: false,
            message: "please, enter valid role for user"
        });
    }

    // check email already registed or not
    const user = await User.findOne({ email });
    if (user) {
        return res.status(409).json({
            success: false,
            message: "email already registed"
        });
    }

    // convert password to hash
    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashPassword,
        role
    });

    return res.status(201).json({
        success: true,
        message: "user registed successfully"
    });

});

module.exports.login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "email and password are required for login."
        });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // check password is match or not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        success: true,
        message: "login successfully done",
        accessToken
    });

});


module.exports.refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "refresh token missing"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );

    return res.status(200).json({
        success: true,
        message: "new Token generated",
        accessToken: newAccessToken
    });

}

module.exports.logout = (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};
