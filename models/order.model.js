const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    customer_name : { type: String, required: true },
    product_id : { type: String, required: true },
    product_name : { type: String, required: true },
    quantities : { type: Number, required: true },
    each_price : { type: Number, required: true },
    total : { type: Number, required: true },
}, {
    timestamps: true
})

module.exports = mongoose.model('order', orderSchema);