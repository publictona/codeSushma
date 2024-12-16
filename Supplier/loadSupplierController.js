/***********************
 CORE PACKAGES
 **********************/
 const express = require('express');
 var q = require('q');
 var jwt = require('jsonwebtoken');
 var util = require('../routes/util.js');
 var baseExport = require('../baseExporter.js');
 const moment=require('moment');
 var F_SUPPCONTRACTModel=require('../models/F_SUPPCONTRACTModel.js');
 /*********************
  MODULE PACKAGES
  ********************/
 
 const rsDataModel = require('../models/rsDataModel.js');
module.exports = {
    getMaster:function(req,res){
        async.parallel({
            MKT_MAST:function(cb){
                rsDataModel.MKT_MASTModel.find({},function(err,dataMast){
                    if(err){
                        cb(err);
                    }else{
                        dataMast=JSON.parse(JSON.stringify(dataMast));
                        cb(null,dataMast)
                    }
                })  
            },
            F74_PAPR:function(cb){
                rsDataModel.F74_PAPRModel.find({},function(err,dataMast){
                    if(err){
                        cb(err);
                    }else{
                        dataMast=JSON.parse(JSON.stringify(dataMast));
                        cb(null,dataMast)
                    }
                })  
            }
        },function(err,result){
            if(err){
                return res.status(500).json({status:false,message:err.message});
            }else{
                return res.status(200).json({status:true,message:"",data:result});
            }
        })
    },
    saveAd:function(req,res){
        var obj=req.body;
        console.log(obj);
        obj.tranNo=parseInt(obj.tranNo);
        // obj.artWorkReadyOn=(obj.artWorkReadyOn)?baseExport.convertToDateNew(obj.artWorkReadyOn):'';
        // obj.publishDate=(obj.publishDate)?baseExport.convertToDateNew(obj.publishDate):'';
        console.log(obj);
        if(obj.tranNo){
            F_SUPPCONTRACTModel.findOneAndUpdate({tranNo:obj.tranNo},{$set:obj},{},function(err){
                if(err){
                    return res.status(500).json({status:false,message:err.message});
                }
                return res.status(200).json({status:true,message:"Ad Details Updated Successfully",data:obj});
            });
        }else{
            F_SUPPCONTRACTModel.findOne({},{tranNo:1},{sort:{tranNo:-1}},function(err,tranData){
                if(err){
                    return res.status(500).json({status:false,message:err.message});
                }
                tranData=JSON.parse(JSON.stringify(tranData));
                obj.tranNo=1;
                if(tranData){
                    obj.tranNo=tranData.tranNo+1;
                }
                obj.createdOn=new Date();   
                obj.createdBy=req.session.user.uid;
                obj.tranId=req.session.user.uid;
                obj.tranDt=baseExport.convertToDateNew(moment().format('DD/MM/YYYY'));
                F_SUPPCONTRACTModel.create(obj,function(err){
                    if(err){
                        return res.status(500).json({status:false,message:err.message});
                    }
                    return res.status(200).json({status:true,message:"Ad Details Saved Successfully",data:obj});
                });
            })
        }
        
    },
    getDetails:function(req,res){
        var obj=req.body;
        obj.tranNo=parseInt(obj.tranNo);
        F_SUPPCONTRACTModel.findOne({tranNo:obj.tranNo},function(err,tranData){
            if(err){
                return res.status(500).json({status:false,message:err.message});
            }
            tranData=JSON.parse(JSON.stringify(tranData));
            return res.status(200).json({status:true,message:"Ad Details find Successfully",data:tranData});
        });
    }
};