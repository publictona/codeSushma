/**
 * @Author:Sushma Landge
 */

/***********************
 CORE PACKAGES
 **********************/
 const express = require('express');
 var q = require('q');
 var jwt = require('jsonwebtoken');
 var util = require('../routes/util.js');
 var baseExport = require('../baseExporter.js');
 
 /*********************
  MODULE PACKAGES
  ********************/
 
 const F21_SLMSModel = require('../models/F21_SLMSModel.js');
 var model = require('../models/assetTransactionModel.js');
 var assetMasterModel = require('../models/assetMasterModel.js');
 
 module.exports = {
 
 // create: function (req, res) {
 //         try {
 //             req.body.tranID = req.session.user.uid;
 //             req.body.tranDt = new Date();
 //             //req.body.tranNo = tranNo
 
 //             var { tranNo, tranID, tranDt, F21_SRNO, F21_FNAME, F21_MNAME, F21_SNAME, F21_DEPT, F21_BRANCH, Asset_Trans } = req.body
 //             //req.body.meetingDate = baseExport.convertToDateNew(req.body.meetingDate);
 //             model.findOne({}).sort({ tranNo: -1 }).exec(async function (err, data1) {
 //                 if (err) {
 //                     console.log(err)
 //                 }
 //                 data1 = JSON.parse(JSON.stringify(data1));
 //                 if (data1) {
 //                     req.body.tranNo = data1.tranNo + 1;
 //                 } else {
 //                     req.body.tranNo = 1;
 //                 }
 //                 console.log("tranNo" , tranNo)
 
 //                 var dataDoc = new model({
 //                     tranNo: req.body.tranNo,
 //                     tranID: tranID ? tranID : "",
 //                     tranDt: tranDt ? tranDt : "",
 //                     F21_SRNO: F21_SRNO ? F21_SRNO : "",
 //                     F21_FNAME: F21_FNAME ? F21_FNAME : "",
 //                     F21_MNAME: F21_MNAME ? F21_MNAME : "",
 //                     F21_SNAME: F21_SNAME ? F21_SNAME : "",
 //                     F21_DEPT: F21_DEPT ? F21_DEPT : "",
 //                     F21_BRANCH: F21_BRANCH ? F21_BRANCH : "",
 //                     Asset_Trans: Asset_Trans ? Asset_Trans : "",
 //                     DBFNAME: "assetTransaction",
 
 //                 });
 //                 console.log("dataDocdataDoc",dataDoc)
 
 
 //                 var data = await dataDoc.save()
 //                 res.status(200).send({ status: true, msg: "data saved", data })
 
 //             })
 
 
 //         } catch (err) {
 //             console.log(err);
 //             res.status(500).send({ msg: msg.err })
 //         }
 //     },
 
 
 create:  function (req, res) {
     try {
         req.body.tranID = req.session.user.uid;
         req.body.tranDt = new Date();
         //req.body.tranNo = tranNo
         req.body.assetType 
 
         var { tranNo, tranID, tranDt, F21_SRNO, F21_FNAME, F21_MNAME, F21_SNAME, F21_DEPT, F21_BRANCH, Asset_Trans , assetType } = req.body
         //req.body.meetingDate = baseExport.convertToDateNew(req.body.meetingDate);
       //  var existingDepartment = await model.findOne({ assetType: assetType});
         model.findOne({}).sort({ tranNo: -1 }).exec(async function (err, data1) {
             if (err) {
                 console.log(err)
             }
             data1 = JSON.parse(JSON.stringify(data1));
             if (data1) {
                 req.body.tranNo = data1.tranNo + 1;
             } else {
                 req.body.tranNo = 1;
             }
             //console.log("tranNo" , tranNo)
 
             var dataDoc = new model({
                 tranNo: req.body.tranNo,
                 tranID: tranID ? tranID : "",
                 tranDt: tranDt ? tranDt : "",
                 F21_SRNO: F21_SRNO ? F21_SRNO : "",
                 F21_FNAME: F21_FNAME ? F21_FNAME : "",
                 F21_MNAME: F21_MNAME ? F21_MNAME : "",
                 F21_SNAME: F21_SNAME ? F21_SNAME : "",
                 F21_DEPT: F21_DEPT ? F21_DEPT : "",
                 F21_BRANCH: F21_BRANCH ? F21_BRANCH : "",
                 Asset_Trans: Asset_Trans ? Asset_Trans : "",
                 assetType: assetType ? assetType: "",
 
                 DBFNAME: "assetTransaction",
 
             });
             
             
             var data = await dataDoc.save()
             res.status(200).send({ status: true, msg: "data saved", data })
             console.log("dataDocdataDoc",data)
 
         })
 
 
     } catch (err) {
         console.log(err);
         res.status(500).send({ msg: msg.err })
     }
 },
 
 
 
 
 
     griddata: async function (req, res) {
         try {
            // console.log("sssssssssssssssssss" ,req.body);
             var query = {};
             var limit = req.body.limit ? parseInt(req.body.limit) : 500;
             var search_by = req.body.search_by ? req.body.search_by : "";
             var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
             var order = req.body.order ? req.body.order : "asc";
             var page = req.body.page ? parseInt(req.body.page) : 0;
             var columns = req.body.columns ? req.body.columns : [];
             var filter_columns = {};
             var draw = req.body.draw ? parseInt(req.body.draw) : 1;
             var start = req.body.start ? parseInt(req.body.start) : 0;
 
             if (req.body.search_query) {
                 var search_query = req.body.search_query;
 
                 if (search_query.F21_BRANCH) {
                     query.F21_BRANCH = search_query.F21_BRANCH;
                 }
                 
                 if (search_query.assetType) {
                     console.log("search_query.assetType" ,search_query.assetType);
                     query.assetType = search_query.assetType;
                 }
 
             } else {
             }
 
 
             var table_format = req.body.table_format ? req.body.table_format : "datatable";
 
             q.all(baseExport.grid('assetTransaction', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                 res.json(result);
             });
 
         } catch (err) {
 
         }
     },
 
     getData: async function (req, res) {
         try {
             var id = req.query.id;
             var data = await model.findById(id);
             //res.json(data);
             res.status(200).json({ status: true, msg: "data saved", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     update: async function (req, res) {
         try {
             var obj = req.body;
 
             var dataSet = {
                 "tranNo": obj.tranNo ? obj.tranNo : "",
                 "tourSeries": obj.tourSeries,
                 "supplier_no": obj.supplier_no,
                 "supplier": obj.supplier,
                 "suppliercat": obj.suppliercat,
                 "uploadFile": obj.uploadFile,
                 "actionDoneBy": req.session.user.uid,
             }
 
             var data = await model.findByIdAndUpdate(req.params.id, { $set: obj, $addToSet: { Actions: dataSet } }, { new: true }); //$addToSet: { Actions: obj.tourSeries }
 
             res.status(200).json({ status: true, msg: "data updated", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     //for Supplier Detail F_CATCODE
     getsupplierDetails: async function (req, res) {
         try {
             var obj = req.body;
             var ST_BRNMSResult = await model.findOne({ F_HLPNAME: obj.F_HLPNAME, F_CATCODE: obj.F_CATCODE });
             //console.log(ST_BRNMSResult)
             return res.status(200).json({
                 "Data": ST_BRNMSResult
             })
         } catch (error) {
             console.log(error);
         }
     },
 
     getPlaces: function (req, res) {
         var F_CATCODE = req.params.id;
         model.find({ F_CATCODE: F_CATCODE }).distinct(("F_PLACECD"), function (err, data) {
             if (err) {
                 res.status(500).json({ status: false, msg: err });
             }
             //  console.log("datadatadata", data)
             res.status(200).json({ status: true, data: data });
         })
     },
 
 
 
     getF21Details: function (req, res) {
         var F21_SRNO = req.params.id;
         F21_SLMSModel.findOne({ F21_SRNO }, function (err, Data) {
             if (!err) {
 
                 return res.json({ data: Data });
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         }).select("F21_SRNO F21_FNAME F21_SNAME F21_MNAME F21_DEPT F21_SECT F21_BRANCH");
     },
 
     getItemCode: function (req, res) {
         assetMasterModel.find({}).distinct(("itemCode"), function (err, data) {
             if (!err) {
 
                 return res.json(data);
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         });
     },
 
     getItemCodeFixed: function (req, res) {
         assetMasterModel.find({ assetType: "FIXED ASSET" }).distinct(("itemCode"), function (err, data) {
             if (!err) {
 
                 return res.json(data);
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         });
     },
 
     getItemCodeNonFixed: function (req, res) {
         assetMasterModel.find({ assetType: "NON-FIXED ASSET" }).distinct(("itemCode"), function (err, data) {
             if (!err) {
 
                 return res.json(data);
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         });
     },
 
     getStaffDetails: function (req, res) {
         F21_SLMSModel.find({}), function (err, data) {
             if (!err) {
 
                 return res.json(data);
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         }.select("F21_SRNO F21_FNAME F21_SNAME")
     },
 
     getitemCodeDesDetails: function (req, res) {
         var itemCode = req.params.id;
         assetMasterModel.findOne({ itemCode }, function (err, Data) {
             if (!err) {
                 return res.json({ data: Data });
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         }).select("itemCode itemDesc");
     },
 
     //get checklist Print
     getWeddingPlanChecklistPrint: async function (req, res) {
         try {
 
             var weddingPlanData = await model.findById(req.body.id).lean();
             res.render('assetTransaction/assetTranDetails', weddingPlanData, function (err, html) {
                 if (err) {
                     console.log(err);
                     res.status(500).json({ status: false, message: err.message });
                 }
                 res.status(200).json({ status: true, message: "", html: html });
             });
         } catch (err) {
             res.status(500).send('Error retrieving wedding plan data.');
         }
     },
 
 }
 
 