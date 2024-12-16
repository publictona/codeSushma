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
 
 const model = require('../models/VISA_FEEModel.js');
 const NRS_MAST = require('../models/nrs_mastModel.js')
 var rsDataModel = require('../models/rsDataModel.js'); 


 
 
 module.exports = {
     create: function (req, res) {
        try {
            // console.log(req.body);
            const User = new model(req.body);
            
            const data = User.save();
            //console.log("datadata" , data)
            res.status(200).send({ status: true, msg: "data saved", Data:data})

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
 
             q.all(baseExport.grid('VISA_FEE', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                console.log("resultresultresult" , result)
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
             var obj=req.body;
             var data = await model.findByIdAndUpdate(req.params.id, {$set: obj}); //$addToSet: { Actions: obj.tourSeries }
             res.status(200).json({ status: true, msg: "data updated" , data });
 
         } catch (e) {
             console.log(e);
         }
     },
 
   //for Supplier Detail F_CATCODE
    //  getsupplierDetails: async function (req, res) {
    //      try {
    //          var obj = req.body;
    //          var ST_BRNMSResult = await model.findOne({ F_HLPNAME: obj.F_HLPNAME , F_CATCODE :obj.F_CATCODE });
    //          //console.log(ST_BRNMSResult)
    //          return res.status(200).json({
    //              "Data": ST_BRNMSResult
    //          })
    //      } catch (error) {
    //          console.log(error);
    //      }
    //  },




     getVisaTypeData: function (req, res) {
        
        NRS_MAST.find({ NRS_FLAG: 'VISA_TYPEX' }, function (err, data) {
             if (!err) {
                 
                  console.log(data)
                 return res.json(data);
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         }).select("NRS_CODE1");
     },

     getPpHoldData: function (req, res) {
        
        NRS_MAST.find({ NRS_FLAG: 'PP_HOLDERX' }, function (err, data) {
             if (!err) {
                 
                  console.log(data)
                 return res.json(data);
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         }).select("NRS_CODE1");
     },


     getCurrencyData: function (req, res) {
        
        rsDataModel.CURRENCYModel.find({}, function (err, data) {
             if (!err) {
                 
                  console.log(data)
                 return res.json(data);
             } else {
                 return res.json(500, {
                     message: 'Error getting Zone.'
                 });
             }
         }).select("CUR_CODE");
     },
  
 
    
 
    //  category: function (req, res) {
    //      model.find({}).distinct(("F_CATCODE"), function (err, F_SUPMST) {
    //          if (!err) {
    //              // res.setHeader('Access-Control-Allow-Origin','*');
    //              // console.log(F_SUPMST)
    //              return res.json(F_SUPMST);
    //          } else {
    //              return res.json(500, {
    //                  message: 'Error getting Zone.'
    //              });
    //          }
    //      });
    //  },
 
  
}
 
 