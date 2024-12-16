var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');
var Schema   = mongoose.Schema;

var F_SUPPCONTRACTSchema = new Schema({
	"tranNo":Number,
	"tourSeries":String,
	"fromDate":{type:Date,default:Date.now},
    "toDate":{type:Date,default:Date.now},
	"contract_content":String,
    "file":String,
	"created_by" : String,
	"created_at":{type:Date,default:Date.now},
	"isActive" : {type: Boolean, default: true},
});
F_SUPPCONTRACTSchema.plugin(mongooseHistory);
module.exports = mongoose.model('F_SUPPCONTRACT', F_SUPPCONTRACTSchema);