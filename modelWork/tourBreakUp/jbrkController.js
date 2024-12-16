/**
 * @Author: Sushma Landge.
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
 
 const model = require('../models/LTC_KMSModel.js');
 var JBRK_TURModel = require('../models/JBRK_TURModel.js')
 var JBRK_DTLModel = require('../models/JBRK_DTLModel.js')
 
 module.exports = {
 
 
 
     create: function (req, res) {
         try {
 
             req.body.F_TRANID = req.session.user.uid;
             //req.body.F_DELID = new Date();
             req.body.F_TRANDT = new Date();
             // req.body.F_DELDT = baseExport.convertToDateNew(req.body.meetingDate);;
             JBRK_TURModel.findOne({}).sort({ F_TRANNO: -1 }).exec(function (err, data1) {
                 if (err) {
                     // Handle the error appropriately
                     res.status(500).send({ status: false, msg: err });
                     return;
                 }
 
                 data1 = JSON.parse(JSON.stringify(data1));
                 let nextF_TRANNO;
 
                 if (data1 != null) {
                     nextF_TRANNO = data1.F_TRANNO + 1;
                 } else {
                     nextF_TRANNO = 1;
                 }
 
                 // Set F_TRANNO and F_MSTNO for the range 1-5
                 req.body.F_TRANNO = nextF_TRANNO;
                 // req.body.F_MSTNO = Math.ceil(nextF_TRANNO / 5);
 
                 // Increment F_MSTNO
                 JBRK_TURModel.findOne({}).sort({ F_MSTNO: -1 }).exec(function (err, data2) {
                     if (err) {
                         res.status(500).send({ status: false, msg: err });
                         return;
                     }
 
                     data2 = JSON.parse(JSON.stringify(data2));
                     let nextF_MSTNO;
 
                     if (data2 != null) {
                         nextF_MSTNO = data2.F_MSTNO + 1;
                     } else {
                         nextF_MSTNO = 1;
                     }
 
                     req.body.F_MSTNO = nextF_MSTNO;
 
                     // Create the record
                     JBRK_TURModel.create(req.body, function (err) {
                         if (err) {
                             res.status(500).send({ status: false, msg: err });
                             return;
                         }
 
                         res.status(200).send({ status: true, msg: "data saved" });
                     });
                 });
             });
         } catch (err) {
             console.log(err);
             res.status(500).send({ msg: "Internal Server Error" });
         }
     },
 
     griddata: async function (req, res) {
         try {
             // console.log(req.body);
             var query = {};
             var limit = req.body.limit ? parseInt(req.body.limit) : 500;
             var search_by = req.body.search_by ? req.body.search_by : "";
             //var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
 
             var sort_by = "F_TRANNO";
             //var sort_by = "F_MSTNO";
             var order = "desc";
             // var order = req.body.order ? req.body.order : "asc";
             var page = req.body.page ? parseInt(req.body.page) : 0;
             var columns = req.body.columns ? req.body.columns : [];
             var filter_columns = {};
             var draw = req.body.draw ? parseInt(req.body.draw) : 1;
             var start = req.body.start ? parseInt(req.body.start) : 0;
 
             if (req.body.search_query) {
                 var search_query = req.body.search_query;
 
             } else {
             }
             var table_format = req.body.table_format ? req.body.table_format : "datatable";
 
             q.all(baseExport.grid('JBRK_TUR', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                 res.json(result);
             });
 
         } catch (err) {
 
         }
     },
 
     getData: async function (req, res) {
         try {
             var id = req.query.id;
             var data = await JBRK_TURModel.findById(id);
             //res.json(data);
             res.status(200).json({ status: true, msg: "data saved", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     update: async function (req, res) {
         try {
             var obj = req.body;
             var data = await JBRK_TURModel.findByIdAndUpdate(req.params.id, { $set: obj }, { new: true }); //$addToSet: { Actions: obj.tourSeries }
 
             res.status(200).json({ status: true, msg: "data updated", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     show_F_MSTNO_details: function (req, res) {
         var id = req.params.id;
         JBRK_DTLModel.find({ F_MSTNO: parseInt(id) }).select({ F_TRANNO: 1, F_MSTNO: 1, F_FROM: 1, F_TO: 1, F_DIST: 1 }).exec(function (err, data) {
             if (err) {
                 return res.json(500, {
                     message: 'Error getting details.'
                 });
             }
             //console.log("resultresult" , data)
             res.status(200).json({ status: 200, data: data });
         })
     },
 
     deleteTour: async function (req, res) {
         try{
             var obj = req.body;
             console.log(obj);
             var setObj={
                 F_DELID :req.session.user.uid,
                 F_DELDT : new Date()
             }
             console.log(setObj);
            
             JBRK_TURModel.update({_id:req.body.id},{$set:setObj},function(err){
                 if(err){
                     console.log(err);
                     }
                 res.status(200).json({ status: true, msg: "data deleted" }); 
             })
           
                               
 
         } catch(err){
             console.log(err)
         }
      },
 
 
 
     // ------------------------------Journey BreakUp Api------------------------------------
     createNewJourney: function (req, res) {
         try {
             var obj = req.body;
             var { F_TRANNO, F_MSTNO, F_FROM, F_TO, F_DIST, F_DELID, F_DELDT } = obj;
             F_MSTNO=parseInt(F_MSTNO);
             F_DIST=parseInt(F_DIST);
             JBRK_DTLModel.findOne({F_MSTNO:parseInt(F_MSTNO)}).sort({ F_TRANNO: -1 }).exec(async function (err, data1) {
                 if (err) {
                     res.status(500).send({ status: false, msg: err });
                     return;
                 }
                 data1 = JSON.parse(JSON.stringify(data1));
                 var nextF_TRANNO = 1;
                 if (data1) {
                     nextF_TRANNO = data1.F_TRANNO + 1;
                 }
                 F_TRANNO = nextF_TRANNO;
                
                 var dataDoc = new JBRK_DTLModel({
                     F_TRANNO: F_TRANNO ? F_TRANNO : "",
                     F_MSTNO: F_MSTNO ? F_MSTNO : "",
                     F_FROM: F_FROM ? F_FROM : "",
                     F_TO: F_TO ? F_TO : "",
                     F_DIST: F_DIST ? F_DIST : "",
                     F_DELID: F_DELID ? F_DELID : "",
                     F_DELDT: F_DELDT ? F_DELDT : "",
                     DBFNAME: "JBRK_DTL",
 
 
                 });
                 console.log({
                     F_TRANNO: F_TRANNO ? F_TRANNO : "",
                     F_MSTNO: F_MSTNO ? F_MSTNO : "",
                     F_FROM: F_FROM ? F_FROM : "",
                     F_TO: F_TO ? F_TO : "",
                     F_DIST: F_DIST ? F_DIST : "",
                     F_DELID: F_DELID ? F_DELID : "",
                     F_DELDT: F_DELDT ? F_DELDT : "",
                     DBFNAME: "JBRK_DTL",
 
 
                 });
                 var data = await dataDoc.save()
                 res.status(200).send({ status: true, msg: "data saved", data })
             });
 
         
         } catch (err) {
             console.log(err);
             res.status(500).send({ msg: "Internal Server Error" });
         }
     },
 
     griddataNewJourney: async function (req, res) {
         try {
             // console.log(req.body);
             var query = {};
             var limit = req.body.limit ? parseInt(req.body.limit) : 500;
             var search_by = req.body.search_by ? req.body.search_by : "";
             //var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
 
             var sort_by = "F_TRANNO";
             //var sort_by = "F_MSTNO";
             var order = "desc";
             // var order = req.body.order ? req.body.order : "asc";
             var page = req.body.page ? parseInt(req.body.page) : 0;
             var columns = req.body.columns ? req.body.columns : [];
             var filter_columns = {};
             var draw = req.body.draw ? parseInt(req.body.draw) : 1;
             var start = req.body.start ? parseInt(req.body.start) : 0;
 
             if (req.body.search_query) {
                 var search_query = req.body.search_query;
 
             } else {
             }
             var table_format = req.body.table_format ? req.body.table_format : "datatable";
 
             q.all(baseExport.grid('JBRK_DTL', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                 res.json(result);
             });
 
         } catch (err) {
 
         }
     },
 
     getDataNewJourney: async function (req, res) {
         try {
             var id = req.query.id;
             var data = await JBRK_DTLModel.findById(id);
             console.log( "datadata",data)
             res.status(200).json({ status: true, msg: "data saved", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     updateNewJourney: async function (req, res) {
         try {
             var obj = req.body;
             obj.F_MSTNO=parseInt(obj.F_MSTNO);
             var data = await JBRK_DTLModel.findByIdAndUpdate(req.params.id, { $set: obj }, { new: true });
 
             res.status(200).json({ status: true, msg: "data updated", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     DeleteTourDetails: async function (req, res) {
         try{
             var obj = req.body;
             console.log(obj);
             var setObj={
                 F_DELID :req.session.user.uid,
                 F_DELDT : new Date()
             }
             console.log(setObj);
             JBRK_DTLModel.update({_id:req.body.id},{$set:setObj},function(err){
                 if(err){
                     console.log(err);
                     }
                 res.status(200).json({ status: true, msg: "data deleted" }); 
             })
             console.log("objobjobj",obj);
                               
 
         } catch(err){
             console.log(err)
         }
      },
 
    
 
 
 
     // --------------------------------------End-----------------------------------
 
 }
 
 