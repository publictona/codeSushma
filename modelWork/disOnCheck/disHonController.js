/**
 * @Author:Sushma Landge
 */

/***********************
 CORE PACKAGES
 **********************/
 const express = require('express');

 var jwt = require('jsonwebtoken');
 var util = require('../routes/util.js');
 
 
 const async = require('async');
 const q = require('q');
 const request = require('request');
 const fs = require('fs');
 const _ = require('underscore');
 const ObjectID = require('mongoskin').ObjectID;
 //const moment = require('moment-timezone');
 var baseExport = require('../baseExporter');
 var moment = require('moment');
 
 var smtpTransport = require('nodemailer-smtp-transport'),
     nodemailer = require('nodemailer');
 var htmlPdf = require('html-pdf');
 var jsbarcode = require('jsbarcode');
 const bwipjs = require('bwip-js');
 
 var configAuth = require('../config/auth.js');
 
 /*********************
  MODULE PACKAGES
  ********************/
 var C_DISHONModel = require('../models/C_DISHONModel.js');
 var C_REASONModel = require('../models/C_REASONModel.js');
 var F_FORMModel = require('../models/F_FORMModel.js');
 var TOURMAS0Model = require('../models/TOURMAS0Model.js');
 var BKAGENTModel = require('../models/BKAGENTModel.js');
 const rsDataModel = require('../models/rsDataModel.js');
 var historyModel = require('../models/HISTORYModel.js');
 var F21_SLMSModel = require('../models/F21_SLMSModel.js');
 var model = require('../models/rs_F_SUPMSTModel.js');
 var baseExport = require('../baseExporter.js');
 var authentication = require('../authentication.js');
 
 
 
 
 async function sendDishonMail(dcno, cb) {
     try {
         var dcNoData = await C_DISHONModel.findOne({ DC_NO: parseInt(dcno) });
         if (!dcNoData) {
             cb();
         }
         // console.log('dcNoDatadcNoData', dcNoData);
         dcNoData = JSON.parse(JSON.stringify(dcNoData));
 
         var tourCode = dcNoData.DC_TOUR;
         //console.log('tourCodetourCode', tourCode);
         var tourForm = parseInt(dcNoData.DC_FORM);
         // console.log('tourFormtourForm', tourForm);
         var firstThreeChars = tourCode//.substring(0, 3);
         let tourData = {};
 
 
         if (firstThreeChars !== 'FIT' && firstThreeChars !== 'GIT') {
             tourData = await historyModel.find({ F_TCD: tourCode, F_FORM: tourForm });
         } else if (firstThreeChars === 'FIT') {
             tourData = await F_FORMModel.find({ F_FITFORM: tourCode });
         }
        // console.log('tourData', tourData);
 
         cb(null, tourData);
     } catch (error) {
         cb(error)
     }
 }
 
 // Example usage:
 // sendDishonMail(1312)
 //     .then((result) => {
 //         console.log('Result:', result);
 //     })
 //     .catch((error) => {
 //         console.error('Error:', error);
 //     });
 
 
 
 
 
 module.exports = {
 
 
     create: function (req, res) {
         try {
 
             C_DISHONModel.findOne({}).sort({ DC_NO: -1 }).exec(function (err, data1) {
                 if (err) {
                 }
                 data1 = JSON.parse(JSON.stringify(data1));
                 if (data1 != null) {
                     req.body.DC_NO = data1.DC_NO + 1;
                 } else {
                     req.body.DC_NO = 1;
                 }
 
                 // req.body.F_TRANNO= req.session.user.uid;
 
                 C_DISHONModel.create(req.body, function (err) {
                     if (err) {
                         res.status(500).send({ status: false, msg: err, })
                     }
                     res.status(200).send({ status: true, msg: "data saved", })
                 })
             })
 
 
         } catch (err) {
             console.log(err);
             res.status(500).send({ msg: msg.err })
         }
     },
 
     // dcNoTesting: async function (req, res) {
     //     try {
     //              var obj = req.body
     //              sendDishonMail(obj.DC_NO , function(err , data){
     //                 if(err){
     //                     res.status(500).json({  status:false , message: err.message  })
     //                 }
     //                 console.log("datadatadatadata",data)
     //                 res.status(200).send({status:true , Data: data})
     //                 data = JSON.parse(JSON.stringify(data));                   
     //              });
     //         } catch (err) {
     //         console.log(err);
     //         res.status(500).send({ msg: msg.err })
     //     }
     // },
 
 
     griddata: async function (req, res) {
         try {
             // console.log( "aaaaaaaaaaaaaaaaaaaaaaa",req.body);
             var query = {};
             var limit = req.body.limit ? parseInt(req.body.limit) : 500;
             var search_by = req.body.search_by ? req.body.search_by : "";
 
             var sort_by = "_id";
             var order = "desc";
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
 
             q.all(baseExport.grid('C_DISHON', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                 //console.log( "resultresult",result) 
                 res.json(result);
             });
 
         } catch (err) {
             console.log(err)
 
         }
     },
 
     getData: async function (req, res) {
         try {
             var id = req.query.id;
             var data = await C_DISHONModel.findById(id);
             //res.json(data);
             res.status(200).json({ status: true, msg: " get data ", data: data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     update: async function (req, res) {
         try {
             var obj = req.body;
 
             var data = await C_DISHONModel.findByIdAndUpdate(req.params.id, { $set: obj }, { new: true }); //$addToSet: { Actions: obj.tourSeries }
 
             res.status(200).json({ status: true, msg: "data updated", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     getReasonsMaster: function (req, res) {
         C_REASONModel.find({}, function (err, Reason) {
             if (!err) {
                 // res.setHeader('Access-Control-Allow-Origin','*');
                 // console.log(Reason)
                 return res.json(Reason);
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         }).select("REAS_DS")
     },
 
     //-------------------------------get tourCode-------------
     checkTourCode: async function (req, res) {
         try {
             const tourCode = req.body.tourCode;
             const firstThreeChars = tourCode.substring(0, 3);
 
             if (firstThreeChars !== 'FIT' && firstThreeChars !== 'GIT') {
                 //const tourmasoCollection = await getCollection('TOURMAS0');
                 const tourmasoResult = await TOURMAS0Model.findOne({ TM_TCD: tourCode });
 
                 if (tourmasoResult) {
                     return res.json({ message: 'Tour code found in TOURMAS0 collection', data: tourmasoResult });
                 } else {
                     return res.status(404).json({ error: 'Tour code not found' });
                 }
             } else if (firstThreeChars === 'FIT') {
                 // const fFormCollection = await getCollection('F_FORM');
                 const fFormResult = await F_FORMModel.findOne({ F_FITFORM: tourCode });
 
                 if (fFormResult) {
                     return res.json({ message: 'Tour code found in F_FORM collection', data: fFormResult });
                 } else {
                     return res.status(404).json({ error: 'Tour code not found' });
                 }
             } else {
                 return res.status(404).json({ error: 'Tour code not found' });
             }
         } catch (error) {
             console.error(error);
             res.status(500).json({ error: 'Internal Server Error' });
         }
     },
     // ------------------------end ----------------------------------
 
     getGuestDetails: function (req, res) {
         var F_TCD = req.params.code;
         var F_FORM = req.params.form;
         historyModel.find(({ F_TCD: F_TCD, F_FORM: parseInt(F_FORM) }), {}, function (err, data) {
             if (err) {
                 res.status(500).json({ status: false, msg: err });
             }
             // console.log("datadatadata",data)
             res.status(200).json({ status: 200, data: data });
         }).select("F_TCD F_FORM F_SNAME F_FNAME")
     },
 
 
     dcNoTesting: async function (req, res) {
         try {
             var obj = req.body
 
             C_DISHONModel.findOne({}).sort({ DC_NO: -1 }).exec(function (err, data1) {
                 if (err) {
                 }
                 data1 = JSON.parse(JSON.stringify(data1));
                 if (data1 != null) {
                     req.body.DC_NO = data1.DC_NO + 1;
                 } else {
                     req.body.DC_NO = 1;
                 }
                 console.log("data1data1data1",data1)
 
 
             //F_TRANNO= req.session.user.uid;
             sendDishonMail(obj.data1, async function (err, data) {
                 if (err) {
                     res.status(500).json({ status: false, message: err.message })
                 }
                console.log("datadatadatadata", data)
                data = JSON.parse(JSON.stringify(data));
              
 
                 //---------------------------------------------
                 var guestEmail = data.F_EMAIL;
              
                 var agentEmail = data.F_BKIDNO;
             
                 var stafEmail = data.F_FNAME;  
        
 
                 // email Data 
                  emailData1 = await BKAGENTModel.findOne({ F_BKIDNO: agentEmail},{ F_EMAILTO: 1 },{ F21_FNAME: 1 });
                  emailData2 = await F21_SLMSModel.findOne({stafEmail},{ F21_EMAIL: 1 });
                  emailData3= await historyModel.findOne({guestEmail},{ F_EMAIL: 1 });
                  console.log("emailDataemailData",emailData1 , emailData2 , emailData3)
 
                 // var textHtml = `Guest Booked by  for ${obj.DC_TOUR}/ ${obj.DC_FORM} cheque has Bounced due to ${obj.REAS_DS} cheno : ${obj.DC_CHQNO} Rs. ${obj.DC_AMT} `;
                  var textHtml = "mail sent Successfully"
                  var transporter = nodemailer.createTransport(smtpTransport(configAuth.smtp));
                  var mailOptions = {
                      from: emailData2, //'darshansr@kesaritours.in', // sender address
                      to: [emailData1],
                      bcc: "",
                      cc: "",
                      subject: "Dis Honoured Check", // Subject line
                      html: textHtml,
                   };
 
                   // console.log("mailOptionsmailOptions", mailOptions)
                   transporter.sendMail(mailOptions, function (error, info) {
                     if (error) {
                         console.log("Partial Email Error", error);
                         res.status(500).json({
                             message: 'Error in sending mail',
                             error: error,
                             status: false
                         });
                     }
 
                     // var setData = {
                     //     emailId: emailData2,
                     //     emailedOn: new Date(),
                     //    // emailBy:req.session.user.F21_IDNO
                     //     emailBy: emailData2 //
                     // };
                     // console.log("setDatasetData" , setData)
 
 
                     // C_DISHONModel.findOneAndUpdate(req.params.id, { $set: setData }, {}, function (err) {//{_id:result.po._id}
                     //     if (err) {
                     //         res.status(500).json({
                     //             message: 'Error in saving invoice',
                     //             error: err,
                     //             status: false
                     //         });
                     //     }
                     //     //res.status(200).json({status:true,result:html,data:result});
                     //     res.status(200).json({ status: true, data: mailOptions.html});
                     // });
 
                 });//
                 
                 //---------------------------------------------
                 res.status(200).send({ status: true, result: mailOptions.html , data:result}) 
                // res.status(200).send({ status: true, message:`${mailOptions.html}`  , data }) // F_BKIDNO
                 })//
                 });
         } catch (err) {
             console.log(err);
             res.status(500).send({ msg: msg.err })
         }
     },
 
 
     generateAutoMail: function (req, res) {
         try {
             var obj = req.body;
 
             F21_SLMSModel.findOne({ F21_LOGIN: obj.F21_LOGIN }, { F21_EMAIL: 1 }, function (err, bkgPerson) {
                 if (err) {
                     console.log(err)
                 }
                 // console.log("bkgPersonbkgPersonbkgPersonbkgPerson" , bkgPerson)// to mailID
                 bkgPerson = JSON.parse(JSON.stringify(bkgPerson));
 
                 BKAGENTModel.findOne({ BKA_CODE: obj.BKA_CODE }, { F_EMAILTO: 1 }, function (err, dat3) {
                     if (err) {
                         res.status(500).send({ status: false, msg: err.msg })
                     }
                     // console.log("dat3dat3dat3dat3dat3" , dat3)//from mailID
                     dat3 = JSON.parse(JSON.stringify(dat3));
 
 
 
                     var textHtml = `Guest Booked by for has bounced due to checkno:567756 RS:50000`;
 
                     // const emailContent2 = `Guest Booked by ${document2.F21_NAME} for ${document2.F21_BRANCH} has bounced due to ${document2.F21_RESGDT} checkno: RS:`;
 
                     //console.log("textHtmltextHtmltextHtml" , textHtml)
 
                     var transporter = nodemailer.createTransport(smtpTransport(configAuth.smtp));
                     var mailOptions = {
                         from: dat3.F_EMAILTO, //'darshansr@kesaritours.in', // sender address
                         to: [bkgPerson.F21_EMAIL,],
                         bcc: "",
                         cc: "",
                         subject: "Dis Honoured Check", // Subject line
                         html: textHtml,
 
                     };
                    // console.log("mailOptionsmailOptions", mailOptions)
                     transporter.sendMail(mailOptions, function (error, info) {
                         if (error) {
                             console.log("Partial Email Error", error);
                             res.status(500).json({
                                 message: 'Error in sending mail',
                                 error: error,
                                 status: false
                             });
                         }
                         var setData = {
                             emailId: bkgPerson,
                             emailedOn: new Date(),
                             //emailBy:req.session.user.F21_IDNO
                             emailBy: bkgPerson //
                         };
                         //console.log("setDatasetData" , setData)
 
 
                         C_DISHONModel.findOneAndUpdate(req.params.id, { $set: setData }, {}, function (err) {//{_id:result.po._id}
                             if (err) {
                                 res.status(500).json({
                                     message: 'Error in saving invoice',
                                     error: err,
                                     status: false
                                 });
                             }
                             res.status(200).json({ status: true, data: mailOptions.html });
                         });
 
 
 
                     });
 
 
                 })
 
                 //return res.json(bkgPerson)
             })
 
         } catch (err) {
             console.log(err)
         }
     },
 
  
 
 }
 
 