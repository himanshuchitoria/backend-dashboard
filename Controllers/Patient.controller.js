const bcrypt = require('bcrypt');
const PatientModel = require("../Models/Patient.model");
const jwt = require("jsonwebtoken");

// Controller function for patient registration
const registerPatient = async (req, res) => {
    try {
        // Check if the email already exists in the database
        const existingPatient = await PatientModel.findOne({ email: req.body.email });
        if (existingPatient) {
            return res.status(400).json({ message: 'Email already exists!', status: false });
        }

        // Hash the password before saving it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Proceed with registration logic
        const newPatient = new PatientModel({ ...req.body, password: hashedPassword });
        await newPatient.save();

        res.status(201).json({ newPatient, message: "Registration successfully", status: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function for patient login (FIXED FOR ROLE)
const loginPatient = async (req, res) => {
    try {
        const patient = await PatientModel.findOne({ email: req.body.email });
        if (!patient) {
            return res.status(400).json({ message: 'Email not found!', status: false });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, patient.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect password!', status: false });
        }

        // INCLUDE role in the JWT payload!
        const token = jwt.sign(
            { userId: patient._id, role: patient.role }, // <-- critical addition
            process.env.secretKey,
            { expiresIn: "7d" }
        );

        res.status(200).json({ message: 'Login successful!', status: true, token, userId: patient._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getPatientById = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const patient = await PatientModel.findById(patientId).populate('appointments');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ patient });
        console.log("Fetching patient by ID:", patientId);
        console.log("DB result:", patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updatePatientById = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const existingPatient = await PatientModel.findById(patientId);
        if (!existingPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const updatedPatientData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            contactNumber: req.body.contactNumber,
            address: req.body.address,
            bloodGroup: req.body.bloodGroup,
        }

        const updatedPatient = await PatientModel.findByIdAndUpdate(
            {_id: patientId},
            updatedPatientData,
            { new: true }
        );

        res.status(200).json(updatedPatient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deletePatientById = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        await PatientModel.findByIdAndDelete({ _id: patientId });
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update patient appointments
const updateAppointment = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { appointmentId } = req.body;

        const doctor = await PatientModel.findById({ _id: patientId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        await PatientModel.findByIdAndUpdate(
            { _id: patientId },
            { $push: { appointments: appointmentId } }
        );

        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    registerPatient,
    loginPatient,
    getPatientById,
    updatePatientById,
    deletePatientById,
    updateAppointment
};
