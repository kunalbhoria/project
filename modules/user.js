const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Customer = require('./customer');
const Supplier = require('./supplier');
const Product = require('./product');
const Detail = require('./detail');

const userSchema = new Schema({
 email:{
     type:String,
     required:true
 },
 password:{
     type:String,
     required:true
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
 paymentmethod:{
    type:[String]

},
monthlysales:[{month:String, amount:Number}],
cart:{
    type:[String]
},
expenses:[{
        month:String,
        amount:Number
    }],
});

module.exports= mongoose.model('User',userSchema);