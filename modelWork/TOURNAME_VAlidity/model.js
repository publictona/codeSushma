var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');
var Schema   = mongoose.Schema;

var tourNameDateValiditySchema = new Schema({
	"tourCode" : String,
	"tourName" : String,
	"validFrom" : {type:Date,default:Date.now},
	"validTo" : {type:Date,default:Date.now},
	"isActive" : {type: Boolean, default: true},
});
	

tourNameDateValiditySchema.plugin(mongooseHistory);

module.exports = mongoose.model('tourNameDateValidity', tourNameDateValiditySchema,'tourNameDateValidity');
