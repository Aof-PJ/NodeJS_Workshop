var express = require('express');
var router = express.Router();
var productSchema = require('../models/product.model');
var orderSchema = require('../models/order.model');
const response_form = require('../components/response_form');

// get product 1 || All
router.get('/:id?', async function(req, res, next) {
    let { id } = req.params;

    if(!id) { // if no ID => all products
        let searchedData = await productSchema.find({});
        response_form(res, 200, "Request successfully", searchedData);
    } else {
        try{
            let searchedData = await productSchema.findById(id);
            if(!searchedData){
                response_form(res, 400, "Invalid ID", null);
            } else {
                let data = {
                    productName: searchedData.productName,
                    remaining: searchedData.remaining,
                    price: searchedData.price,
                    description : searchedData.description,
                    imageUrl : searchedData.imageUrl,
                };
                response_form(res, 200, "Request successfully", data);
            }
        } catch(err) {
            console.log(err);
            response_form(res, 400, "Invalid ID", null);
        }
        
    }
});

// add product
router.post('/', async function(req, res, next) {
    let { productName, remaining, price, description, imageUrl } = req.body;

    // check product's name
    let searchedData = await productSchema.find({ productName });
    let isDup = (searchedData.length) > 0;

    try {
        if(isDup) {
            response_form(res, 400, "This product's name has been taken.", null);
        } else if (productName && remaining>=0 && price>=0 && description && imageUrl) { 
            let product = new productSchema({
                productName: productName,
                remaining: remaining,
                price: price,
                description: description,
                imageUrl: imageUrl,
            })
            await product.save();

            response_form(res, 201, "product added.", null);
        } else {
            response_form(res, 400, "Missing Arguments", null);
        }
    } catch(err) {
        console.log(err);
        response_form(res, 500, "Ops! something went wrong.", null);
    }
});

// edited product data
router.put('/:id', async function(req, res, next) {
    let { productName, remaining, price, description, imageUrl } = req.body;
    let { id } = req.params;

    if(!id) {
        response_form(res, 400, "Missing Arguments", null);
    } else {
        let productData = await productSchema.findById(id);
        if(!productData){
            response_form(res, 400, "Invalid ID", null);
        } else {
            productData.productName = (productName?productName:productData.productName);
            productData.remaining = (remaining?remaining:productData.remaining);
            productData.price = (price?price:productData.price);
            productData.description = (description?description:productData.description);
            productData.imageUrl = (imageUrl?imageUrl:productData.imageUrl);

            productData.save();
            
            response_form(res, 200, "Updated successfully", productData);
        }
    }
});

// remove product
router.delete('/:id', async function(req, res, next) {
    let { id } = req.params;

    if(!id) {
        response_form(res, 400, "Missing Arguments", null);
    } else {
        let deletedData = await productSchema.findByIdAndDelete(id);
        if(!deletedData){
            response_form(res, 400, "Invalid ID", null);
        } else {
            response_form(res, 200, "Delected successfully", null);
        }
    }
});

// get order from product id
router.get('/:id/orders', async function(req, res, next) {
    let { id } = req.params;

    if(!id) {
        response_form(res, 400, "Missing Arguments");
    } else {
        product_id = id;
        let searchedData = await orderSchema.find({ product_id });

        if(searchedData.length > 0){ 
            response_form(res, 200, "Request", searchedData);
        } else {
            response_form(res, 200, "Order(s) Not Found");
        }
    }
});

// order from product id
router.post('/:id/orders', async function(req, res, next) {
    let { quantities } = req.body;
    let { id } = req.params;
    let user_data = req.user;

    if(!quantities){
        response_form(res, 400, "Missing Arguments", null);
    }

    if(!id) {
        response_form(res, 400, "Product ID Missing", null);
    } else {
        product_id = id;
        let productData = await productSchema.findById(id);
        if(productData){
            if(productData.remaining >= quantities) { // quantities check
                // create order
                let new_order = new orderSchema({
                    customer_name : user_data.username,
                    product_id : id,
                    product_name : productData.productName,
                    quantities : quantities,
                    each_price : productData.price,
                    total : productData.price*quantities,
                });
                new_order.save();
                // console.log(new_order);

                // update product
                productData.remaining = productData.remaining - quantities
                productData.save();
                
                response_form(res, 200, "Order successfully", new_order);
            } else {
                response_form(res, 400, `Sorry, We don't have enough item(s). (${productData.remaining} remaining)`, null);
            }
        } else {
            response_form(res, 400, "Invalid product ID", null);
        }
    }
});

module.exports = router;