const { bookAppointment, getMyAppointment, updateAppointmentStatus } = require("../controller/appointment.controller");
const { protect } = require("../middleware/auth.middleware");
const { allowedTo } = require("../middleware/role.middleware");

const router = require("express").Router();



// patient book appointment
router.post("/", protect, allowedTo("patient"), bookAppointment);

// doctor and patient view 
router.get("/me", protect, allowedTo("doctor", "patient"), getMyAppointment);

// doctor update status
router.put("/:id/status", protect, allowedTo("doctor"), updateAppointmentStatus);

module.exports = router;