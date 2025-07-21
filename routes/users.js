var express = require('express');
var router = express.Router();
var userSchema = require('../models/user.model');
const response_form = require('../components/response_form');

router.put('/:id/approve', async function(req, res, next) {
  let isApprove = true;
  let { id } = req.params;

  let user = await userSchema.findByIdAndUpdate(id, { isApprove }, { new: true });

  await user.save();

  let data = {
    "username": user.username,
    "Approve Status": user.isApprove
  }
  
  response_form(res, 200, "Approved", data);
});

// get users data
router.get('/', async function(req, res, next) {
  let user = await userSchema.find({});

  response_form(res, 200, "get data complete", user);
});

module.exports = router;
