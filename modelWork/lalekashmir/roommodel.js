var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');
var DataTable = require('mongoose-datatable');
var Schema = mongoose.Schema;

DataTable.configure({ verbose: true, debug: true });
mongoose.plugin(DataTable.init);

var roomMasterNewSchema = new Schema({
    "roomId": Number,
    "hotelId": Number,
    "room_number": Number,
    "room_type": String,
    "beds": Number,
    "availability": Boolean,
    "reservation": [{
        "reservation_id": String,
        "guest_name": String,
        "checkin_date": { type: Date },
        "checkout_date": { type: Date },
    }]
});



roomMasterNewSchema.plugin(mongooseHistory);
module.exports = mongoose.model('roomMasterNew', roomMasterNewSchema);