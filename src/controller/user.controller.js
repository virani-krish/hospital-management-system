module.exports.getUser = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "user data get successfully",
        user: req.user
    });
}