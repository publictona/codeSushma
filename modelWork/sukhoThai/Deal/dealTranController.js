var dealMaster = require('../models/DEAL_MSTModel.js');
var dealTrnSchema = require('../models/DEAL_TRNModel.js');
var ST_BRNMSModel = require('../models/ST_BRNMSModel.js');
var _ = require('underscore');
const debug = require('debug')('ERP:server');
var q = require('q');
var baseExport = require('../baseExporter.js');
var moment = require('moment');

module.exports = {

    dealTransactionMaster: (req, res) => {
        // console.log(req.body);
        return res.status(200).json({
            "Data": "Successfully get the data"
        });
    },


    dealTransactionMasterDocument: function (req, res) {
        try {
            var { F_TRANNO, F_TRANDT, F_ACCTCD, F_ACCTCDNO, F_DEALNO, F_VLDDT1, F_VLDDT2, F_DEALAMT, F_DEALFLG, F_SPALOCN } = req.body;;
           // req.body.meetingDate = baseExport.convertToDateNew(req.body.meetingDate);

           var query = {
            F_ACCTCD: { $in: [req.body.F_ACCTCD] }
        }

        dealTrnSchema.findOne({}).sort({ F_TRANNO: -1 }).exec(function (err, data1) {
                if (err) {
                }
                data1 = JSON.parse(JSON.stringify(data1));
                if (data1 != null) {
                    req.body.F_TRANNO = data1.F_TRANNO + 1;
                } else {
                    req.body.F_TRANNO = 1;
                }

                

                // dealTrnSchema.findOne({}).sort({ F_ACCTCDNO: -1 }).exec(function (err, accCodeNo) {
                //     if (err) {
                //         console.log(err)
                //     }


                    dealTrnSchema.findOne(query, { F_ACCTCDNO: 1 }, { sort: { F_ACCTCDNO: -1 } }, async function (err, accCodeNo) {
                        if (err) {
                            console.log(err)

                        }
                       //var  F_ACCTCDNO = 1;
                       accCodeNo = JSON.parse(JSON.stringify(accCodeNo));
                       if (accCodeNo != null) {
                           req.body.F_ACCTCDNO = accCodeNo.F_ACCTCDNO + 1;
                        } else {
                            req.body.F_ACCTCDNO = 1;
                        }
                        console.log("accCodeNo.F_ACCTCDNO",F_ACCTCDNO)

                        // var F_ACCTCDNO = 1;
                        // if (accCodeNo && accCodeNo.F_ACCTCDNO) {
                        //     F_ACCTCDNO = accCodeNo.F_ACCTCDNO + 1;
                        // }

                      req.body.F_DEALNO = `${F_ACCTCD}00${F_ACCTCDNO}`;
                      console.log( "F_DEALNO",req.body.F_DEALNO)
       


                console.log("accCodeNoaccCodeNo" , accCodeNo)

                dealTrnSchema.create(req.body, function (err) {
                    if (err) {
                        res.status(500).send({ status: false, msg: err, })
                    }
                    res.status(200).send({ status: true, msg: "data saved", })
                })

            })
        })

    } catch (err) {
            console.log(err);
            res.status(500).send({ msg: msg.err })
        }
    },

  // dealTransactionMasterDocument: async function (req, res) {
    //     try {
    //         var { F_TRANNO, F_TRANDT, F_ACCTCD, F_DEALNO, F_VLDDT1, F_VLDDT2, F_DEALAMT, F_DEALFLG, F_SPALOCN } = req.body;;

    //         var result = await dealTrnSchema.findOne({ F_TRANNO: parseInt(F_TRANNO) });
    //         if (result) {

    //             //console.log(result);
    //             dealTrnSchema.findOneAndUpdate({ F_TRANNO: parseInt(F_TRANNO) }, { $set: (req.body) }, {}, function (error) {
    //                 if (error) {
    //                     return res.status(500).json({
    //                         "Data": "Unsuccessful, Not Updated shipment Details"
    //                     });
    //                 } else {
    //                     return res.status(200).json({
    //                         "Data": "Successfully Updated shipment Details"
    //                     });
    //                 }
    //             });
    //         } else {
    //             // console.log(req.body);
    //             dealTrnSchema.findOne({}, {}, { sort: { F_TRANNO: -1 } }, async function (err, dataTran) {
              
    //                 console.log("fdfgfdfF_TRANNO",F_TRANNO)
    //                 var F_TRANNO = 1;
    //                 if (dataTran && dataTran.F_TRANNO) {
    //                     F_TRANNO = dataTran.F_TRANNO + 1;
    //                 }
    //                 console.log("dataTrandataTran",dataTran)
    //                 dataTran = JSON.parse(JSON.stringify(dataTran));
    //                F_DEALNO = `${F_ACCTCD}00${F_TRANNO.toString().padStart(3, '0')}`;
    //                // F_DEALNO = parseInt(`${F_ACCTCD}00${F_TRANNO.toString().padStart(3, '0')}`);


    //                 var shipmentDoc = new dealTrnSchema({
    //                     F_TRANNO: F_TRANNO,
    //                     F_TRANDT: F_TRANDT,
    //                     F_ACCTCD: F_ACCTCD,
    //                     F_DEALNO: F_DEALNO,
    //                     F_VLDDT1: F_VLDDT1,
    //                     F_VLDDT2: F_VLDDT2,
    //                     F_DEALAMT: F_DEALAMT,
    //                     F_DEALFLG: F_DEALFLG,
    //                     F_SPALOCN: F_SPALOCN,
    //                 });
    //                 var result = await shipmentDoc.save();
    //                 console.log("resultresultresult",result)

    //                 return res.status(200).json({
    //                     "Data": "Successfully Saved shipment Details"
    //                 });
    //             });
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },



    // dealTransactionMasterDocument: async function(req, res){
    //     try {
    //         var {F_TRANNO,F_TRANDT,F_ACCTCD,F_DEALNO,F_VLDDT1 ,F_VLDDT2 ,F_DEALAMT , F_DEALFLG,F_SPALOCN } = req.body;

    //         var result = await dealTrnSchema.findOne({F_TRANNO:parseInt(F_TRANNO)});
    //         if(result){

    //              //console.log(result);
    //             dealTrnSchema.findOneAndUpdate({F_TRANNO:parseInt(F_TRANNO)}, {$set:(req.body)}, {}, function(error){
    //                 if(error){
    //                     return res.status(500).json({
    //                         "Data": "Unsuccessful, Not Updated Details"
    //                     });
    //                 }else{
    //                     return res.status(200).json({
    //                         "Data": "Successfully Updated Details"
    //                     }); 
    //                 }
    //             });
    //         }else{
    //             // console.log(req.body);
    //             dealTrnSchema.findOne({},{},{sort:{F_TRANNO:-1}},async function (err,dataTran){
    //             dataTran=JSON.parse(JSON.stringify(dataTran));

    //             var F_TRANNO = 1;
    //             if(dataTran && dataTran.F_TRANNO){
    //                 F_TRANNO = dataTran.F_TRANNO+1; 
    //             }

    //              F_DEALNO = `${F_ACCTCD}00${F_TRANNO.toString().padStart(3, '0')}`;

    //             var shipmentDoc = new dealTrnSchema({
    //             F_TRANNO:F_TRANNO,
    //             F_TRANDT:F_TRANDT,
    //             F_ACCTCD:F_ACCTCD,
    //             F_DEALNO:F_DEALNO,
    //             F_VLDDT1:F_VLDDT1,
    //             F_VLDDT2:F_VLDDT2,
    //             F_DEALAMT:F_DEALAMT,
    //             F_DEALFLG:F_DEALFLG,
    //             F_SPALOCN:F_SPALOCN,
    //            });

    //            console.log("shipmentDocshipmentDoc" , shipmentDoc)

    //             var result = await shipmentDoc.save();

    //             return res.status(200).json({
    //                 "Data": "Successfully Saved  Details",
    //                 data:result
    //             });  
    //         });
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },

 getdealTransactionrDocument: async function (req, res) {
        try {
            var obj = {};
            var result = await dealTrnSchema.find(obj);
            // console.log(result);

            return res.status(200).json({
                "Data": result
            });

        } catch (error) {
            console.log(error)
        }
    },

    getdealTransactionDataById: async function (req, res) {
        try {
            var obj = req.body;
            var result = await dealTrnSchema.findOne({ F_TRANNO: parseInt(obj.F_TRANNO) });

            return res.status(200).json({
                "Data": result
            });
        } catch (error) {
            console.log(error);
        }
    },

    getdealTransactionBranchDetails: async function (req, res) {
        try {
            var obj = req.body;
            var ST_BRNMSResult = await ST_BRNMSModel.findOne({ ST_BRN: obj.ST_BRN });
            //console.log(ST_BRNMSResult)
            return res.status(200).json({
                "Data": ST_BRNMSResult
            })
        } catch (error) {
            console.log(error);
        }
    },

    // getdealTransactionBranchDetails: async function (req, res) {
    //     try {
    //         var obj = req.body;
    //         var ST_BRNMSResult = await ST_BRNMSModel.findOne({ ST_BRN: obj.ST_BRN });
    //         //console.log(ST_BRNMSResult)
    //         return res.status(200).json({
    //             "Data": ST_BRNMSResult
    //         })
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },

    getAccountCode: async function (req, res) {
        try {

            var Result = await dealMaster.find({}).select('F_ACCTCD');
            console.log("ResultResultResultResult", Result)
            return res.status(200).json({
                "Data": Result
            })
        } catch (error) {
            console.log(error);
        }
    },

    getAccCode: function (req, res) {
        dealMaster.find({}).distinct(("F_ACCTCD"), function (err, F_SUPMST) {
            if (!err) {
                console.log(err)
                return res.json(F_SUPMST);
            } else {
                return res.json(500, {
                    message: 'Error getting Zone.'
                });
            }
        });
    },


    //get checklist Print
    getdealTransactionPrint: async function (req, res) {
        try {

            var shipmentData = await dealTrnSchema.findById(req.body.id).lean();
            res.render('shipment/shipmentPrint', { data: shipmentData }, function (err, html) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: false, message: err.message });
                }
                res.status(200).json({ status: true, message: "", html: html });
            });
        } catch (err) {
            res.status(500).send('Error retrieving shipment data.');
        }
    },


    gridData: async function (req, res) {
        try {
            // console.log(req.body);
            var query = {};
            var limit = req.body.limit ? parseInt(req.body.limit) : 500;
            var search_by = req.body.search_by ? req.body.search_by : "";
            var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
            var order = req.body.order ? req.body.order : "asc";
            var page = req.body.page ? parseInt(req.body.page) : 0;
            var columns = req.body.columns ? req.body.columns : [];
            var filter_columns = {};
            // var sort_by = "_id";
            // var order = "desc";
            var draw = req.body.draw ? parseInt(req.body.draw) : 1;
            var start = req.body.start ? parseInt(req.body.start) : 0;

            if (req.body.search_query) {
                var search_query = req.body.search_query;

            } else {
            }
            var table_format = req.body.table_format ? req.body.table_format : "datatable";

            q.all(baseExport.grid('DEAL_TRN', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                //console.log("rrrrrrrrrrrrrr" , result)
                res.json(result);
            });

        } catch (err) {

            console.log("eeeeeeeerrrrrrrrr", err)

        }
    },

};