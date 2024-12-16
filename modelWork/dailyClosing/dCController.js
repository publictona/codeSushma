/*********************************
CORE PACKAGES
**********************************/

const async = require('async');
//const moment        = require('moment-timezone');
const q = require('q');
const request = require('request');
const fs = require('fs');
const _ = require('underscore');
const ObjectID = require('mongoskin').ObjectID;
const moment = require('moment-timezone');


/*********************************
MODULE PACKAGES
**********************************/

const model = require('../models/stDataModel.js');
const branchModel = require('../models/ST_BRNMSModel.js');
const ST_FLGBRModel = require('../models/ST_FLGBRModel.js');
const pettyCashModel = require('../models/ST_PCHDRModel.js');
const baseExport = require('../baseExporter');
const { obj } = require('../models/dynamicModel.js');
const stDataModel = require('../models/stDataModel.js');
const F91_ATTDModel = require('../models/F91_ATTDModel.js');
const F21_STAFModel = require('../models/F21_STAFModel.js');
//const F55_OFFModel = require('../models/F55_OFFModel.js');
const { dateFormat } = require('../baseExporter');
const  dailyClosing = require('../models/dailyClosingModel.js');



module.exports = {

    getDailyClosingDtl: async function (req, res, next) {
        try {
            var date = new Date(req.params.date);
    
            // Adjust to UTC date format for querying MongoDB
            let startOfDay = new Date(date.setHours(0, 0, 0, 0));
            let endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
            let query = {
                "payment_date": {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
              //  "hotelId": req.session.user.ST_BRN,
            };
           // console.log("query:", query);
    
            let query3 = {
                "F_TRANDT": {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
                "ST_BRN": req.session.user.ST_BRN,
            };
    
            // Perform the queries
            var result = await stDataModel.PAYMENT_TRANModel
                .find(query)
                .select('paymentType advsettl payment_amount tranNo reservation_id paymentMethod payment_cur utr remark createdOn')
                .sort({ _id: -1 });
    
            //console.log("result:", result);
    
            var pettyCashData = await pettyCashModel
                .find(query3)
                .select('F_TRANNO ST_BRN F_TOTAL')
                .sort({ _id: -1 });
    
           // console.log("pettyCashData:", pettyCashData);
    
            if (result.length > 0 || pettyCashData.length > 0) {
                res.status(200).json({
                    message: "Successfully retrieved data",
                    data: result,
                    pettyCashData: pettyCashData
                });
            } else {
                res.status(404).json({
                    message: "No data matched the query",
                    data: [],
                    pettyCashData: []
                });
            }
        } catch (e) {
            console.error(e.stack);
            res.status(500).json({
                code: 'unknown_error',
                message: e.stack
            });
        }
    },
    
    getReClosingCorrection: function (req, res, next) {
        try {
            var dateArr = [];
            // console.log(req.params);
            var diffDate = moment(new Date(req.params.edate)).diff(new Date(req.params.sdate), 'days');
            for (var i = 0; i <= diffDate; i++) {
                if (i === 0) {
                    dateArr.push(baseExport.dateFormat(new Date(req.params.sdate)));
                } else {
                    dateArr.push(moment(new Date(req.params.sdate)).add(i, 'days').format('DD/MM/YYYY'));
                }
            }
            async.eachSeries(dateArr, async function (item, cb) {
                var date = baseExport.convertToDateNew(item);


                let query = ({
                    "F31_APPTDT": date,
                    "ST_BRN": req.params.branch,
                    "CANC______": { $ne: "Y" },
                    "REC_YN": "Y"
                    // "CHECK_____": { $ne: "" },
                    // "entryFrom": "SUKHOERP"
                });
                let query1 = ({
                    "F28_TRANDT": date,
                    "ST_BRN": req.params.branch,
                    // "entryFrom": "SUKHOERP"
                });

                let query2 = ({
                    "F41_RECDT": date,
                    "ST_BRN": req.params.branch,
                    // "entryFrom": "SUKHOERP"
                });

                let query3 = ({
                    "F_TRANDT": date,
                    "ST_BRN": req.params.branch,
                });


                var result = await model.F61_APPTModel.find(query).select('F41_WLAMT F31_NOPER F31_TRANTM F31_IDNM2 F31_IDNM1 F31_CASH F31_GVAMT F31_CCAMT F31_WLAMT realValue F31_TIPSCC F31_APPTDT F41_CCFLG F31_TRANID ST_BRN F31_NAME F31_SNAME F31_FNAME F31_TCODE F31_TIPS F41_CCFLG F31_T1 F31_T2 F31_TOTAL F31_PT1 F31_PT2 F31_POINT F41_RECNO F31_IDNO1 F31_AMT F31_IDNO2 F31_TIME1 F31_TIME2 REC_YN groupNumber entryFrom F31_TRANDT RECEIPTNO F41_RECNO F31_CHRCD F31_TAFLAG F81_RECP.WALLET_TYP').sort('_id:-1');
                result = _.sortBy(result, function (num) {
                    return num;
                });

                var f28_crResult = await model.F28_CRModel.find(query1).select('F28_TRANNO F28_TRANDT F28_TCODE F28_GFTSTR F28_CARDNO ST_BRN F28_AMT F28_VALUE F28_CCFLG F28_CCAMT F28_CASH F28_FOC F28_WLAMT').sort('_id:-1');
                f28_crResult = _.sortBy(f28_crResult, function (num) {
                    return num;
                });

                var F81ReceiptData = await model.F81_RECPModel.find(query2).select('F41_RECNO F41_RECDT F41_RECID F41_CCFLG F41_AMT F41_GVAMT F41_GIFTNO F41_CASH F41_CCAMT F41_WLAMT RECEIPTNO F41_RECNO').sort('F41_RECNO:1');
                F81ReceiptData = _.sortBy(F81ReceiptData, function (num) {
                    return num;
                });


                var pettyCashData = await pettyCashModel.find(query3).select('F_TRANNO ST_BRN F_TOTAL').sort('_id:-1');
                pettyCashData = _.sortBy(pettyCashData, function (num) {
                    return num;
                });

                if (result && result.length > 0 || f28_crResult && f28_crResult.length > 0 || F81ReceiptData && F81ReceiptData.length > 0 || pettyCashData && pettyCashData.length) {
                    calculateDailyClosingForApp({
                        taskDate: date,
                        branch: req.params.branch,
                        message: "success fully getting data",
                        data: result,
                        f28_CRData: f28_crResult,
                        F81ReceiptData: F81ReceiptData,
                        pettyCashData: pettyCashData
                    }, function (err, dataClosing) {
                        if (err) {
                            cb(err);
                        }
                        if (dataClosing && dataClosing.returnData) {
                            var currentDate = new Date(moment(date).subtract(1, 'days').format());
                            var nextDate = new Date(moment(date).add(1, 'days').format());
                            var qry = {
                                "ST_BRN": req.params.branch,
                                "F_DATE": {
                                    $gt: currentDate,
                                    $lt: nextDate
                                },
                                "F_CLOSEDT": { $exists: true, $ne: "" }
                            };
                            // console.log(dataClosing.returnData);
                            ST_FLGBRModel.findOne(qry,function(err,dataOld){
                                if (err) {
                                    res.status(500).json({
                                        message: err,
                                        success: false
                                    });
                                }
                                dataOld=JSON.parse(JSON.stringify(dataOld));
                                if(dataOld && dataOld.RPT_SENT){
                                    delete dataClosing.RPT_TOTAL;
                                    delete dataClosing.RPT_THP;
                                }
                                ST_FLGBRModel.findOneAndUpdate(qry, { $set: dataClosing.returnData }, { upsert: true, new: true }, function (err, newData) {
                                    if (err) {
                                        cb(err)
                                    }
                                    cb();
                                });
                            });
                        } else {
                            cb();
                        }
                    });
                } else {
                    cb()
                }
            }, function (err) {
                if (err) {
                    res.status(500).json({
                        message: err,
                        success: false
                    });
                }
                res.status(200).json({
                    message: "success fully getting data",
                    data: [],
                    success: true
                });
            });
        } catch (e) {
            console.error(e.stack);
            res.status(500).json({
                code: Code.errors.unknown,
                message: e.stack
            });
        }
    },

    getDailyClosingDtlApp: async function (req, res, next) {
        try {
            var date = new Date(req.params.date);
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            
            var nextDate = baseExport.convertToDateNew(day + '/' + month + '/' + year);
            nextDate.setDate(nextDate.getDate() + 1);
            var lastDate = baseExport.convertToDateNew(day + '/' + month + '/' + year);
            lastDate.setDate(lastDate.getDate() - 1);
            var todayDate=baseExport.convertToDateNew(baseExport.dateFormat(date));
            if (new Date().getHours() >= 0 && new Date().getHours() < 4) {
                todayDate = baseExport.convertToDateNew(moment(date).subtract(1, "day").format("DD/MM/YYYY"));
            }
            let query = ({
                "F31_APPTDT": todayDate,
                "ST_BRN": req.params.branch,
                "CANC______": { $ne: "Y" },
                "REC_YN": "Y"
                // "CHECK_____": { $ne: "" },
                // "entryFrom": "SUKHOERP"
            });
            let query1 = ({
                "F28_TRANDT": todayDate,
                "ST_BRN": req.params.branch,
                // "entryFrom": "SUKHOERP"
            });

            let query2 = ({
                "F41_RECDT": todayDate,
                "ST_BRN": req.params.branch,
                // "entryFrom": "SUKHOERP"
            });

            let query3 = ({
                "F_TRANDT": todayDate,
                "ST_BRN": req.params.branch,
            });


            var result = await model.F61_APPTModel.find(query).select('F41_WLAMT F31_NOPER F31_TRANTM F31_IDNM2 F31_IDNM1 F31_CASH F31_GVAMT F31_CCAMT F31_WLAMT F31_TIPSCC F31_APPTDT F41_CCFLG F31_TRANID ST_BRN F31_NAME F31_SNAME F31_FNAME F31_TCODE F31_TIPS F41_CCFLG F31_T1 F31_T2 F31_TOTAL F31_PT1 F31_PT2 F31_POINT realValue F41_RECNO F31_IDNO1 F31_AMT F31_IDNO2 F31_TIME1 F31_TIME2 REC_YN groupNumber entryFrom F31_TRANDT RECEIPTNO F41_RECNO F31_CHRCD F31_TAFLAG F81_RECP.WALLET_TYP').sort('_id:-1');
            result = _.sortBy(result, function (num) {
                return num;
            });
            var f28_crResult = await model.F28_CRModel.find(query1).select('F28_TRANNO F28_TRANDT F28_TCODE F28_GFTSTR F28_CARDNO ST_BRN F28_AMT F28_VALUE F28_CCFLG F28_CCAMT F28_CASH F28_FOC F28_WLAMT').sort('_id:-1');
            f28_crResult = _.sortBy(f28_crResult, function (num) {
                return num;
            });

            var F81ReceiptData = await model.F81_RECPModel.find(query2).select('F41_RECNO F41_RECDT F41_RECID F41_CCFLG F41_AMT F41_GVAMT F41_GIFTNO F41_CASH F41_CCAMT F41_WLAMT RECEIPTNO F41_RECNO').sort('F41_RECNO:1');
            F81ReceiptData = _.sortBy(F81ReceiptData, function (num) {
                return num;
            });


            var pettyCashData = await pettyCashModel.find(query3).select('F_TRANNO ST_BRN F_TOTAL').sort('_id:-1');
            pettyCashData = _.sortBy(pettyCashData, function (num) {
                return num;
            });


            // if (result && result.length > 0 || f28_crResult && f28_crResult.length > 0 || F81ReceiptData && F81ReceiptData.length > 0 || pettyCashData && pettyCashData.length) {
                calculateDailyClosingForApp({
                    taskDate: baseExport.convertToDateNew(baseExport.dateFormat(date)),
                    branch: req.params.branch,
                    message: "success fully getting data",
                    data: result,
                    f28_CRData: f28_crResult,
                    F81ReceiptData: F81ReceiptData,
                    pettyCashData: pettyCashData
                }, function (err, dataClosing) {
                    if (err) {
                        res.status(500).json({
                            message: err,
                            success: false
                        });
                    }
                    if (dataClosing && dataClosing.returnData) {
                        var currentDate = new Date(moment(date).subtract(1, 'days').format());
                        var nextDate = new Date(moment(date).add(1, 'days').format());
                        var qry = {
                            "ST_BRN": req.params.branch,
                            "F_DATE": {
                                $gt: currentDate,
                                $lt: nextDate
                            },
                            "F_CLOSEDT": { $exists: true, $ne: "" }
                        };
                        ST_FLGBRModel.findOne(qry,function(err,dataOld){
                            if (err) {
                                res.status(500).json({
                                    message: err,
                                    success: false
                                });
                            }
                            dataOld=JSON.parse(JSON.stringify(dataOld));
                            if(dataOld && dataOld.RPT_SENT){
                                delete dataClosing.RPT_TOTAL;
                                delete dataClosing.RPT_THP;
                            }
                            ST_FLGBRModel.findOneAndUpdate(qry, { $set: dataClosing.returnData }, { upsert: true, new: true }, function (err, newData) {
                                if (err) {
                                    res.status(500).json({
                                        message: err,
                                        success: false
                                    });
                                }
                                res.status(200).json({
                                    message: "success fully getting data",
                                    data: dataClosing,
                                    success: true
                                });
                            });
                        });
                    } else {
                        res.status(200).json({
                            message: "success fully getting data",
                            data: dataClosing,
                            success: true
                        });
                    }
                });
            
        } catch (e) {
            console.error(e.stack);
            res.status(500).json({
                code: Code.errors.unknown,
                message: e.stack
            });
        }
    },
    saveDailyClosingApp: function (req, res) {
        try {
            req.body.F_DATE = baseExport.convertToDateNew(baseExport.dateFormat(req.body.F_DATE));
            req.body.F_TIME = baseExport.getTimeStamp();
            req.body.F_CLOSEDT = baseExport.convertToDateNew(baseExport.dateFormat(new Date()));
            req.body.F_CLOSETM = baseExport.getTimeStamp();
            req.body.ST_BRN = req.body.ST_BRN;
            req.body.F_CLOSEYN = "Y";
            req.body.F_CLOSEID = req.body.userID;
            req.body.entryFrom = "SUKHOERPAPP";
            req.body.DBFNAME = "ST_FLGBR";

            req.body.CC_HDFC = (req.body.CC_HDFC) ? req.body.CC_HDFC : 0;
            req.body.CC_AMEX = (req.body.CC_AMEX) ? req.body.CC_AMEX : 0;
            req.body.CC_STLTIP = (req.body.CC_STLTIP) ? req.body.CC_STLTIP : 0;
            req.body.NXT_APPTSH = (req.body.NXT_APPTSH) ? req.body.NXT_APPTSH : 0;
            var currentDate = new Date(moment(req.body.F_DATE).subtract(1, 'days').format());
            var nextDate = new Date(moment(req.body.F_DATE).add(1, 'days').format());
            var qry = {
                "ST_BRN": req.body.ST_BRN,
                "F_DATE": {
                    $gt: currentDate,
                    $lt: nextDate
                },
                "F_CLOSEDT": { $exists: true, $ne: "" }
            };
            ST_FLGBRModel.findOneAndUpdate(qry, { $set: req.body }, { upsert: true, new: true }, function (err, newData) {
                if (err) {
                    res.status(500).json({
                        message: err,
                        success: false
                    });
                }
                sendTherapyDoneSMS(req.body.ST_BRN,function(err){
                    if (err) {
                        res.status(500).json({
                            message: err,
                            success: false
                        });
                    }
                    res.status(200).json({
                        message: "Closing Done Successfully.",
                        data: [],
                        success: true
                    });
                });
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                code: Code.errors.unknown,
                message: e.stack
            });
        }
    },


    // create: function(req, res) {
    //     try {
    //         // Use moment to get proper Date objects for the current and next date
    //         var currentDate = moment(req.session.transctionDate).subtract(1, 'days').startOf('day').toDate();
    //         var nextDate = moment(req.session.transctionDate).add(1, 'days').startOf('day').toDate();
    
            
        
    //         // Check if a closing entry already exists for the provided date range
    //         dailyClosing.findOne({
    //            "ST_BRN": req.session.user.ST_BRN,        // Using session data for branch
    //            "HOTEL_BRANCH": req.session.user.BRANCH,  // Using session data for hotel branch
    //             "F_CLOSEDT": {
    //                 $gt: currentDate,
    //                 $lt: nextDate
    //             }
    //         })
    //         .sort({ '_id': -1 })
    //         .select('F_CLOSEDT ST_BRN HOTEL_BRANCH F_CLOSEYN F_DATE')
    //         .exec(function(err, dailyClosingData) {
    //             if (err) {
    //                 return res.status(500).json({ message: 'Error fetching data', error: err });
    //             }
        
    //             if (dailyClosingData) {
    //                 // If data exists, return a message indicating it's a duplicate
    //                 console.log("Duplicate data found:", dailyClosingData);  // Log for debugging
    //                 return res.status(200).json({
    //                     message: 'Duplicate Data',
    //                     status: true
    //                 });
    //             } else {
    //                 // Proceed with creating new data
    //                 req.body.F_TIME = baseExport.getTimeStamp();
    //                 req.body.F_CLOSEDT = req.session.transctionDate;
    //                 req.body.F_TRANDT = new Date();
    //                 req.body.F_DATE = Date.now();
    //                 req.body.F_CLOSETM = baseExport.getTimeStamp();
    //                 req.body.F_CLOSEYN = "Y";
    //                 req.body.cashSpent = req.body.cashSpent || 0;
                    
    //                 // Setting session user data for branch, hotel, and close ID
    //                req.body.ST_BRN = req.session.user.ST_BRN;
    //                req.body.HOTEL_BRANCH = req.session.user.BRANCH;
    //                req.body.F_CLOSEID = req.session.user.F21_IDNO; // Close ID from session user data
                    
                
    //                // Ensure closingData is an array
    //               req.body.closingData = Array.isArray(req.body.closingData) ? req.body.closingData : [req.body.closingData];

    //                     // Define default structure with heads and default values
    //                     const defaultClosingData = [
    //                         { head: "Hotel", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
    //                         { head: "Restaurant", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
    //                         { head: "SPA", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
    //                         { head: "MINI BAR", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
    //                         { head: "Taxi Service", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
    //                         { head: "MMT", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
    //                         { head: "Agoda", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
    //                         { head: "Other", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 }
    //                     ];

    //                     // Merge incoming closingData with default data
    //                     defaultClosingData.forEach(defaultItem => {
    //                         // Check if there's already an object with the same head
    //                         let found = req.body.closingData.find(item => item.head === defaultItem.head);
                            
    //                         if (!found) {
    //                             // If not found, add the default item
    //                             req.body.closingData.push(defaultItem);
    //                         } else {
    //                             // If found, fill in missing values with defaults (cash, creditCard, etc.)
    //                             found.cash = found.cash || 0;
    //                             found.creditCard = found.creditCard || 0;
    //                             found.debitCard = found.debitCard || 0;
    //                             found.UPI = found.UPI || 0;
    //                             found.NEFT = found.NEFT || 0;
    //                             found.cheque = found.cheque || 0;
    //                         }
    //                     });

    //                req.body.totalCollection = req.body.totalCollection || {
    //                 cash: 0,
    //                 creditCard: 0,
    //                 debitCard: 0,
    //                 UPI: 0,
    //                 NEFT: 0,
    //                 cheque: 0
    //             };
               
                
    //                 // Additional static fields
    //                 req.body.entryFrom = "LAKE VIEW KASHMIR";
    //                 req.body.DBFNAME = "dailyClosing";
        
    //                 // Log the request body to ensure data correctness
    //                 console.log("Request body: ", req.body);
        
    //                 // Save the new entry
    //                 var closingData = new dailyClosing(req.body);
    //                 closingData.save(function(err, closingData) {
    //                     if (err) {
    //                         return res.status(500).json({ message: 'Error saving Closing Data', error: err });
    //                     } else {
    //                         return res.status(200).send({ message: "Save Closing Data Successfully", closingData });
    //                     }
    //                 });
    //             }
    //         });
    //     } catch (err) {
    //         console.log("Error: ", err);
    //         return res.status(500).json({ message: 'Internal Server Error', error: err });
    //     }
    // },

    create: function(req, res) {
        try {
            // Use moment to get proper Date objects for the current and next date using F_CLOSEDT from req.body
            var currentDate = moment(req.body.F_CLOSEDT).subtract(1, 'days').startOf('day').toDate();
            var nextDate = moment(req.body.F_CLOSEDT).add(1, 'days').startOf('day').toDate();
    
            // Check if a closing entry already exists for the provided date range using F_CLOSEDT from req.body
            dailyClosing.findOne({
               "ST_BRN": req.session.user.ST_BRN,        // Using session data for branch
               "HOTEL_BRANCH": req.session.user.BRANCH,  // Using session data for hotel branch
                "F_CLOSEDT": {
                    $gt: currentDate,
                    $lt: nextDate
                }
            })
            .sort({ '_id': -1 })
            .select('F_CLOSEDT ST_BRN HOTEL_BRANCH F_CLOSEYN F_DATE')
            .exec(function(err, dailyClosingData) {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching data', error: err });
                }
    
                if (dailyClosingData) {
                    // If data exists, return a message indicating it's a duplicate
                    console.log("Duplicate data found:", dailyClosingData);  // Log for debugging
                    return res.status(200).json({
                        message: 'Duplicate Data',
                        status: true
                    });
                } else {
                    // Proceed with creating new data
                    req.body.F_TIME = baseExport.getTimeStamp();
                    req.body.F_TRANDT = new Date();
                    req.body.F_DATE = Date.now();
                    req.body.F_CLOSETM = baseExport.getTimeStamp();
                    req.body.F_CLOSEYN = "Y";
                    req.body.cashSpent = req.body.cashSpent || 0;
    
                    // Ensure F_CLOSEDT is set from req.body
                    req.body.F_CLOSEDT = req.body.F_CLOSEDT || new Date();  // If not provided, default to the current date
    
                    // Setting session user data for branch, hotel, and close ID
                    req.body.ST_BRN = req.session.user.ST_BRN;
                    req.body.HOTEL_BRANCH = req.session.user.BRANCH;
                    req.body.F_CLOSEID = req.session.user.F21_IDNO; // Close ID from session user data
    
                    // Ensure closingData is an array
                    req.body.closingData = Array.isArray(req.body.closingData) ? req.body.closingData : [req.body.closingData];
    
                    // Define default structure with heads and default values
                    const defaultClosingData = [
                        { head: "Hotel", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
                        { head: "Restaurant", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
                        { head: "SPA", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
                        { head: "MINI BAR", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
                        { head: "Taxi Service", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
                        { head: "MMT", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
                        { head: "Agoda", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 },
                        { head: "Other", cash: 0, creditCard: 0, debitCard: 0, UPI: 0, NEFT: 0, cheque: 0 }
                    ];
    
                    // Merge incoming closingData with default data
                    defaultClosingData.forEach(defaultItem => {
                        // Check if there's already an object with the same head
                        let found = req.body.closingData.find(item => item.head === defaultItem.head);
                        
                        if (!found) {
                            // If not found, add the default item
                            req.body.closingData.push(defaultItem);
                        } else {
                            // If found, fill in missing values with defaults (cash, creditCard, etc.)
                            found.cash = found.cash || 0;
                            found.creditCard = found.creditCard || 0;
                            found.debitCard = found.debitCard || 0;
                            found.UPI = found.UPI || 0;
                            found.NEFT = found.NEFT || 0;
                            found.cheque = found.cheque || 0;
                        }
                    });
    
                    req.body.totalCollection = req.body.totalCollection || {
                        cash: 0,
                        creditCard: 0,
                        debitCard: 0,
                        UPI: 0,
                        NEFT: 0,
                        cheque: 0
                    };
    
                    // Additional static fields
                    req.body.entryFrom = "LAKE VIEW KASHMIR";
                    req.body.DBFNAME = "dailyClosing";
    
                    // Log the request body to ensure data correctness
                    console.log("Request body: ", req.body);
    
                    // Save the new entry
                    var closingData = new dailyClosing(req.body);
                    closingData.save(function(err, closingData) {
                        if (err) {
                            return res.status(500).json({ message: 'Error saving Closing Data', error: err });
                        } else {
                            return res.status(200).send({ message: "Save Closing Data Successfully", closingData });
                        }
                    });
                }
            });
        } catch (err) {
            console.log("Error: ", err);
            return res.status(500).json({ message: 'Internal Server Error', error: err });
        }
    },
    
    
    /*getDailyClosingDtlApp: function (req, res) {
        try {
            ST_FLGBRModel.find({
                "ST_BRN": req.body.ST_BRN
            }).sort({
                '_id': -1
            }).exec(function (err, data) {
                if (err) {
                    res.status(500).json({
                        message: e.stack,
                        data: [],
                        success: false
                    });
                } else if (!data) {
                    res.status(404).json({
                        message: "Data not found",
                        data: [],
                        success: false
                    });

                } else {
                    res.status(200).json({
                        message: "success fully getting data",
                        data: data,
                        success: true
                    });
                }
            });
        } catch (e) {
            console.log("error is..........", e);
        }
    },*/

    getTodaysClosingData: async function (req, res) {
        try {
            var currentDate = new Date(moment(req.body.F_CLOSEDT).subtract(1, 'days').format());
            var nextDate = new Date(moment(req.body.F_CLOSEDT).add(1, 'days').format());
            var query = {
                "F_CLOSEDT": {
                    $gt: currentDate,
                    $lte: nextDate
                },
                "ST_BRN": req.session.user.ST_BRN
            }
         //   console.log("queryqueryqueryquery" , query)

            let closingData = await dailyClosing.findOne(query);
           // console.log("closingDataclosingData" , closingData)
            if (!closingData) {
                return res.status(404).json({
                    message: 'NOT FOUND.',
                    success: false,
                    result: {}
                });
            }

            return res.status(200).json({
                message: 'OK.',
                success: true,
                result: closingData
            });

        } catch (e) {

            res.status(500).json({
                message: 'INTERNAL SERVER ERROR',
                success: false,
                error: e
            });

        }

    },

    getDailyCollection: function (req, res) {

        var currentDate = baseExport.convertToDateNew(req.body.fromDate);
        var lastDate = new Date(moment(currentDate).subtract(1, 'days').format());
        var nextDate = new Date(moment(currentDate).add(1, 'days').format());
        let query = {
            "F_DATE": {
                $gt: lastDate,
                $lt: nextDate
            },

        };


        async.waterfall([
            function (callback) {
                branchModel.
                    find({
                        "STAT______": { $eq: "" }
                    })
                    .select('INV_REGION ST_ONLIN ST_BRN F_CITY')
                    .lean()
                    //.sort('-ST_BRN')
                    .sort({ ST_BRN: 1, F_CITY: -1 })
                    .exec(function (err, branchData) {
                        if (err) {
                            callback(err, []);
                        } else if (branchData === null || branchData === undefined || branchData.length === 0) {
                            callback(null, []);
                        } else {
                            callback(null, branchData);
                        }
                    });
            },
            function (branchData, callback) {
                var details = [];
                if (branchData && branchData.length > 0) {
                    async.each(branchData, function (data, callbackEach) {
                        var data = JSON.parse(JSON.stringify(data));
                        query.ST_BRN = data.ST_BRN;
                        var pbNoArray = [];
                        var REC_Y = 0;
                        var REC_N = 0;

                        ST_FLGBRModel
                            .find(query)
                            .select('ST_BRN GUEST_NO COLLECTION F_DATE')
                            .lean()
                            .sort('ST_BRN')
                            .exec(function (err, result2) {
                                if (err) {
                                    callback(err, null);
                                }
                                if (result2 && result2.length > 0) {

                                    var result2 = JSON.parse(JSON.stringify(result2));


                                    async.each(result2, function (arr2obj, callback1) {

                                        arr2obj.INV_REGION = data.INV_REGION;
                                        arr2obj.F_CITY = data.F_CITY;
                                        arr2obj.ST_ONLIN = data.ST_ONLIN;
                                        data.F_DATE = arr2obj.F_DATE;
                                        data.GUEST_NO = arr2obj.GUEST_NO;
                                        data.COLLECTION = arr2obj.COLLECTION;
                                        pbNoArray.push(arr2obj);
                                        callback1();
                                    }, function (err) {

                                        details.push(data);
                                        callbackEach(null, details);

                                    });

                                } else {
                                    details.push(data);
                                    callbackEach(null, details);
                                }

                            });

                    }, function (err) {
                        callback(null, details);
                    });

                } else {
                    callback(null, []);
                }


            }], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        error: err,
                        message: "ERROR IN GETTINF ALL BRANCH DATA."
                    });
                } else {

                    var brnArray = [];

                    result = _.groupBy(result, function (num) {
                        return num.F_CITY;
                    });
                    _.each(result, function (arr2obj, key) {
                        var obj = {
                            "region": key,
                            "branch": arr2obj
                        };
                        brnArray.push(obj);
                    });

                    // brnArray = _.sortBy(brnArray, function (num) {
                    //     return num.ST_BRN;
                    // });

                    return res.status(200).json({
                        success: true,
                        message: "SUCCESS",
                        data: brnArray
                    });
                }
            });
    },

    checkTodayPettyLeaveLaundry: async function (req, res) {
        try {
            var currentDate = new Date(moment(req.body.F_CLOSEDT).subtract(1, 'days').format());
            var nextDate = new Date(moment(req.body.F_CLOSEDT).add(1, 'days').format());

            

            var queryOne = {
                "F_TRANDT": {
                    $gt: currentDate,
                    $lte: nextDate
                },
                "ST_BRN": req.session.user.ST_BRN,
            }

            

            console.log("queryOne" , queryOne)


           
            let CheckPettyCash = await pettyCashModel.findOne(queryOne);
          


            if (!CheckPettyCash) {

                if (req.session.user.F21_IDNO == "ADMIN" || req.session.user.F21_IDNO == 102) {

                    return res.status(200).json({
                        message: 'OK',
                        success: true,
                        CheckPettyCash: {},
                        
                    });

                } else {
                    return res.status(200).json({
                        message: 'NOT FOUND',
                        success: false,
                       CheckPettyCash: CheckPettyCash,
                        
                    });

                }

            } else {
              //  console.log("CheckPettyCashCheckPettyCash" , CheckPettyCash)
                return res.status(200).json({
                    message: 'OK',
                    success: true,
                    CheckPettyCash: CheckPettyCash,
                    
                });
            }
        } catch (e) {

            res.status(500).json({
                message: 'INTERNAL SERVER ERROR',
                success: false,
                error: e.message
            });

        }

    },

    updateAppointment: function (req, res) {
        try {
            if (req.body.sukhoData && req.body.sukhoData.length) {
                async.eachSeries(req.body.sukhoData, function (item, cb) {

                    model.F61_APPTModel.findByIdAndUpdate({
                        '_id': item.id
                    }, {
                        $set: item
                    }, function (err, apptFutureData) {
                        if (err) {
                            cb(err, null);
                        } else {
                            cb(null, {});
                        }
                    });
                }, function (err) {
                    if (err) {
                        return res.status(500).json({
                            message: "Error",
                            error: err,
                            status: false
                        });
                    } else {
                        return res.status(200).json({
                            message: 'Appointment Succesfully Update',
                            status: true
                        });
                    }
                });
            }
        } catch (e) {
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@2##########", e);
        }

    },
    updateGiftCardValues: function (req, res) {
        try {
            if (req.body.giftData && req.body.giftData.length) {
                async.eachSeries(req.body.giftData, function (item, cb) {

                    model.F28_CRModel.findByIdAndUpdate({
                        '_id': item.id
                    }, {
                        $set: item
                    }, function (err, apptFutureData) {
                        if (err) {
                            cb(err, null);
                        } else {
                            cb(null, {});
                        }
                    });
                }, function (err) {
                    if (err) {
                        return res.status(500).json({
                            message: "Error",
                            error: err,
                            status: false
                        });
                    } else {
                        return res.status(200).json({
                            message: 'Gift card Succesfully Update',
                            status: true
                        });
                    }
                });
            }

        } catch (e) {
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@2##########", e);
        }

    },
    getRecloseingData: async function (req, res) {

        try {
            let pushYearMonth = [];
            let fromDate = new Date(req.body.search_query.start_date);
            var fromDay = fromDate.getDate();
            var fromMonth = fromDate.getMonth() + 1;
            var fromYear = fromDate.getFullYear();

            let toDate = new Date(req.body.search_query.end_date);

            var toDay = toDate.getDate();
            var toMonth = toDate.getMonth() + 1;
            var toYear = toDate.getFullYear();

            for (var i = fromDay; i <= toDay; i++) {
                var dateFormated = toYear + "-" + toMonth + "-" + i;
                pushYearMonth.push(dateFormated);
            }
            //   async.eachSeries(pushYearMonth, function (item, cb) {
            //pushYearMonth.forEach(async (food) => {
            //const output = await AIFoodRecognition(foodArray[i]);

            // for (const item of pushYearMonth) {

            function delay() {
                return new Promise(resolve => setTimeout(resolve, 300));
            }


            //async function processArray(array) {
            for (const item of pushYearMonth) {
                await delayedLog(item);
            }
            console.log('Done!');
            // }
            async function delayedLog(item) {
                // notice that we can await a function
                // that returns a promise
                await delay();
                //}

                var nextDate = baseExport.convertToDate(item);
                var lastDate = baseExport.convertToDate(item);

                let query = ({
                    "F31_APPTDT": {
                        $gte: nextDate,
                        $lte: lastDate
                    },
                    "ST_BRN": req.session.user.ST_BRN,
                    "CANC______": { $ne: "Y" },
                    "REC_YN": "Y"

                });
                // console.log("query.....", query);

                let query1 = ({
                    "F28_TRANDT": {
                        $gt: lastDate,
                        $lt: nextDate
                    },
                    "ST_BRN": req.session.user.ST_BRN,
                    // "entryFrom": "SUKHOERP"
                });

                let query2 = ({
                    "F41_RECDT": {
                        $gt: lastDate,
                        $lt: nextDate
                    },
                    "ST_BRN": req.session.user.ST_BRN,
                    // "entryFrom": "SUKHOERP"
                });

                let query3 = ({
                    "F_TRANDT": {
                        $gt: lastDate,
                        $lt: nextDate
                    },
                    "ST_BRN": req.session.user.ST_BRN,
                });


                var result = await model.F61_APPTModel.find(query).select('F41_WLAMT F31_NOPER F31_TRANTM F31_IDNM2 F31_IDNM1 F31_CASH F31_GVAMT F31_CCAMT F31_WLAMT F31_TIPSCC F31_APPTDT F41_CCFLG F31_TRANID ST_BRN F31_NAME F31_SNAME F31_FNAME F31_TCODE F31_TIPS F41_CCFLG F31_T1 F31_T2 F31_TOTAL F31_PT1 F31_PT2 F31_POINT F41_RECNO F31_IDNO1 F31_AMT F31_IDNO2 F31_TIME1 F31_TIME2 REC_YN groupNumber entryFrom F31_TRANDT RECEIPTNO F41_RECNO F31_CHRCD F31_TAFLAG F81_RECP.WALLET_TYP').sort('_id:-1');
                result = _.sortBy(result, function (num) {
                    return num;
                });

                var f28_crResult = await model.F28_CRModel.find(query1).select('F28_TRANNO F28_TRANDT F28_TCODE F28_GFTSTR F28_CARDNO ST_BRN F28_AMT F28_VALUE F28_CCFLG F28_CCAMT F28_CASH F28_WLAMT').sort('_id:-1');
                f28_crResult = _.sortBy(f28_crResult, function (num) {
                    return num;
                });

                var F81ReceiptData = await model.F81_RECPModel.find(query2).select('F41_RECNO F41_RECDT F41_RECID F41_CCFLG F41_AMT F41_GVAMT F41_GIFTNO F41_CASH F41_CCAMT F41_WLAMT RECEIPTNO F41_RECNO').sort('F41_RECNO:1');
                F81ReceiptData = _.sortBy(F81ReceiptData, function (num) {
                    return num;
                });


                var pettyCashData = await pettyCashModel.find(query3).select('F_TRANNO ST_BRN F_TOTAL').sort('_id:-1');
                pettyCashData = _.sortBy(pettyCashData, function (num) {
                    return num;
                });

                //console.log("result.............................", result);
                var apiData = {
                    data: result,
                    F81ReceiptData: F81ReceiptData,
                    f28_crResult: f28_crResult,
                    pettyCashData: pettyCashData
                }

                //console.log("result.............................", apiData);
                //if (apiData.data && apiData.data.length > 0) {

                apiData = JSON.parse(JSON.stringify(apiData));
                var cashCollection = [];
                var creditCardCollection = [];
                var giftCardCollection = [];
                var wallet = [];
                var giftVouchersUtilised = [];

                var tipsCashArr = [];
                var tipsCreditCardArr = [];
                var tipsGiftCardArr = [];
                var tipsOtherArr = [];
                var priorityCard = [];
                var priorityCardForCash = [];
                var priorityCardForCreditCard = [];
                var priorityCardForGiftCard = [];
                var priorityCardForWallet = [];
                var priorityCardForFOC = [];
                var priorityCardForCashCrDot = [];
                var priorityCardForCashCr = [];
                var giftCardForCash = [];
                var giftCardForCreditCard = [];
                var giftCardForFOC = [];
                var giftCardForGiftCard = [];
                var giftCardForWallet = [];
                var giftCardForCashCrDot = [];
                var giftCardForCashCr = [];

                var pettyCashArray = [];
                var UPIAMTArray = [];
                var billToHotelArray = [];


                if (apiData.data && apiData.data.length > 0 || apiData.F81ReceiptData && apiData
                    .F81ReceiptData.length > 0 || apiData.f28_CRData && apiData.f28_CRData.length > 0 ||
                    apiData.f28_CRData && apiData.f28_CRData.length > 0 || apiData.pettyCashData &&
                    apiData.pettyCashData.length) {


                    for (var i = 0; i < apiData.data.length; i++) {
                        if (apiData.data[i].F41_CCFLG == "Cash") {
                            cashCollection.push(apiData.data[i].F31_TOTAL);

                        } else if (apiData.data[i].F41_CCFLG == "Credit Card") {
                            creditCardCollection.push(apiData.data[i].F31_TOTAL);

                        } else if (apiData.data[i].F41_CCFLG == "Gift Card") {

                            giftCardCollection.push(apiData.data[i].F31_TOTAL);
                            giftVouchersUtilised.push(apiData.data[i].F31_TOTAL);

                        } else if (apiData.data[i].F41_CCFLG == "Wallet") {
                            wallet.push(apiData.data[i].F31_TOTAL);

                            if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                                UPIAMTArray.push(apiData.data[i].F31_TOTAL);
                            }

                        } else if (apiData.data[i].F41_CCFLG == "Bank Transfer") {
                            wallet.push(apiData.data[i].F31_TOTAL);

                        } else if (apiData.data[i].F41_CCFLG == "Gift+Cash") {

                            cashCollection.push(apiData.data[i].F31_CASH);
                            giftCardCollection.push(apiData.data[i].F31_GVAMT);
                            giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);

                        } else if (apiData.data[i].F41_CCFLG == "Gift+Cash/CC") {
                            cashCollection.push(apiData.data[i].F31_CASH);
                            giftCardCollection.push(apiData.data[i].F31_GVAMT);
                            creditCardCollection.push(apiData.data[i].F31_CCAMT);
                            giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);

                        } else if (apiData.data[i].F41_CCFLG == "Cash+Cr.Card") {
                            cashCollection.push(apiData.data[i].F31_CASH);
                            creditCardCollection.push(apiData.data[i].F31_CCAMT);

                        } else if (apiData.data[i].F41_CCFLG == "Cash+Cr") {
                            cashCollection.push(apiData.data[i].F31_CASH);
                            creditCardCollection.push(apiData.data[i].F31_CCAMT);

                        } else if (apiData.data[i].F41_CCFLG == "Walt+Cash") {
                            wallet.push(apiData.data[i].F41_WLAMT);
                            cashCollection.push(apiData.data[i].F31_CASH);

                            if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                                UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                            }

                        } else if (apiData.data[i].F41_CCFLG == "Walt+CC") {
                            wallet.push(apiData.data[i].F41_WLAMT);
                            creditCardCollection.push(apiData.data[i].F31_CCAMT);

                            if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                                UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                            }

                        } else if (apiData.data[i].F41_CCFLG == "Walt+Gift") {
                            wallet.push(apiData.data[i].F41_WLAMT);
                            giftCardCollection.push(apiData.data[i].F31_GVAMT);
                            giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);

                            if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                                UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                            }

                        } else if (apiData.data[i].F41_CCFLG == "Cash+CC+Walt") {
                            cashCollection.push(apiData.data[i].F31_CASH);
                            creditCardCollection.push(apiData.data[i].F31_CCAMT);
                            wallet.push(apiData.data[i].F41_WLAMT);

                        } else if (apiData.data[i].F41_CCFLG == "Cash+Gift+Walt") {
                            cashCollection.push(apiData.data[i].F31_CASH);
                            giftCardCollection.push(apiData.data[i].F31_GVAMT);
                            wallet.push(apiData.data[i].F41_WLAMT);
                            giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);

                            if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                                UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                            }

                        } else if (apiData.data[i].F41_CCFLG == "CC+Gift+Walt") {
                            creditCardCollection.push(apiData.data[i].F31_CCAMT);
                            giftCardCollection.push(apiData.data[i].F31_GVAMT);
                            wallet.push(apiData.data[i].F41_WLAMT);
                            giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);

                            if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                                UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                            }

                        } else if (apiData.data[i].F41_CCFLG == "Cash+CC+Gift+Walt") {
                            cashCollection.push(apiData.data[i].F31_CASH);
                            creditCardCollection.push(apiData.data[i].F31_CCAMT);
                            giftCardCollection.push(apiData.data[i].F31_GVAMT);
                            wallet.push(apiData.data[i].F41_WLAMT);
                            giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);

                            if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                                UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                            }

                        } else if (apiData.data[i].F41_CCFLG == "Bill To Hotel") {
                            // alert(apiData.data[i].F31_TOTAL);

                            billToHotelArray.push(apiData.data[i].F31_TOTAL);

                        } else { }

                    }

                    for (var i = 0; i < apiData.data.length; i++) {

                        if (apiData.data[i].F31_TIPSCASH == "Cash") {
                            tipsCashArr.push(apiData.data[i].F31_TIPS);
                        }
                        if (apiData.data[i].F31_TIPSCC == "Credit Card") {
                            tipsCreditCardArr.push(apiData.data[i].F31_TIPS);
                        }

                    }


                    for (var p = 0; p < apiData.pettyCashData.length; p++) {
                        pettyCashArray.push(apiData.pettyCashData[p].F_TOTAL);
                    }

                    var totalPettyCashAmmount = pettyCashArray.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);


                    var totalCashCollection = cashCollection.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalCreditCardCollection = creditCardCollection.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalWalletCollection = wallet.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);


                    var totalGiftCardCollection = giftCardCollection.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalCashTips = tipsCashArr.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalCreditCardTips = tipsCreditCardArr.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalGiftCardTips = tipsGiftCardArr.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalOtherTips = tipsOtherArr.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    if (apiData.f28_CRData) {
                        for (var i = 0; i < apiData.f28_CRData.length; i++) {
                            var str = apiData.f28_CRData[i].F28_GFTSTR;
                            var res = str.charAt(0)
                            if (res == 2) {
                                priorityCard.push(apiData.f28_CRData[i].F28_AMT);

                                switch (apiData.f28_CRData[i].F28_CCFLG) {
                                    case 'Cash':
                                        priorityCardForCash.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Credit Card':
                                        priorityCardForCreditCard.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Gift Card':
                                        priorityCardForGiftCard.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Wallet':
                                        priorityCardForWallet.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Walt+Cash':
                                        priorityCardForWallet.push(apiData.f28_CRData[i].F28_WLAMT);
                                        priorityCardForCash.push(apiData.f28_CRData[i].F28_CASH);
                                        break;
                                    case 'Walt+CC':
                                        priorityCardForWallet.push(apiData.f28_CRData[i].F28_WLAMT);
                                        priorityCardForCreditCard.push(apiData.f28_CRData[i].F28_CCAMT);
                                        break;
                                    case 'Bank Transfer':
                                        priorityCardForWallet.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Cash+Cr.Card':
                                        priorityCardForCash.push(apiData.f28_CRData[i].F28_CASH);
                                        priorityCardForCreditCard.push(apiData.f28_CRData[i].F28_CCAMT);
                                        break;
                                    case 'Cash+Cr':
                                        priorityCardForCashCr.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'FOC':
                                        priorityCardForFOC.push(apiData.f28_CRData[i].F28_FOC);
                                        break;
                                    default:
                                        console.log('This is defult for priority card');
                                }
                            } else {

                                switch (apiData.f28_CRData[i].F28_CCFLG) {
                                    case 'Cash':
                                        giftCardForCash.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Credit Card':
                                        giftCardForCreditCard.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Gift Card':
                                        giftCardForGiftCard.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Wallet':
                                        giftCardForWallet.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Walt+Cash':
                                        giftCardForWallet.push(apiData.f28_CRData[i].F28_WLAMT);
                                        giftCardForCash.push(apiData.f28_CRData[i].F28_CASH);
                                        break;
                                    case 'Walt+CC':
                                        giftCardForWallet.push(apiData.f28_CRData[i].F28_WLAMT);
                                        giftCardForCreditCard.push(apiData.f28_CRData[i].F28_CCAMT);
                                        break;
                                    case 'Bank Transfer':
                                        giftCardForWallet.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'Cash+Cr.Card':
                                        // giftCardForCashCrDot.push(apiData.f28_CRData[i].F28_AMT);
                                        giftCardForCash.push(apiData.f28_CRData[i].F28_CASH);
                                        giftCardForCreditCard.push(apiData.f28_CRData[i].F28_CCAMT);
                                        break;
                                    case 'Cash+Cr':
                                        giftCardForCashCr.push(apiData.f28_CRData[i].F28_AMT);
                                        break;
                                    case 'FOC':
                                        giftCardForFOC.push(apiData.f28_CRData[i].F28_FOC);
                                        break;
                                    default:
                                        console.log('This is defult for gift card');
                                }

                            }
                        }
                    }

                    var totalPriorityCardForCash = priorityCardForCash.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalPriorityCardForCreditCard = priorityCardForCreditCard.reduce(function (acc,
                        score) {
                        return acc + score;
                    }, 0);
                    var totalPriorityCardForFOC = priorityCardForFOC.reduce(function (acc,
                        score) {
                        return acc + score;
                    }, 0);
                    var totalPriorityCardForGiftCard = priorityCardForGiftCard.reduce(function (acc,
                        score) {
                        return acc + score;
                    }, 0);

                    var totalPriorityCardForWallet = priorityCardForWallet.reduce(function (acc,
                        score) {
                        return acc + score;
                    }, 0);

                    var totalPriorityCardForCashCrDot = priorityCardForCashCrDot.reduce(function (acc,
                        score) {
                        return acc + score;
                    }, 0);

                    var totalPriorityCardForCashCr = priorityCardForCashCr.reduce(function (acc,
                        score) {
                        return acc + score;
                    }, 0);

                    // Addition for Gift Card Ammount
                    var totalGiftCardForCash = giftCardForCash.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalGiftCardForCreditCard = giftCardForCreditCard.reduce(function (acc,
                        score) {
                        return acc + score;
                    }, 0);
                    var totalGiftCardForFOC = giftCardForFOC.reduce(function (acc,
                        score) {
                        return acc + score;
                    }, 0);
                    var totalGiftCardForGiftCard = giftCardForGiftCard.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalGiftCardForWallet = giftCardForWallet.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalGiftCardForCashCrDot = giftCardForCashCrDot.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var totalGiftCardForCashCr = giftCardForCashCr.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var UPIAMTOtal = UPIAMTArray.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);

                    var billToHotelTOtal = billToHotelArray.reduce(function (acc, score) {
                        return acc + score;
                    }, 0);


                    var BillToHotel1 = billToHotelTOtal;
                    var numberOfPriorityCards = priorityCard.length;
                    var totalPriorityCard = totalPriorityCardForCreditCard;
                    var cashBranchCollection = parseInt(totalCashCollection) + parseInt(
                        totalGiftCardForCash) + parseInt(totalPriorityCardForCash);

                    var creditCardBranchCollection = parseInt(totalCreditCardCollection) + parseInt(
                        totalPriorityCardForCreditCard) + parseInt(totalGiftCardForCreditCard);

                    var walletBranchCollection = parseInt(totalWalletCollection) + parseInt(
                        totalPriorityCardForWallet) + parseInt(totalGiftCardForWallet);

                    var branchCollection = parseInt(totalCashCollection) + parseInt(
                        totalGiftCardForCash) + parseInt(totalPriorityCardForCash) + parseInt(
                            totalCreditCardCollection) + parseInt(totalGiftCardForCreditCard) +
                        parseInt(totalPriorityCardForCreditCard) + parseInt(totalWalletCollection) +
                        parseInt(totalPriorityCardForWallet) + parseInt(totalGiftCardForWallet);;
                    var totCashAmt = parseInt(totalCashCollection) + parseInt(
                        totalGiftCardForCash) + parseInt(totalPriorityCardForCash);

                    var classOfprioritycardwallet = totalPriorityCardForWallet;

                    var sumOfCashForPriority = totalPriorityCardForCash;

                    var totalPriorityCardForCash = parseInt(totalPriorityCardForCash) + parseInt(
                        totalPriorityCardForCreditCard);

                    var totalPriorityCardForCreditCard = totalPriorityCardForCreditCard;
                    var sumOfGiftCardCreditCard = totalGiftCardForCreditCard;
                    var totalGiftCardForCC = totalGiftCardForCreditCard;

                    var envelopeAmount = parseInt(totCashAmt) - parseInt(
                        totalPettyCashAmmount);

                    var UPIAmtTotal = UPIAMTOtal;

                    var branchTotalSale = parseInt(totalCashCollection) + parseInt(
                        totalCreditCardCollection) + parseInt(totalGiftCardCollection) +
                        parseInt(totalWalletCollection);


                    ST_FLGBRModel.findOne({
                        "ST_BRN": req.session.user.ST_BRN,
                        "F_CLOSEDT": { $exists: true },
                        "F_CLOSEDT": {
                            $gte: nextDate,
                            $lte: lastDate
                        }
                    }).sort({
                        '_id': -1
                    }).select('F_CLOSEDT ST_BRN F_CLOSEYN F_DATE').exec(function (err, ST_FLGBRData) {
                        
                        if (ST_FLGBRData) {
                            // console.log(" ST_FLGBRData.id...............", ST_FLGBRData.id);
                            var saveObj = {
                                "F_SLCASH": totalCashCollection,
                                "F_SLCC": totalCreditCardCollection,
                                "F_SLWL": totalWalletCollection,
                                "F_SLGVCASH": totalGiftCardForCash,
                                "F_SLGVCC": sumOfGiftCardCreditCard,
                                "F_SLGVFOC": totalGiftCardForFOC,
                                "F_SLGVWL": 0,
                                "F_PCCASH": sumOfCashForPriority,
                                "F_PCCC": totalPriorityCard,
                                "F_PCWL": classOfprioritycardwallet,
                                "F_CSHRCV": cashBranchCollection,
                                "F_CCRCV": creditCardBranchCollection,
                                // "F_TIPS": 0,
                                // "F_CTIPS": 0,
                                "F_TOTSALE": branchTotalSale,
                                "cashSpent": totalPettyCashAmmount,
                                "cashEnvelope": envelopeAmount,
                                "UPIAmt": UPIAmtTotal,
                                "BillToHotel": BillToHotel1,
                                "reClosingId": req.session.user.F21_IDNO,
                                "reClosingDate": baseExport.convertToDateNew(baseExport.dateFormat(new Date()))
                            }
                           
                            ST_FLGBRModel.findByIdAndUpdate({
                                '_id': ST_FLGBRData.id
                            }, {
                                $set: saveObj
                            }, function (err, closingData) {
                                if (err) {
                                    console.log("Error getting ........", err);
                                } else {
                                    console.log("SuccessFully Updated");
                                }
                            });

                        }
                        //}
                    });

                }
            }
            return res.status(200).json({
                message: 'success',
                status: true
            });
            //}

        } catch (e) {
            console.error(e.stack);

        }

    },

    griddata: async function (req, res) {
        try {
             console.log(req.body);
            var query = {};
            var limit = req.body.limit ? parseInt(req.body.limit) : 500;
            var search_by = req.body.search_by ? req.body.search_by : "";
            //var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
            var sort_by = "F_TRANDT";
            var order = "asc";
            // var order = req.body.order ? req.body.order : "asc";
            var page = req.body.page ? parseInt(req.body.page) : 0;
            var columns = req.body.columns ? req.body.columns : [];
            var filter_columns = {};
            var draw = req.body.draw ? parseInt(req.body.draw) : 1;
            var start = req.body.start ? parseInt(req.body.start) : 0;
    
            if (req.body.search_query) {
                var search_query = req.body.search_query;
                if (search_query.ST_BRN) {
                   query.ST_BRN = search_query.ST_BRN;
               }
           } 

            var table_format = req.body.table_format ? req.body.table_format : "datatable";
    
            q.all(baseExport.grid('dailyClosing', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
               console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr" , result)
                res.json(result);
            });
    
        } catch (err) {
    console.log("errrrrrrrrrrrrrrrrrr",err)
        }
    },

}

function calculateDailyClosingForApp(apiData, cb) {
    // if (apiData.data && apiData.data.length > 0) {
        apiData = JSON.parse(JSON.stringify(apiData));


        var cashCollection = [];
        var creditCardCollection = [];
        var giftCardCollection = [];
        var wallet = [];
        var giftVouchersUtilised = [];
        var giftVouchersUtilisedReal = [];
        var tipsCashArr = [];
        var tipsCreditCardArr = [];
        var tipsGiftCardArr = [];
        var tipsOtherArr = [];
        var priorityCard = [];
        var priorityCardForCash = [];
        var priorityCardForCreditCard = [];
        var priorityCardForFOC = [];
        var priorityCardForGiftCard = [];
        var priorityCardForWallet = [];
        var priorityCardForCashCrDot = [];
        var priorityCardForCashCr = [];
        var giftCardForCash = [];
        var giftCardForCreditCard = [];
        var giftCardForFOC = [];
        var giftCardForGiftCard = [];
        var giftCardForWallet = [];
        var giftCardForCashCrDot = [];
        var giftCardForCashCr = [];

        var pettyCashArray = [];
        var UPIAMTArray = [];
        var billToHotelArray = [];



        // var priorityCardForGiftWallet = [];

        // if (apiData.data && apiData.data.length > 0 || apiData.F81ReceiptData && apiData
        //     .F81ReceiptData.length > 0 || apiData.f28_CRData && apiData.f28_CRData.length > 0 ||
        //     apiData.f28_CRData && apiData.f28_CRData.length > 0 || apiData.pettyCashData &&
        //     apiData.pettyCashData.length) {

            // $("#NoOfBranchTherapySale").val(apiData.data.length);
            // $("#toDaysDate").html(dateFormat(apiData.data[0].F31_APPTDT));

            for (var i = 0; i < apiData.data.length; i++) {
                if (apiData.data[i].F41_CCFLG == "Cash") {
                    cashCollection.push(apiData.data[i].F31_TOTAL);

                } else if (apiData.data[i].F41_CCFLG == "Credit Card") {
                    creditCardCollection.push(apiData.data[i].F31_TOTAL);

                } else if (apiData.data[i].F41_CCFLG == "Gift Card") {

                    giftCardCollection.push(apiData.data[i].F31_TOTAL);
                    giftVouchersUtilised.push(apiData.data[i].F31_TOTAL);
                    giftVouchersUtilisedReal.push((apiData.data[i].realValue)?apiData.data[i].realValue:0);
                } else if (apiData.data[i].F41_CCFLG == "Wallet") {
                    wallet.push(apiData.data[i].F31_TOTAL);

                    if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                        UPIAMTArray.push(apiData.data[i].F31_TOTAL);
                    }

                } else if (apiData.data[i].F41_CCFLG == "Bank Transfer") {
                    wallet.push(apiData.data[i].F31_TOTAL);

                } else if (apiData.data[i].F41_CCFLG == "Gift+Cash") {

                    cashCollection.push(apiData.data[i].F31_CASH);
                    giftCardCollection.push(apiData.data[i].F31_GVAMT);
                    giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);
                    giftVouchersUtilisedReal.push((apiData.data[i].realValue)?apiData.data[i].realValue:0);

                } else if (apiData.data[i].F41_CCFLG == "Gift+Cash/CC") {
                    cashCollection.push(apiData.data[i].F31_CASH);
                    giftCardCollection.push(apiData.data[i].F31_GVAMT);
                    creditCardCollection.push(apiData.data[i].F31_CCAMT);
                    giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);
                    giftVouchersUtilisedReal.push((apiData.data[i].realValue)?apiData.data[i].realValue:0);

                } else if (apiData.data[i].F41_CCFLG == "Cash+Cr.Card") {
                    cashCollection.push(apiData.data[i].F31_CASH);
                    creditCardCollection.push(apiData.data[i].F31_CCAMT);

                } else if (apiData.data[i].F41_CCFLG == "Cash+Cr") {
                    cashCollection.push(apiData.data[i].F31_CASH);
                    creditCardCollection.push(apiData.data[i].F31_CCAMT);

                } else if (apiData.data[i].F41_CCFLG == "Walt+Cash") {
                    wallet.push(apiData.data[i].F41_WLAMT);
                    cashCollection.push(apiData.data[i].F31_CASH);

                    if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                        UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                    }

                } else if (apiData.data[i].F41_CCFLG == "Walt+CC") {
                    wallet.push(apiData.data[i].F41_WLAMT);
                    creditCardCollection.push(apiData.data[i].F31_CCAMT);

                    if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                        UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                    }

                } else if (apiData.data[i].F41_CCFLG == "Walt+Gift") {
                    wallet.push(apiData.data[i].F41_WLAMT);
                    giftCardCollection.push(apiData.data[i].F31_GVAMT);
                    giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);
                    giftVouchersUtilisedReal.push((apiData.data[i].realValue)?apiData.data[i].realValue:0);
                    if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                        UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                    }

                } else if (apiData.data[i].F41_CCFLG == "Cash+CC+Walt") {
                    cashCollection.push(apiData.data[i].F31_CASH);
                    creditCardCollection.push(apiData.data[i].F31_CCAMT);
                    wallet.push(apiData.data[i].F41_WLAMT);

                } else if (apiData.data[i].F41_CCFLG == "Cash+Gift+Walt") {
                    cashCollection.push(apiData.data[i].F31_CASH);
                    giftCardCollection.push(apiData.data[i].F31_GVAMT);
                    wallet.push(apiData.data[i].F41_WLAMT);
                    giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);
                    giftVouchersUtilisedReal.push((apiData.data[i].realValue)?apiData.data[i].realValue:0);
                    if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                        UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                    }

                } else if (apiData.data[i].F41_CCFLG == "CC+Gift+Walt") {
                    creditCardCollection.push(apiData.data[i].F31_CCAMT);
                    giftCardCollection.push(apiData.data[i].F31_GVAMT);
                    wallet.push(apiData.data[i].F41_WLAMT);
                    giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);
                    giftVouchersUtilisedReal.push((apiData.data[i].realValue)?apiData.data[i].realValue:0);
                    if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                        UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                    }

                } else if (apiData.data[i].F41_CCFLG == "Cash+CC+Gift+Walt") {
                    cashCollection.push(apiData.data[i].F31_CASH);
                    creditCardCollection.push(apiData.data[i].F31_CCAMT);
                    giftCardCollection.push(apiData.data[i].F31_GVAMT);
                    wallet.push(apiData.data[i].F41_WLAMT);
                    giftVouchersUtilised.push(apiData.data[i].F31_GVAMT);
                    giftVouchersUtilisedReal.push((apiData.data[i].realValue)?apiData.data[i].realValue:0);
                    if (apiData.data[i].F81_RECP && apiData.data[i].F81_RECP.WALLET_TYP && apiData.data[i].F81_RECP.WALLET_TYP == "UPI") {
                        UPIAMTArray.push(apiData.data[i].F41_WLAMT);
                    }

                } else if (apiData.data[i].F41_CCFLG == "Bill To Hotel") {
                    // alert(apiData.data[i].F31_TOTAL);

                    billToHotelArray.push(apiData.data[i].F31_TOTAL);

                }
                else {

                }

            }

            for (var i = 0; i < apiData.data.length; i++) {

                if (apiData.data[i].F31_TIPSCASH == "Cash") {
                    // console.log("totalCashTips.......", apiData.data[i].F31_TIPS);
                    tipsCashArr.push(apiData.data[i].F31_TIPS);
                }
                if (apiData.data[i].F31_TIPSCC == "Credit Card") {
                    // console.log("totalCCTips.......", apiData.data[i].F31_TIPS);
                    tipsCreditCardArr.push(apiData.data[i].F31_TIPS);
                }
            }


            for (var p = 0; p < apiData.pettyCashData.length; p++) {
                pettyCashArray.push(apiData.pettyCashData[p].F_TOTAL);
            }

            var totalPettyCashAmmount = pettyCashArray.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            // $(".branchSalePettyCash").html(totalPettyCashAmmount);
            // $("#cashSpentId").val(totalPettyCashAmmount);


            var totalCashCollection = cashCollection.reduce(function (acc, score) {
                return acc + score;
            }, 0);


            // $("#cashCollection").val(totalCashCollection);

            var totalCreditCardCollection = creditCardCollection.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            // $("#creditCardCollection").val(totalCreditCardCollection);

            var totalWalletCollection = wallet.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            // $(".walletCollection").val(totalWalletCollection);



            // $("#totalCollection").val(parseInt(totalCashCollection) + parseInt(
            //     totalCreditCardCollection) + parseInt(totalWalletCollection));

            var totalGiftCardCollection = giftCardCollection.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalGiftCardCollectionReal = giftVouchersUtilisedReal.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalCashTips = tipsCashArr.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalCreditCardTips = tipsCreditCardArr.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalGiftCardTips = tipsGiftCardArr.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalOtherTips = tipsOtherArr.reduce(function (acc, score) {
                return acc + score;
            }, 0);


            // $("#TotalGiftVouchersUtilised").val(totalGiftCardCollection);
            // $("#NoOfGiftVouchersUtilised").val(giftVouchersUtilised.length);
            // $("#branchTotalSale").val(parseInt(totalCashCollection) + parseInt(
            //     totalCreditCardCollection) + parseInt(totalGiftCardCollection) +
            //     parseInt(totalWalletCollection));

            // $("#totalCashTipsId").val(totalCashTips)
            // $(".totalCreditCard").val(totalCreditCardTips)
            // $("#totalTips").val(parseInt(totalCashTips) + parseInt(totalCreditCardTips));

            for (var i = 0; i < apiData.f28_CRData.length; i++) {
                var str = apiData.f28_CRData[i].F28_GFTSTR;
                var res = str.charAt(0)
                if (res == 2) {
                    priorityCard.push(apiData.f28_CRData[i].F28_AMT);
                    // console.log(apiData.f28_CRData);
                    switch (apiData.f28_CRData[i].F28_CCFLG) {
                        case 'Cash':
                            priorityCardForCash.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Credit Card':
                            priorityCardForCreditCard.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Gift Card':
                            priorityCardForGiftCard.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Wallet':
                            priorityCardForWallet.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Walt+Cash':
                            priorityCardForWallet.push(apiData.f28_CRData[i].F28_WLAMT);
                            priorityCardForCash.push(apiData.f28_CRData[i].F28_CASH);
                            break;
                        case 'Walt+CC':
                            priorityCardForWallet.push(apiData.f28_CRData[i].F28_WLAMT);
                            priorityCardForCreditCard.push(apiData.f28_CRData[i].F28_CCAMT);
                            break;
                        case 'Bank Transfer':
                            priorityCardForWallet.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Cash+Cr.Card':
                            priorityCardForCash.push(apiData.f28_CRData[i].F28_CASH);
                            priorityCardForCreditCard.push(apiData.f28_CRData[i].F28_CCAMT);
                            break;
                        case 'Cash+Cr':
                            priorityCardForCashCr.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'FOC':
                            priorityCardForFOC.push(apiData.f28_CRData[i].F28_FOC);
                            break;
                        default:
                            console.log('This is defult for priority card');
                    }
                } else {

                    switch (apiData.f28_CRData[i].F28_CCFLG) {
                        case 'Cash':
                            giftCardForCash.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Credit Card':
                            giftCardForCreditCard.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Gift Card':
                            giftCardForGiftCard.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Wallet':
                            giftCardForWallet.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Walt+Cash':
                            giftCardForWallet.push(apiData.f28_CRData[i].F28_WLAMT);
                            giftCardForCash.push(apiData.f28_CRData[i].F28_CASH);
                            break;
                        case 'Walt+CC':
                            giftCardForWallet.push(apiData.f28_CRData[i].F28_WLAMT);
                            giftCardForCreditCard.push(apiData.f28_CRData[i].F28_CCAMT);
                            break;
                        case 'Bank Transfer':
                            giftCardForWallet.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'Cash+Cr.Card':
                            // giftCardForCashCrDot.push(apiData.f28_CRData[i].F28_AMT);
                            giftCardForCash.push(apiData.f28_CRData[i].F28_CASH);
                            giftCardForCreditCard.push(apiData.f28_CRData[i].F28_CCAMT);
                            break;
                        case 'Cash+Cr':
                            giftCardForCashCr.push(apiData.f28_CRData[i].F28_AMT);
                            break;
                        case 'FOC':
                            giftCardForFOC.push(apiData.f28_CRData[i].F28_FOC);
                            break;
                        default:
                            console.log('This is defult for gift card');
                    }

                }
            }

            var totalPriorityCardForCash = priorityCardForCash.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalPriorityCardForCreditCard = priorityCardForCreditCard.reduce(function (acc,
                score) {
                return acc + score;
            }, 0);

            var totalPriorityCardForGiftCard = priorityCardForGiftCard.reduce(function (acc,
                score) {
                return acc + score;
            }, 0);
            var totalPriorityCardForFOC = priorityCardForFOC.reduce(function (acc,
                score) {
                return acc + score;
            }, 0);

            var totalPriorityCardForWallet = priorityCardForWallet.reduce(function (acc,
                score) {
                return acc + score;
            }, 0);

            var totalPriorityCardForCashCrDot = priorityCardForCashCrDot.reduce(function (acc,
                score) {
                return acc + score;
            }, 0);

            var totalPriorityCardForCashCr = priorityCardForCashCr.reduce(function (acc,
                score) {
                return acc + score;
            }, 0);

            // Addition for Gift Card Ammount
            var totalGiftCardForCash = giftCardForCash.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalGiftCardForCreditCard = giftCardForCreditCard.reduce(function (acc,
                score) {
                return acc + score;
            }, 0);
            var totalGiftCardForFOC = giftCardForFOC.reduce(function (acc,
                score) {
                return acc + score;
            }, 0);

            var totalGiftCardForGiftCard = giftCardForGiftCard.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalGiftCardForWallet = giftCardForWallet.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalGiftCardForCashCrDot = giftCardForCashCrDot.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var totalGiftCardForCashCr = giftCardForCashCr.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var UPIAMTOtal = UPIAMTArray.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            var billToHotelTOtal = billToHotelArray.reduce(function (acc, score) {
                return acc + score;
            }, 0);

            // $("#BillToHotelId").html(billToHotelTOtal);

            // $("#BillToHotel1").val(billToHotelTOtal);

            // $("#numberOfPriorityCards").val(priorityCard.length);

            // $(".totalGiftVouchers").val(0);
            // $("#TodaysClosingGiftCard").html(totalGiftCardCollection);

            // $("#totalGiftVouchers1").val(0);

            // $(".totalPriorityCard").val(totalPriorityCardForCreditCard);

            // $("#cashBranchCollection").val(parseInt(totalCashCollection) + parseInt(
            //     totalGiftCardForCash) + parseInt(totalPriorityCardForCash));

            // $("#creditCardBranchCollection").val(parseInt(totalCreditCardCollection) + parseInt(
            //     totalPriorityCardForCreditCard) + parseInt(totalGiftCardForCreditCard));

            // $("#walletBranchCollection").val(parseInt(totalWalletCollection) + parseInt(
            //     totalPriorityCardForWallet));

            // $("#branchCollection").val(parseInt(totalCashCollection) + parseInt(
            //     totalGiftCardForCash) + parseInt(totalPriorityCardForCash) + parseInt(
            //         totalCreditCardCollection) + parseInt(totalGiftCardForCreditCard) +
            //     parseInt(totalPriorityCardForCreditCard) + parseInt(totalWalletCollection) +
            //     parseInt(totalPriorityCardForWallet));
            var totCashAmt = parseInt(totalCashCollection) + parseInt(
                totalGiftCardForCash) + parseInt(totalPriorityCardForCash);

            // $("#TodaysClosingCash").html(totCashAmt);
            // $("#TodaysClosingCreditCard").html(parseInt(totalCreditCardCollection) + parseInt(
            //     totalPriorityCardForCreditCard) + parseInt(totalGiftCardForCreditCard));
            // $(".classOfprioritycardwallet").val(totalPriorityCardForWallet);
            // $(".sumOfCashForPriority").val(totalPriorityCardForCash);
            // $(".totalPriorityCardForCash").val(parseInt(totalPriorityCardForCash) + parseInt(
            //     totalPriorityCardForCreditCard));
            // $(".totalPriorityCardForCreditCard").val(totalPriorityCardForCreditCard);
            // $(".sumOfGiftCardCreditCard").val(totalGiftCardForCreditCard);
            // $(".totalGiftCardForCC").val(totalGiftCardForCreditCard);
            // $("#TodaysClosingWallet").html(parseInt(totalWalletCollection) + parseInt(
            //     totalPriorityCardForWallet));


            var envelopeAmount = parseInt(totCashAmt) - parseInt(
                totalPettyCashAmmount);

            // $(".envelopePettyClass").html(envelopeAmount);

            // $("#cashEnvelopeId").val(envelopeAmount);

            // $(".UPIAmtClass").html(UPIAMTOtal);
            // $("#UPIAmtTotal").val(UPIAMTOtal);
            var dailyClosingArr = [];
            var obj1 = {
                title: "Branch Therapy Sale",
                titleShort: "Sale Thrp",
                count: apiData.data.length,
                cash: totalCashCollection,
                creditCard: totalCreditCardCollection,
                wallet: totalWalletCollection,
                total: (parseInt(totalCashCollection) + parseInt(
                    totalCreditCardCollection) + parseInt(totalWalletCollection))
            };
            var obj2 = {
                title: "Gift Vouchers Utilised",
                titleShort: "GV Util.",
                count: giftVouchersUtilised.length,
                cash: 0,
                creditCard: 0,
                wallet: 0,
                total: totalGiftCardCollection
            };
            var obj3 = {
                title: "Branch Total Sale",
                titleShort: "TotalSale",
                count: 0,
                cash: 0,
                creditCard: 0,
                wallet: 0,
                total: (parseInt(totalCashCollection) + parseInt(
                    totalCreditCardCollection) + parseInt(totalGiftCardCollection) +
                    parseInt(totalWalletCollection))
            };
            var obj4 = {
                title: "Gift Vouchers",
                titleShort: "Gift Vou.",
                count: 0,
                cash: totalGiftCardForCash,
                creditCard: totalGiftCardForCreditCard,
                wallet: totalGiftCardForWallet,
                foc: totalGiftCardForFOC,
                total: (parseInt(
                    totalGiftCardForCash) + parseInt(totalGiftCardForCreditCard) + parseInt(totalGiftCardForWallet))
            };
            var obj5 = {
                title: "Priority Cards",
                titleShort: "Priority",
                count: priorityCard.length,
                cash: totalPriorityCardForCash,
                creditCard: totalPriorityCardForCreditCard,
                wallet: totalPriorityCardForWallet,
                foc: totalPriorityCardForFOC,
                total: (parseInt(totalPriorityCardForCash) + parseInt(
                    totalPriorityCardForCreditCard) + parseInt(totalPriorityCardForWallet))
            };
            var obj6 = {
                title: "Branch Collection",
                titleShort: "Brn Coll.",
                count: 0,
                cash: (parseInt(totalCashCollection) + parseInt(
                    totalGiftCardForCash) + parseInt(totalPriorityCardForCash)),
                creditCard: (parseInt(totalCreditCardCollection) + parseInt(
                    totalPriorityCardForCreditCard) + parseInt(totalGiftCardForCreditCard)),
                wallet: (parseInt(totalWalletCollection) + parseInt(
                    totalPriorityCardForWallet) + parseInt(totalGiftCardForWallet)),
                total: (parseInt(totalCashCollection) + parseInt(
                    totalGiftCardForCash) + parseInt(totalPriorityCardForCash) + parseInt(
                        totalCreditCardCollection) + parseInt(totalGiftCardForCreditCard) +
                    parseInt(totalPriorityCardForCreditCard) + parseInt(totalWalletCollection) +
                    parseInt(totalPriorityCardForWallet) + parseInt(totalGiftCardForWallet))
            };
            var obj7 = {
                title: "Tips",
                titleShort: "Tips",
                count: 0,
                cash: totalCashTips,
                creditCard: totalCreditCardTips,
                wallet: 0,
                total: (parseInt(totalCashTips) + parseInt(totalCreditCardTips))
            };

            dailyClosingArr.push(obj1, obj2, obj3, obj4, obj5, obj6, obj7);

            var dailyClosingSummary = [
                { title: "Cash", value: totCashAmt },
                { title: "Credit Card", value: (parseInt(totalCreditCardCollection) + parseInt(totalPriorityCardForCreditCard) + parseInt(totalGiftCardForCreditCard)) },
                { title: "Gift Card Utilised", value: totalGiftCardCollection },
                {
                    title: "Wallet", value: (parseInt(totalWalletCollection) + parseInt(
                        totalPriorityCardForWallet) + parseInt(
                            totalGiftCardForWallet))
                },
                { title: "UPI AMT", value: UPIAMTOtal },
                { title: "Bill To Hotel", value: billToHotelTOtal },
                { title: "Cash Spent", value: totalPettyCashAmmount },
                { title: "Cash Envelope", value: envelopeAmount },
            ]

            var dailyClosingObj = {
                F_THRPTOT: obj1.count,
                F_DATE: new Date(apiData.taskDate),
                F_SLCASH: obj1.cash,
                F_SLCC: obj1.creditCard,
                F_SLWL: (obj1.wallet) ? obj1.wallet : 0,
                F_THRPGV: obj2.count,
                F_GVUTIL: obj2.total,
                F_GVUTILREAL:totalGiftCardCollectionReal,
                F_TOTSALE: obj3.total,
                F_GVSALE: obj4.count,
                F_SLGVCASH: obj4.cash,
                F_SLGVCC: obj4.creditCard,
                F_SLGVFOC: obj4.foc,
                F_SLGVWL: obj4.wallet,
                F_PCCASH: obj5.cash,
                F_PCCC: obj5.creditCard,
                F_PCWL: obj5.wallet,
                F_CSHRCV: obj6.cash,
                F_CCRCV: obj6.creditCard,
                F_TIPS: parseInt(totalCashTips),
                F_CTIPS: parseInt(totalCreditCardTips),
                CC_STLNO: 0,
                cashSpent: totalPettyCashAmmount,
                cashEnvelope: envelopeAmount,
                UPIAmt: UPIAMTOtal,
                BillToHotel: billToHotelTOtal,
                CC_HDFC: 0,
                CC_AMEX: 0,
                CC_STLTIP: 0,
                NXT_APPTSH: 0,
                F_CLOSEREM: "",
                RPT_TOTAL:( obj1.cash+obj1.creditCard+((obj1.wallet) ? obj1.wallet : 0)+totalGiftCardCollectionReal),
                RPT_THP:obj1.count,
                ST_BRN: apiData.branch,
                "F_TIME": (("00" + new Date().getHours()).slice(-2)) + ":" + (("00" + new Date().getMinutes()).slice(-2)),
                "F_CLOSEDT": baseExport.convertToDateNew(baseExport.dateFormat(new Date())),
                "F_CLOSETM": (("00" + new Date().getHours()).slice(-2)) + ":" + (("00" + new Date().getMinutes()).slice(-2)),
                "ST_BRN": apiData.branch,
                "F_CLOSEYN": "Y",
                "F_CLOSEID": (apiData.branch === "IN008") ? 157 : 2,
            }
            var dataAll = { dailyClosingData: dailyClosingArr, summary: dailyClosingSummary, returnData: dailyClosingObj };
            cb(null, dataAll);
        // }
    // }
    // else {
    //     cb(null, null);
    // }
}

function sendTherapyDoneSMS(branch, cb) {
    var today=baseExport.convertToDateNew(baseExport.dateFormat(new Date()));
    F91_ATTDModel.find({ST_BRN:branch,F51_DATE:today,"F51_RATING" : "Therapist","F51_ATTD" : "P"},function(err,data){
        if(err){
            cb(err);
        }
        data=JSON.parse(JSON.stringify(data));
        async.eachSeries(data,function(item,cb2){
            F21_STAFModel.findOne({F21_IDNO:parseInt(item.F51_IDNO),F21_MOBILE:{$exists:true,$ne:""}},{F21_FNAME:1,F21_IDNO:1,F21_MOBILE:1},{},function(err,dataStaff){
                if(err){
                  cb2(err);
                }
                dataStaff=JSON.parse(JSON.stringify(dataStaff));
                if(dataStaff){
                  stDataModel.F61_APPTModel.find({"therapist.id":dataStaff.F21_IDNO,F31_APPTDT:today,ST_BRN:branch,"REC_YN" : "Y"},function(err,therapyData){
                    if(err){
                      cb2(err);
                    }
                    therapyData=JSON.parse(JSON.stringify(therapyData));
                    if(therapyData.length>0){
                        var str1='';
                        var str2='';
                        var tempStr='';
                        var paddStr='';
                      for(var i=0;i<therapyData.length;i++){
                        tempStr+=therapyData[i].F31_TCODE;
                        if(tempStr.lengt>30){
                            str2+=paddStr+therapyData[i].F31_TCODE;
                        }else{
                            str1+=paddStr+therapyData[i].F31_TCODE;
                            paddStr=',';
                        }
                      }
                      var subject='Dear '+dataStaff.F21_FNAME+',\n\nYou have done '+therapyData.length+' therapies today.\n\n'+str1+'\n'+str2+'\n\nTeam SukhoThai';
                      q.all([baseExport.globalSendSMS2(subject, dataStaff.F21_MOBILE, dataStaff.F21_FNAME, "SUKHOTHAI STAFF THERAPY",'1607100000000239905')]).then(function (msgInfo) {
                        cb2();
                      });
                    }else{
                      cb2();
                    }
                  })
                }else{
                  cb2();
                }
              });
        },function(err){
            if(err){
                cb(err);
            }
            cb();
        })
    });
  }


