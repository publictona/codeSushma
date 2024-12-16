var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');


var F_SUPPSchema = new mongoose.Schema({
	"tranNo":Number,
	"tourSeries":String,
	"validFrom":String,
    "validTo":String,
	"contract_content":String,
	"hotelName":String,
	"hotelPlace":String,
	"suppliercat":String,
	"supplier_no":Number,
	"supplier_category":String,
    "uploadFile": String,
	"created_by" : String,
	"created_at":{type:Date,default:Date.now},
	"isActive" : {type: Boolean, default: true},
    // "tourCode" : String,
	// "tourName" : String,
	// "validFrom" : {type:Date,default:Date.now},
	// "validTo" : {type:Date,default:Date.now},
	// "isActive" : {type: Boolean, default: true},
});
F_SUPPSchema.plugin(mongooseHistory);
module.exports = mongoose.model('F_SUPP', F_SUPPSchema , 'F_SUPP');


