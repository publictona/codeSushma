/*
 * @Author: Maruti Karad
 * @Date: 2018-10-04 20:00:02
 * @Last Modified by:   Shital
 * @Last Modified time: 2018-06-13 17:58:03
 */


/*********************************
CORE PACKAGES
**********************************/
var passport = require('../passport');
var express = require('express');
const debug = require('debug')('ERP:server');
var router = express.Router();
var q = require('q');
var jwt = require('jsonwebtoken');
var util = require('../routes/util.js');
var asego = require('../routes/asego.js');
var moment = require('moment');
var nodemailer = require('nodemailer');
var fs = require('fs');
var request = require('request');
var smtpTransport = require('nodemailer-smtp-transport');
var configAuth = require('../config/auth');
var js2xmlparser = require('js2xmlparser');
const xml2json = require('../custom/musicjson-extend');
/*********************************
MODULE PACKAGES
**********************************/
// var controller = require('../controllers/whatsapMarketingController.js');
var baseExport = require('../baseExporter.js');
var authentication = require('../authentication.js');
var rsDataModel = require('../models/rsDataModel.js');
var erpMasterModel = require('../models/rsDataModel.js').erpMasterModel;
var tourmas0Model = require('../models/TOURMAS0Model.js');

//var insurancePoolModel = require('../models/insurancePoolModel.js');
/*********************************
GET REQUESTS
**********************************/


router.get('/apiMaster', function (req, res, next) {
    try {
        res.render('insurance/list', {
            "username": req.session.user.cn,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "kname": req.session.user.cn,
            "rsid": req.session.user.uid,
            "department": req.session.user.department,
            "branch": req.session.user.other_info[0].F21_BRANCH,
            "title": 'Insurance Email master',
            "AccessToken": req.session.user.token,
            "token": req.session.token
        }, function (err, html) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.send(html);
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/master', function (req, res, next) {
    try {
        res.render('insurance/apiInsurancelist', {
            "username": req.session.user.cn,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "kname": req.session.user.cn,
            "rsid": req.session.user.uid,
            "department": req.session.user.department,
            "branch": req.session.user.other_info[0].F21_BRANCH,
            "title": 'Insurance Api master',
            "AccessToken": req.session.user.token,
            "token": req.session.token
        }, function (err, html) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.send(html);
        });
    } catch (e) {
        console.log(e);
    }
});

//Sushma Landge
// ------------------------------Insurance Report---------------------------------------
router.get('/insuranceReport', function (req, res, next) {
    try {
        res.render('insurance/insuranceReport', {
            "username": req.session.user.cn,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "kname": req.session.user.cn,
            "rsid": req.session.user.uid,
            "department": req.session.user.department,
            "branch": req.session.user.other_info[0].F21_BRANCH,
            "title": 'Insurance Api master',
            "AccessToken": req.session.user.token,
            "token": req.session.token
        }, function (err, html) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.send(html);
        });
    } catch (e) {
        console.log(e);
    }
});



// router.post('/getValidInsurancePolicieswork', async (req, res) => {
//     try {
//         const { tourcode } = req.body;

//         if (!tourcode) {
//             return res.status(400).json({ status: false, message: "tourcode is required in the request body." });
//         }

//         const today = new Date();

//         // Step 1: Retrieve insurance data
//         const insuranceData = await rsDataModel.insurancePoolModel.find({
//             policyIssued: true,
//             travelStartDt: { $gte: today }
//         }).lean().select('tourcode tourform tourId tourName country policyIssued tranNo travelStartDt travelEndDt guestName guestNo policyNo policyAmount');

//         if (!insuranceData || insuranceData.length === 0) {
//             return res.status(404).json({ status: false, message: "No insurance data found for the specified tourcode." });
//         }

//         console.log("insuranceData" ,insuranceData)

//         // Step 2: Retrieve tour data for tourcode from TOURMAS0
//         const tourData = await tourmas0Model.findOne({
//             TM_TCD: tourcode
//         }).lean().select("TM_TCD TM_DT1 TM_DT2 TOURNAME TM_LEADER");

//         console.log("tourData" ,tourData)

//         if (!tourData) {
//             return res.status(404).json({ status: false, message: "No tour data found for the specified tourcode in TOURMAS0." });
//         }

//         // Helper function to format date as DD/MM/YYYY
//         function formatDate(date) {
//             const day = String(date.getDate()).padStart(2, '0');
//             const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//             const year = date.getFullYear();
//             return `${day}/${month}/${year}`;
//         }

//         // Step 3: Filter insuranceData where travelStartDt is within TM_DT1 and TM_DT2 from tourData
//         const matchedInsuranceData = insuranceData.filter(ins => {
//             const travelStart = new Date(ins.travelStartDt);
//             const tmDt1 = new Date(tourData.TM_DT1);
//             const tmDt2 = new Date(tourData.TM_DT2);

//             // Check if travelStartDt is between TM_DT1 and TM_DT2
//             return travelStart >= tmDt1 && travelStart <= tmDt2;
//         }).map(ins => ({
//             ...ins,
//             travelStartDt: formatDate(new Date(ins.travelStartDt)) // Format travelStartDt as DD/MM/YYYY
//         }));

//         // Format TM_DT1 and TM_DT2 in tourData
//         tourData.TM_DT1 = formatDate(new Date(tourData.TM_DT1));
//         tourData.TM_DT2 = formatDate(new Date(tourData.TM_DT2));

//         if (matchedInsuranceData.length === 0) {
//             return res.status(404).json({ status: false, message: "No insurance policies match the specified date range in TOURMAS0." });
//         }

//         // Step 4: Combine matched insurance data with formatted tour data
//         const combinedData = {
//             insuranceData: matchedInsuranceData,
//             tourData
//         };

//         res.status(200).json({ status: true, data: combinedData });
//     } catch (err) {
//         console.error("Error fetching insurance and tour data:", err);
//         res.status(500).json({ status: false, message: "Internal server error" });
//     }
// });




// router.post('/getValidInsurancePolicies', async (req, res) => {
//     try {
//         const unmatchedInsuranceData = []; // Array to store unmatched insurance data
//         const todayDt = moment().startOf('day').toDate();

//         // Retrieve insurance data for policies issued and starting today or later
//         rsDataModel.insurancePoolModel.find({
//             policyIssued: true,
//             travelStartDt: { $gte: todayDt }
//         })
//         .select('tourcode tourform tourId tourName country policyIssued tranNo travelStartDt travelEndDt guestName guestNo policyNo policyAmount')
//         .exec((err, insData) => {
//             if (err) {
//                 return res.status(500).json({ status: false, message: err.message });
//             }

//             insData = JSON.parse(JSON.stringify(insData));
            
//             async.eachSeries(insData, function (item, cb) {
//                 tourmas0Model.find({
//                     TM_TCD: item.tourcode
//                 })
//                 .select("TM_TCD TM_DT1 TM_DT2 TOURNAME TM_LEADER")
//                 .exec((err, tourData) => {
//                     if (err) return cb(err);
                    
//                     let matched = false;
                    
//                     if (tourData && tourData.length > 0) {
//                         for (const tour of tourData) {
//                             // Convert dates to start of day to avoid time component mismatches
//                             const travelStartDt = item.travelStartDt;
//                             const TM_DT1 = { $gte: travelStartDt };
//                             const TM_DT2 = { $lte: travelStartDt };
                            
//                             // Check if travelStartDt is within the TM_DT1 and TM_DT2 range
//                             if (travelStartDt >= TM_DT1 && travelStartDt <= TM_DT2) {
//                                 matched = true;
//                                 break;
//                             }
//                             console.log("travelStartDt", travelStartDt)
//                         }
//                     }

//                     // If no matching tour data or no date match, add to unmatched array
//                     if (!matched) {
//                         unmatchedInsuranceData.push(item);
//                     }

//                     cb(); // Move to the next item in async.eachSeries
//                 });
//             }, (err) => { // Final callback for async.eachSeries
//                 if (err) {
//                     console.error("Error in async processing:", err);
//                     return res.status(500).json({ status: false, message: err.message });
//                 }
                
//                 // Send the unmatched insurance data as response
//                 res.status(200).json({ status: true, unmatchedData: unmatchedInsuranceData, data: insData });
//             });
//         });
//     } catch (err) {
//         console.error("Error fetching insurance and tour data:", err);
//         res.status(500).json({ status: false, message: "Internal server error" });
//     }
// });

//  const travelStartDt = moment( item.travelStartDt, "YYYY-MM-DD").toDate();





// router.post('/getValidInsurancePolicies', async (req, res) => {
//     try {
//         const todayDt = moment().startOf('day').toDate();
        
//         // Retrieve insurance data for policies issued and starting today or later
//         rsDataModel.insurancePoolModel.find({
//             policyIssued: true,
//             travelStartDt: { $gte: todayDt }
//         })
//         .select('tourcode tourform tourId tourName country policyIssued tranNo travelStartDt travelEndDt guestName guestNo policyNo policyAmount')
//         .exec((err, insData) => {
//             if (err) {
//                 return res.status(500).json({ status: false, message: err.message });
//             }
//             const unmatchedInsuranceData = []; // Array to store unmatched insurance data

//             insData = JSON.parse(JSON.stringify(insData));
//          //   console.log("insData" , insData)

//             async.eachSeries(insData, function (item, cb) {
//                 const travelStartDt = moment(item.travelStartDt).format("YYYY-MM-DD");   //new Date(item.travelStartDt); // Ensure travelStartDt is a Date object

//                 tourmas0Model.find({
//                     TM_TCD: item.tourcode
//                 })
//                 .select("TM_TCD TM_DT1 TM_DT2")
//                 .exec((err, tourData) => {
//                     if (err) return cb(err);

//                     tourData = JSON.parse(JSON.stringify(tourData));

//                     let matched = false;

//                     // Loop through each tourData item and check if travelStartDt is within the range of TM_DT1 and TM_DT2
//                     if (tourData && tourData.length > 0) {
//                         for (const tour of tourData) {
//                           const TM_DT1 = moment(tour.TM_DT1).format("YYYY-MM-DD");
//                             const TM_DT2 = moment(tour.TM_DT2).format("YYYY-MM-DD");

//                             // Check if travelStartDt falls within TM_DT1 and TM_DT2 range
//                             if (travelStartDt >= TM_DT1 && travelStartDt <= TM_DT2) {
//                                 matched = true; // Set matched to true if a match is found
//                                 break; // Stop checking further if a match is found
//                             }
//                         }
//                     }

//                     // If no matching tour data found, add item to unmatched array
//                     if (!matched) {
//                         unmatchedInsuranceData.push(item);
//                     }

//                   //  unmatchedInsuranceData.push(unMatch);
//                     cb(); // Move to the next item in async.eachSeries
//                 });
//                 console.log(" unmatchedInsuranceData" ,  unmatchedInsuranceData)
//             });
//             res.status(200).json({ status: true, data: unmatchedInsuranceData });
//         });
//     } catch (err) {
//         console.error("Error fetching insurance and tour data:", err);
//         res.status(500).json({ status: false, message: "Internal server error" });
//     }
// });


// router.post('/getValidInsurancePolicies', async (req, res) => {
//     try {
//         const todayDt = moment().startOf('day').toDate();
        

//         // Retrieve insurance data for policies issued and starting today or later
//         const insData = await rsDataModel.insurancePoolModel.find({
//             policyIssued: true,
//             travelStartDt: { $gte: todayDt }
//         }).select('tourcode tourform tourId tourName country policyIssued tranNo travelStartDt travelEndDt guestName guestNo policyNo policyAmount').lean();
//         console.log("insData"  , insData.length)
//         // Collect all unique tour codes from insData
//        // const tourcodes = [...new Set(insData.map(item => item.tourcode))];
//         const tourcodes = insData.map(item => item.tourcode);
//         console.log("tourcodes"  , tourcodes.length)
//         // Retrieve all relevant tour data in one go
//         const tourDataMap = await tourmas0Model.find({
//             TM_TCD: { $in: tourcodes }
//            // TM_DT1: { $in: travelStartDt },
//            // TM_DT2: { $in: travelStartDt }
//         }).select("TM_TCD TM_DT1 TM_DT2").lean();
//        console.log("tourDataMap"  , tourDataMap.length)

//         const unmatchedInsuranceData = [];

//         // Organize tour data by tour code for quick lookup
//         const tourDataByCode = tourDataMap.reduce((acc, tour) => {
//             if (!acc[tour.TM_TCD]) acc[tour.TM_TCD] = [];
//             acc[tour.TM_TCD].push({
//                 TM_DT1: moment(tour.TM_DT1).format("YYYY-MM-DD"),
//                 TM_DT2: moment(tour.TM_DT2).format("YYYY-MM-DD")
//             });
//             console.log("accacc"  ,acc , acc.length)
//             return acc;
//         }, {});
//         console.log("tourDataByCode"  , tourDataByCode.length)
//         // Process each item in insData to find unmatched records
//         insData.forEach(item => {
//             const travelStartDt = moment(item.travelStartDt).format("YYYY-MM-DD");
//             const tourMatches = tourDataByCode[item.tourcode] || [];
            
//             // Check if any tour date range matches
//             const matched = tourMatches.some(tour => 
//                 travelStartDt >= tour.TM_DT1 && travelStartDt <= tour.TM_DT2
//             );

//             // If no match found, add to unmatched insurance data
//             if (!matched) {
//                 unmatchedInsuranceData.push(item);
//             }
//         });

//         // Send the unmatched insurance data and count as response
//         res.status(200).json({ 
//             status: true, 
//             count: unmatchedInsuranceData.length, // Document count
//             data: unmatchedInsuranceData 
//         });

//     } catch (err) {
//         console.error("Error fetching insurance and tour data:", err);
//         res.status(500).json({ status: false, message: "Internal server error" });
//     }
// });


router.post('/getValidInsurancePolicies', async (req, res) => {
    try {
        const todayDt = moment().startOf('day').toDate();

        // Retrieve insurance data for policies issued and starting today or later
        const insData = await rsDataModel.insurancePoolModel.find({
            policyIssued: true,
            travelStartDt: { $gte: todayDt }
        }).select('tourcode tourform tourId tourName country policyIssued insuranceStartDt insuranceEndDt tranNo travelStartDt travelEndDt guestName guestNo policyNo policyAmount').lean();

        console.log("insData count:", insData.length);

        // Get all tour codes from insData
        const tourcodes = insData.map(item => item.tourcode);
        console.log("tourcodes count:", tourcodes.length);

        // Retrieve all relevant tour data at once
        const tourDataMap = await tourmas0Model.find({
            TM_TCD: { $in: tourcodes }
        }).select("TM_TCD TM_DT1 TM_DT2").lean();

        console.log("tourDataMap count:", tourDataMap.length);

        const unmatchedInsuranceData = [];

        // Organize tour data by tour code for quick lookup and ensure date format consistency
        const tourDataByCode = tourDataMap.reduce((acc, tour) => {
            if (!acc[tour.TM_TCD]) acc[tour.TM_TCD] = [];
            acc[tour.TM_TCD].push({
                TM_DT1: moment(tour.TM_DT1).format("YYYY-MM-DD"),
                TM_DT2: moment(tour.TM_DT2).format("YYYY-MM-DD")
            });
            return acc;
        }, {});

      //  console.log("tourDataByCode keys count:", Object.keys(tourDataByCode).length);

        // Process each item in insData to find unmatched records
        insData.forEach(item => {
            const travelStartDt = moment(item.travelStartDt).format("YYYY-MM-DD");
            const tourMatches = tourDataByCode[item.tourcode] || [];

            // Check if any tour date range matches
            const matched = tourMatches.some(tour => 
                travelStartDt >= tour.TM_DT1 && travelStartDt <= tour.TM_DT2
            );
      

            // If no match found, add to unmatched insurance data
            if (!matched) {
                unmatchedInsuranceData.push(item);
            }
        });

        // Send the unmatched insurance data and count as response
        res.status(200).json({ 
            status: true, 
            count: unmatchedInsuranceData.length, // Document count
            data: unmatchedInsuranceData 
        });

    } catch (err) {
        console.error("Error fetching insurance and tour data:", err);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});

router.post('/getValidInsurancePoliciessss', function (req, res) {
    try {
        const unmatchedInsuranceData = []; // Array to store unmatched insurance data
        const todayDt = moment().startOf('day').toDate(); // Use static date as requested

        
        // Step 1: Retrieve insurance data from insurancePoolModel
        rsDataModel.insurancePoolModel.find({
            policyIssued: true,
            travelStartDt: { $gte: todayDt }
        }, function (err, insData) {
            if (err) {
                return res.status(500).json({ status: false, message: err.message });
            }
            insData = JSON.parse(JSON.stringify(insData));

            async.eachSeries(insData, function (item, cb) {
                // Step 2: Retrieve corresponding data from tourmas0Model with matching tourcode
                tourmas0Model.find({
                    TM_TCD: item.tourcode
                }).lean().select("TM_TCD TM_DT1 TM_DT2 TOURNAME TM_LEADER")
                .exec(function (err, tourData) {
                    if (err) return cb(err);

                    let matched = false;
                    
                    if (tourData && tourData.length > 0) {
                        for (const tour of tourData) {
                            // Convert to start of day to avoid time component mismatches
                            const travelStartDt = new Date(item.travelStartDt).setHours(0, 0, 0, 0);
                            const TM_DT1 = new Date(tour.TM_DT1).setHours(0, 0, 0, 0);
                            const TM_DT2 = new Date(tour.TM_DT2).setHours(0, 0, 0, 0);

                            // Check if travelStartDt is within the TM_DT1 and TM_DT2 range
                            if (travelStartDt >= TM_DT1 && travelStartDt <= TM_DT2) {
                                matched = true;
                                break;
                            }
                        }
                    }

                    // If no matching tour data or no date match, add to unmatched array
                    if (!matched) {
                        unmatchedInsuranceData.push(item);
                    }
                    
                    cb(); // Move to the next item in async.eachSeries
                });
            }, function (err) {
                if (err) {
                    console.error("Error in async processing:", err);
                    return res.status(500).json({ status: false, message: err });
                }
                // Step 4: Send the unmatched insurance data as response
                res.status(200).json({ status: true, data: insData });
            });
        }).lean().select('tourcode tourform tourId tourName country policyIssued tranNo travelStartDt travelEndDt guestName guestNo policyNo policyAmount');
    } catch (e) {
        console.error("Unexpected error:", e);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}





//-----------------------------end--------------------------------------------


router.get('/opsInsuMaster', function (req, res, next) {
    try {
        res.render('insurance/opsInsuMaster', {
            "username": req.session.user.cn,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "kname": req.session.user.cn,
            "rsid": req.session.user.uid,
            "department": req.session.user.department,
            "branch": req.session.user.other_info[0].F21_BRANCH,
            "title": 'Insurance Api master',
            "AccessToken": req.session.user.token,
            "token": req.session.token
        }, function (err, html) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.send(html);
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/insuReport', function (req, res, next) {
    try {
        res.render('insurance/insuReport', {
            "username": req.session.user.cn,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "kname": req.session.user.cn,
            "rsid": req.session.user.uid,
            "department": req.session.user.department,
            "branch": req.session.user.other_info[0].F21_BRANCH,
            "title": 'Insurance Api master',
            "AccessToken": req.session.user.token,
            "token": req.session.token
        }, function (err, html) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.send(html);
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/setStatus', function (req, res) {
    try {
        var obj = req.body;
        enquiryModel.findOneAndUpdate({
            inquiry_no: parseInt(obj.inquiry_no)
        }, {
            $set: {
                whatsapStatus: obj.whatsapStatus,
                whatsapStatusMarkBy: req.session.user.uid,
                whatsapStatusSentOn: new Date()
            }
        }, {}, function (err) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json([]);
            }
        })
    } catch (e) {
        console.log(e);
    }
});

router.post('/sendEmail', function (req, res) {
    try {
        var obj = req.body;
        rsDataModel.historyModel.findOne({
            F_TCD: obj.F_TCD,
            F_FORM: parseInt(obj.F_FORM),
            F_UPDFLG: ""
        }, function (err, formData) {
            if (err) {
                res.status(500).json({
                    message: 'Error in sending mail',
                    error: err,
                    status: false
                });
            }
            formData = JSON.parse(JSON.stringify(formData));
            var bookingPerId = formData.F_BKIDNO;
            rsDataModel.F21_SLMSModel.findOne({
                F21_SRNO: bookingPerId
            }, {
                F21_EMAIL: 1
            }, {}, function (err, stafData) {
                if (err) {
                    res.status(500).json({
                        message: 'Error in sending mail',
                        error: err,
                        status: false
                    });
                }
                stafData = JSON.parse(JSON.stringify(stafData));
                var mailOptions = {
                    from: "insurancepolicy@kesari.in",
                    // to: "kuldeep@kesari.in",
                    to: ["nayan.girkar@asego.in", "operation.mumbai@asego.in", "vilas.sathe@asego.in"],
                    cc: [stafData.F21_EMAIL, "insurancepolicy@kesari.in"],
                    subject: formData.F_TCD + "/" + formData.F_FORM + " " + formData.F_PRE + " " + formData.F_FNAME + " " + formData.F_SNAME, // Subject line
                    html: obj.html,
                    attachments: []
                };
                var transporter = nodemailer.createTransport(smtpTransport(configAuth.smtp));
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.status(500).json({
                            message: 'Error in sending mail',
                            error: error,
                            status: false
                        });
                    }
                    var updObj = {
                        policyIssued:true,
                        insuranceMailSendBy: req.session.user.uid,
                        insuranceMailSendOn: new Date()
                    };
                    rsDataModel.historyModel.update({
                        F_TCD: obj.F_TCD,
                        F_FORM: parseInt(obj.F_FORM)
                    }, {
                        $set: updObj
                    }, {}, function (err) {
                        if (err) {
                            res.status(500).json({
                                message: 'Error in sending mail',
                                error: err,
                                status: false
                            });
                        }
                        res.status(200).json({
                            message: 'Success',
                            status: true
                        });
                    });
                });
            })
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/getEmailData', function (req, res) {
    try {
        var obj = req.body;
        rsDataModel.historyModel.find({
            F_TCD: obj.F_TCD,
            F_FORM: parseInt(obj.F_FORM),
            F_UPDFLG: ""
        }, {}, {}, function (err, formData) {
            if (err) {
                res.status(500).json(err);
            } else {
                rsDataModel.tourmasZeroModel.findOne({
                    TM_TCD: obj.F_TCD
                }, function (err, tmData) {
                    if (err) {
                        res.status(500).json(err);
                    }
                    formData = JSON.parse(JSON.stringify(formData));
                    tmData = JSON.parse(JSON.stringify(tmData));
                    var insuranceStartDt = "";
                    var TM_ID = tmData.TM_ID;
                    for (var i = 0; i < formData.length; i++) {
                        // TM_ID=formData[i].TM_ID;
                        formData[i].F_BIRTHDT = baseExport.dateFormat(formData[i].F_BIRTHDT);
                        formData[i].daysNeed = moment(formData[i].TM_DT2).diff(moment(formData[i].TM_DT1), 'days') + 3;
                        insuranceStartDt = baseExport.dateFormat(new Date(moment(tmData.TM_DT1).subtract(1, 'day')));
                        if (TM_ID === "I" && tmData.TM_ZONE === "Europe" && tmData.TOURSERIES !== "EX" && tmData.TOURSERIES !== "ET") {
                            formData[i].daysNeed = 35;
                            insuranceStartDt = baseExport.dateFormat(new Date(moment(tmData.TM_DT1).subtract(4, 'days')));
                        }

                        formData[i].TM_DT1 = baseExport.dateFormat(tmData.TM_DT1);
                    }
                    // console.log(TM_ID,insuranceStartDt);
                    res.render('insurance/mailTable', {
                        "data": formData,
                        "TM_ID": TM_ID,
                        "tmData": tmData,
                        "insuranceStartDt": insuranceStartDt
                    }, function (err, html) {
                        if (err) {
                            console.log(err);
                            res.status(500).json([]);
                        }
                        res.status(200).json({
                            data: html
                        });
                    });
                });
            }
        })
    } catch (e) {
        console.log(e);
    }
});


router.post('/grid-data', function (req, res) {
    try {
        erpMasterModel.findOne({"type" : "Insurance Permission"},function(err,userPermData){
			if(err){
				console.log(err);
				res.send(err.message);
			}
			userPermData=JSON.parse(JSON.stringify(userPermData));
            var query = {};
            var limit = req.body.limit ? parseInt(req.body.limit) : 500;
            var search_by = req.body.search_by ? req.body.search_by : "";
            var sort_by = "F_BKDT";
            var order = req.body.order ? req.body.order : "asc";
            var page = req.body.page ? parseInt(req.body.page) : 0;
            var columns = req.body.columns ? req.body.columns : [];
            var filter_columns = {};
            var draw = req.body.draw ? parseInt(req.body.draw) : 1;
            var start = req.body.start ? parseInt(req.body.start) : 0;
            query["F_REM"] = "H";
            query["F_UPDFLG"] = "";
            if (req.body.search_query) {
                var search_query = req.body.search_query;
                if (search_query.F_TCD) {
                    query['F_TCD'] = (search_query.F_TCD).toUpperCase();
                }
                if (search_query.mailStatus) {
                    if (search_query.mailStatus === "Sent") {
                        query['insuranceMailSendOn'] = {
                            $exists: true
                        };
                    }
                    if (search_query.mailStatus === "Pending") {
                        query['insuranceMailSendOn'] = {
                            $exists: false
                        };
                    }
                    // if (search_query.mailStatus === "Pending") {
                    //     // query['$or']=[{'policyIssued': {$exists: false}},{insuranceMailSendBy:{$exists: false}},{"insuranceStatus.status":false}];
                    //     query["insuranceStatus"]={$exists:false};
                    // }
                }

                if (search_query.KT_BRANCH) {
                    query['KT_BRANCH'] = (search_query.KT_BRANCH).toUpperCase();
                }
                if (search_query.showCancel) {
                    query['F_UPDFLG'] ="C";
                }
                if (search_query.enquiry_date && search_query.enquiry_date !== "") {
                    var date1 = baseExporter.convertToDateNew(search_query.enquiry_date.split(' - ')[0]);
                    date1.setHours(0, 0, 0);
                    var date2 = baseExporter.convertToDateNew(search_query.enquiry_date.split(' - ')[1]);
                    date2.setHours(23, 59, 59);
                    // console.log(date1);
                    query['F_BKDT'] = {
                        $gt: date1,
                        $lt: date2
                    };
                }
                if (search_query.date2 && search_query.date2 !== "") {
                    var date3 = baseExporter.convertToDateNew(search_query.date2.split(' - ')[0]);
                    date3.setHours(0, 0, 0);
                    var date4 = baseExporter.convertToDateNew(search_query.date2.split(' - ')[1]);
                    date4.setHours(23, 59, 59);
                    // console.log(date1);
                    query['TM_DT1'] = {
                        $gt: date3,
                        $lt: date4
                    };
                }
            }
            if(req.session.user.uid==="GP9"){
                delete query.F_UPDFLG;
            }
            if (req.session.user.uid !== "admin") {
                if (req.session.user.other_info[0].F21_DEPT !== "FOREX" && userPermData.data.indexOf(req.session.user.uid)===-1) {
                    query['F_BKIDNO'] = req.session.user.uid;
                }
            }
            var table_format = req.body.table_format ? req.body.table_format : "datatable";
            util.renderRecords(rsDataModel.historyModel, query, limit, search_by, sort_by, order, columns, draw, start, page, getCount2, getRecords2, function (err, returnData) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.status(200).json(returnData);
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/grid-data2', function (req, res) {
    try {
        erpMasterModel.findOne({"type" : "Insurance Permission"},function(err,userPermData){
			if(err){
				console.log(err);
				res.send(err.message);
			}
			userPermData=JSON.parse(JSON.stringify(userPermData));
            var query = {F_FORM:{$ne:0}};
            var limit = req.body.limit ? parseInt(req.body.limit) : 500;
            var search_by = req.body.search_by ? req.body.search_by : "";
            var sort_by = "F_BKDT";
            var order = req.body.order ? req.body.order : "asc";
            var page = req.body.page ? parseInt(req.body.page) : 0;
            var columns = req.body.columns ? req.body.columns : [];
            var filter_columns = {};
            var draw = req.body.draw ? parseInt(req.body.draw) : 1;
            var start = req.body.start ? parseInt(req.body.start) : 0;
            query["F_UPDFLG"] = "";
            if (req.body.search_query) {
                var search_query = req.body.search_query;
                if (search_query.F_TCD) {
                    query['F_TCD'] = (search_query.F_TCD).toUpperCase();
                }
                if (search_query.mailStatus) {
                    if (search_query.mailStatus === "Issued") {
                        query['$or']=[{'policyIssued': {
                            $exists: true,$eq:true
                        }},{insuranceMailSendBy:{$exists: true}}];
                    }
                    // if (search_query.mailStatus === "Error") {
                    //     // query['$or']=[{'policyIssued': {$exists: false}},{insuranceMailSendBy:{$exists: false}},{"insuranceStatus.status":false}];
                    //     $or=[{"insuranceStatus.status":false},{"insuranceStatus":{$exists:false}}];
                    // }
                    if (search_query.mailStatus === "Pending") {
                        // query['$or']=[{'policyIssued': {$exists: false}},{insuranceMailSendBy:{$exists: false}},{"insuranceStatus.status":false}];
                        query["$or"]=[{"insuranceStatus.status":false},{"insuranceStatus":{$exists:false}}];
                    }
                }
                if (search_query.showCancel) {
                    query['F_UPDFLG'] ="C";
                }
                if (search_query.KT_BRANCH) {
                    query['KT_BRANCH'] = (search_query.KT_BRANCH).toUpperCase();
                }
                if (search_query.enquiry_date && search_query.enquiry_date !== "") {
                    var date1 = baseExporter.convertToDateNew(search_query.enquiry_date.split(' - ')[0]);
                    date1.setHours(0, 0, 0);
                    var date2 = baseExporter.convertToDateNew(search_query.enquiry_date.split(' - ')[1]);
                    date2.setHours(23, 59, 59);
                    // console.log(date1);
                    query['F_BKDT'] = {
                        $gt: date1,
                        $lt: date2
                    };
                }
                if (search_query.date2 && search_query.date2 !== "") {
                    var date3 = baseExporter.convertToDateNew(search_query.date2.split(' - ')[0]);
                    date3.setHours(0, 0, 0);
                    var date4 = baseExporter.convertToDateNew(search_query.date2.split(' - ')[1]);
                    date4.setHours(23, 59, 59);
                    // console.log(date1);
                    query['TM_DT1'] = {
                        $gt: date3,
                        $lt: date4
                    };
                }
            }
            if (req.session.user.uid !== "admin") {
                if (req.session.user.other_info[0].F21_DEPT !== "FOREX" && userPermData.data.indexOf(req.session.user.uid)===-1) {
                    query['F_BKIDNO'] = req.session.user.uid; 
                }
            }
            // console.log(query);
            if(req.session.user.uid==="GP9"){
                delete query.F_UPDFLG;
            }
            var table_format = req.body.table_format ? req.body.table_format : "datatable";
            util.renderRecords(rsDataModel.historyModel, query, limit, search_by, sort_by, order, columns, draw, start, page, getCount2, getRecords2, function (err, returnData) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.status(200).json(returnData);
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/generatePolicy', function (req, res) {
    try {
        var obj=req.body;
        rsDataModel.insurancePoolModel.findOne({policyIssued:{$exists:false},tourcode:obj.F_TCD,tourform:parseInt(obj.F_FORM),guestNo:parseInt(obj.F_TNO)},function(err,item){
            if(err){
                res.status(500).json({status:false,message:err.message});
            }
            item = JSON.parse(JSON.stringify(item));
            if(item){
                rsDataModel.historyModel.findOne({
                    F_TCD: item.tourcode,
                    F_FORM: item.tourform,
                    F_REM:"H",
                    insuranceMailSendBy:{$exists:false}
                  }, function (err, dataHistMain) {
                    if (err) {
                      cb(err);
                    }
                    dataHistMain = JSON.parse(JSON.stringify(dataHistMain));
                    //check whether insurance email is sent by email or not
                        rsDataModel.historyModel.findOne({F_TCD:item.tourcode,F_FORM:item.tourform,F_TNO:item.guestNo},function(err,dataHist){
                            if(err){
                                cb(err);
                            }
                            dataHist = JSON.parse(JSON.stringify(dataHist));
                            if(dataHist){
                                item.passport=dataHist.F_PPNO;
                                item.passportName=dataHist.F_PPNAME;
                            }
                            rsDataModel.F21_SLMSModel.findOne({F21_SRNO:item.bookingPerson},function(err,insuStafData){
                                if (err) {
                                  cb(err);
                                }
                                insuStafData = JSON.parse(JSON.stringify(insuStafData));
                            item.bookingPerson=dataHist.F_BKIDNO;
                            var errMsg=[];
                            var isValid=true;
                            if(dataHistMain){
                            }else{
                              isValid = false;
                              errMsg.push("Policy Already Issued By Mail");
                            }
                            if(item.pincode==""){
                                item.pincode="400016";
                                item.city="Mumbai";
                                item.district="Mumbai";
                                item.state="Maharashtra"
                                item.country= "India";
                                // isValid=false;
                                // errMsg.push("Enter Pincode");
                            }
                            if (item.address1 == "") {
                                item.address1 = "Kesari Tours Pvt. Ltd.";
                                item.address2 = "314, L.J. Road"; 
                                item.address3 = "Mahim"; 
                                item.address4 = "Mumbai"; 
                                // isValid = false;
                                // errMsg.push("Enter Address");
                            }
                            if (["ID","IW"].indexOf(item.tourcode.substr(0,2))>-1) {
                                isValid = false;
                                errMsg.push("Provitional Tours");
                            }
                            if (item.mobile == "") {
                                isValid = false;
                                errMsg.push("Enter Mobile Number");
                            }
                            if(item.email==""){
                                item.email=insuStafData.F21_EMAIL;
                                // isValid=false;
                                // errMsg.push("Enter Email Id");
                            }
                            if(item.email){
                                if(!validateEmail(item.email)){
                                    item.email=insuStafData.F21_EMAIL;
                                    // isValid=false;
                                    // errMsg.push("Enter Valid Email Id");
                                }
                            }
                            if(item.nomineeName==""){
                                item.nomineeName=item.guestName;
                                
                            }
                            if(item.nomineeRelation==""){
                                item.nomineeRelation="self";
                            }
                            
                            if(dataHist.F_WORK=="J"){
                                isValid=false;
                                errMsg.push("Joining Leaving Guest");
                            }
                            if (dataHist.F_UPDFLG == "C") {
                                isValid = false;
                                errMsg.push("Passenger Already Cancelled");
                            }
                            if (item.tourId == "D" && item.age>70) {
                                isValid = false;
                                errMsg.push("Insurance Not Applicable for Domestic guest above 70 age");
                            }
                            if(item.zone!=="Nepal" && item.zone!=="Bhutan"){
                                if (item.tourId=="I" && (item.passport == "" || item.passport==null)) {
                                    isValid = false;
                                    errMsg.push("Enter Passport Number");
                                }
                                if (item.tourId=="I" && (item.passportName == "" || item.passportName == null )) {
                                    isValid = false;
                                    errMsg.push("Enter Passport Name");
                                }
                            }
                            if(item.insuranceStatus && item.insuranceStatus.errMsg && item.insuranceStatus.errMsg.indexOf("The age should be equal to the system calculated age at the time of Departure Date ")>-1){
                                item.age=item.age-1;
                                item.systemAge=item.systemAge-1;
                            }
                            if(isValid){
                                    createPolicyXml(item,function(err,xmlData){
                                    if(err){
                                        res.status(500).json({status:false,message:err.message});
                                    }
                                    asego.createPolicyCb({xmlData:xmlData.xml},function(err,data){
                                        if(err){
                                            res.status(500).json({status:false,message:err.message});  
                                        }
                                        var setOb={};
                                        if(data.error){
                                            setOb.status=false;
                                            setOb.data=data;
                                            setOb.errCode=(data && data.data && data.data.response)?((data.data.response.split('<errorcode>')[1]).split('</errorcode>')[0]).trim():'';
                                            setOb.dt=new Date();
                                            setOb.errMsg=[];
                                        }else{
                                            setOb.status=true;
                                            setOb.data=data;
                                            setOb.errMsg=[];
                                            setOb.dt=new Date();
                                            setOb.pdf=(data && data.data && data.data.response)?((data.data.response.split('<document>')[1]).split('</document>')[0]).trim():'';
                                        }
                                        if(setOb.status){
                                            rsDataModel.insurancePoolModel.update({_id:item._id},{$set:{policyAmount:xmlData.policyAmount,policyIssued:true,insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                                if(err){
                                                    res.status(500).json({status:false,message:err.message});
                                                }
                                                rsDataModel.historyModel.update({F_TCD:item.tourcode,F_FORM:item.tourform,F_TNO:item.guestNo},{$set:{policyIssued:true,insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                                    if(err){
                                                        res.status(500).json({status:false,message:err.message});
                                                    }
                                                    res.status(200).json({status:true});
                                                });
                                            });
                                        }else{
                                            var code=(setOb.errCode)?((setOb.errCode.split('[')[1]).split(']')[0]):0;
                                            getInsuranceError(code,function(err,dataMsg){
                                                if(err){
                                                    res.status(500).json({status:false,message:err.message});
                                                }
                                                if(dataMsg){
                                                setOb.errMsg=[dataMsg];
                                                }
                                                rsDataModel.insurancePoolModel.update({_id:item._id},{$set:{policyAmount:xmlData.policyAmount,insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                                    if(err){
                                                        res.status(500).json({status:false,message:err.message});
                                                    }
                                                    rsDataModel.historyModel.update({F_TCD:item.tourcode,F_FORM:item.tourform,F_TNO:item.guestNo},{$set:{insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                                        if(err){
                                                            res.status(500).json({status:false,message:err.message});
                                                        }
                                                        res.status(200).json({status:true});
                                                    });
                                                });
                                            })
                                        }
                                    });
                                });           
                            }else{
                                rsDataModel.insurancePoolModel.update({_id:item._id},{$set:{insuranceStatus:{status:false,errMsg:errMsg,dt:new Date()}},$addToSet:{insuranceActivity:{status:false,errMsg:errMsg,dt:new Date()}}},{},function(err){
                                    if(err){
                                        res.status(500).json({status:false,message:err.message});
                                    }
                                    rsDataModel.historyModel.update({F_TCD:obj.F_TCD,F_FORM:parseInt(obj.F_FORM),F_TNO:parseInt(obj.F_TNO)},{$set:{insuranceStatus:{status:false,errMsg:errMsg,dt:new Date()}},$addToSet:{insuranceActivity:{status:false,errMsg:errMsg,dt:new Date()}}},{},function(err){
                                        if(err){
                                            res.status(500).json({status:false,message:err.message});
                                        }
                                        res.status(200).json({status:false,message:errMsg.join(', ')});
                                    })
                                })
                            }
                        })
                    });
                });
            }else{
                res.status(200).json({status:false,message:"Pool Data Not Found"});
            }
        });
    }catch(e){
        console.log(e);
    }
});
router.post('/cancelPolicy', function (req, res) {
    try {
        var obj=req.body;
        rsDataModel.insurancePoolModel.findOne(
          {
            policyIssued: { $exists: true },
            tourcode: obj.F_TCD,
            tourform: parseInt(obj.F_FORM),
            guestNo: parseInt(obj.F_TNO),
          },
          function (err, item) {
            if (err) {
              res.status(500).json({ status: false, message: err.message });
            }
            item = JSON.parse(JSON.stringify(item));
            if (item) {
              rsDataModel.insurancePoolModel.updateOne(
                { _id: item._id },
                {
                  $set: {
                    isCancelled: true,
                    cancellBy: req.session.user.uid,
                    cancellOn: new Date(),
                  },
                },
                {},
                function (err) {
                  if (err) {
                    res
                      .status(500)
                      .json({ status: false, message: err.message });
                  }
                  rsDataModel.historyModel.updateOne(
                    {
                      F_TCD: obj.F_TCD,
                      F_FORM: parseInt(obj.F_FORM),
                      F_TNO: parseInt(obj.F_TNO),
                    },
                    {
                      $set: {
                        policyCancelled: true,
                        policyCancelledBy: req.session.user.uid,
                        policyCancelledCancellOn: new Date(),
                      },
                    },
                    {},
                    function (err) {
                      if (err) {
                        res
                          .status(500)
                          .json({ status: false, message: err.message });
                      }
                      var mailBody = `
                        <table>
                        <tr>
                        <td>
                            <p>Dear Sir,</p>

                            Please cancel below policy as per below mention Policy details.</p>
                            <table border="1" style="width:100%;">
                            <thead>
                                <tr>
                                <th>Tourcode</th>
                                <th>Tourform</th>
                                <th>Guest #</th>
                                <th>Name</th>
                                <th>Policy Number</th>
                                </tr>
                            </thead>
                            <tbody>`;
                      mailBody += `
                            <tr>
                                <td>${item.tourcode}</td>
                                <td>${item.tourform}</td>
                                <td>${item.guestNo}</td>
                                <td>${item.guestName}</td>
                                <td>${item.policyNo}</td>
                            </tr>
                        `;
                      mailBody += `</tbody>
                            </table>
                                <p>Thank You</p>
                            </td>
                            </tr>
                        </table>`;
                      var mailOptions = {
                        from: "insurancepolicy@kesari.in",
                        // to: "kuldeep@kesari.in",
                        to: [
                          "nayan.girkar@asego.in",
                          "operation.mumbai@asego.in",
                          "vilas.sathe@asego.in",
                        ],
                        cc: ["insurancepolicy@kesari.in"],
                        subject:"Cancel Insurance Policy",
                        html:mailBody,
                        attachments: [],
                      };
                      var transporter = nodemailer.createTransport(
                        smtpTransport(configAuth.smtp)
                      );
                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          console.log(error);
                          res.status(500).json({
                            message: "Error in sending mail",
                            error: error,
                            status: false,
                          });
                        }
                        var ob = {
                          inquiry_no: 0,
                          status: "Sent",
                          date_of_delivery: new Date(),
                          time_of_delivery: "00:00",
                          email_lang: "English",
                          email_type: "Normal",
                          email_source: "insurancepolicy@kesari.in",
                          email_sector: "",
                          email_subject: "Cancel Insurance Policy",
                          email_html: mailBody,
                          campaign_id: "",
                          emailTriggerSource: "kesari",
                          created_by: "SYSTEM",
                          remarks: [],
                          created_at: new Date(),
                          receiver_email_id: [
                            "nayan.girkar@asego.in",
                            "operation.mumbai@asego.in",
                            "vilas.sathe@asego.in",
                          ],
                        };
                        rsDataModel.emailPoolModel.create(ob, function (err) {
                            if (error) {
                                console.log(error);
                                res.status(500).json({
                                  message: "Error in sending mail",
                                  error: error,
                                  status: false,
                                });
                            }
                            res
                            .status(200)
                            .json({ status: true, message: "Policy Cancelled Successfully" });
                        });
                      });
                    }
                  );
                }
              );
            } else {
              res
                .status(200)
                .json({ status: false, message: "Data Not Found" });
            }
          }
        );
            }catch(e){
                console.log(e);
            }
});

router.post('/endorsePolicy', function (req, res) {
    try {
        var obj=req.body;
        rsDataModel.insurancePoolModel.findOne({tourcode:obj.F_TCD,tourform:parseInt(obj.F_FORM),guestNo:parseInt(obj.F_TNO),"insuranceStatus.status":true},function(err,item){
            if(err){
                res.status(500).json({status:false,message:err.message});
            }
            item = JSON.parse(JSON.stringify(item));
            if(item){
                // console.log(item)
                var policyNo=item.insuranceStatus.data.data.response.split('<policy>')[1];
                policyNo=(policyNo.split('</policy>')[0]).trim();
                item.policyNo=policyNo;
                createEndorsePolicyXlm(item,function(err,xmlData){
                    if(err){
                        res.status(500).json({status:false,message:err.message});
                    }
                    asego.endorsePolicyCb({xmlData:xmlData},function(err,data){
                        if(err){
                            res.status(500).json({status:false,message:err.message});  
                        }
                        if(!data.error){
                            // console.log("@@@@@@@@@@@@@@@@@",data.data.response)
                            xml2json.musicJSON(data.data.response, function(xmlErr, xmlResult){
                                if(xmlErr){
                                    res.status(500).json({status:false,message:xmlErr.message});  
                                }else{
                                    // console.log("xmlResult",xmlResult)
                                    xmlResult.policy.otherdetails.policycomment="NA";
                                    xmlResult.policy.otherdetails.universityname="NA";
                                    xmlResult.policy.otherdetails.universityaddress="NA";
                                    delete xmlResult.policy.otherdetails.documents;
                                    createEndorsePolicyDetailsXml(xmlResult,item,function(err,dataXml){
                                        if(err){
                                            res.status(500).json({status:false,message:err.message});
                                        }
                                        asego.endorsePolicyDetailsCb({xmlData:dataXml},function(err,data){
                                            if(err){
                                                res.status(500).json({status:false,message:err.message});  
                                            }
                                            var setOb={};
                                            if(data.error){
                                                setOb.status=false;
                                                setOb.data=data;
                                                setOb.errCode=(data && data.data && data.data.response)?((data.data.response.split('<errorcode>')[1]).split('</errorcode>')[0]).trim():'';
                                                setOb.dt=new Date();
                                                setOb.errMsg=[];
                                            }else{
                                                setOb.status=true;
                                                setOb.data=data;
                                                setOb.errMsg=[];
                                                setOb.dt=new Date();
                                                setOb.pdf=(data && data.data && data.data.response)?((data.data.response.split('<document>')[1]).split('</document>')[0]).trim():'';
                                            }
                                            res.status(200).json({status:true,data:setOb});
                                            /*if(setOb.status){
                                                rsDataModel.insurancePoolModel.update({_id:item._id},{$set:{insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                                    if(err){
                                                        res.status(500).json({status:false,message:err.message});
                                                    }
                                                    rsDataModel.historyModel.update({F_TCD:item.tourcode,F_FORM:item.tourform,F_TNO:item.guestNo},{$set:{policyIssued:true,insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                                        if(err){
                                                            res.status(500).json({status:false,message:err.message});
                                                        }
                                                        res.status(200).json({status:true});
                                                    });
                                                });
                                            }else{
                                                var code=(setOb.errCode)?((setOb.errCode.split('[')[1]).split(']')[0]):0;
                                                getInsuranceError(code,function(err,dataMsg){
                                                    if(err){
                                                        res.status(500).json({status:false,message:err.message});
                                                    }
                                                    if(dataMsg){
                                                    setOb.errMsg=[dataMsg];
                                                    }
                                                    rsDataModel.insurancePoolModel.update({_id:item._id},{$set:{insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                                        if(err){
                                                            res.status(500).json({status:false,message:err.message});
                                                        }
                                                        rsDataModel.historyModel.update({F_TCD:item.tourcode,F_FORM:item.tourform,F_TNO:item.guestNo},{$set:{insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                                            if(err){
                                                                res.status(500).json({status:false,message:err.message});
                                                            }
                                                            res.status(200).json({status:true});
                                                        });
                                                    });
                                                })
                                            }*/
                                        });
                                    });                                    
                                }
                            });
                        }else{
                            res.status(500).json({status:false,message:"Endorse Policy Data not found"});  
                        }
                    });
                });
            }else{
                res.status(200).json({status:false,message:"Pool Data Not Found"});
            }
        });
    }catch(e){
        console.log(e);
    }
});

router.post('/runInsurance', function (req, res) {
    try {
        var todayDt=baseExport.convertToDateNew("02/08/2022");
        // insuranceToBeSentOn:todayDt
        rsDataModel.insurancePoolModel.find({insuranceToBeSentOn:todayDt,policyIssued:{$exists:false}},function(err,insData){
            if(err){
                res.status(500).json({status:false,message:err.message});
            }
            insData = JSON.parse(JSON.stringify(insData));
            async.eachSeries(insData,function(item,cb){
                rsDataModel.historyModel.findOne({F_TCD:item.tourcode,F_FORM:item.tourform,F_TNO:item.guestNo},function(err,dataHist){
                    if(err){
                        cb(err);
                    }
                    dataHist=JSON.parse(JSON.stringify(dataHist));
                    item.bookingPerson=dataHist.F_BKIDNO;
                    var errMsg=[];
                    var isValid=true;
                    if(item.pincode==""){
                        isValid=false;
                        errMsg.push("Enter Pincode");
                    }
                    if(item.email==""){
                        isValid=false;
                        errMsg.push("Enter Email Id");
                    }
                    if(item.email){
                        if(!validateEmail(item.email)){
                            isValid=false;
                            errMsg.push("Enter Valid Email Id");
                        }
                    }
                    if(dataHist.F_WORK=="J"){
                        isValid=false;
                        errMsg.push("Joining Leaving Guest");
                    }
                    if(dataHist.F_BIRTHDT==baseExporter.convertToDateNew("01/01/1970")){
                        isValid=false;
                        errMsg.push("Invalid Birth Date");
                    }
                    if(isValid){
                        createPolicyXml(item,function(err,xmlData){
                            if(err){
                                cb(err);
                            }
                            asego.createPolicyCb({xmlData:xmlData},function(err,data){
                                if(err){
                                    cb(err)
                                }
                                var setOb={};
                                if(data.error){
                                    setOb.status=false;
                                    setOb.data=data;
                                    setOb.errCode=(data && data.data && data.data.response)?((data.data.response.split('<errorcode>')[1]).split('</errorcode>')[0]).trim():'';
                                    setOb.dt=new Date();
                                    setOb.errMsg=[];
                                }else{
                                    setOb.status=true;
                                    setOb.data=data;
                                    setOb.errMsg=[];
                                    setOb.dt=new Date();
                                    setOb.pdf=(data && data.data && data.data.response)?(data.data.response.split('<document>')[1]).split('</document>')[0]:'';
                                }
                                if(setOb.status){
                                    rsDataModel.insurancePoolModel.update({_id:item._id},{$set:{insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                        if(err){
                                            res.status(500).json({status:false,message:err.message});
                                        }
                                        rsDataModel.historyModel.update({F_TCD:item.tourcode,F_FORM:item.tourform,F_TNO:item.guestNo},{$set:{policyIssued:true,insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                            if(err){
                                                res.status(500).json({status:false,message:err.message});
                                            }
                                            res.status(200).json({status:true});
                                        });
                                    });
                                }else{
                                    var code=(setOb.errCode)?((setOb.errCode.split('[')[1]).split(']')[0]):0;
                                    getInsuranceError(code,function(err,dataMsg){
                                        if(err){
                                            res.status(500).json({status:false,message:err.message});
                                        }
                                        if(dataMsg){
                                        setOb.errMsg=[dataMsg];
                                        }
                                        rsDataModel.insurancePoolModel.update({_id:item._id},{$set:{insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                            if(err){
                                                res.status(500).json({status:false,message:err.message});
                                            }
                                            rsDataModel.historyModel.update({F_TCD:item.tourcode,F_FORM:item.tourform,F_TNO:item.guestNo},{$set:{insuranceStatus:setOb},$addToSet:{insuranceActivity:setOb}},{},function(err){
                                                if(err){
                                                    res.status(500).json({status:false,message:err.message});
                                                }
                                                res.status(200).json({status:true});
                                            });
                                        });
                                    })
                                }
                            });
                        });               
                    }else{
                        rsDataModel.insurancePoolModel.update({_id:item._id},{$set:{insuranceStatus:{status:false,errMsg:errMsg,dt:new Date()}},$addToSet:{insuranceActivity:{status:false,errMsg:errMsg,dt:new Date()}}},{},function(err){
                            if(err){
                                cb(err);
                            }
                            rsDataModel.historyModel.update({F_TCD:data.tourcode,F_FORM:data.tourform,F_TNO:data.guestNo},{$set:{insuranceStatus:{status:false,errMsg:errMsg,dt:new Date()}},$addToSet:{insuranceActivity:{status:false,errMsg:errMsg,dt:new Date()}}},{},function(err){
                                if(err){
                                    cb(err);
                                }
                                cb();
                            })
                        })
                    }
                });
            },function(err){
                if(err){
                    console.log(err);
                    res.status(500).json({status:false,message:err});
                }
                res.status(200).json({status:true});
            })
        });
    } catch (e) {
        console.log(e);
    }
});
router.post('/getPolicyReport', function (req, res) {
    try {
        var obj = req.body;
        // console.log(obj);
        var fromDate= baseExporter.convertToDateNew(moment().startOf('month').format("DD/MM/YYYY"));
        var toDate= baseExporter.convertToDateNew(moment().endOf('month').format("DD/MM/YYYY"));
        if (obj.reportDate) {
            fromDate = baseExporter.convertToDateNew(obj.reportDate.split(' - ')[0]);
            fromDate.setHours(0, 0, 0);
            toDate = baseExporter.convertToDateNew(obj.reportDate.split(' - ')[1]);
            toDate.setHours(23, 59, 59);
        }
        var query1={"insuranceActivity.status" : true,isCancelled:{$exists:false},"insuranceActivity.dt":{$gt:fromDate,$lt:toDate}};
        
        if (obj.type=="cancel") {
            query1={isCancelled:true,"cancellOn":{$gt:fromDate,$lt:toDate}};
        }
        var arr=[{$match:query1},{$unwind:"$insuranceActivity"},{$match:{"insuranceActivity.status":true}},{$sort:{"insuranceActivity.dt":1}},{$group:{_id:{policyNo:"$policyNo"},tourcode:{$first:"$tourcode"},tourform:{$first:"$tourform"},guestNo:{$first:"$guestNo"},guestName:{$first:"$guestName"},policyNo:{$first:"$policyNo"},"tranNo":{$first:"$tranNo"},policyAmount:{$first:"$policyAmount"},dt:{$first:"$insuranceActivity.dt"}}},{$match:{"dt":{$gt:fromDate,$lt:toDate}}},{$sort:{"dt":1}}]
        rsDataModel.insurancePoolModel.aggregate(arr,function(err,data){
            if(err){
                console.log(err);
                res.status(500).json({status:false,message:err});
            }
            res.status(200).json({status:true,data:data});
        })
    } catch (e) {
        console.log(e);
    }
});

router.post('/panValidate', async function (req, res) {
    // Your NSDL API endpoint
    const apiUrl = 'https://api.nsdl.co.in/pan-verification';

    // Your API key (replace with your actual API key)
    const apiKey = 'YOUR_API_KEY';

    // PAN number to be verified
    const panNumber = 'ASNPD3264C';

    // Function to verify PAN
    
    const response = await axios.post(apiUrl, {
        pan: panNumber,
        }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.data && response.data.status === 'VALID') {
        console.log(`PAN ${panNumber} is valid.`);
    } else {
        console.log(`PAN ${panNumber} is invalid.`);
    }
    
    

});


module.exports = router;
function validateEmail(emailField){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,5})$/;
    if (reg.test(emailField) == false) {
        return false;
    }else{
    return true;
    }
}
function getRecords2(query, searchCondition, limit, start, sort, callback) {
    rsDataModel.historyModel.find(query, {}, {}, function (err, result) {
        if (err) {
            callback(err);
        } else {
            result = JSON.parse(JSON.stringify(result));
            async.each(result, function (item, cb) {
                rsDataModel.historyModel.find({
                    F_TCD: item.F_TCD,
                    F_FORM: item.F_FORM,
                    F_UPDFLG: "",
                    $or:[{F_WORK: ""},{F_WORK: "N"}],
                    F_AGE: {
                        $lte: 70
                    }
                }, function (err, data2) {
                    if (err) {
                        cb();
                    }
                    data2 = JSON.parse(JSON.stringify(data2));
                    rsDataModel.insurancePoolModel.findOne({tourcode:item.F_TCD,tourform:item.F_FORM,guestNo:item.F_TNO},function(err,insuData){
                        if(err){
                            cb(err)
                        }
                        insuData = JSON.parse(JSON.stringify(insuData));
                        item.insuData=insuData;
                        item.F_NOPER = data2.length;
                        cb();
                    });                   
                })
            }, function (err) {
                if (err) {
                    callback(err);
                }
                callback(null, result);
            });
        }
    });
}

// function to get count of matched documents; 
function getCount2(query, searchConditions, callback) {
    rsDataModel.historyModel.aggregate([{
            $match: query
        },
        {
            $group: {
                _id: null,
                count: {
                    $sum: 1
                },
            }
        }
    ], function (err, countResult) {
        if (err) {
            callback(err);
        } else {
            callback(null, countResult)
        }
    });
}

function createPolicyXml(data,cb) {
    var policyAmount=0;
    var ob = {
            "identity": {
                "sign": "",                
                "branchsign": "",
                "username": "",
                "reference": "Kesari_"+data.tranNo
            },
            "plan": {
                "categorycode": "",
                "plancode": "",
                "basecharges": "",
                "totalbasecharges": "",
                "servicetax": "",
                "totalcharges": ""
            },
            "traveldetails": {
                "departuredate": data.insuranceStartDt,
                "days": data.daysNeed,
                "arrivaldate":  data.insuranceEndDt
            },
            "passengerreference": data.tourcode+"/"+data.tourform,
            "insured": {
                "passport":data.passport,
                "contactdetails": {
                    "address1": data.address1+", "+data.address2+", "+data.address3+", "+data.address4,
                    "address2": "",
                    "city":data.city,
                    "district": data.district,
                    "state":data.state,
                    "pincode": data.pincode,
                    "country":data.country,
                    "phoneno": "",
                    "mobileno": data.mobile,
                    "emailaddress": data.email
                },
                "name": (data.passportName)?data.passportName:data.guestName,
                "dateofbirth": data.dob,
                "age": (data.systemAge)?data.systemAge:data.age,
                "trawelltagnumber": "",
                "nominee": data.nomineeName,
                "relation": data.nomineeRelation,
                "pastillness": ""
            },
            "otherdetails": {
                "policycomment": "",
                "universityname": "",
                "universityaddress": ""
            
        }
    };
    // console.log(ob);
    async.parallel({
        apiCallerId:function(cb2){
            rsDataModel.insuranceApiMasterModel.findOne({masterType:"API Caller Identification"},function(err,dataId){
                if(err){
                    cb2(err);
                }
                dataId=JSON.parse(JSON.stringify(dataId));
                if(dataId){
                    ob.identity.sign=dataId.Sign;
                    cb2();
                }else{
                    cb2();
                }
            })
        },
        branchUser:function(cb2){
            rsDataModel.insuranceApiMasterModel.findOne({masterType:"API Caller User","User Name":data.bookingPerson},function(err,dataId){
                if(err){
                    cb2(err);
                }

                dataId=JSON.parse(JSON.stringify(dataId));
                if(dataId){
                    ob.identity.branchsign=dataId["Branch Sign"];
                    ob.identity.username=dataId["User Name"];
                    cb2();
                }else{
                    cb2();
                }
            }) 
        },
        premiumChart: function (cb2) {
            var query = {};
            if (data.systemAge > 0 && data.systemAge <= 70) {
              var planCode = "";
              var dayLimit =  1;
              if (data.tourId == "D") {
                // planCode = "87b3eccf-60ec-4698-be1a-0f2a9865045c";
                planCode = "a9e1f4c7-0823-4d09-9f0b-22def885b8c0";
                // dayLimit = 60;
                dayLimit = 30;
              } else {
                if (data.zone === "America") {
                    // planCode = "9443b933-ac1a-497e-8aaf-ef7e14b7ac35";
                    planCode = "4c8c8e1f-58ca-4f64-b091-e42a7b266651";
                } else {
                // planCode = "81687020-5025-429f-9ca6-125b151bf5c6";
                    planCode = "eb7e4c7a-6381-4646-ab84-734cc06552a0";
                }
              }
              // {masterType:"Premium Chart","Plan Code":planCode,"Age Limit":{$gte:parseInt(data.age)},"Day Limit":1}
              // console.log({masterType:"Plan","Age Limit":{$gte:parseInt(data.age)},"Day Limit":{$gte:parseInt(data.tourDays)}});
              rsDataModel.insuranceApiMasterModel.findOne({
                masterType: "Premium Chart",
                "Plan Code": planCode,
                "Age Limit": {
                  $gte: parseInt(data.systemAge)
                },
                "Day Limit": dayLimit
              }, {}, {
                sort: {
                  "Age Limit": 1,
                  "Day Limit": 1
                }
              }, function (err, dataId) {
                if (err) {
                  cb2(err);
                }
                dataId = JSON.parse(JSON.stringify(dataId));
                if (dataId) {
                  ob.plan.basecharges = (data.tourId == "D")?parseFloat(dataId.Premium):parseFloat(dataId.Premium * data.daysNeed);
                    // ob.plan.basecharges =parseFloat(dataId.Premium);
                    ob.plan.servicetax = parseFloat((parseFloat(ob.plan.basecharges) * 18) / 100).toFixed(2);
                    ob.plan.totalbasecharges = ob.plan.basecharges - ob.plan.servicetax;
                    ob.plan.totalcharges = parseFloat(ob.plan.basecharges);
                    policyAmount=parseFloat(ob.plan.basecharges);
                    ob.plan.plancode = dataId["Plan Code"];
                  rsDataModel.insuranceApiMasterModel.findOne({
                    "Plan Code": dataId["Plan Code"],
                    masterType: "Plan"
                  }, function (err, dataId2) {
                    if (err) {
                      cb2(err);
                    }
                    dataId2 = JSON.parse(JSON.stringify(dataId2));
                    if (dataId2) {
                      ob.plan.categorycode = dataId2["Category Code"];
                    }
                    cb2();
                  });
                } else {
                  cb2();
                }
              });
            } else {
              if (data.tourId == "D") {
                //No Insurance for domestic Tours above 70 years
                cb2();
              } else {
                var planCode = "";
                if (data.zone === "America") {
                  // planCode = "75fc6888-2c6c-463e-8999-bf66e03c1303";
                  planCode = "f7100892-82d9-4435-9b5f-4bd2c506bd0e";
                } else {
                  // planCode = "3c1ed6c2-c9a0-480a-b175-dfc14514225b";
                  planCode = "f6bc4cb8-7ae1-45c3-91d6-dff54a641047";
                }
                rsDataModel.insuranceApiMasterModel.findOne({
                  masterType: "Premium Chart",
                  "Plan Code": planCode,
                  "Age Limit": {
                    $gte: parseInt(data.systemAge)
                  },
                  "Day Limit": {
                    $gte: parseInt(data.daysNeed)
                  }
                }, {}, {
                  sort: {
                    "Age Limit": 1,
                    "Day Limit": 1
                  }
                }, function (err, dataId) {
                  if (err) {
                    cb2(err);
                  }
                  dataId = JSON.parse(JSON.stringify(dataId));
                  if (dataId) {
                    ob.plan.basecharges = parseFloat(dataId.Premium);
                    ob.plan.servicetax = parseFloat((parseFloat(dataId.Premium) * 18) / 100).toFixed(2);
                    ob.plan.totalbasecharges = ob.plan.basecharges - ob.plan.servicetax;
                    ob.plan.totalcharges = parseFloat(dataId.Premium);
                    ob.plan.plancode = dataId["Plan Code"];
                    rsDataModel.insuranceApiMasterModel.findOne({
                      "Plan Code": dataId["Plan Code"],
                      masterType: "Plan"
                    }, function (err, dataId2) {
                      if (err) {
                        cb2(err);
                      }
                      dataId2 = JSON.parse(JSON.stringify(dataId2));
                      if (dataId2) {
                        ob.plan.categorycode = dataId2["Category Code"];
                      }
                      cb2();
                    });
                  } else {
                    cb2();
                  }
                });
              }
            }
        }
    },function(err,result){
        if(err){
            cb(err);
        }
        cb(null,{xml:js2xmlparser('policy',ob),policyAmount:policyAmount});
    });    
}

function createEndorsePolicyXlm(data,cb){
    var ob={
            identity:{
                sign:"",
                branchsign:"",
                username:"",
                policynumber:data.policyNo
            }        
    };
    async.parallel({
        apiCallerId:function(cb2){
            rsDataModel.insuranceApiMasterModel.findOne({masterType:"API Caller Identification"},function(err,dataId){
                if(err){
                    cb2(err);
                }
                dataId=JSON.parse(JSON.stringify(dataId));
                if(dataId){
                    ob.identity.sign=dataId.Sign;
                    cb2();
                }else{
                    cb2();
                }
            })
        },
        branchUser:function(cb2){
            rsDataModel.insuranceApiMasterModel.findOne({masterType:"API Caller User","User Name":data.bookingPerson},function(err,dataId){
                if(err){
                    cb2(err);
                }
                dataId=JSON.parse(JSON.stringify(dataId));
                if(dataId){
                    ob.identity.branchsign=dataId["Branch Sign"];
                    ob.identity.username=dataId["User Name"];
                    cb2();
                }else{
                    cb2();
                }
            }) 
        }
    },function(err,result){
        if(err){
            cb(err);
        }
        // console.log(js2xmlparser('policy',ob));
        cb(null,js2xmlparser('policy',ob));
    });   
}

function createEndorsePolicyDetailsXml(xmlData,data,cb) {
    // console.log("AAAAAAAA",data);
    var val = Math.floor(1000 + Math.random() * 9000);
    xmlData.policy.identity.policynumber=xmlData.policy.identity.policynumber.trim();
    // +"_XX"+val;
    xmlData.policy.identity.reference=xmlData.policy.identity.reference.trim();
    if(["Q2","FY","QA","FT"].indexOf(data.tourseries)>-1 && (new Date(data.insuranceStartDt).getTime()>=new Date("2023/02/01").getTime() && new Date(data.insuranceStartDt).getTime()<=new Date("2023/06/01").getTime())){
        data.insuranceEndDt=baseExport.convertToDateNew(moment(data.insuranceEndDt).add(7,'days').format('DD/MM/YYYY'));
        data.daysNeed=data.daysNeed+7;
    }
    // xmlData.policy.plan.riders={
    //     "ridercode":""
    // }
    xmlData.policy.traveldetails= {
        "departuredate": moment(data.insuranceStartDt).format("DD-MMM-YYYY"),
        "days": parseInt(data.daysNeed),
        "arrivaldate":  moment(data.insuranceEndDt).format("DD-MMM-YYYY")
    };
  
    xmlData.policy.insured= {
                "passport":data.passport,
                "contactdetails": {
                    "address1": data.address1+", "+data.address2,
                    "address2": data.address3+", "+data.address4,
                    "city":data.city,
                    "district": data.district,
                    "state":data.state,
                    "pincode": data.pincode,
                    "country":data.country,
                    "phoneno": "",
                    "mobileno": data.mobile,
                    "emailaddress": data.email
                },
                "name": (data.passportName)?data.passportName:data.guestName,
                "dateofbirth":moment(data.dob).format("DD-MMM-YYYY"),
                "age": (data.systemAge)?data.systemAge:data.age,
                // "trawelltagnumber": 0,
                "nominee": data.nomineeName,
                "relation": data.nomineeRelation,
                "pastillness": "",
                "passengerreference":data.tourcode+"/"+data.tourform
            };
        // data.tourcode+"/"+data.tourform
    // console.log(js2xmlparser('policy',xmlData.policy));
    cb(null,js2xmlparser('policy',xmlData.policy));        
}

function getInsuranceError(code,cb){
    rsDataModel.insuranceApiMasterModel.findOne({masterType:"Errors","Error Code":parseInt(code)},function(err,dataErr){
        if(err){
            cb(err);
        }
        dataErr=JSON.parse(JSON.stringify(dataErr));
        if(dataErr){
            cb(null,dataErr.Description);
        }else{
            cb();
        }
    })
}