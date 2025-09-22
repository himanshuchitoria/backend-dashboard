const express = require("express");
const DoctorModel = require("../Models/Doctor.model"); // Import DoctorModel here
const {
  register,
  login,
  deleteDoctor,
  updateDoctor,
  getAllDoctors,
  updateAppointment,
  findDoctor,
  postBlog,
  editBlog,
  deleteBlog,
  getBlogs,
} = require("../Controllers/Doctor.controller");

const DoctorRouter = express.Router();
const Auth = require("../Middlewares/JWT.authentication");
const { DoctorAuth } = require("../Middlewares/RoleBased.authentication");

// Doctor Registration
DoctorRouter.post("/register", register);

// Doctor Login
DoctorRouter.post("/login", login);

// Doctor Deletion
DoctorRouter.delete("/:doctorId", Auth, DoctorAuth, deleteDoctor);

// Doctor Update
DoctorRouter.patch("/:doctorId", Auth, DoctorAuth, updateDoctor);

// All Doctors Data
DoctorRouter.get("/all", Auth, getAllDoctors);

// Find Doctor by ID
DoctorRouter.get("/:doctorId", Auth, DoctorAuth, findDoctor);

// Update Appointment
DoctorRouter.patch("/appointment/:doctorId", Auth, DoctorAuth, updateAppointment);

// ===== Blog Routes =====

// Post a new blog for a doctor
DoctorRouter.post("/:doctorId/blogs", Auth, DoctorAuth, postBlog);

// Edit a blog for a doctor
DoctorRouter.patch("/:doctorId/blogs/:blogId", Auth, DoctorAuth, editBlog);

// Delete a blog for a doctor
DoctorRouter.delete("/:doctorId/blogs/:blogId", Auth, DoctorAuth, deleteBlog);

// Get all blogs of a doctor
DoctorRouter.get("/:doctorId/blogs", Auth, DoctorAuth, getBlogs);

// Public route - get all blogs across all doctors (no auth)
DoctorRouter.get("/blogs/public", async (req, res) => {
  try {
    const doctors = await DoctorModel.find({}, { firstName: 1, lastName: 1, blogs: 1 }).lean();
    const allBlogs = [];
    doctors.forEach(doc => {
      if (doc.blogs && doc.blogs.length) {
        doc.blogs.forEach(blog => {
          allBlogs.push({
            ...blog,
            author: doc.firstName + " " + doc.lastName,
          });
        });
      }
    });
    // Sort blogs by createdAt descending for latest first
    allBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ blogs: allBlogs });
  } catch (error) {
    console.error("Failed to fetch public blogs", error);
    res.status(500).json({ message: "Failed to fetch public blogs" });
  }
});

module.exports = DoctorRouter;
