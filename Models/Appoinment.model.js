// models/Appointment.model.js

const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patients',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctors',
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slots',
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled',
  },
  disease: {
    type: String,
    required: true
  }
});

// Remove startTime and endTime fields from appointment — these will be accessed via the slot reference.

const AppointmentModel = mongoose.model('Appointments', appointmentSchema);

module.exports = AppointmentModel;
