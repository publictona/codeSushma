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
 
 var asego = require('../routes/asego.js');
 var moment = require('moment');
 var nodemailer = require('nodemailer');
 var fs = require('fs');
 var request = require('request');
 var smtpTransport = require('nodemailer-smtp-transport');
 var configAuth = require('../config/auth');
 var js2xmlparser = require('js2xmlparser');
 const xml2json = require('../custom/musicjson-extend');
 
 /*********************
  MODULE PACKAGES
  ********************/
 
 var model = require('../models/TLInsuranceModel.js');
 var rsDataModel = require('../models/rsDataModel.js');
 var transporter = nodemailer.createTransport(smtpTransport(configAuth.smtp));
 
 module.exports = {
 
     create: function (req, res) {
         try {
             req.body.tranID = req.session.user.uid;
             req.body.tranDt = new Date();
             req.body.DOB = baseExport.convertToDateNew(req.body.DOB);
             req.body.dateOfTravel = baseExport.convertToDateNew(req.body.dateOfTravel);
             req.body.insuranceStart = baseExport.convertToDateNew(req.body.insuranceStart);
             model.findOne({}).sort({ tranNo: -1 }).exec(function (err, data1) {
                 if (err) {
                     res.status(500).send({ status: false, msg: err, })
                 }
                 data1 = JSON.parse(JSON.stringify(data1));
                 console.log("data1data1data1", data1)
                 console.log("req.bodyreq.body", req.body)
                 if (data1 != null) {
                     req.body.tranNo = data1.tranNo + 1;
                 } else {
                     req.body.tranNo = 1;
                 }
 
                 model.create(req.body, function (err) {
                     if (err) {
                         res.status(500).send({ status: false, msg: err, })
                     }
                     req.body.DOB = moment().format('L');
                     req.body.dateOfTravel = moment().format('L');
                     req.body.insuranceStart = moment().format('L');
                     // moment().format('L');
 
                     var TourLeaderID = req.session.user.uid;
                     rsDataModel.F21_SLMSModel.findOne({ F21_SRNO: TourLeaderID }, { F21_EMAIL: 1 }, {}, function (err, stafData) {
                         if (err) {
                             res.status(500).send({ status: false, msg: err, })
                         }
                         stafData = JSON.parse(JSON.stringify(stafData));
                         console.log("stafDatastafDataaaaaaaaaa", stafData)
 
                         res.render("TLInsurance/TLDetailForm", { data: req.body }, function (err, html) {
                             if (err) {
                                 res.status(500).send({ status: false, msg: err, })
                             }
 
                          
 
                             const mailOptions = {
                                 from: stafData.F21_EMAIL,
                                 to: "sushmal@kesari.in",
                                 // to: "operation.mumbai@asego.in",
                                 // cc: ["dhirajk @kesari.in", "hrushikeshpd @kesari.in"],
                                 subject: 'Tour Manager Insurance Policy',
                                 html: html
                             };
                             // console.log("html",html)
                             transporter.sendMail(mailOptions, function (error, data) {
 
                                 if (err) {
                                     res.status(500).send({ status: false, msg: err, })
                                 } else {
                                     res.status(200).send({ status: true, msg: "data saved", data })
                                 }
                             });
                         });//
                     });
                 });
             })
 
 
         } catch (err) {
             console.log(err);
             res.status(500).send({ msg: msg.err })
         }
     },
 
 
     griddata: async function (req, res) {
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
             var draw = req.body.draw ? parseInt(req.body.draw) : 1;
             var start = req.body.start ? parseInt(req.body.start) : 0;
 
             if (req.body.search_query) {
                 var search_query = req.body.search_query;
 
             } else {
             }
             var table_format = req.body.table_format ? req.body.table_format : "datatable";
 
             q.all(baseExport.grid('TLInsurance', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
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
             var data = await model.findByIdAndUpdate(req.params.id, { $set: obj }, { new: true }); //$addToSet: { Actions: obj.tourSeries }
 
             res.status(200).json({ status: true, msg: "data updated", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     getTourLeader: function (req, res) {
         rsDataModel.F31_SALKModel
             .find({})
             .select('F31_SRNO F21_JOIN F31_SRNO F31_FULLNM F31_BIRTH F31_MOBILE F31_ADD1 F31_FNAME')
             .exec(function (err, data) {
                 if (!err) {
                     //  console.log(data)
                     return res.json(data);
                 } else {
                     return err;
                 }
             });
     },
 
     getF31Details: function (req, res) {
         var F31_SRNO = req.params.id;
         rsDataModel.F31_SALKModel.findOne({ F31_SRNO }, function (err, Data) {
             if (!err) {
 
                 return res.json({ data: Data });
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         }).select("F31_SRNO  F31_SRNO F31_FULLNM F31_BIRTH F31_MOBILE F31_ADD1 F31_FNAME F31_EMAIL F31_PPNO");
     },
 }
 
 