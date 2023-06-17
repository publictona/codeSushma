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
const moment = require('moment');
/*********************
 MODULE PACKAGES
 ********************/

const rsDataModel = require('../models/rsDataModel.js');

module.exports = {
    getComplementaryVou: async function (req, res) {

        try {

            var obj = req.body;

            //in history model all tourcode history is available
            rsDataModel.historyModel.find({ F_TCD: obj.tourCode, F_FORM: parseInt(obj.tourForm), F_UPDFLG: "" }, function (err, formData) {
                if (err) {
                    res.status(500).send({ status: false, msg: err.message });
                }
                formData = JSON.parse(JSON.stringify(formData));

                //

                rsDataModel.TR_CMPHDModel.findOne({ F_TCD: obj.tourCode, F_FORM: parseInt(obj.tourForm) }, async function (err, checkVoucher) {
                    if (err) {
                        res.status(500).send({ status: false, msg: err.message });
                    }
                    checkVoucher = JSON.parse(JSON.stringify(checkVoucher));
                    //console.log(checkVoucher)
                    if (checkVoucher) {
                        return res.status(200).send({ status: true, message: "voucher already exist" })
                    } else {
                        var obCount = {
                            fname: "",
                            lname: "",
                            maleAdCount: 0,
                            femaleAdCount: 0,
                            chI: 0,
                            chD: 0,
                            paxCount: 0,
                            tourName: ""
                        };

                        for (let i = 0; i < formData.length; i++) {
                            obCount.paxCount++;
                            if (formData[i].F_REM == "H") { // F_REM ===H remark headPerson
                                obCount.fname = formData[i].F_FNAME;
                                obCount.lname = formData[i].F_SNAME;
                                obCount.tourName = formData[i].TOURNAME;
                            }
                            if (formData[i].F_AGE > 11) {
                                if (formData[i].F_MF === "M") {
                                    obCount.maleAdCount++;
                                } else if (formData[i].F_MF === "F") {
                                    obCount.femaleAdCount++;
                                }
                            } else {
                                if (formData[i].TM_ID === "I") {
                                    if (formData[i].F_AGE > 1 && formData[i].F_AGE < 12) {
                                        obCount.chI++;
                                    }
                                } else if (formData[i].TM_ID === "D") {
                                    if (formData[i].F_AGE > 4 && formData[i].F_AGE < 12) {
                                        obCount.chD++;
                                    }
                                }
                            }
                            // console.log(formData[i])
                        };

                        //here we find first two letters of tourcode using substring

                        var tourcmpl = await rsDataModel.TOURCMPLModel.find({ TOURCODE: obj.tourCode.substr(0, 2) });
                        tourcmpl = JSON.parse(JSON.stringify(tourcmpl)); //when you write any query always write this line
                        async.eachSeries(tourcmpl, async function (item, cb) { //callback 

                            var itemNm = await rsDataModel.ITEMNOModel.findOne({ ITM_NO: item.ITM_NO })
                            if (itemNm) {
                                item.ITM_DESC1 = itemNm.ITM_DESC1;
                            } else {
                                item.ITM_DESC1 = "";
                            }
                            switch (item.COMPL_TYPE) {

                                case "Per Person": item.F_QTY = obCount.paxCount; break;

                                case "Child Age 2-11": item.F_QTY = obCount.chD; break;
                            }

                            cb();

                        }, async function (err) {
                            if (err) {
                                res.status(500).send({ status: false, msg: err.message });
                            }

                            var tourcmphd = await rsDataModel.TRCMP_HDModel.findOne({}, { F_TRANNO: 1 }, { sort: { F_TRANNO: -1 } });
                            tourcmphd = JSON.parse(JSON.stringify(tourcmphd));
                            var tranNo = 1;
                            if (tourcmphd) {
                                tranNo = tourcmphd.F_TRANNO + 1;
                            }

                            var ob = {
                                "DBFNAME": "TRCMP_HD",
                                "DBFKEY": "F_TRAPPNNO",
                                "F_TRANNO": tranNo,
                                "F_TRANDT": baseExport.convertToDateNew(baseExport.dateFormat(new Date())), ///baseExport.dateFormat(new Date()), //or we use moment also whatever format we want //moment().format('D MMMM YYYY')
                                "F_FORM": parseInt(obj.tourForm),
                                //obCount Value (obj created)
                                "F_SNAME": obCount.lname,
                                "F_FNAME": obCount.fname,
                                "F_ADMALE": obCount.maleAdCount,
                                "F_ADFEMALE": obCount.femaleAdCount,
                                "F_CH13_19": obCount.chI,
                                "F_CH3_12": obCount.chD,
                                "TOURNAME": obCount.tourName,//tourname
                                "GIVEN_____": "",
                                "F_GIVEID": "",
                                "F_GIVEDT": "",
                                "F_GIVETM": "",
                                "CREATE____": "",
                                "F_CREID": req.session.user.uid,
                                "F_CREDT": new Date(),
                                "KT________": "",
                                "KT_SYSLOG": "ADD", // we want to add data then give Key "ADD" else "UPD"
                                "KT_BRANCH": req.session.user.other_info[0].F21_BRANCH, //branch address
                                "KC_KEY": "",
                                "vouItems": tourcmpl //our voucher items array like :- cap , bag
                            };
                            //console.log(ob)




                            rsDataModel.TRCMP_HDModel.create(ob, function (err, obData) { //save data here
                                if (err) {
                                    res.status(500).send({ status: false, msg: err.msg })
                                }
                                obData = JSON.parse(JSON.stringify(obData));

                                //here we are find a kesari branch address in BKAGENTModel we get whole obj whatever key we want we can get like 
                                BKAGENTModel.findOne({ BKA_CODE: req.session.user.other_info[0].F21_BRANCH }, function (err, dat3) {
                                    if (err) {
                                        res.status(500).send({ status: false, msg: err.msg })
                                    }
                                    dat3 = JSON.parse(JSON.stringify(dat3));
                                   //for barcode code we write code usig tran no
                                    var src = '';
                                    bwipjs.toBuffer({
                                        bcid: 'code128',
                                        text: tranNo.toString(),//tran no
                                        scale: 3,
                                        height: 10,
                                        includetext: true,
                                        textxalign: 'center',
                                    }, function (err, png) {
                                        if (err) {
                                            res.status(500).json({
                                                status: "Faild-1",
                                                message: err
                                            });

                                        } else {
                                            src = Buffer.from(png).toString('base64');
                                            src = 'data:image/png;base64,' + src;
                                        }

//whatever we are render data we check using console whether that data is print or not if that data is not console meanse problem in backend not in ejs  and if data is printed but still problem in ejs file not shown check ejs code try to print simple html tag like <h1>susham</h1>
                                        res.render("booking/tour_Complementary", {
                                            isEdit: false,
                                            ob: obData,// my data object
                                            branchData: dat3, // branch address key
                                            imgSrc: src,//for barcode
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
                                                console.log("errrrrrrrrrrrrrrrr");

                                                res.status(500).json({
                                                    status: "Faild",
                                                    message: err
                                                });
                                            } else {
                                                // console.log("htmjjjjjjjjjjl", html);
                                                res.status(200).json({
                                                    status: "success",
                                                    message: "success",
                                                    data: html
                                                });
                                            }
                                            //res.send(html)
                                        });

                                    });
                                })
                            })
                        });
                    }

                })
            })
        } catch (err) {
            console.log(err);
            res.status(500).send({ status: false, msg: msg.err });
        }
    },
//for branch address function
    branchData: function (cb) {
        rsDataModel.BKAGENTModel.findOne({
            BKA_CODE: req.session.user.other_info[0].F21_BRANCH
        }, function (err, brnData) {
            if (err) {
                cb(err);
            }
            brnData = JSON.parse(JSON.stringify(brnData));
            cb(null, brnData);
        });
    },

}


//------------------------------------------------------------------------------------------------------------------------------
/**
 * @Author: Sushma Landge
 */

/***********************
 CORE PACKAGES
 **********************/
//  const express = require('express');
//  var q = require('q');
//  var jwt = require('jsonwebtoken');
//  var util = require('../routes/util.js');
//  var baseExport = require('../baseExporter.js');
//  const moment = require('moment');
//  const bwipjs = require('bwip-js');
 
//  const rsDataModel = require('../models/rsDataModel.js');
 
 
//  module.exports = {
//      getComplementaryVou: async function (req, res) {
//          try {
//              var obj = req.body;
//              rsDataModel.historyModel.find({ F_TCD: obj.tourCode, F_FORM: parseInt(obj.tourForm), F_UPDFLG: "" }, function (err, formData) {
//                  if (err) {
//                      res.status(500).send({ status: false, msg: err.message });
//                  }
//                  formData = JSON.parse(JSON.stringify(formData));
//                  console.log("formDataformDataformData" , formData)
 
 
//                  rsDataModel.TR_CMPHDModel.findOne({ F_TCD: obj.tourCode, F_FORM: parseInt(obj.tourForm) }, async function (err, checkVoucher) {
//                      if (err) {
//                          res.status(500).send({ status: false, msg: err.message });
//                      }
//                      checkVoucher = JSON.parse(JSON.stringify(checkVoucher));
 
//                      if (checkVoucher) {
//                          return res.status(200).send({ status: true, message: "voucher already exist" })
//                      } else {
//                          var obCount = {
//                              fname: "",
//                              lname: "",
//                              maleAdCount: 0,
//                              femaleAdCount: 0,
//                              chI: 0,
//                              chD: 0,
//                              paxCount: 0,
//                              tourName: ""
//                          };
 
//                          for (let i = 0; i < formData.length; i++) {
//                              obCount.paxCount++;
//                              if (formData[i].F_REM == "H") {
//                                  obCount.fname = formData[i].F_FNAME;
//                                  obCount.lname = formData[i].F_SNAME;
//                                  obCount.tourName = formData[i].TOURNAME;
 
//                              }
//                              if (formData[i].F_AGE > 11) {
//                                  if (formData[i].F_MF === "M") {
//                                      obCount.maleAdCount++;
//                                  } else if (formData[i].F_MF === "F") {
//                                      obCount.femaleAdCount++;
//                                  }
//                              } else {
//                                  if (formData[i].TM_ID === "I") {
//                                      if (formData[i].F_AGE > 1 && formData[i].F_AGE < 12) {
//                                          obCount.chI++;
//                                      }
//                                  } else if (formData[i].TM_ID === "D") {
//                                      if (formData[i].F_AGE > 4 && formData[i].F_AGE < 12) {
//                                          obCount.chD++;
//                                      }
//                                  }
//                              }
 
//                          };
 
//                          var tourcmpl = await rsDataModel.TOURCMPLModel.find({ TOURCODE: obj.tourCode.substr(0, 2) });
//                          tourcmpl = JSON.parse(JSON.stringify(tourcmpl));
//                          console.log("tourcmpltourcmpltourcmpl", tourcmpl)
 
//                          async.eachSeries(tourcmpl, async function (item, cb) {
 
//                              var itemNm = await rsDataModel.ITEMNOModel.findOne({ ITM_NO: item.ITM_NO })
 
//                              if (itemNm) {
//                                  item.ITM_DESC1 = itemNm.ITM_DESC1;
//                              } else {
//                                  item.ITM_DESC1 = "";
//                              }
//                              switch (item.COMPL_TYPE) {
 
//                                  case "Per Person": item.F_QTY = obCount.paxCount; break;
 
//                                  case "Child Age 2-11": item.F_QTY = obCount.chD; break;
 
//                                  case "Per Room": item.F_QTY = obCount.paxCount; break;
                                
//                              }
//                              console.log("itemNmitemNmitemNm" ,itemNm)
 
//                              cb();
 
//                          }, async function (err) {
//                              if (err) {
//                                  res.status(500).send({ status: false, msg: err.message });
//                              }
 
//                              var tourcmphd = await rsDataModel.TRCMP_HDModel.findOne({}, { F_TRANNO: 1 }, { sort: { F_TRANNO: -1 } });
//                              tourcmphd = JSON.parse(JSON.stringify(tourcmphd));
//                              var tranNo = 1;
//                              if (tourcmphd) {
//                                  tranNo = tourcmphd.F_TRANNO + 1;
//                              }
 
//                              var given = {
//                                  givendt: (new Date).toISOString(),
//                                  giveId: req.session.user.uid,
//                                  giventm: moment().format("hh:mm"),
//                              }
 
                            
 
//                              // rsDataModel.TOURCMPLModel.update({ tourCode: obj.tourCode, tourForm: parseInt(obj.tourForm) }, given, { new: true }, function (err, tourGivenData) {
//                              //     tourGivenData = JSON.parse(JSON.stringify(tourGivenData));
//                              //     if (err) {
//                              //         res.status(500).send({ status: false, msg: err.message });
//                              //     }
 
 
//                                  var ob = {
//                                      "DBFNAME": "TRCMP_HD",
//                                      "DBFKEY": "F_TRAPPNNO",
//                                      "F_TRANNO": tranNo,
//                                      "F_TRANDT": moment().format('D MMMM YYYY'),
//                                      "F_TRANTM": moment().format("hh:mm"),
//                                      "F_TRANID": req.session.user.uid,
//                                      "F_TRANNM": req.session.user.cn,
//                                      "X_________": "",
//                                      "F_TCD": obj.tourCode,
//                                      "F_FORM": parseInt(obj.tourForm),
//                                      "F_SNAME": obCount.lname,
//                                      "F_FNAME": obCount.fname,
//                                      "F_ADMALE": obCount.maleAdCount,
//                                      "F_ADFEMALE": obCount.femaleAdCount,
//                                      "F_CH13_19": obCount.chI,
//                                      "F_CH3_12": obCount.chD,
//                                      "TOURNAME": obCount.tourName,
 
//                                      "GIVEN_____": "",
//                                      "F_GIVEID": req.session.user.uid,
//                                      "F_GIVEDT": (new Date).toISOString(),
//                                      "F_GIVETM": moment().format("hh:mm"),
//                                      "CREATE____": "",
//                                      "F_CREID": req.session.user.uid,
//                                      "F_CREDT": new Date(),
//                                      "KT________": "",
//                                      "KT_SYSLOG": "ADD",
//                                      "KT_BRANCH": req.session.user.other_info[0].F21_BRANCH,
//                                      "KC_KEY": "",
//                                      "vouItems": tourcmpl
//                                  };
//                                  console.log(ob)
//                                  rsDataModel.TRCMP_HDModel.create(ob, function (err, obData) {
//                                      if (err) {
//                                          res.status(500).send({ status: false, msg: err.msg })
//                                      }
//                                      obData = JSON.parse(JSON.stringify(obData));
 
//                                      BKAGENTModel.findOne({ BKA_CODE: req.session.user.other_info[0].F21_BRANCH }, function (err, dat3) {
//                                          if (err) {
//                                              res.status(500).send({ status: false, msg: err.msg })
//                                          }
//                                          dat3 = JSON.parse(JSON.stringify(dat3));
 
//                                          var src = '';
 
//                                          bwipjs.toBuffer({
//                                              bcid: 'code128',
//                                              text: tranNo.toString(),
//                                              scale: 3,
//                                              height: 10,
//                                              includetext: true,
//                                              textxalign: 'center',
//                                          }, function (err, png) {
//                                              if (err) {
//                                                  res.status(500).json({
//                                                      status: "Faild-1",
//                                                      message: err
//                                                  });
 
//                                              } else {
//                                                  src = Buffer.from(png).toString('base64');
//                                                  src = 'data:image/png;base64,' + src;
//                                              }
 
//                                              res.render("booking/tour_Complementary", {
//                                                  isEdit: false,
//                                                  ob: obData,
//                                                  branchData: dat3,
//                                                  imgSrc: src,
//                                                  "username": req.session.user.cn,
//                                                  "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
//                                                  "menu": req.session.menu,
//                                                  "kname": req.session.user.cn,
//                                                  "rsid": req.session.user.uid,
//                                                  "department": req.session.user.department,
//                                                  "branch": req.session.user.other_info[0].F21_BRANCH,
//                                                  "title": 'Rescheduling Email master',
//                                                  "AccessToken": req.session.user.token,
//                                                  "token": req.session.token
 
//                                              }, function (err, html) {
//                                                  if (err) {
//                                                      res.status(500).json({
//                                                          status: "Faild",
//                                                          message: err
//                                                      });
//                                                  } else {
//                                                      res.status(200).json({
//                                                          status: "success",
//                                                          message: "success",
//                                                          data: html
//                                                      });
//                                                  }
//                                              });
 
//                                          })
//                                      })
//                                  })
                              
 
 
//                          });
//                      }
//                  })
//              })
//          } catch (err) {
//              console.log(err);
//              res.status(500).send({ status: false, msg: msg.err });
//          }
//      },
 
//      branchData: function (cb) {
//          rsDataModel.BKAGENTModel.findOne({
//              BKA_CODE: req.session.user.other_info[0].F21_BRANCH
//          }, function (err, brnData) {
//              if (err) {
//                  cb(err);
//              }
//              brnData = JSON.parse(JSON.stringify(brnData));
//              cb(null, brnData);
//          });
//      },
 
//  }
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
















