var model = require('../models/OKOGBillingModel.js');
var model1 = require('../models/OKOGBillingReportModel.js');
const debug = require('debug')('ERP:server');
// var model1 = require('../models/OKOG_BILLING_LOCATIONModel.js')

function insertDocument(formData, targetCollection, callback) {

    var keepRunning = true;
    var seq = 1;
    async.whilst(recursiveFunction, mainFunction);
    function recursiveFunction() {
        return keepRunning;
    }
    function mainFunction(next) {
        targetCollection.find({}).select('_id documentNumber').sort({
            'documentNumber': -1
        }).limit(1).exec(function(err, inqDataRaw) {
            if (!err) {
                var new_documentNumber = 1;
                if(inqDataRaw.length > 0){
                    var inqDataRaw = JSON.stringify(inqDataRaw[0]);
                    inqDataRaw = JSON.parse(inqDataRaw);
                    new_documentNumber = inqDataRaw.documentNumber ? parseInt(inqDataRaw.documentNumber) + 1 : 1;
                }
                    var formDataSerialized = JSON.stringify(formData);
                    formDataSerialized = JSON.parse(formDataSerialized);
                    formDataSerialized.documentNumber = new_documentNumber;

                    var OKOGBillingReport = new model1(formDataSerialized);
                    OKOGBillingReport.save(function(err, OKOGBillingReport) {
                        debug(err, OKOGBillingReport);
                        if (err) {
                            if (err.code == 11000) {
                                debug("Duplicate documentNumber Number Detected");
                                keepRunning = false;
                            } else {
                                debug("Error in saving");
                                keepRunning = false;
                            }
                        } else {
                            debug("Inserted Successfully");
                            keepRunning = false;
                            callback(null, 'saved');
                        }
                        next();
                    });
            }else{
                keepRunning = false;
            }
        });
    }
}

function convertToDate(data) {
    var day, month, year, date;
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    if (data != "") {
        data = data.replace("/", '');
        data = data.replace("/", '');
        year = data.substring(4, 8);
        month = data.substring(2, 4);
        day = data.substring(0, 2);
        date = day + " " + monthNames[parseInt(month) - 1] + " " + year + " " + "00:00:00 -0530";
        data = new Date(date);
        return data;
    } else {
        return "";
    }
}

module.exports = {

	create: function(req, res) {
		// var company = req.body.company.split("@");
		// req.body.company = company[0];

		// var KTName = req.body.kesarianName.split('_');
		// req.body.kesarianName = KTName[1];
		// req.body.kesarianNameRSID = KTName[0];

        req.body.created_at = new Date();
        req.body.created_by = req.session.user.uid;

        var OKOGBilling = new model(req.body);
        OKOGBilling.save(function(err, OKOGBilling){
            if(err) {
                return res.status(500).json({
                    message: 'Error Saving OKOGBilling',
                    error: err
                });
            }else if(!OKOGBilling){
            	return res.status(404).json({
            		message: 'No Suchh A Record Found For OKOGBilling.'
            	});
            }else{
        		return res.status(200).json({
        			message: 'Sucessfully Added OKOGBilling.'
        			//data   :OKOGBilling
        		});
        	}
        });
    },

    show: function(req, res) {
        var id = req.params.id;
        model.findOne({_id: id}, function(err, ShowOKOGBilling){
            if(err) {
                return res.json(500, {
                    message: 'Error getting ShowOKOGBilling.'
                });
            }
            if(!ShowOKOGBilling) {
                return res.json(404, {
                    message: 'No such ShowOKOGBilling'
                });
            }
            return res.json(ShowOKOGBilling);
        });
    },

    update: function(req, res) {
    	req.body.updated_by = req.session.user.uid;
    	req.body.updated_at = new Date();

        var id = req.params.id;
        var NewObj = req.body;

        model.findById(id, function (err, OKOGData) {
            model.update({_id: id}, {$set: NewObj}, function (err, OKOGData1) {
                if(err) {
	                return res.status(500).json({
	                    message: 'Error getting OKOGData.'
	                });
	            }
                return res.status(200).json({
                    message: 'Updated Successfully',
                });
            });
        }); 
    },

    list: function(req, res) {
     var query = {};
        if(req.params.COMPANY){
            query.company = req.params.COMPANY
        }

        // if(req.params.LOCATION){
        //     query.location = req.params.LOCATION
        // }
       
        model.find(query , function(err , CompanyWiseOKOGBilling){
             if (err) {
                return res.json(500, {
                    message: 'Error getting OKOGBilling Company Wise Location Data.'
                });
            }else{
            	return res.status(200).json({
            		message: 'Data Found For Selected Company.',
            		result: CompanyWiseOKOGBilling
            	})
            }
        });    
    },

    BillReportCreation: function(req, res) {
        try {
        	req.body.createdAt = new Date();
        	req.body.createdBy = req.session.user.uid;
        	req.body.fromDate = convertToDate(req.body.fromDate);
        	req.body.toDate = convertToDate(req.body.toDate);
        	req.body.createdByName = req.session.user.givenName;
            // req.body.branch = req.user.F21_BRANCH;
            // req.body.momDate = convertToDate(req.body.momDate);
            // req.body.momDate = convertToDate(req.body.momDate);
            var formData = req.body; 
            insertDocument(formData, model1, function(err, msg) {
                if(err){
                    res.status(500).json({
                        message: "Faild",
                        result: err
                    });
                }else{
                    res.status(200).json({
                        message: "Successfully Added Billing Data",
                        result: msg
                    });
                }
            });
        } catch (e) {
            debug('An error has occurred: '+e.message);
        }
    },	
    
    /*companyWiseLocationShow: function(req, res) {
    	// For Loading Only Data Array. {data:1}
    	var id = req.params.id;
        model1.findOne({_id: id}, {data:1} ,function(err, ShowOKOGBilling){
            if(err) {
                return res.json(500, {
                    message: 'Error getting ShowOKOGBilling.'
                });
            }
            if(!ShowOKOGBilling) {
                return res.json(404, {
                    message: 'No such ShowOKOGBilling'
                });
            }
            return res.json(ShowOKOGBilling);
        });
    }*/
    // nameUpdate: function(req, res){
    //     try{
    //         console.log(req.body);
    //     console.log({_id:req.body.id,"billingData.okogNo":req.body.number});
    //     model1.findOneAndUpdate({"billingData._id":req.body.id,"billingData.okogNo":req.body.number},{$set:{'billingData.$.kesarianName':req.body.name}},function(err,data){
    //         if(err){
    //             res.status(500).json({msg:err});
    //         }
    //         model.findOneAndUpdate({OKOGNO:req.body.number},{$set:{kesarianName:req.body.name}},function(err,data){
    //             if(err){
    //                 res.status(500).json({msg:err});
    //             }
    //             res.status(200).json({message:"Data Updated Successfully"});
    //         })
            
    //     })
    //     }catch(err){
    //         console.log(err);
    //     }
        
    // },

    // nameUpdate: async function(req, res){
    //     try {
    //         console.log(req.body);
    
    //         const updateCondition1 = {
    //             "billingData._id": req.body.id,
    //             "billingData.okogNo": req.body.number
    //         };
    //         const updateCondition2 = {
    //             OKOGNO: req.body.number
    //         };
    //         const updateData = {
    //             $set: { 
    //                 'billingData.$.kesarianName': req.body.name,
    //                 'billingData.$.location': req.body.location,
    //                 'billingData.$.assignee': req.body.assignee,
    //                 'billingData.$.limit': req.body.limit
    //             }
    //         };
    //         const updateData2 = {
    //             $set: { 
    //                 kesarianName: req.body.name,
    //                 location: req.body.location,
    //                 assignee: req.body.assignee,
    //                 limit: req.body.limit
    //             }
    //         };
    
    //         // Update in model1
    //         await model1.findOneAndUpdate(updateCondition1, updateData);
    
    //         // Update in model
    //         await model.findOneAndUpdate(updateCondition2, updateData2);
    
    //         // If both updates are successful
    //         res.status(200).json({ message: "Data Updated Successfully" });
    
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ message: "An error occurred while updating data", error: err.message });
    //     }
    // },

     nameUpdate : async (req, res) => {
        try {
            const { id, number, kesarianName, location, assignee, limit } = req.body;
    
            // First update in model1
            await model1.findOneAndUpdate(
                { "billingData._id": id, "billingData.okogNo": number },
                {
                    $set: {
                        'billingData.$.kesarianName': kesarianName,
                        'billingData.$.location': location,
                        'billingData.$.assignee': assignee,
                        'billingData.$.limit': limit
                    }
                }
            );
    
            // Second update in model
            await model.findOneAndUpdate(
                { OKOGNO: number },
                {
                    $set: {
                        kesarianName: kesarianName,
                        location: location,
                        assignee: assignee,
                        limit: limit
                    }
                }
            );
    
            res.status(200).json({ message: "Data Updated Successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "An error occurred while updating data", error: err.message });
        }
    },
    
    
    showReportView: function(req, res) {
        var reportId = req.params.reportId;
        model1.findOne({_id: reportId}, function(err, ShowOKOGBilling){
            if(err) {
                return res.json(500, {
                    message: 'Error getting ShowOKOGBilling.'
                });
            }
            if(!ShowOKOGBilling) {
                return res.json(404, {
                    message: 'No such ShowOKOGBilling Report'
                });
            }
            return res.json(ShowOKOGBilling);
        });
    },
    
    updateReportView: function(req, res) {
    	try{
	    	req.body.updated_by = req.session.user.uid;
	    	req.body.updated_at = new Date();

	    	req.body.fromDate = convertToDate(req.body.fromDate);
        	req.body.toDate = convertToDate(req.body.toDate);
	        var reportId = req.params.reportId;
	        var NewObj = req.body;

	        model1.findById(reportId, function (err, updateReportViewData) {
	            model1.update({_id: reportId}, {$set: NewObj}, function (err, updateReportViewData1) {
	                if(err) {
		                return res.status(500).json({
		                    message: 'Error getting updateReportViewData1.'
		                });
		            }
	                return res.status(200).json({
	                    message: 'Updated Successfully',
	                });
	            });
	        }); 
    	}catch(err){
    		debug("err is",err);
    	}
    },
}