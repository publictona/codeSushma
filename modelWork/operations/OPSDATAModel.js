var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongooseHistory = require('mongoose-history');
//var address = require("../models/addressModel");
//var contactPerson = require("../models/contactPersonModel");

var OPSDATA = Schema({ any: Schema.Types.Mixed }, { strict : false });
OPSDATA.plugin(mongooseHistory);
var OPSDATAModel = mongoose.model('OPSDATA', OPSDATA,'OPSDATA');
module.exports = OPSDATAModel;