var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enquirySchema = new Schema({
    efname: {type: String , required: true},
    elname: {type: String, required: true},
    ephone: {type: String, required: true},
    eemail: {type: String, required: true},
    emessage: {type: String, required: true}
});

module.exports = mongoose.model('Enquiry', enquirySchema); 