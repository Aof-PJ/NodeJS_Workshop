const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username : { type: String, required: true },
    password : { type: String, required: true },
    email : { type: String, required: true },
    phone : { type: String, required: true },
    isApprove : { type: Boolean, required: true }
}, {
    timestamps: true
})

module.exports = mongoose.model('users', userSchema);