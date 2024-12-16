/*********************************
CORE PACKAGES
**********************************/
const _ = require("underscore");
var baseExport = require("../baseExporter.js");
const async = require("async");
const moment = require("moment-timezone");
/*********************************
MODULE PACKAGES
**********************************/
var stDataModel = require("../models/stDataModel.js");
module.exports = {
  master:function(req,res){
     try{
      var obj=req.body;
      var query={};
        if(obj.request_type){
          query.request_type=obj.request_type;
        }
        if(obj.fromDate){
          query.request_date={$gte:baseExport.convertToDateNew(obj.fromDate),$lte:baseExport.convertToDateNew(obj.toDate)};
        }
        stDataModel.hotelItemModel.find(query,function(err,data){
          if(err){
            res.status(500).json({status:false,message:err.message});
          }
          data=JSON.parse(JSON.stringify(data));
          res.status(200).json({status:true,message:"",data:data});
        });
     }catch(e){
       console.log(e);
     }
  },
  saveRequest:function(req,res){
    try{
      var obj=req.body;
      // console.log(obj);
      if(obj.request_date){
        obj.request_date=baseExport.convertToDateNew(obj.request_date);
      }
      obj.request_Qty=(obj.request_Qty)?parseInt(obj.request_Qty):0;
      obj.receive_Qty=(obj.receive_Qty)?parseInt(obj.receive_Qty):0;
      stDataModel.hotelItemModel.create(obj,function(err,data){
        if(err){
          res.status(500).json({status:false,message:err.message});
        }
        res.status(200).json({status:true,message:"Request Saved Successfully"});
      });
    }catch(e){
      console.log(e);
    }
  },
  BC_MASTER:function(req,res){
    try{
     var obj=req.body;
     var query={};
       if(obj.master_type){
         query.master_type=obj.master_type;
       }
       stDataModel.BC_MASTERModel.find(query,function(err,data){
         if(err){
           res.status(500).json({status:false,message:err.message});
         }
         data=JSON.parse(JSON.stringify(data));
         res.status(200).json({status:true,message:"",data:data});
       });
    }catch(e){
      console.log(e);
    }
 },
 saveBcRequest:function(req,res){
  try{
    var obj=req.body;

    if(obj.master_id){
      obj.master_id=parseInt(obj.master_id);
      // obj.updatedOn=new Date();
      // obj.updatedBy=obj.staf_id;
      stDataModel.BC_MASTERModel.findOneAndUpdate({
        master_id:parseInt(obj.master_id),master_type:obj.master_type
      },{$set:obj},{},function(err,data){
        if(err){
          res.status(500).json({status:false,message:err.message});
        }
        res.status(200).json({status:true,message:"Master Updated Successfully"});
      });
    }else{
      stDataModel.BC_MASTERModel.findOne({master_type:obj.master_type},{},{sort:{master_id:1}},function(err,data){
        if(err){
          res.status(500).json({status:false,message:err.message});
        }
        data=JSON.parse(JSON.stringify(data));
        obj.master_id=1;
        if(data){
          obj.master_id=data.master_id+1;
        }
        stDataModel.BC_MASTERModel.create(obj,function(err,data){
          if(err){
            res.status(500).json({status:false,message:err.message});
          }
          res.status(200).json({status:true,message:"Master Saved Successfully"});
        });
    });
    }    
  }catch(e){
    console.log(e);
  }
},
itemList:function(req,res){
  var obj=req.body;
  var query={};
  if(obj.type){
    query.INV_TYPE=obj.type;
  }
  if(obj.group){
    query.ITEM_GROUP=obj.group;
  }
  stDataModel.INV_MASTERModel.find(query,function(err,data){
    if(err){
      res.status(500).json({status:false,message:err.message});
    }
    data=JSON.parse(JSON.stringify(data));
    res.status(200).json({status:true,message:"Master Updated Successfully",data:data});
  });
},
saveDailyStock:function(req,res){
  var obj=req.body;
  obj.date=baseExport.convertToDateNew(obj.date);
  for(var i=0;i<obj.items.length;i++){
    obj.items[i].item_order=(obj.items[i].item_order)?parseInt(obj.items[i].item_order):0;
    obj.items[i].item_balance=(obj.items[i].item_balance)?parseInt(obj.items[i].item_balance):0;
  }
  stDataModel.INV_STOCKModel.findOne({date:obj.date},{date:1},{},function(err,data){
    if(err){
      res.status(500).json({status:false,message:err.message});
    }
    data=JSON.parse(JSON.stringify(data));
    if(data){
      obj.updatedOn=baseExport.convertToDate(baseExport.dateFormat(new Date()));
      stDataModel.INV_STOCKModel.update({date:obj.date},{$set:obj},{},function(err){
        if(err){
          res.status(500).json({status:false,message:err.message});
        }else{
          res.status(200).json({status:true,message:"Data Updated Successfully"});
        }
      })
    }else{
      obj.createdOn=baseExport.convertToDate(baseExport.dateFormat(new Date()));
      stDataModel.INV_STOCKModel.create(obj,function(err){
        if(err){
          res.status(500).json({status:false,message:err.message});
        }else{
          res.status(200).json({status:true,message:"Data Created Successfully"});
        }
      })
    }
  });
},
getStockData:function(req,res){
  var obj=req.body;
  obj.date=baseExport.convertToDateNew(obj.date);
  stDataModel.INV_STOCKModel.findOne({date:obj.date},{},{},function(err,data){
    if(err){
      res.status(500).json({status:false,message:err.message});
    }
    data=JSON.parse(JSON.stringify(data));
    res.status(200).json({status:true,data:data});
  });
}
};
