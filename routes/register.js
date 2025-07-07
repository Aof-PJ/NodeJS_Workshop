var express = require('express');
var router = express.Router();
var userSchema = require('../models/user.model');
const bcrypt = require('bcrypt');
const response_form = require('../components/response_form')

router.post('/', async function(req, res, next) {
    // get body preparing for check auth
    let { username, password, email, phone } = req.body;
    
    // check username & password
    let searchedData = await userSchema.find({ username });
    let isDup = (searchedData.length) > 0;
 
    if(isDup) { // if username is duplicated
        response_form(res, 400, "This Username has been used.", null);
    } else if (username && password && email && phone) {
        let hashedPassword = await bcrypt.hash(password, Number(process.env.HASH_BUFFER));
        
        let user = new userSchema({
            username: username,
            password: hashedPassword,
            email: email,
            phone: phone,
            isApprove: false,
        })

        await user.save();
        response_form(res, 201, "Registerd Sucessed!", null);
    } else {
        response_form(res, 400, "Missing Arguments", null);
    }
});

module.exports = router;