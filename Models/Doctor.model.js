const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  headTitle: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL or image path; optional
  },
  createdAt: {
    type: Date,
    default: Date.now, // automatically set creation date
  }
});

const DoctorSchema = new mongoose.Schema({
  profile: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  clinicLocation: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  workingHours: {
    type: String,
  },
  about: {
    type: String,
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointments',
  }],
  role: {
    type: String,
    default: "doctor",
    required: true,
  },

  blogs: [BlogSchema]  // Embedded blogs array added here
});

const DoctorModel = mongoose.model("Doctors", DoctorSchema);

module.exports = DoctorModel;
