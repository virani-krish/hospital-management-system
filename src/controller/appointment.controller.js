const app = require("../app");
const Appointment = require("../models/Appointment.model");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");

module.exports.bookAppointment = asyncHandler(async (req, res) => {

    const { doctorId, date, reasone } = req.body;

    if (!doctorId || !date || !reasone) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found"
        });
    }

    const appointment = await Appointment.create({
        patient: req.user._id,
        doctor: doctorId,
        date,
        reasone
    });

    res.status(201).json({
        success: true,
        message: "Appointment book successfully",
        data: appointment
    });

});

module.exports.getMyAppointment = asyncHandler(async (req, res) => {

    const filter = req.user.role === "doctor"
        ? { doctor: req.user._id }
        : { patient: req.user._id };

    const appointment = await Appointment.find(filter)
        .populate("patient", "name email")
        .populate("doctor", "name email");

    return res.status(200).json({
        success: true,
        message: "Data get successfully",
        data: appointment
    });

});

module.exports.updateAppointmentStatus = asyncHandler(async (req, res) => {

    const doctorId = req.user._id;
    const appointmentId = req.params.id;
    const { status } = req.body;

    const appointment = await Appointment.findOne({ doctor: doctorId, _id: appointmentId });

    if (!appointment) {
        return res.status(400).json({
            success: false,
            message: "appointment not found"
        });
    }

    appointment.status = status;
    await appointment.save();

    return res.status(200).json({
        success: true,
        message: "appointment status updated successfully"
    });

});