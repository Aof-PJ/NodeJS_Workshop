const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    productName : { type: String, required: true },
    remaining : { type: Number, required: true },
    price : { type: Number, required: true },
    description : { type: String, required: true },
    imageUrl : { type: String, required: true },
}, {
    timestamps: true
})

module.exports = mongoose.model('products', productSchema);