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
 
 const F_SUPP = require('../models/F_SUPPModel.js');
 //var model = require('../models/createAirTicketModel.js');
 var AR_STKHD = require('../models/ar_stkhdModel.js')
 var AR_STKRG = require('../models/airStockRegisterModel.js')//AR_STKRG
 var rsData = require('../models/rsDataModel.js')
 
 
 function convertToDate1(data) {
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
         date = day + " " + monthNames[parseInt(month) - 1] + " " + year + " " + "00:00:00 -0000";
         data = new Date(date);
     }
     return data;
 }
 
 
 module.exports = {
 
     // create: function (req, res) {
     //     try {
     //         // Set received date and user ID in the request body
     //         req.body.F_RCVDDT = new Date();
     //         req.body.F_RCVDBY = req.session.user.uid;
     
     //         // Convert the fromTicket and tillTicket values to integers
     //         const fromTicket = parseInt(req.body.F_FROMTKT, 10);
     //         const tillTicket = parseInt(req.body.F_TILLTKT, 10);
     //         const totalTickets = tillTicket - fromTicket + 1;  // Calculate total tickets
     
     //          // Check if any tickets exist where F_FROMTKT >= req.body.F_FROMTKT and F_TILLTKT <= req.body.F_TILLTKT
     //         AR_STKRG.findOne({
     //             F_FROMTKT: { $gte: fromTicket },
     //             F_TILLTKT: { $lte: tillTicket }
     //         }).exec(function (err, existingTickets) {
     //             if (err) {
     //                 console.error("Error checking tickets:", err);  // Log the error
     //                 return res.status(500).send({ status: false, msg: "Error checking tickets." });
     //             }
     
     //             // Check if tickets exist and return 400 status
     //             if (existingTickets) {
     //                 console.log("Tickets already exist for this range:", existingTickets);  // Log the existing data
     //                 return res.status(400).send({ status: false, msg: "Tickets already exist in the given range." });
     //             }
     
     //             // If no overlap, continue with creating new tickets
     //             console.log("No existing tickets found. Proceeding to create new tickets.");
     
     //             AR_STKRG.findOne({}).sort({ F_TRANNO: -1 }).exec(function (err, data1) {
     //                 if (err) {
     //                     console.error("Error fetching transaction number:", err);  // Log the error
     //                     return res.status(500).send({ status: false, msg: "Error fetching transaction number." });
     //                 }
     
     //                 // Set F_TRANNO to the next available number
     //                 data1 = JSON.parse(JSON.stringify(data1));
     //                 if (data1 != null) {
     //                     req.body.F_TRANNO = data1.F_TRANNO + 1;
     //                 } else {
     //                     req.body.F_TRANNO = 1;
     //                 }
 
     //                 var doc = {
     //                         // Static value
     //                     F_TRANNO: req.body.F_TRANNO ? req.body.F_TRANNO : 0,   // If F_TRANNO exists, use it; otherwise default to 0
     //                     F_AIRLNNO: req.body.F_AIRLNNO ? req.body.F_AIRLNNO : "",  // If F_AIRLNNO exists, use it; otherwise default to empty string
     //                     F_INTDOM: req.body.F_INTDOM ? req.body.F_INTDOM : "",  // Similarly, use the value if present, otherwise fallback to empty string
     //                     F_AGENTCD: req.body.F_AGENTCD ? req.body.F_AGENTCD : "",
     //                     F_VMPDNO: req.body.F_VMPDNO ? req.body.F_VMPDNO : 0,
     //                     F_FROMTKT: req.body.F_FROMTKT ? req.body.F_FROMTKT : 0,
     //                     F_TILLTKT: req.body.F_TILLTKT ? req.body.F_TILLTKT : 0,
     //                     F_TOTALTKT: req.body.F_TOTALTKT ? req.body.F_TOTALTKT : 0,
     //                     F_RCVDBY: req.body.F_RCVDBY ? req.body.F_RCVDBY : "",
     //                     F_RCVDDT: req.body.F_RCVDDT ? new Date(req.body.F_RCVDDT) : "",  // Ternary to handle Date conversion or set null if not present
     //                     F_RCVDTM: req.body.F_RCVDTM ? req.body.F_RCVDTM : "",
     //                     F_QUOTA: req.body.F_QUOTA ? req.body.F_QUOTA : "",
     //                     F_MPD: req.body.F_MPD ? req.body.F_MPD : "",
     //                     F_SAS: req.body.F_SAS ? req.body.F_SAS : "",
     //                     F_CHQNO: req.body.F_CHQNO ? req.body.F_CHQNO : 0,
     //                     F_CHQDT:req.body.F_CHQDT ? new Date(req.body.F_CHQDT) : "" ,  // Ternary to handle Date conversion or null
     //                     F_CHQRS: req.body.F_CHQRS ? req.body.F_CHQRS : 0,
     //                     F_BILLNO: req.body.F_BILLNO ? req.body.F_BILLNO : "",
     //                     F_BILLDT:req.body.F_BILLDT ? new Date(req.body.F_BILLDT) : "" ,  // Handle date conversion or null
     //                     X_________: req.body.X_________ ? req.body.X_________ : "",
     //                     KT_SYSLOG: req.body.KT_SYSLOG ? req.body.KT_SYSLOG : "",
     //                     KT_BRANCH: req.body.KT_BRANCH ? req.body.KT_BRANCH : "",
     //                     created_on: req.body.created_on ? new Date(req.body.created_on) : new Date(),  // Use current date if not provided
     //                     F_RCVDFNM : req.session.user.other_info[0].F21_FNAME,
     //                     F_RCVDSNM : req.session.user.other_info[0].F21_SNAME,
     //                     F_RCVDNM: req.body.F_RCVDNM ? req.body.F_RCVDNM : "",
     //                     DBFNAME: "AR_STKRG",  // Static value
     //                     DBFKEY: "F_TKT" 
     //                 };
 
                   
     //                 // Now create blank entries in AR_STKHD
     //                 const blankEntries = [];
     //                 for (let ticketNumber = fromTicket; ticketNumber <= tillTicket; ticketNumber++) {
     //                     blankEntries.push({
     //                         F_TKT: ticketNumber,               // Blank ticket number
     //                         F_AGENTCD: req.body.F_AGENTCD,
     //                         F_AIRLNNO: req.body.F_AIRLNNO,               // Original start ticket
     //                         KT_BRANCH: req.body.KT_BRANCH,  
     //                         F_SAS: req.body.F_SAS,  
     //                         F_MPD: req.body.F_MPD,  
     //                         F_QUOTA: req.body.F_QUOTA,  
     //                         F_RCVDDT: req.body.F_RCVDDT,       // Received date
     //                         F_RCVDBY: req.body.F_RCVDBY,       // Received by user
     //                         F_TRANNO: req.body.F_TRANNO,       // Transaction number
                           
     //                     });
     //                 }
     
     //                 // Save entries to AR_STKHD in bulk using insertMany
     //                 AR_STKHD.insertMany(blankEntries, function (err, result) {
     //                     if (err) {
     //                         console.error("Error creating blank ticket entries:", err);  // Log the error
     //                         return res.status(500).send({ status: false, msg: "Error creating blank ticket entries." });
     //                     }
     //                    // console.log("Blank tickets created:", result);
     
     //                     // Proceed to create data in AR_STKRG collection
     //                     AR_STKRG.create(doc, function (err, result) {
     //                         if (err) {
     //                             console.error("Error saving data to AR_STKRG:", err);  // Log the error
     //                             return res.status(500).send({ status: false, msg: "Error saving data to AR_STKRG." });
     //                         }
     //                         console.log("Data saved to AR_STKRG:", result);
     
     //                         return res.status(200).send({
     //                             status: true,
     //                             msg: "Blank Ticket Entries And Ticket Generated successfully."
     //                         });
     //                     });
     //                 });
     //             });
     //         });
     //     } catch (err) {
     //         console.error("Catch block error:", err);  // Log any catch block error
     //         res.status(500).send({ msg: err.message || "An error occurred." });
     //     }
     // },
 
     create: function (req, res) {
         try {
             // Set received date and user ID in the request body
             req.body.F_RCVDDT = new Date();
             req.body.F_RCVDBY = req.session.user.uid;
     
             // Trim and validate F_FROMTKT and F_TILLTKT to ensure they are integers
             const fromTicket = parseInt(req.body.F_FROMTKT.trim());  // Trim and convert to integer
             const tillTicket = parseInt(req.body.F_TILLTKT.trim());  // Trim and convert to integer
             const totalTickets = tillTicket - fromTicket + 1;  // Calculate total tickets
     
             if (isNaN(fromTicket) || isNaN(tillTicket)) {
                 return res.status(400).send({ status: false, msg: "Invalid ticket numbers." });
             }
     
             AR_STKRG.findOne({}).sort({ F_TRANNO: -1 }).exec(function (err, data1) {
                 if (err) {
                     console.error("Error fetching transaction number:", err);  // Log the error
                     return res.status(500).send({ status: false, msg: "Error fetching transaction number." });
                 }
     
                 // Set F_TRANNO to the next available number
                 data1 = JSON.parse(JSON.stringify(data1));
                 req.body.F_TRANNO = data1 ? data1.F_TRANNO + 1 : 1;
     
                 var doc = {
                     F_TRANNO: req.body.F_TRANNO || 0,
                     F_AIRLNNO: req.body.F_AIRLNNO || "",
                     F_INTDOM: req.body.F_INTDOM || "",
                     F_AGENTCD: req.body.F_AGENTCD || "",
                     F_VMPDNO: req.body.F_VMPDNO || 0,
                     F_FROMTKT: fromTicket || 0,  // Use the trimmed and validated fromTicket
                     F_TILLTKT: tillTicket || 0,  // Use the trimmed and validated tillTicket
                     F_TOTALTKT: req.body.F_TOTALTKT || 0,
                     F_RCVDBY: req.body.F_RCVDBY || "",
                     F_RCVDDT: req.body.F_RCVDDT ? new Date(req.body.F_RCVDDT) : "",  // Handle Date conversion
                     F_RCVDTM: req.body.F_RCVDTM || "",
                     F_QUOTA: req.body.F_QUOTA || "",
                     F_MPD: req.body.F_MPD || "",
                     F_SAS: req.body.F_SAS || "",
                     F_CHQNO: req.body.F_CHQNO || 0,
                     F_CHQDT: req.body.F_CHQDT ? req.body.F_CHQDT : "",  // Handle Date conversion
                     F_CHQRS: req.body.F_CHQRS || 0,
                     F_BILLNO: req.body.F_BILLNO || "",
                     F_BILLDT: req.body.F_BILLDT ? req.body.F_BILLDT : "",  // Handle Date conversion
                     X_________: req.body.X_________ || "",
                     KT_SYSLOG: req.body.KT_SYSLOG || "",
                     KT_BRANCH: req.body.KT_BRANCH || "",
                     created_on: req.body.created_on ? new Date(req.body.created_on) : new Date(),  // Use current date if not provided
                     F_RCVDFNM: req.session.user.other_info[0].F21_FNAME,
                     F_RCVDSNM: req.session.user.other_info[0].F21_SNAME,
                     F_RCVDNM: req.body.F_RCVDNM || "",
                     DBFNAME: "AR_STKRG",  // Static value
                     DBFKEY: "F_TKT"
                 };
     
                 // Create blank entries in AR_STKHD
                 const blankEntries = [];
                 for (let ticketNumber = fromTicket; ticketNumber <= tillTicket; ticketNumber++) {
                     blankEntries.push({
                         F_TKT: ticketNumber,
                         F_AGENTCD: req.body.F_AGENTCD,
                         F_AIRLNNO: req.body.F_AIRLNNO,
                         KT_BRANCH: req.body.KT_BRANCH,
                         F_SAS: req.body.F_SAS,
                         F_MPD: req.body.F_MPD,
                         F_QUOTA: req.body.F_QUOTA,
                         F_RCVDDT: req.body.F_RCVDDT,
                         F_RCVDBY: req.body.F_RCVDBY,
                         F_TRANNO: req.body.F_TRANNO
                     });
                 }
     
                 // Save entries to AR_STKHD in bulk using insertMany
                 AR_STKHD.insertMany(blankEntries, function (err, result) {
                     if (err) {
                         console.error("Error creating blank ticket entries:", err);
                         return res.status(500).send({ status: false, msg: "Error creating blank ticket entries." });
                     }
     
                     // Save the data to AR_STKRG collection
                     AR_STKRG.create(doc, function (err, result) {
                         if (err) {
                             console.error("Error saving data to AR_STKRG:", err);
                             return res.status(500).send({ status: false, msg: "Error saving data to AR_STKRG." });
                         }
     
                         return res.status(200).send({
                             status: true,
                             msg: "Blank Ticket Entries And Ticket Generated successfully."
                         });
                     });
                 });
             });
         } catch (err) {
             console.error("Catch block error:", err);
             res.status(500).send({ msg: err.message || "An error occurred." });
         }
     },
     
     
     griddata: async function (req, res) {
         try {
             // console.log(req.body);
             var query = {};
             var limit = req.body.limit ? parseInt(req.body.limit) : 500;
             var search_by = req.body.search_by ? req.body.search_by : "";
             var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
             var order = req.body.order ? req.body.order : "desc";
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
 
             q.all(baseExport.grid('airStockRegister', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                 res.json(result);
             });
 
         } catch (err) {
 
         }
     },
 
     getData: async function (req, res) {
         try {
             
             var id = req.query.id;
             var data = await AR_STKRG.findById(id);
             //res.json(data);
             res.status(200).json({ status: true, msg: "data saved", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     update: async function (req, res) {
         try {
           //  moment(req.body.F_CHQDT).format('YYYY/MM/DD')
           //  moment(req.body.F_BILLDT).format('YYYY/MM/DD')
             var obj = req.body;
             var data = await AR_STKRG.findByIdAndUpdate(req.params.id, { $set: obj }, { new: true }); //$addToSet: { Actions: obj.tourSeries }
 
             res.status(200).json({ status: true, msg: "Air Ticket Data Updated", data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
 
     checkTKT1: async function (req, res) {
     try {
         const { fromTicket, tillTicket } = req.body;
 
         // Find if any tickets exist in the specified range
         const existingTicket = await AR_STKRG.findOne({
             $or: [
                 { F_FROMTKT: { $lte: tillTicket, $gte: fromTicket } }, // Start within range
                 { F_TILLTKT: { $lte: tillTicket, $gte: fromTicket } }, // End within range
                 { F_FROMTKT: { $lte: fromTicket }, F_TILLTKT: { $gte: tillTicket } } // Encloses the range
             ]
         });
 
         if (existingTicket) {
             // If a ticket exists in this range, return true
             return res.json({ exists: true });
         }
 
         // If no ticket exists, return false
         res.json({ exists: false });
     } catch (error) {
         console.error("Error checking ticket range:", error);
         res.status(500).json({ error: "Server error checking ticket range" });
     }
 }
 
 
 }
 