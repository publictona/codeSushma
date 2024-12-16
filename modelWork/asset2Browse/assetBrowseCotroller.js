/**
 * @Author: Sushma Landge
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
 const querystring = require('querystring');
 
 /*********************
  MODULE PACKAGES
  ********************/
 var model = require('../models/assetTransactionModel.js');
 
 module.exports = {
 
     getAssetReportBrowse: async function (req, res) {
         try {
             var obj = req.body;
             req.body.F21_BRANCH
             await model.find({ F21_BRANCH: obj.F21_BRANCH }, function (err, data) {
                 if (err) {
                     res.status(500).json({ status: true, msg: err.message });
                     console.log(err);
                 }
                 //console.log("data1data1data1", data);
                 data = JSON.parse(JSON.stringify(data));
                 var key = [];
 
                 for (var i = 0; i < data.length; i++) {
                     key.push(data[i].F21_BRANCH);
 
                 }
                 var agg = [
                     {
                         $match:
                             { "F21_BRANCH": { $in: key } }
                     },
                 ];
                 model.aggregate(agg, function (err, data1) {
                     if (err) {
                         res.status(500).json({ status: true, msg: err.message });
                         console.log(err);
                     }
                     data1 = JSON.parse(JSON.stringify(data1));
                    // console.log("data1", data1);
                     res.status(200).send({ status: true, data: data1 });
                 })
             })
 
         } catch (err) {
             console.log(err);
         }
     },
 
     getAssetReportBrowse1: async function (req, res) {
         try {
             var obj = req.body;
             // console.log(req.body.F21_BRANCH);
 
             var agg = [
                 {
                     $match:
                         { "F21_BRANCH": req.body.F21_BRANCH }
                 },
                 {
                     $unwind: "$Asset_Trans"
                 },
                 {
                     $match:
                         { "F21_BRANCH": req.body.F21_BRANCH }
                 },
                 {
                     $group: {
                         _id: "$Asset_Trans.itemCode",
                         totalAmount: { $sum: "$Asset_Trans.fixedQuantity" },
                         count: { $sum: 1 }
                     },
                 },
 
             ];
             model.aggregate(agg, function (err, data1) {
                 if (err) {
                     console.log(err);
                 }
                 data1 = JSON.parse(JSON.stringify(data1));
                 //console.log(data1);
                 res.status(200).send({ status: true, data: data1 });
             })
         } catch (err) {
             console.log(err);
         }
     },
 }