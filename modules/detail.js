const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Customer = require('./customer');
const Supplier = require('./supplier');
const Product = require('./product');
const User = require('./user');

const detailSchema = new Schema({
    paymentmethod:{
        type:[String]
    },
    monthlysales:{
        type:[{
            month:"String",
            amount:"Number"
        }]
    },
    Cart:{
        type:[Schema.Types.ObjectId],
        ref:'Product'
    },
    expenses:{
        type:[{
            month:"String",
            amount:"Number"
        }]
    },

 customer:{
     type:[Schema.Types.ObjectId],
     ref:'Customer'
 },
 supplier:{
     type:[Schema.Types.ObjectId],
     ref:'Supplier'
 },
 product:{
     type:[Schema.Types.ObjectId],
     ref:'Product'
 },
 admin:{
     type:[Schema.Types.ObjectId],
     ref:'User'
 }
});

module.exports= mongoose.model('Detail',detailSchema);


