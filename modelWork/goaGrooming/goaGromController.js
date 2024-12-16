/**
 * @Author: Vivek Yadav 
 */

/***********************
 CORE PACKAGES
 **********************/
 
 var _ = require('underscore');
 const debug = require('debug')('ERP:server');
 var q = require('q');
 var baseExport = require('../baseExporter.js');
  /*********************
   MODULE PACKAGES
   ********************/
   const stDataModel = require('../models/stDataModel.js');
 
  const ST_BRNMS = require('../models/ST_BRNMSModel.js');
  const F21_STAF = require('../models/F21_STAFModel.js');
  const { therapies } = require('./TherapiesController.js');
  const therapiesModel = require('../models/F22_THRPModel.js');
 
  
  module.exports = {
 
 
     //with month
     // groomingDataMonthWise: async function (req, res) {
     //     try {
     //         console.log("Request Body:", req.body);
     //         const { month, year } = req.body; // Expecting `month` (1-12) and `year` in the request body
     
     //         // If no month is provided, default to the current month
     //         const currentMonth = new Date().getMonth() + 1; // Get the current month (1-based)
     //         const currentYear = new Date().getFullYear(); // Get the current year
     
     //         // Use current year and month if not provided
     //         const finalYear = year || currentYear;
     //         const finalMonth = month || currentMonth;
     
     //         console.log("Using year:", finalYear, "and month:", finalMonth);
     
     //         // Step 1: Calculate the start and end date for the given month of the year
     //         const startDate = new Date(finalYear, finalMonth - 1, 1); // Start of the month (0-based 
     //         const endDate = new Date(finalYear, finalMonth, 0); // End of the month (last day of the 
     //         var branchArr = [];
            
     //         var result1 = await therapiesModel.aggregate([
     //             {
     //                 $match: { "therapyType": "Foot" }
     //             },
     //             {
     //                 $project: {
     //                     F22_TCODE: 1,
     //                     _id: 0
     //                 }
     //             }
     //         ]);
     //         var therapyArr = result1.map(item => item.F22_TCODE);
 
     //         let result2 = await ST_BRNMS.aggregate([
     //             {
     //                 $match: { GOA_YN: "Y" }
     //             },
     //             {
     //                 $project: {
     //                     ST_BRN: 1,
     //                     _id: 0
     //                 }
     //             }
     //         ]);
     //         var branchArr = result2.map(item => item.ST_BRN);
            
     //         // Step 4: Combine the `branchArr` and `therapyArr` to use in the main query
     //         const query = {};
     //         query['ST_BRN'] = { "$in": branchArr }; // Filter by ST_BRN
     //         query['F31_TCODE'] = { "$in": therapyArr }; // Filter by therapy type (F22_TCODE)
     //         query['REC_YN'] = "Y"; // Static filter for REC_YN
     //         query['F31_APPTDT'] = {
     //             $gte: startDate,  // Match transactions from the start of the month (inclusive)
     //             $lte: endDate    // Match transactions until the end of the month (inclusive)
     //         };
     //         //query['CANC_DT'] = "";
     
     //        //  console.log("Query Object for F61_APPT:", query);
     //        const therapistsData = await stDataModel.F61_APPTModel.aggregate([
     //             {
     //                 $match: query
     //             },
     //             {
     //                 $addFields: {
     //                     // Extract the fourth character of the F31_TCODE
     //                     fourthChar: { $substrBytes: ["$F31_TCODE", 3, 1] }, // Extract fourth character (index 3)
             
     //                     // Calculate the price based on the fourth character
     //                     therapyPrice: {
     //                         $cond: {
     //                             if: {
     //                                 $in: ["$fourthChar", ["1", "2", "3", "4", "5", "6", "7", "8", "9"]]
     //                             },
     //                             then: {
     //                                 $multiply: [
     //                                     70, // Base price
     //                                     {
     //                                         $subtract: [
     //                                             { $indexOfArray: [["1", "2", "3", "4", "5", "6", "7", "8", "9"], "$fourthChar"] },
     //                                             -1
     //                                         ]
     //                                     }
     //                                 ]
     //                             },
     //                             else: 0   // If it's not a valid number between "1" and "9", set price to 0
     //                         }
     //                     }
     //                 }
     //             },
     //             {
     //                 $facet: {
     //                     therapist1: [
     //                         {
     //                             $match: { F31_IDNO1: { $exists: true, $ne: null } }
     //                         },
     //                         {
     //                             $project: {
     //                                 ST_BRN: 1,
     //                                 therapistId: "$F31_IDNO1",
     //                                 fourthChar: 1,
     //                                 therapyPrice: 1
     //                             }
     //                         }
     //                     ],
     //                     therapist2: [
     //                         {
     //                             $match: { F31_IDNO2: { $exists: true, $ne: null } }
     //                         },
     //                         {
     //                             $project: {
     //                                 ST_BRN: 1,
     //                                 therapistId: "$F31_IDNO2",
     //                                 fourthChar: 1,
     //                                 therapyPrice: 1
     //                             }
     //                         }
     //                     ]
     //                 }
     //             },
     //             {
     //                 $project: {
     //                     combined: { $setUnion: ["$therapist1", "$therapist2"] }
     //                 }
     //             },
     //             {
     //                 $unwind: "$combined"
     //             },
     //             {
     //                 $replaceRoot: { newRoot: "$combined" }
     //             },
     //             {
     //                 $group: {
     //                     _id: { ST_BRN: "$ST_BRN", therapistId: "$therapistId", therapyNo: "$fourthChar" },
     //                     count: { $sum: 1 }, // Count the number of occurrences
     //                     Amount: { $first: "$therapyPrice" } // Get the calculated therapyPrice
     //                 }
     //             },
     //             {
     //                 $group: {
     //                     _id: "$_id.ST_BRN",
     //                     therapists: {
     //                         $push: {
     //                             therapistId: "$_id.therapistId",
     //                             count: "$count",
     //                             Amount: { $multiply: ["$Amount", "$count"] } // Multiply price by count
     //                         }
     //                     }
     //                 }
     //             },
     //             {
     //                 $unwind: "$therapists"
     //             },
     //             {
     //                 $project: {
     //                     ST_BRN: "$_id",
     //                     therapistId: "$therapists.therapistId",
     //                     count: "$therapists.count",
     //                     Amount: "$therapists.Amount"
     //                 }
     //             },
     //             {
     //                 $group: {
     //                     _id: { ST_BRN: "$ST_BRN", therapistId: "$therapistId" },
     //                     therapiesCount: { $sum: "$count" },
     //                     Amount: { $sum: "$Amount" }
     //                 }
     //             },
     //             {
     //                 $project: {
     //                     ST_BRN: "$_id.ST_BRN",
     //                     therapistId: "$_id.therapistId",
     //                     therapiesCount: 1,
     //                     Amount: { $multiply: [70, "$therapiesCount"] } // Multiply total count by 70
     //                 }
     //             }
     //         ]);
             
             
     
     //        console.log("Therapists Data:", therapistsData);
     
     //         // Step 6: Fetch the therapist names from the F21_STAF collection
     //         const therapistIds = therapistsData.map(data => data.therapistId);
     //         const therapistDetails = await F21_STAF.aggregate([
     //             { $match: { F21_IDNO: { $in: therapistIds } } },
     //             { $project: { F21_IDNO: 1, F21_SUKONM: 1 } }
     //         ]);
     //         //console.log("therapistIds", therapistIds);
     //         console.log("therapistDetailslength", therapistDetails.length);
     
     
     //         // Step 7: Map therapist names to the therapistsData
     //         therapistsData.forEach(therapist => {
     //             const therapistDetail = therapistDetails.find(detail => detail.F21_IDNO === therapist.therapistId);
     //             if (therapistDetail) {
     //                 therapist.therapistName = therapistDetail.F21_SUKONM;
     //             }
     //         });
     
     //         // Step 8: Add startDate and endDate to each therapist data object
     //         therapistsData.forEach(therapist => {
     //             therapist.startDate = startDate;
     //             therapist.endDate = endDate;
     //         });
     
     
     //        // Step 9: Insert into GOA_GROM only if F21_IDNO is not already present
 
     //         const existingIdsInGoaGroom = await stDataModel.GOA_GROMModel.distinct("F21_IDNO"); // Fetch all existing F21_IDNOs in GOA_GROM
     //         const newTherapistsData = therapistsData.filter(
     //             therapist => !existingIdsInGoaGroom.includes(therapist.therapistId) // Filter out therapists that already exist
     //         );
 
     //         if (newTherapistsData.length > 0) {
     //             // Prepare the data to be inserted
     //             const insertData = newTherapistsData.map(therapist => ({
     //                 F21_IDNO: therapist.therapistId,
     //                 F21_SUKONM: therapist.therapistName,
     //                 F_FROMDT: therapist.startDate,
     //                 AMT_GROOM: therapist.Amount,
     //                 ST_BRN: therapist.ST_BRN,
     //                 OLD_GROOM: 0,
     //                 updated_on :new Date(),
     //                 "DBFNAME": "GOA_GROM",
 
 
     //             }));
         
     //             // Insert the filtered data into GOA_GROM
     //             await stDataModel.GOA_GROMModel.insertMany(insertData);
 
     //             console.log("New data inserted into GOA_GROM:", insertData , insertData.length );
     //         } else {
     //             console.log("No new data to insert into GOA_GROM.");
     //         }
 
     //         // Return response with the therapyDetails data
     //         res.status(200).send({
     //             status: true,
     //             therapyDetails: therapistsData,
     //             message: `${newTherapistsData.length} new records added to GOA_GROM.`
     //         });
 
     
     //     } catch (err) {
     //         console.error("Error:", err.message);
     //         res.status(500).send({ status: false, msg: err.message });
     //     }
     // }
 
 
 
     //from date- to date
     groomingDataMonthWise: async function (req, res) {
         try {
            // console.log("Request Body:", req.body);
             var { startDate, endDate } = req.body; // Expecting `startDate` and `endDate` in the request body
 
         if (!startDate || !endDate) {
             return res.status(400).json({ error: "startDate and endDate are required in the format YYYY-MM-DD" });
         }
 
          startDate = baseExport.convertToDate(req.body.startDate);
          endDate = baseExport.convertToDate(req.body.endDate);
         
          var branchArr = [];
            
             var result1 = await therapiesModel.aggregate([
                 {
                     $match: { "therapyType": "Foot" }
                 },
                 {
                     $project: {
                         F22_TCODE: 1,
                         _id: 0
                     }
                 }
             ]);
             var therapyArr = result1.map(item => item.F22_TCODE);
 
             let result2 = await ST_BRNMS.aggregate([
                 {
                     $match: { GOA_YN: "Y" }
                 },
                 {
                     $project: {
                         ST_BRN: 1,
                         _id: 0
                     }
                 }
             ]);
             var branchArr = result2.map(item => item.ST_BRN);
             console.log( "brahcn: ", branchArr);
             console.log("theraphyt: ", therapyArr);
           
             // Step 4: Combine the `branchArr` and `therapyArr` to use in the main query
            
             const query = {};
             query['ST_BRN'] = { "$in": branchArr }; // Filter by ST_BRN
             query['F31_TCODE'] = { "$in": therapyArr }; // Filter by therapy type (F22_TCODE)
             query['REC_YN'] = "Y"; // Static filter for REC_YN
             query['F31_APPTDT'] = {
                 $gte: baseExport.convertToDate(req.body.startDate),  // Match transactions from the start of the month (inclusive)
                 $lte: baseExport.convertToDate(req.body.endDate)   // Match transactions until the end of the month (inclusive)
             };
            // query['CANC_DT'] = "";
     
              console.log("Query Object for F61_APPT:", query);
            const therapistsData = await stDataModel.F61_APPTModel.aggregate([
                 {
                     $match: query
                 },
                 {
                     $addFields: {
                         // Extract the fourth character of the F31_TCODE
                         fourthChar: { $substrBytes: ["$F31_TCODE", 3, 1] }, // Extract fourth character (index 3)
             
                         // Calculate the price based on the fourth character
                         therapyPrice: {
                             $cond: {
                                 if: {
                                     $in: ["$fourthChar", ["1", "2", "3", "4", "5", "6", "7", "8", "9"]]
                                 },
                                 then: {
                                     $multiply: [
                                         70, // Base price
                                         {
                                             $subtract: [
                                                 { $indexOfArray: [["1", "2", "3", "4", "5", "6", "7", "8", "9"], "$fourthChar"] },
                                                 -1
                                             ]
                                         }
                                     ]
                                 },
                                 else: 0   // If it's not a valid number between "1" and "9", set price to 0
                             }
                         }
                     }
                 },
                 {
                     $facet: {
                         therapist1: [
                             {
                                 $match: { F31_IDNO1: { $exists: true, $ne: null } }
                             },
                             {
                                 $project: {
                                     ST_BRN: 1,
                                     therapistId: "$F31_IDNO1",
                                     fourthChar: 1,
                                     therapyPrice: 1
                                 }
                             }
                         ],
                         therapist2: [
                             {
                                 $match: { F31_IDNO2: { $exists: true, $ne: null } }
                             },
                             {
                                 $project: {
                                     ST_BRN: 1,
                                     therapistId: "$F31_IDNO2",
                                     fourthChar: 1,
                                     therapyPrice: 1
                                 }
                             }
                         ]
                     }
                 },
                 {
                     $project: {
                         combined: { $setUnion: ["$therapist1", "$therapist2"] }
                     }
                 },
                 {
                     $unwind: "$combined"
                 },
                 {
                     $replaceRoot: { newRoot: "$combined" }
                 },
                 {
                     $group: {
                         _id: { ST_BRN: "$ST_BRN", therapistId: "$therapistId", therapyNo: "$fourthChar" },
                         count: { $sum: 1 }, // Count the number of occurrences
                         Amount: { $first: "$therapyPrice" } // Get the calculated therapyPrice
                     }
                 },
                 {
                     $group: {
                         _id: "$_id.ST_BRN",
                         therapists: {
                             $push: {
                                 therapistId: "$_id.therapistId",
                                 count: "$count",
                                 Amount: { $multiply: ["$Amount", "$count"] } // Multiply price by count
                             }
                         }
                     }
                 },
                 {
                     $unwind: "$therapists"
                 },
                 {
                     $project: {
                         ST_BRN: "$_id",
                         therapistId: "$therapists.therapistId",
                         count: "$therapists.count",
                         Amount: "$therapists.Amount"
                     }
                 },
                 {
                     $group: {
                         _id: { ST_BRN: "$ST_BRN", therapistId: "$therapistId" },
                         therapiesCount: { $sum: "$count" },
                         Amount: { $sum: "$Amount" }
                     }
                 },
                 {
                     $project: {
                         ST_BRN: "$_id.ST_BRN",
                         therapistId: "$_id.therapistId",
                         therapiesCount: 1,
                         Amount: { $multiply: [70, "$therapiesCount"] } // Multiply total count by 70
                     }
                 }
             ]);
             console.log("Therapists Data:", therapistsData);
     
             // Step 6: Fetch the therapist names from the F21_STAF collection
             const therapistIds = therapistsData.map(data => data.therapistId);
             const therapistDetails = await F21_STAF.aggregate([
                 { $match: { F21_IDNO: { $in: therapistIds } } },
                 { $project: { F21_IDNO: 1, F21_SUKONM: 1 } }
             ]);
             //console.log("therapistIds", therapistIds);
            // console.log("therapistDetails", therapistDetails);
             // Step 7: Map therapist names to the therapistsData
             therapistsData.forEach(therapist => {
                 const therapistDetail = therapistDetails.find(detail => detail.F21_IDNO === therapist.therapistId);
                 if (therapistDetail) {
                     therapist.therapistName = therapistDetail.F21_SUKONM;
                 }
             });
     
             // Step 8: Add startDate and endDate to each therapist data object
             therapistsData.forEach(therapist => {
                 therapist.startDate = startDate;
                 therapist.endDate = endDate;
             });
     
             //console.log("Final Therapists Data:", therapistsData);
     
             // Step 9: Return the response with the aggregated list of therapist IDs, their count, price, startDate, and endDate
             res.status(200).send({
                 status: true,
                 therapyDetails: therapistsData
             });
     
         } catch (err) {
             console.error("Error:", err.message);
             res.status(500).send({ status: false, msg: err.message });
         }
     }
     
 // , F31_APPTDT: { "$gte" :ISODate('2020-02-01T00:00:00.000+00:00'), "$lte" :ISODate('2020-02-29T00:00:00.000+00:00')}
 }
 
 
 
 
 