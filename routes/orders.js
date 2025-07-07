var express = require('express');
var router = express.Router();
var orderSchema = require('../models/order.model');
const response_form = require('../components/response_form');

router.get('/', async function(req, res, next) {    
    try {
        let searchedData = await orderSchema.find({});   
        response_form(res, 200, "Request sucessfully", searchedData);
    } catch (err) {    
        response_form(res, 200, "Ops! Something went wrong.");
    }
});

module.exports = router;