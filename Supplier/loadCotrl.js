/***********************
 CORE PACKAGES
 **********************/
 const express = require('express');
 var q = require('q');
 var jwt = require('jsonwebtoken');
 var util = require('../routes/util.js');
 var baseExport = require('../baseExporter.js');
 const moment=require('moment');
 var model=require('../models/F_SUPPCONTRACTModel.js');
 /*********************
  MODULE PACKAGES
  ********************/
 
 const rsDataModel = require('../models/rsDataModel.js');
module.exports = {



  shipmentMaster: (req, res)=>{
        // console.log(req.body);
        return res.status(200).json({
            "Data": "Successfully get the data"
        });
    },

    

    shipmentMasterDocument: async function(req, res){
        try {
            var {tranNo,tourSeries,fromDate,toDate,contract_content,file,srNo} = req.body;
          
            
            var result = await model.findOne({tranNo:parseInt(tranNo)});
            if(result){
                
                 //console.log(result);
                model.findOneAndUpdate({tranNo:parseInt(tranNo)}, {$set:(req.body)}, {}, function(error){
                    if(error){
                        return res.status(500).json({
                            "Data": "Unsuccessful, Not Updated  Details"
                        });
                    }else{
                        return res.status(200).json({
                            "Data": "Successfully Updated  Details"
                        }); 
                    }
                });
            }else{
                // console.log(req.body);
                model.findOne({},{},{sort:{tranNo:-1}},async function (err,dataTran){
                dataTran=JSON.parse(JSON.stringify(dataTran));
                var tranNo=1;
                if(dataTran && dataTran.tranNo){
                    tranNo=dataTran.tranNo+1; 
                }

                // var tranNo = 1;
                // if(tranNo){
                //     tranNo = tranNo+1
                // };

                var doc = new model({ 
                tranNo:tranNo,
                srNo:srNo,
                tourSeries:tourSeries,
                 toDate:toDate,
                fromDate:fromDate,
                contract_content:contract_content,
                file:file,
                });
                //console.log(doc)

                var result = await doc.save();

                return res.status(200).json({
                    "Data": "Successfully Saved shipment Details"

                });  
            });
            }
        } catch (error) {
            console.log(error)
        }
    },  

    shipmentMasterDocumentGet: async function(req, res){
        try {
            var obj = {
            
            };
            var result = await model.find(obj);
            // console.log(result);
            
            return res.status(200).json({
                "Data": result
            });
            
        } catch (error) {
            console.log(error)
        }
    },

    getShipmentDataById:async function(req,res){
        try {
            var obj=req.body;
            var result = await model.findOne({tranNo:parseInt(obj.tranNo)});

            return res.status(200).json({
                "Data": result
            });
        } catch (error) {
            console.log(error);
        }
    },

   

   


    gridData: async function (req, res) {
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

            q.all(baseExport.grid('F_SUPPCONTRACT', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
               //console.log("rrrrrrrrrrrrrr" , result)
                res.json(result);
            });

        } catch (err) {

            console.log("eeeeeeeerrrrrrrrr" , err)

        }
    },

};