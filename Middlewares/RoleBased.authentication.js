// role-based authentication

const DoctorAuth = (req, res, next) => {
    const { role } = req.user || {};
    if (role === "doctor" || role === "admin") {
        next();
    } else {
        res.status(403).json({ message: 'Admin or Doctor can access', status: true });
    }
};

const PatientAuth = (req, res, next) => {
    const { role } = req.user || {};
    if (role === "patient" || role === "admin" || role === "doctor") {
        next();
    } else {
        res.status(403).json({ message: 'Access denied', status: true });
    }
};

module.exports = { DoctorAuth, PatientAuth };
