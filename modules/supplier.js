const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const supplierSchema = new Schema({
 name:{
     type:String,
     required:true
 },
 number:{
     type:String,
     required:true
 },
 email:{
     type:String,
     required:true
 },
 location:{
     type:String,
     required:true
 },
 admin:{
     type:[Schema.Types.ObjectId],
     ref:'User'
 }
});

module.exports= mongoose.model('Supplier',supplierSchema);