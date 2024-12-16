/*********************************
CORE PACKAGES
**********************************/

const async = require('async');
const q = require('q');
const request = require('request');
const fs = require('fs');
const _ = require('underscore');
const ObjectID = require('mongoskin').ObjectID;
//const moment = require('moment-timezone');
var baseExport = require('../baseExporter');
var moment = require('moment');
var stData = require('../models/stDataModel.js');
var smtpTransport = require('nodemailer-smtp-transport');
nodemailer = require('nodemailer');

const bwipjs = require('bwip-js');
var model = require('../models/F21_STAFModel.js')
//var html_pdf = require('html-pdf'); 
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

var configAuth = require('../config/auth.js');
const ST_ITEMModel = require('../models/ST_ITEMModel');
const ST_IBACTModel = require('../models/ST_IBACTModel');
var ST_POHDRModel = require('../models/ST_POHDRModel.js');
var ST_PODTLModel = require('../models/ST_PODTLModel.js');

const puppeteer = require('puppeteer');
/*********************************
MODULE PACKAGES
**********************************/


async function generatePDF(content) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    console.log("content", content)
    console.log("page", page)

    page.drawText(content, {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
    });

    var pdfBytes = await pdfDoc.save();
    console.log("pdfBytes", pdfBytes)
    return pdfBytes;
}

//working

// async function generatePDF(text) {
//     try{
//       const browser = await puppeteer.launch({
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });
//     const page = await browser.newPage();
//     await page.setContent(text);
//     const pdfBuffer = await page.pdf({ format: 'A4' });
//     await browser.close();
//     return pdfBuffer;
//     }catch(e){
//       console.log(e);
//     }
//   }


module.exports = {
//    generatePo: function (req, res) {
//         try {
//             var obj = req.body;
//             // console.log("objobj" ,obj)
//             async.parallel({
//                 list: function (cb) {
//                     ST_PODTLModel.find({ F_PONO: obj.poNo }, {}, { sort: { F_POSRNO: 1 } }, function (err, poList) {
//                         if (err) {
//                             cb(err);
//                         }

//                         poList = JSON.parse(JSON.stringify(poList));
//                         async.eachSeries(poList, function (item, cb2) {

//                             ST_ITEMModel.findOne({ "F_ITEMCD": item.ITM_NO }, function (err, dataPOCat) {
//                                 if (err) {
//                                     cb2(err);
//                                 }
//                                 dataPOCat = JSON.parse(JSON.stringify(dataPOCat));

//                                 if (dataPOCat) {
//                                     item.desc = dataPOCat.F_ITEMNM;
//                                 }
//                                 cb2();
//                             })
//                         }, function (err) {
//                             if (err) {
//                                 cb(err);
//                             }
//                             cb(null, poList);
//                         })
//                     });
//                 },
//                 po: function (cb) {
//                     ST_POHDRModel.findOne({ F_PONO: obj.poNo }, function (err, poData) {
//                         if (err) {
//                             cb(err);
//                         }
//                         poData = JSON.parse(JSON.stringify(poData));
//                         if (poData) {
//                             ST_IBACTModel.findOne({ F_ACCTCD: poData.F_ACCTCD }, function (err, partyData) {
//                                 if (err) {
//                                     cb(err);
//                                 }
//                                 partyData = JSON.parse(JSON.stringify(partyData));
//                                 poData.partyName = (partyData) ? partyData.F_ACCTNM : poData.F_ACCTCD;
//                                 poData.F_PODT = moment(poData.F_PODT).format("DD/MM/YYYY");
//                                 poData.totalStr = baseExport.getConvertNumberToWords(poData.F_POAMT);
//                                 cb(null, poData);
//                             });

//                         } else {
//                             cb(null, poData);
//                         }
//                     });
//                 }
//             }, function (err, result) {
//                 if (err) {
//                     res.status(500).json({ status: false, message: err.message })
//                 }
//                 bwipjs.toBuffer({
//                     bcid: 'code128',       // Barcode type
//                     text: "PO/" + result.po.F_PONO,    // Text to encode
//                     scale: 3,               // 3x scaling factor
//                     height: 10,              // Bar height, in millimeters
//                     includetext: true,            // Show human-readable text
//                     textxalign: 'center',        // Always good to set this
//                 }, function (err, png) {
//                     if (err) {
//                         // `err` may be a string or Error object
//                     }
//                     var src = Buffer.from(png).toString('base64');
//                     src = 'data:image/png;base64,' + src;
//                     result.src = src;
//                     result.userName = req.session.user.F21_FNAME;
//                     result.today = moment().format("LLL");
//                     res.render('po/poTemplate', result, async function (err, html) {
//                         if (err) {
//                             res.status(500).json({ status: false, message: err.message })
//                         }
//                         // var options = {
//                         //   format: 'Letter',
//                         //   "zoomFactor": "0",
//                         //   "border": {
//                         //       "top": "0.2in", // default is 0, units: mm, cm, in, px
//                         //       "right": "0.2in",
//                         //       "bottom": "0.2",
//                         //       "left": "0.2in"
//                         //   }
//                         // };
//                         var textHtml = `<table>
//           <tr>
//             <td style="text-align:justify;padding-bottom: 10px;">
//               <p>Dear Guest,</p>
//             </td>
//           </tr>
//           <tr>
//             <td style="text-align:justify;padding-bottom: 10px;">
//             <p>Kindly find attached PO with details. </p>
//             </td>
//           </tr>
//           <tr>
//             <td style="text-align:justify;padding-bottom: 10px;">
//             <p>Thank you for the business. Our team await to welcome you at SukhoThai</p>
//             </td>
//           </tr>
//           <tr>
//             <td>
//             <p>Regards, Team SukhoThai.</p>
//             </td>
//           </tr>
//       </table>`;
//                         console.log("pdfBuffer" , pdfBuffer)
//                         var pdfBuffer = await generatePDF(html);
//                         // htmlPdf.create(html, options).toBuffer(function(err, buffer, ){
//                         //     if (err) {
//                         //         console.log(err);
//                         //         //cb(err);
//                         //     }
//                         var transporter = nodemailer.createTransport(smtpTransport(configAuth.smtp));
//                         var mailOptions = {
//                             from: "finance@sukhothai.in", //'darshansr@kesaritours.in', // sender address
//                             bcc: obj.emailId,
//                             cc: "",
//                             subject: "Purchase Order", // Subject line
//                             html: textHtml,
//                             // html: fields["html"],
//                             attachments: [{ filename: result.po.F_PONO.split('/').join('-') + ".pdf", content: pdfBuffer }]
//                         };
//                         console.log("mailOptions", mailOptions)

//                         // transporter.sendMail(mailOptions, function (error, info) {
//                         //     if (error) {
//                         //         res.status(500).send({ status: false, msg: err })}
//                         //     var setData = {
//                         //         emailId: obj.emailId,
//                         //         emailedOn: new Date(),
//                         //         emailBy: req.session.user.F21_IDNO
//                         //     };

//                         //     console.log("setData", setData)

//                         //   ST_POHDRModel.findOneAndUpdate({_id:result.po._id},{$set:setData},{},function(err){
//                         //       if (err) {
//                         //         res.status(500).send({ status: false, msg: err })
//                         //       }else{
//                         //         res.status(200).json({status:true,result:html,data:result});
//                         //       }
//                         //     });
//                         // });


//              transporter.sendMail(mailOptions, function (error, data) {

//                         if (err) {
//                             res.status(500).send({ status: false, msg: err, })
//                         }

//                         var setData={
//                             emailId:obj.emailId,
//                             emailedOn:new Date(),
//                             emailBy:req.session.user.F21_IDNO
//                           };

//                         ST_POHDRModel.findOneAndUpdate({_id:result.po._id},{$set:setData},{},function(err){
//                             if (err) {
//                               res.status(500).json({
//                                   message: 'Error in saving invoice',
//                                   error: err,
//                                   status: false
//                               });
//                             }else{
//                                res.status(200).json({status:true,result:html,data:result});
//                             }
                        
//                     });

//                 });
//             });
//                 });
//             });
//         } catch (e) {
//             console.log(e);
//         }
//     },

    generatePo: function (req, res) {
        try {
            var obj = req.body;
            // console.log("objobj" ,obj)
            async.parallel({
                list: function (cb) {
                    ST_PODTLModel.find({ F_PONO: obj.poNo }, {}, { sort: { F_POSRNO: 1 } }, function (err, poList) {
                        if (err) {
                            cb(err);
                        }

                        poList = JSON.parse(JSON.stringify(poList));
                        async.eachSeries(poList, function (item, cb2) {

                            ST_ITEMModel.findOne({ "F_ITEMCD": item.ITM_NO }, function (err, dataPOCat) {
                                if (err) {
                                    cb2(err);
                                }
                                dataPOCat = JSON.parse(JSON.stringify(dataPOCat));

                                if (dataPOCat) {
                                    item.desc = dataPOCat.F_ITEMNM;
                                }
                                cb2();
                            })
                        }, function (err) {
                            if (err) {
                                cb(err);
                            }
                            cb(null, poList);
                        })
                    });
                },
                po: function (cb) {
                    ST_POHDRModel.findOne({ F_PONO: obj.poNo }, function (err, poData) {
                        if (err) {
                            cb(err);
                        }
                        poData = JSON.parse(JSON.stringify(poData));
                        if (poData) {
                            ST_IBACTModel.findOne({ F_ACCTCD: poData.F_ACCTCD }, function (err, partyData) {
                                if (err) {
                                    cb(err);
                                }
                                partyData = JSON.parse(JSON.stringify(partyData));
                                poData.partyName = (partyData) ? partyData.F_ACCTNM : poData.F_ACCTCD;
                                poData.F_PODT = moment(poData.F_PODT).format("DD/MM/YYYY");
                                poData.totalStr = baseExport.getConvertNumberToWords(poData.F_POAMT);
                                cb(null, poData);
                            });

                        } else {
                            cb(null, poData);
                        }
                    });
                }
            }, function (err, result) {
                if (err) {
                    res.status(500).json({ status: false, message: err.message })
                }
                bwipjs.toBuffer({
                    bcid: 'code128',       // Barcode type
                    content: "PO/" + result.po.F_PONO,    // Text to encode
                    scale: 3,               // 3x scaling factor
                    height: 10,              // Bar height, in millimeters
                    includetext: true,            // Show human-readable text
                    textxalign: 'center',        // Always good to set this
                }, function (err, png) {
                    if (err) {
                        // `err` may be a string or Error object
                    }
                    var src = Buffer.from(png).toString('base64');
                    src = 'data:image/png;base64,' + src;
                    result.src = src;
                    result.userName = req.session.user.F21_FNAME;
                    result.today = moment().format("LLL");
                    res.render('po/poTemplate', result, async function (err, html) {
                        if (err) {
                            res.status(500).json({ status: false, message: err.message })
                        }
                        // var options = {
                        //   format: 'Letter',
                        //   "zoomFactor": "0",
                        //   "border": {
                        //       "top": "0.2in", // default is 0, units: mm, cm, in, px
                        //       "right": "0.2in",
                        //       "bottom": "0.2",
                        //       "left": "0.2in"
                        //   }
                        // };
                        var textHtml = `<table>
          <tr>
            <td style="text-align:justify;padding-bottom: 10px;">
              <p>Dear Guest,</p>
            </td>
          </tr>
          <tr>
            <td style="text-align:justify;padding-bottom: 10px;">
            <p>Kindly find attached PO with details. </p>
            </td>
          </tr>
          <tr>
            <td style="text-align:justify;padding-bottom: 10px;">
            <p>Thank you for the business. Our team await to welcome you at SukhoThai</p>
            </td>
          </tr>
          <tr>
            <td>
            <p>Regards, Team SukhoThai.</p>
            </td>
          </tr>
      </table>`;
                        console.log("pdfBuffer" , pdfBuffer)
                        var pdfBuffer = await generatePDF(html);
                      
                        var transporter = nodemailer.createTransport(smtpTransport(configAuth.smtp));
                        var mailOptions = {
                            from: "finance@sukhothai.in", //'darshansr@kesaritours.in', // sender address
                            bcc: obj.emailId,
                            cc: "",
                            subject: "Purchase Order", // Subject line
                            html: textHtml,
                            // html: fields["html"],
                            attachments: [{ filename: result.po.F_PONO.split('/').join('-') + ".pdf", content: pdfBuffer }]
                        };
                        console.log("mailOptions", mailOptions)

                       

             transporter.sendMail(mailOptions, function (error, data) {

                        if (err) {
                            res.status(500).send({ status: false, msg: err, })
                        }

                        var setData={
                            emailId:obj.emailId,
                            emailedOn:new Date(),
                            emailBy:req.session.user.F21_IDNO
                          };

                        ST_POHDRModel.findOneAndUpdate({_id:result.po._id},{$set:setData},{},function(err){
                            if (err) {
                              res.status(500).json({
                                  message: 'Error in saving invoice',
                                  error: err,
                                  status: false
                              });
                            }else{
                               res.status(200).json({status:true,result:html,data:result});
                            }
                        
                    });

                });
            });
                });
            });
        } catch (e) {
            console.log(e);
        }
    },

  downloadPo: function (req, res) {
        try {
            var obj = req.body;
            async.parallel({
                list: function (cb) {
                    ST_PODTLModel.find({ F_PONO: obj.poNo }, {}, { sort: { F_POSRNO: 1 } }, function (err, poList) {
                        if (err) {
                            cb(err);
                        }
                        poList = JSON.parse(JSON.stringify(poList));
                        async.eachSeries(poList, function (item, cb2) {
                            ST_ITEMModel.findOne({ "F_ITEMCD": item.ITM_NO }, function (err, dataPOCat) {
                                if (err) {
                                    cb2(err);
                                }
                                dataPOCat = JSON.parse(JSON.stringify(dataPOCat));
                                if (dataPOCat) {
                                    item.desc = dataPOCat.F_ITEMNM;
                                }
                                cb2();
                            })
                        }, function (err) {
                            if (err) {
                                cb(err);
                            }
                            cb(null, poList);
                        })
                    });
                },
                po: function (cb) {
                    ST_POHDRModel.findOne({ F_PONO: obj.poNo }, function (err, poData) {
                        if (err) {
                            cb(err);
                        }
                        poData = JSON.parse(JSON.stringify(poData));
                        if (poData) {
                            ST_IBACTModel.findOne({ F_ACCTCD: poData.F_ACCTCD }, function (err, partyData) {
                                if (err) {
                                    cb(err);
                                }
                                partyData = JSON.parse(JSON.stringify(partyData));
                                poData.partyName = (partyData) ? partyData.F_ACCTNM : poData.F_ACCTCD;
                                poData.F_PODT = moment(poData.F_PODT).format("DD/MM/YYYY");
                                poData.totalStr = baseExport.getConvertNumberToWords(poData.F_POAMT);
                                cb(null, poData);
                            });

                        } else {
                            cb(null, poData);
                        }
                    });
                }
            }, function (err, result) {
                if (err) {
                    res.status(500).json({ status: false, message: err.message })
                }
                bwipjs.toBuffer({
                    bcid: 'code128',       // Barcode type
                    text: "PO/" + result.po.F_PONO,    // Text to encode
                    scale: 3,               // 3x scaling factor
                    height: 10,              // Bar height, in millimeters
                    includetext: true,            // Show human-readable text
                    textxalign: 'center',        // Always good to set this
                }, function (err, png) {
                    if (err) {
                        // `err` may be a string or Error object
                    }
                    var src = Buffer.from(png).toString('base64');
                    src = 'data:image/png;base64,' + src;
                    result.src = src;
                    result.userName = req.session.user.F21_FNAME;
                    result.today = moment().format("LLL");
                    res.render('po/poTemplate', result, function (err, html) {
                        if (err) {
                            res.status(500).json({ status: false, message: err.message })
                        }
                        res.status(200).json({ status: true, html: html });
                    });
                });
            });
        } catch (e) {
            console.log(e);
        }
    },
    generatePoNumber: function (req, res) {
        var obj = req.body;
        obj.date = baseExport.convertToDateNew(obj.date);
        generatePo(obj.date, function (err, data) {
            
            if (err) {
                res.status(500).json({
                    message: err.message,
                    error: err,
                    status: false
                });
            }
            res.status(200).json({ status: true, data: data.str });
        });
    },
    getPo: function (req, res) {
        var obj = req.body;
      
        ST_POHDRModel.findOne({ F_PONO: obj.pono }, function (err, dataPo) {
            if (err) {
                res.status(500).json({
                    message: err.message,
                    error: err,
                    status: false
                });
            }
            dataPo = JSON.parse(JSON.stringify(dataPo));
            res.status(200).json({ status: true, data: dataPo });
        });
    },
    savePo: function (req, res) {
        var obj = req.body;
        var headerData = obj.header;
        headerData.F_PODT = baseExport.convertToDateNew(headerData.F_PODT);
        generatePo(headerData.F_PODT, function (err, data) {
            if (err) {
                res.status(500).json({
                    message: err.message,
                    error: err,
                    status: false
                });
            }

            headerData.detailList = obj.details;
            headerData.F_POBY = parseInt(headerData.F_POBY);
            headerData.F_POBASIC = parseFloat(headerData.F_POBASIC);
            headerData.CGST_PER = parseFloat(headerData.CGST_PER);
            headerData.CGST_AMT = parseFloat(headerData.CGST_AMT);
            headerData.SGST_PER = parseFloat(headerData.SGST_PER);
            headerData.SGST_AMT = parseFloat(headerData.SGST_AMT);
            headerData.IGST_PER = parseFloat(headerData.IGST_PER);
            headerData.IGST_AMT = parseFloat(headerData.IGST_AMT);
            headerData.F_POAMT = parseFloat(headerData.F_POAMT);

          
            ST_POHDRModel.findOne({ F_PONO: headerData.F_PONO }, function (err, dataPo) {
                if (err) {
                    res.status(500).json({
                        message: err.message,
                        error: err,
                        status: false
                    });
                }
                dataPo = JSON.parse(JSON.stringify(dataPo));
                if (dataPo) {
                    headerData.updatedOn = new Date();
                    ST_POHDRModel.update({ _id: dataPo._id }, { $set: headerData }, {}, function (err) {
                        if (err) {
                            res.status(500).json({
                                message: err.message,
                                error: err,
                                status: false
                            });
                        }
                        savePoDetails(dataPo.F_PONO, obj.details, function (err) {
                            if (err) {
                                res.status(500).json({
                                    message: err.message,
                                    error: err,
                                    status: false
                                });
                            }
                            res.status(200).json({ status: true, message: "PO Updated Successfully", data: [] });
                        })

                    });
                } else {
                    headerData.F_MTH = data.mth;
                    headerData.F_YEAR = data.year;
                    headerData.F_PONO = data.str;
                    headerData.F_NO = parseInt(data.tno);
                    headerData.createdOn = new Date();
                    headerData.F_QUOTDT = headerData.F_PODT;
                    ST_POHDRModel.create(headerData, function (err) {
                        if (err) {
                            res.status(500).json({
                                message: err.message,
                                error: err,
                                status: false
                            });
                        }
                        savePoDetails(headerData.F_PONO, obj.details, function (err) {
                            if (err) {
                                res.status(500).json({
                                    message: err.message,
                                    error: err,
                                    status: false
                                });
                            }
                            res.status(200).json({ status: true, message: "PO Created Successfully", data: [] });
                        })
                    });
                }
            })


        });
    },

    getItemCodeSupplierData: async function (req, res, next) {
        try {

            var code = (req.body.q) ? req.body.q : "";
            code = code.toUpperCase();
            query = {};
            if (code) {
                query['F_ITEMNM'] = {
                    $regex: new RegExp('^' + code, 'i')
                };
            }
            if (req.body.zone) {
                query['ITM_ZONE'] = req.body.zone;
            }
          
            var result = await ST_ITEMModel.find(query).select('F_ITEMCD F_ITEMNM F_ITEMTY ITM_UNIT ITM_COST SPA_COST').sort('_id:-1');
            result = _.sortBy(result, function (num) {
              return num;
            });
            var arr = [];
         
            if (result && result.length > 0) {
                async.each(result, function (item, cb) {
                 ST_IBACTModel.findOne({ F_ACCTCD: req.body.supplier, F_ITEMCD: { $in: [item.F_ITEMCD] } }, function (err, data1) {
                        if (err) {
                            cb(err);
                        }
                        data1 = JSON.parse(JSON.stringify(data1));
                        if (data1) {
                            arr.push(item);
                            cb();
                        } else {
                            cb();
                        }
                    })
                }, function (err) {
                    arr = JSON.parse(JSON.stringify(arr));
                     res.status(200).json({
                        message: "success fully getting data",
                        data: arr,
                        success: true
                    });
                })


            } else {
                res.status(200).json({
                    message: "Not matched",
                    data: [],
                    success: false
                });
            }

        } catch (e) {
            console.error(e.stack);
            res.status(500).json({
                data: [],
                success: false,
                message: "error getting in get sub category",
            });
        }
    },


    getrsID: function (req, res) {
        model.find({ "F21_RESIDT": "" })
            .select('F21_IDNO F21_PRE F21_SUKONM F21_FNAME F21_MOBILE F21_SNAME F21_MF ST_BRN')
            .exec((err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "FAILED",
                        result: "ERROR IN GETTING RSID DATA."
                    });
                }

                if (result.length === 0) {
                    return res.status(404).json({
                        message: "Data Not Found",
                        data: []
                    });
                }

                return res.status(200).json({
                    message: "SUCCESS IN GETTING ALL USERS ID",
                    data: result
                });
            });
    },



};

function savePoDetails(pono, data, cb) {
    async.eachSeries(data, function (item, cb2) {
        item.F_PONO = pono;
        ST_PODTLModel.findOne({ "F_PONO": pono, "F_POSRNO": parseInt(item.F_POSRNO) }, function (err, poDtl) {
            if (err) {
                cb2(err);
            }
            poDtl = JSON.parse(JSON.stringify(poDtl));
            if (poDtl) {
                ST_PODTLModel.update({ _id: poDtl._id }, { $set: item }, {}, function (err) {
                    cb2(err);
                });
            } else {
                item.KT_SYSLOG = "";
                item.KT_BRANCH = "";
                item.DBFNAME = "ST_PODTL";
                ST_PODTLModel.create(item, function (err) {
                    cb2(err);
                });
            }
        })

    }, function (err) {
        if (err) {
            cb(err);
        }
        cb();
    });
}
// function generatePo(date,cb){
//   var ob={};
//   ob["mth"]=(date.getMonth()+1).toString();
//   ob["year"]=(date.getFullYear()).toString();
//   console.log(ob)
//   ST_POHDRModel.findOne({F_MTH:ob.mth,F_YEAR:ob.year},{},{sort:{F_NO:-1}},function(err,dataPo){
//     if(err){
//      cb(err);
//     }
//     dataPo=JSON.parse(JSON.stringify(dataPo));
//     var tno=1;
//     if(dataPo){
//       tno=parseInt(dataPo.F_NO)+1;
//     }
//     var str=ob.year+"/"+ob.mth+"/"+(("0000")+tno).slice(-4);
//     ob["tno"]=tno;
//     ob["str"]=str;

//     cb(null,ob);
//   })
// }

function generatePo(date, cb) {
    // Validate that date is a valid Date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return cb(new Error("Invalid date provided"));
    }

    var ob = {};
    ob["mth"] = (date.getMonth() + 1).toString(); // Month is zero-based, so add 1
    ob["year"] = date.getFullYear().toString();

  ST_POHDRModel.findOne(
        { F_MTH: ob.mth, F_YEAR: ob.year },
        {},
        { sort: { F_NO: -1 } },
        function (err, dataPo) {
            if (err) {
                return cb(err);
            }
            
            var tno = 1;
            if (dataPo) {
                dataPo = JSON.parse(JSON.stringify(dataPo));
                tno = parseInt(dataPo.F_NO) + 1;
            }

            var str = ob.year + "/" + ob.mth + "/" + ("0000" + tno).slice(-4);
            ob["tno"] = tno;
            ob["str"] = str;
            cb(null, ob);
        }
    );
}
