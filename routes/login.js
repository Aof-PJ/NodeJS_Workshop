var express = require('express');
var router = express.Router();
var userSchema = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const response_form = require('../components/response_form')

const privateKey = fs.readFileSync('./keys/private.pem');

router.post('/', async function(req, res, next) {
    // get body preparing for check auth
    let { username, password } = req.body;

    // check and get data from db with username
    let searchedData = await userSchema.findOne({ username });

    if(searchedData !== null) { 
        let authCheck = await bcrypt.compare(password, searchedData.password);

        if (authCheck && searchedData.isApprove) { // if true create token and return msg
            payload = {
                username: searchedData.username,
                email: searchedData.email,
                phone: searchedData.phone,
            }
            let token = jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn: '1h' });
            response_form(res, 200, "Login successful!", { "token": token });
        } else if (!searchedData.isApprove) { // false because of not approved
            response_form(res, 403, "This account has not been approved yet.");
        } else { // else return fail msg
            response_form(res, 400, "Invalid password");
        }
    } else {
        response_form(res, 400, "Username not found, please sign-up.");
    }
});

module.exports = router;