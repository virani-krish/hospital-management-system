const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

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

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_KEY,
        {
            expiresIn: "1d"
        }
    );

    // res.cookie("token", token, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: "strict",
    //     maxAge: 24 * 60 * 60 * 1000
    // });

    return res.status(200).json({
        success: true,
        message: "login successfully done",
        token
    });

});
