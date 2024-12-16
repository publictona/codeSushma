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
            // await model.find({F21_BRANCH: "D8"}, function (err, data) {
            //     if (err) {
            //         res.status(500).json({ status: true, msg: err.message });
            //         console.log(err);
            //     }
            //     //console.log( "data1data1data1",data);
            //     data = JSON.parse(JSON.stringify(data));
            //     var key = [];
            //     //console.log("keykey" , key)
            //     for (var i = 0; i < data.length; i++) {
            //         key.push(data[i].F21_BRANCH);
                   
            //     }
            //     var agg = [
            //         {
            //             $match:
            //                 { "F21_BRANCH": { $in: key } }
            //         },
            //         {
            //             $group:{}
            //         }

            //      ];
            //     model.aggregate(agg , function (err, data1) {
            //         if (err) {
            //             res.status(500).json({ status: true, msg: err.message });
            //             console.log(err);
            //         }
            //         data1= JSON.parse(JSON.stringify(data1));
            //         console.log("data1",data1);
            //         res.status(200).send({ status: true, data: data1 });
            //     })
            // })
            var agg = [
                        {
                            $match:
                                { "F21_BRANCH": "D8" }
                        },
                        {
                            $unwind:"$Asset_Trans"
                        },
                        {
                            $group:{_id:{
                                itemCode:"$Asset_Trans.itemCode"
                                        }
                                    }
                        }
                        
    
                     ];
            model.aggregate(agg,function(err, data1){
                if(err){
                    console.log(err);
                }
                data1= JSON.parse(JSON.stringify(data1));
                console.log(data1);
                res.status(200).send({ status: true, data: data1 });
            })
        } catch (err) {
            console.log(err);
        }
    },
}