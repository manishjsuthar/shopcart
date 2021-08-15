var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = new Schema({
    aname: {type: String , required: true},
    aemail: {type: String, required: true},
    aphone: {type: String, required: true},
    aaddress: {type: String, required: true},
    acountry: {type: String, required: true},
    astate: {type: String, required: true},
    apincode: {type: String, required: true},
    oproduct1: [{oproduct:{type:Array, required: true},
                oproductqty: {type: Array, required: true},
                oproducttprice: {type: String, required: true},}]
});

module.exports = mongoose.model('DeliveryAddress', addressSchema); 