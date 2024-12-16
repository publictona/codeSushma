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
 
 const model = require('../models/ST_MASTRModel.js');
 
 module.exports = {

    create: async function (req, res) {
        try {
             console.log(req.body);
             var obj = req.body
               var {F_TYPE ,F_CODE ,F_CODE12 , F_CODE10, DBFNAME , updated_on} =  obj 

    //            const unique = await bookmodel.findOne({ title: data.title })
    // if (uniqueTitle) {
    //   return res.status(400).send({ status: false, msg: "This Title  already exists " })
    // }
              
               var dataDoc = new model({
                F_TYPE: F_TYPE ? F_TYPE : "",
                F_CODE: F_CODE ? F_CODE : "",
                F_CODE12: F_CODE12 ? F_CODE12 : "",
                F_CODE10: F_CODE10 ? F_CODE10 : "",
                DBFNAME: "ST_MASTR",
                //updated_on: updated_on,
                
               
            });
            console.log("dataDoc" ,  dataDoc)

             var data = await dataDoc.save()
             res.status(200).send({ status: true, msg: "data saved" ,  data })

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
             //var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
             var sort_by ="_id";
             var order =  "desc";
            // var order = req.body.order ? req.body.order : "asc";
             var page = req.body.page ? parseInt(req.body.page) : 0;
             var columns = req.body.columns ? req.body.columns : [];
             var filter_columns = {};
             var draw = req.body.draw ? parseInt(req.body.draw) : 1;
             var start = req.body.start ? parseInt(req.body.start) : 0;
               
             if (req.body.search_query) { 
                 var search_query = req.body.search_query;
               
                 if(search_query.F_TYPE){
                    query.F_TYPE = search_query.F_TYPE;
                }
             } else {
             }
            // console.log( "dddddddddd",query)
             var table_format = req.body.table_format ? req.body.table_format : "datatable";
 
             q.all(baseExport.grid('ST_MASTR', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
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
            res.status(200).json({ status: true, msg: "data updated" ,data});

        } catch (e) {
            console.log(e);
        }
    }

 
 }
 
 