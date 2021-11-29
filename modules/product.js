const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');


const productSchema = new Schema({
 name:{
     type:String,
     required:true
 },
 code:{
     type:String,
     required:true
 },
 categories:{
    type:String,
     required:true
 },
 description:{
    type:String,
     required:true
 },
 stock:{
    type:String,
    required:true
 },
 price:{
    type:Number,
    required:true
 },
 admin:{
     type:[Schema.Types.ObjectId],
     ref:'User'
 }
});

module.exports= mongoose.model('Product',productSchema);