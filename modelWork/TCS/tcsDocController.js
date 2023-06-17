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
 
var authentication = require('../authentication.js');
var rsDataModel = require('../models/rsDataModel.js');
var F21_SLMSModel = require('../models/F21_SLMSModel.js');
var tempBookingModel = require('../models/tempBookingModel.js');
 
 /*********************
  MODULE PACKAGES
  ********************/
 
 const tcs = require('../models/tcsModel.js');
 
 module.exports = {
 
  //post
     create: function (req, res) {
        try {
            var obj = req.body;
            rsDataModel.TCS_CertificateModel.create(obj, function (err, obData) {
                if (err) {
                    res.status(500).send({ status: false, msg: err.msg })
                }
                obData = JSON.parse(JSON.stringify(obData));
                //console.log("jjjjjjjjjjjjjjjjjjjjjjjj" , obData)
                res.status(200).send({ status: true, msg: "save", data:obData })
            })
    
        } catch (err) {
            console.log(err);
            res.status(500).send({ status: false, msg: msg.err });
        }
    },

//get  localhost:3000/route/financeTcs/master
    master: function (req, res) {
      try {
         
          res.render('financeTcs/docTcs', {
              "username": req.session.user.cn,
              "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
              "menu": req.session.menu,
              "kname": req.session.user.cn,
              "rsid": req.session.user.uid,
              "department": req.session.user.department,
              "branch": req.session.user.other_info[0].F21_BRANCH,
              "title": 'Rescheduling Email master',
              "AccessToken": req.session.user.token,
              "token": req.session.token
          }, function (err, html) {
              if (err) {
                  console.log(err);
                  res.send(err);
              }
              res.send(html);
          });
      } catch (err) {
          console.log(err);
      }
  },

    
    //post
     docMasterList: function (req, res) {
        var obj=req.body;
        var query={};
        if(obj.panNo){
          query["pan_no"]=parseInt(obj.panNo);
        }
        if(obj.year){
          query["year"]=obj.year;
        }
        if(obj.file){
          query["file"]=obj.file;
        }
        rsDataModel.TCS_CertificateModel.find(query,function (err, data) {
            if (err) {
              return res.status(500).json( {
                  status:false,
                  message: 'Error '
              });
            }
            data=JSON.parse(JSON.stringify(data));
            return res.json({
              status:true,
              data: data
            });
        });
    
      },
 }
 
 