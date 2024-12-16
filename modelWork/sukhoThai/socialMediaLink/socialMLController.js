/**
 * @Author: Sushma Landge
 */

/***********************
 CORE PACKAGES
 **********************/
 const express = require('express');
 var q = require('q');
 var jwt = require('jsonwebtoken');
 //var util = require('../routes/util.js');
 var baseExport = require('../baseExporter.js');
 
 /*********************
  MODULE PACKAGES
  ********************/
 
 const model = require('../models/socialMediaLinksModel.js');
 const masterModel = require('../models/socialMediaLinksMasterModel.js');
 const seriesToBranchMappingModel = require('../models/seriesToBranchMappingModel.js');

 
 module.exports = {
    // linkList : [
    //     { Facebook_Name : "facebook.com"},
    //     { Facebook_Name  : "instagram.com"}
    
    // ]

    //socialMediaName : socialMediaLinkKeyName
 
    
 
 
     create: async function (req, res) {
        try {
            const { ST_BRN ,linkList ,DBFNAME } = req.body;
    

            const dataDoc = new model({
                ST_BRN: ST_BRN || "",
                linkList : linkList || "",
               
                DBFNAME: DBFNAME || "socialMediaLinks"
            });
    
            // Save the document to the database
            console.log("dataDocdataDocdataDocdataDoc" , dataDoc)
            const data = await dataDoc.save();

    
            // Respond with success message and the saved data
            res.status(200).json({ status: true, msg: "Data saved", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: false, msg: "Internal server error" });
        }
     },
 
     griddata: async function (req, res) {
         try {
             // console.log(req.body);
             var query = {};
             var limit = req.body.limit ? parseInt(req.body.limit) : 500;
             var search_by = req.body.search_by ? req.body.search_by : "";
             //var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
             var sort_by = "_id";
             var order = "desc";
             // var order = req.body.order ? req.body.order : "asc";
             var page = req.body.page ? parseInt(req.body.page) : 0;
             var columns = req.body.columns ? req.body.columns : [];
             var filter_columns = {};
             var draw = req.body.draw ? parseInt(req.body.draw) : 1;
             var start = req.body.start ? parseInt(req.body.start) : 0;
 
             if (req.body.search_query) {
                 var search_query = req.body.search_query;
 
                 if (search_query.F_TYPE) {
                     query.F_TYPE = search_query.F_TYPE;
                 }
             } else {
             }
             // console.log( "dddddddddd",query)
             var table_format = req.body.table_format ? req.body.table_format : "datatable";
 
             q.all(baseExport.grid('socialMediaLinks', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                 // console.log("LTC_KMS" , result)
                 res.json(result);
             });
 
         } catch (err) {
 
         }
     },
     getdata: async function (req, res) {
         try {
             var id = req.query.id;
             var data = await model.findById(id);
             //res.json(data);
             res.status(200).json({ status: true, msg: "data saved", data });
 
         } catch (e) {
             console.log(e);
         }
     },
     updateData: async function (req, res) {
         try {
 
             var data = await model.findByIdAndUpdate(req.params.id, { $set: req.body });
             res.status(200).json({ status: true, msg: "data updated", data });
 
         } catch (e) {
             console.log(e);
         }
     },

    getDataFromMaster:function (req,res){
         try {
            masterModel.find({},function(err,linkList){
                 if(err){
                     res.status(500).json({ status: false, msg: err.message });
                 }
                // console.log(linkList)
                 linkList=JSON.parse(JSON.stringify(linkList));
                 res.status(200).json({ status: true, msg: "Get Data", linkList:linkList });
 
             }).select("socialMediaName socialMediaLinkKeyName")
         } catch (e) {
             console.log(e);
         }
     },

    



        addLink : async function(req, res) {
        try {
            const branchKey = req.params.ST_BRN;
    
            const data = await masterModel.find({ ST_BRN: branchKey });
            console.log("datadatadatadatadata" , data);
            res.json(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


 
 }
 
 