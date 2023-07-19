var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');
var Schema   = mongoose.Schema;
var autoIncrement = require('../custom/mongoose-auto-increment-extend');
var db = mongoose.connection;

autoIncrement.initialize(db);

var weddingPlanCheckListSchema = new Schema({
	"wedding_plan_checklist":String,
	"event_type":{type:String , default:"Wedding Planner Checklist"},
	"Guest_UID": String,
	"guest_Name" : String,
	"guest_Mobile" :Number,
	"guest_Email" :String,
	"wedding_type":String,
	"language":String,
	"checkList":[{
		Narrow_down_dates:String,
		gather_guest_list:String,
		settle_a_budget:String,
		create_wedding_website:String,
		reserve_venue:String,
		book_vendors:String,
		final_number_of_events:String,
		book_entertainment:String,
		wedding_trousou:String,
		wedding_outfits:String,
		invitation_selection:String,
		book_car_tranportation:String,
		make_up_artist:String,
		acessory_shopping:String,
		RSVP:String,
		E_invites:String,
		book_music:String,
		licences:String,
		F_and_B_finalization:String,
		choreographer:String,
		pre_wedding_shoot:String,
		honeymoon_booking:String,
		payment_mode:String,
		goodie_bags:String,
		thank_you_goods:String,
		room_hampers:String,
		souviners:String,
		whether_prection_prevention:String

	}
	],
	"isActive" : {type: Boolean, default: true},
	"created_by":String,
	"created_at":{type:Date,default:Date.now},
	
});

weddingPlanCheckListSchema.plugin(mongooseHistory);

weddingPlanCheckListSchema.plugin(autoIncrement.plugin, {
    model: 'wedding_plan_checklist',
    field: 'Guest_UID',
    prefix:'GUID',
    startAt: 1,
    incrementBy: 1,

});
module.exports = mongoose.model('weddingPlanCheckList', weddingPlanCheckListSchema);