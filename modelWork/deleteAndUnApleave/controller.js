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
 var crypto = require('crypto');
 const axios = require('axios');
 const qs = require('qs');
 //const utf8 = require('utf8');
 const querystring = require('querystring');
 const model = require('../models/rsDataModel.js');
 const mongoose = require('mongoose');
 /*********************
  MODULE PACKAGES
  ********************/
 

 const F32_CL = require('../models/F32_CLModel.js');
 
 module.exports = {

    deleteAUaLeave: async function (req, res) {
        try {
            console.log("Request Body:", req.body);
        
            // Destructure request body
            const { F32_APPYN, F32_IDNO,F32_YEAR, created_on } = req.body;
    
            // Validate required fields
            // if (!F32_APPYN || !F32_IDNO || !created_on) {
            //     return res.status(400).json({ status: false, msg: "F32_APPYN, F32_IDNO, and created_on are required." });
            // }
        
            // Find documents where F32_APPYN, F32_IDNO, and the year of created_on match
            const data = await F32_CL.find({
                F32_APPYN,
                F32_IDNO,
                F32_YEAR
              //  $expr: { $eq: [{ $year: "$created_on" }, created_on] }  // Extract year from created_on and match it with the provided year
            }).lean();
        
            // Check if any records were found
            if (!data || data.length === 0) {
                return res.status(404).json({ status: false, msg: "No records found with the specified criteria." });
            }
        
            // Extract F32_TRANNO values from the matched documents
            const keys = data.map(item => item.F32_TRANNO);
            //console.log("Extracted F32_TRANNO Keys:", keys);
        
            // Define aggregation pipeline
            const aggPipeline = [
                {
                    $match: {
                        F32_TRANNO: { $in: keys }
                    }
                }
            ];
        
            // Execute aggregation query
            const aggregatedData = await F32_CL.aggregate(aggPipeline);
        
            // Return success response
            res.status(200).json({ status: true, data: aggregatedData });
        
        } catch (err) {
            console.error("Error:", err.message);
        
            // Return error response
            res.status(500).json({
                status: false,
                msg: "Internal server error",
                error: err.message
            });
        }
    },

    // updateLeaveRecord: async function (req, res) {
    //     try {
    //         const { F32_IDNO , F32_TRANNO, F_DELID, F_DELDT } = req.body;
    
    //         // Update the document by setting new fields
    //         const updatedRecord = await F32_CL.updateOne(
    //             { F32_TRANNO }, // Find the document with the given TRANNO
    //             {
    //                 $set: {
    //                     //F32_IDNO:"ZZZ",
    //                     //F32_OLDNO :F32_IDNO,
    //                     F32_TRANNO: F32_TRANNO,
    //                     F32_DELID: "RU5", // Add or update the F_DELID field
    //                     F32_DELDT: new Date(),
    //                     F32_DELTM: new Date().toLocaleTimeString(), // Add or update the F_DELDT field
    //                 },
    //             },
    //             { upsert: false } // Do not create a new document if TRANNO is not found
    //         );
    
    //         // Check if the document was found and updated
    //         if (updatedRecord.matchedCount === 0) {
    //             return res.status(404).json({ status: false, msg: "Record not found." });
    //         }
    
    //         return res.status(200).json({
    //             status: true,
    //             msg: "data Deleted successfully.",
    //             data: updatedRecord,
    //         });
    //     } catch (err) {
    //         console.error("Error:", err);
    //         return res.status(500).json({
    //             status: false,
    //             msg: "Internal server error.",
    //             error: err.message,
    //         });
    //     }
    // },


    // DeleteTourDetailswwww: async function (req, res) {
    //     try {
    //         const { _id , F32_IDNO } = req.body;
    
    //         // Validate input
    //         if (!_id) {
    //             return res.status(400).json({ status: false, msg: "ID is required" });
    //         }
             
    
    //         // Construct the update object
    //         const setObj = {
    //                     F32_IDNO:"ZZZ",
    //                    // F32_OLDNO :F32_IDNO,
    //                     F32_DELID: req.session.user.uid, // Add or update the F_DELID field
    //                     F32_DELDT: new Date(),
    //                     F32_DELTM: new Date().toLocaleTimeString(), // Add or update the F_DELDT field
    //         };
    
    //         // Update the document
    //         const result = await F32_CL.updateOne({ _id: _id }, { $set: setObj });
    
    //         if (result.nModified === 0) {
    //             return res.status(404).json({ status: false, msg: "Document not found" });
    //         }
    
    //         res.status(200).json({ status: true, msg: "Data deleted successfully" });
    //     } catch (err) {
    //         console.error("Error in DeleteTourDetails:", err);
    //         res.status(500).json({ status: false, msg: "Internal Server Error" });
    //     }
    // }


    DeleteTourDetails: async function (req, res) {
        try {
            const currentDate = new Date();
            const F32_DELTM = currentDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',  // Optional: If you want to include seconds as well
            }).slice(0, 4); // Slice to get only the first 5 characters (HH:mm)

            const { _id , F32_IDNO } = req.body;
            F32_CL.findOne(({ _id: _id }), async function (err, data1) {
                if (err) {
                    res.status(500).json({ status: false, msg: err });
                }
                data1 = JSON.parse(JSON.stringify(data1));
                console.log("data1" , data1)
                if (data1) {
                    F32_CL.update({ _id: data1._id }, {
                        $set: {
                          
                                F32_IDNO : "ZZZ", 
                                F32_OLDNO: data1.F32_IDNO  || "", // Set the value of F32_IDNO into F32_OLDNO
                                F32_DELID: req.session.user.uid, // User ID from session
                                F32_DELDT: new Date(),
                                F32_DELTM: F32_DELTM,
                    
                        }
                    }, {}, function (err) {
                        if (err) {
                            res.status(500).json({ status: false, msg: err });
                        }
                        res.status(200).json({ status: true, msg: "Data saved" });
                    });
                } 
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: false, msg: "Internal server error" });
        }
    },
    
   


}