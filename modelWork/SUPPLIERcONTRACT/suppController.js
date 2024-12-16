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
 var model =require('../models/rs_F_SUPMSTModel.js');
 
 
 module.exports = {
        create: function (req, res) {
        try {
           req.body.meetingDate=baseExport.convertToDateNew(req.body.meetingDate);
           F_SUPP.findOne({}).sort({tranNo:-1}).exec(function(err,data1){
               if(err){
               }
               data1 =JSON.parse(JSON.stringify(data1));
               if(data1 != null){
                   req.body.tranNo=data1.tranNo+1;
               }else{
                   req.body.tranNo = 1;
               }
               
               F_SUPP.create(req.body,function(err){
                  if(err){
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
 
             q.all(baseExport.grid('F_SUPP', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                 res.json(result);
             });
 
         } catch (err) {
 
         }
     },
     getData: async function (req, res) {
         try {
             var id = req.query.id;
             var data = await F_SUPP.findById(id);
             //res.json(data);
             res.status(200).json({ status: true, msg: "data saved", data });
 
         } catch (e) {
             console.log(e);
         }
     },
     update: async function (req, res) {
         try {
             // console.log(req.body);
             // console.log(req.params.id);
             var data = await F_SUPP.findByIdAndUpdate(req.params.id, { $set: req.body });
 
             res.status(200).json({ status: true, msg: "data updated" });
 
         } catch (e) {
             console.log(e);
         }
     },
     getShipmentBranchDetails: async function(req,res){
        try {
            var obj=req.body;
            var ST_BRNMSResult = await model.findOne({F_HLPNAME:obj.F_HLPNAME});
            //console.log(ST_BRNMSResult)
            return res.status(200).json({
                "Data": ST_BRNMSResult
            })
        } catch (error) {
            console.log(error);
        }
    },

    // getShipmentBranchDetails: async function(req,res){
    //     try {
    //         var obj=req.body;
    //         var ST_BRNMSResult = await model.findOne({F_SUPPNO:obj.F_SUPPNO});
    //         //console.log(ST_BRNMSResult)
    //         return res.status(200).json({
    //             "Data": ST_BRNMSResult
    //         })
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },

    category: function(req, res) {
        model.find({}).distinct(("F_CATCODE"), function(err, F_SUPMST) {
            if (!err) {
                // res.setHeader('Access-Control-Allow-Origin','*');
               // console.log(F_SUPMST)
                return res.json(F_SUPMST);
            } else {
                return res.json(500, {
                    message: 'Error getting Zone.'
                });
            }
        });
    },

    supplier: function(req, res) {
        var query = {};
        var supplier = req.params.supplier;
        var place = req.params.place;
        if(supplier){ query['F_CATCODE'] = supplier; }
        if(place){ query['F_PLACECD'] = place; }
        model.find(query, function(err, F_SUPMST) {
            if (!err) {
                
                return res.json(F_SUPMST);
            } else {
                return res.json(500, {
                    message: 'Error getting Zone.'
                });
            }
        }).select("F_SUPPNO F_SUPCD F_HLPNAME F_PLACECD F_CATCODE F_NAME F_LOGIN F_BKACODE F_NICKNAME F_CONTACT F_ADD1 F_ADD2 F_ADD3 F_PLACE F_PIN F_STATE F_COUNTRY F_TEL F_MOBILE F_HTLGRADE KT_BRANCH DMC_CODE");
    },
 }
 
 