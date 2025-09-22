const jwt = require("jsonwebtoken");
require('dotenv').config();

const Auth = (req, res, next) => {
    const token = req.headers.authorization;
    console.log("Received token:", token);

    if (!token) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }

    let tok = token.split(" ")[1];
    if (tok) {
        jwt.verify(tok, process.env.secretKey, function (err, decoded) {
            if (decoded) {
                req.user = decoded; // Attach decoded payload to request
                console.log("decode", decoded);
                next();
            } else {
                res.status(400).send({ err });
            }
        });
    } else {
        res.status(401).json({ message: "Malformed Authorization header" });
    }
};

module.exports = Auth;
