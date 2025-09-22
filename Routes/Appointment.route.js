const express = require("express");
const AppointmentRouter = express.Router();
const appointmentController = require("../Controllers/Appointment.controller");
const Auth = require("../Middlewares/JWT.authentication");
const { PatientAuth, DoctorAuth } = require("../Middlewares/RoleBased.authentication");

// ----- SLOT-BASED APPOINTMENT MANAGEMENT -----

// Get all available slots for a doctor/date (public/patient booking view)
AppointmentRouter.get("/slots", appointmentController.getAvailableSlots);

// Book an appointment (patient books a slot)
AppointmentRouter.post("/book", Auth, PatientAuth, appointmentController.bookAppointment);

// Doctor: Get all slots for a given date
AppointmentRouter.get("/doctor/slots", Auth, DoctorAuth, appointmentController.getDoctorSlots);

// Doctor: Set availability/unavailability for a slot
AppointmentRouter.patch("/slot/:id/availability", Auth, DoctorAuth, appointmentController.setSlotAvailability);

// Doctor: Edit a slot's timings
AppointmentRouter.patch("/slot/:id/timings", Auth, DoctorAuth, appointmentController.editSlotTimings);

// Doctor: Generate fresh slots for a day (utility call)
AppointmentRouter.post("/doctor/:doctorId/generate-slots", Auth, DoctorAuth, appointmentController.generateSlotsForDay);

// ----- APPOINTMENT CRUD -----

// Get all appointments for a doctor (dashboard view)
AppointmentRouter.get("/doctor/:doctorId", Auth, DoctorAuth, appointmentController.getDoctorAppointments);

// Get all appointments for a patient
AppointmentRouter.get("/patient/:patientId", Auth, PatientAuth, appointmentController.getPatientAppointments);

// Update an appointment by ID (status/cancel/update disease)
AppointmentRouter.patch("/:appointmentId", Auth, appointmentController.updateAppointmentById);

// Delete an appointment by ID
AppointmentRouter.delete("/:appointmentId", Auth, appointmentController.deleteAppointmentById);

module.exports = AppointmentRouter;
