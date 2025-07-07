const jwt = require("jsonwebtoken");
const fs = require("fs");
const publicKey = fs.readFileSync('./keys/public.pem'); //returns Buffer
const response_form = require('../components/response_form');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split("Bearer ")[1];
        jwt.verify(token, publicKey, (err, decoded) => {
            if(err) {
                response_form(res, 401, "Invalid token or token expired, please sign in.");
            } else {
                req.user = decoded; // pass decoded token to API
                return next();
            }
        });
    } catch (err) {
        console.log(err)
        response_form(res, 401, "Unauthorized, something went wrong.");
    }
}