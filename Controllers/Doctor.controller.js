const { request } = require("express");
const DoctorModel = require("../Models/Doctor.model");
const getRandomDoctorImage = require("../Utils/StaticData");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Controller function for doctor registration
const register = async (req, res) => {
    try {
        const existingDoctor = await DoctorModel.findOne({ email: req.body.email });

        if (existingDoctor) {
            return res.status(400).json({ message: 'Email already exists!', status: false });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const newDoctor = new DoctorModel({
            ...req.body,
            password: hashedPassword,
            profile: getRandomDoctorImage()
        });

        await newDoctor.save();

        res.status(201).json({ newDoctor, message: "registration successfully", status: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function for doctor login
const login = async (req, res) => {
    try {
        const doctor = await DoctorModel.findOne({ email: req.body.email });

        if (!doctor) {
            return res.status(400).json({ message: 'Email not found!', status: false });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, doctor.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect password!', status: false });
        }

        const token = jwt.sign({ userId: doctor._id, role: doctor.role }, process.env.secretKey);

        res.status(200).json({ message: 'Login successful!', token, userId: doctor._id, status: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function for deleting a doctor
const deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        const doctor = await DoctorModel.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        await DoctorModel.findByIdAndDelete(doctorId);

        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function for updating a doctor
const updateDoctor = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        const doctor = await DoctorModel.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const updatedDoctor = await DoctorModel.findByIdAndUpdate(doctorId, req.body, { new: true });

        res.status(200).json(updatedDoctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to find a doctor and populate appointments
const findDoctor = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        const doctor = await DoctorModel.findById(doctorId).populate('appointments');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function for getting all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await DoctorModel.find();
        res.status(200).json({ doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function for updating an appointment
const updateAppointment = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const { appointmentId } = req.body;

        const doctor = await DoctorModel.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        await DoctorModel.findByIdAndUpdate(
            doctorId,
            { $push: { appointments: appointmentId } }
        );

        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ====== Blog Controllers ======

// Create/post a new blog for a doctor
const postBlog = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const { headTitle, body, image } = req.body;

        // Find doctor by id
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const author = `${doctor.firstName} ${doctor.lastName}`;

        const newBlog = {
            headTitle,
            body,
            author,
            image: image || '',
            createdAt: new Date()
        };

        doctor.blogs.push(newBlog);
        await doctor.save();

        res.status(201).json({ message: "Blog posted successfully", blog: newBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Edit a blog by blog ID for a doctor
const editBlog = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const blogId = req.params.blogId;
        const { headTitle, body, image } = req.body;

        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const blog = doctor.blogs.id(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (headTitle) blog.headTitle = headTitle;
        if (body) blog.body = body;
        if (image !== undefined) blog.image = image;

        await doctor.save();

        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a blog by blog ID for a doctor
const deleteBlog = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const blogId = req.params.blogId;

        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Use .id(blogId) to get the subdocument
        const blog = doctor.blogs.id(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Remove the subdocument
        blog.deleteOne(); // or blog.remove(), both work in Mongoose 6+
        await doctor.save();

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get all blogs of a doctor
const getBlogs = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const doctor = await DoctorModel.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ blogs: doctor.blogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    findDoctor,
    register,
    login,
    deleteDoctor,
    updateDoctor,
    getAllDoctors,
    updateAppointment,
    postBlog,
    editBlog,
    deleteBlog,
    getBlogs,
};
