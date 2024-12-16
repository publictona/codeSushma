/*
 * @Author:Maruti Karad
 * @Date: 2019-04-30
 */
/*******************************************
CORE PACKAGES
*******************************************/
var config = require('./config.js');
var schedule = require('node-schedule');
var moment = require('moment');
var http = require('http'),
    _ = require("underscore"),
    q = require('q'),
    async = require('async'),
    // request = require('request'),
    // async = require('async'),
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring'),
    schedule = require('node-schedule'),
    mongodb = require('mongodb'),
    mongoose = require('mongoose')
//     mongoskin = require('mongoskin'),
//     mongooseHistory = require('mongoose-history'),
//     ObjectID = require('mongoskin').ObjectId,
//     BSON = require('mongoskin').BSONPure,
//     Schema = mongoose.Schema;
// os = require('os'),
//     osUtil = require('os-utils');
// dbAWS = require('./config.js').dbAws;

/*********************************
MODULE PACKAGES
**********************************/
//var rsDataModel = require('./models/stDataModel.js');
var stDataModel = require('./models/stDataModel.js');

/*********************************
GLOBLE FUNCTION
**********************************/
// var globleFunction = require('./globleFunction.js');
//var parser = new (require('simple-excel-to-json').XlsParser)();

var dynamicSort = function (property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
        * and you may want to customize it to your needs
        */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
function validDate(val) {
    if (val) {
        return (val.indexOf('/') > -1 && val.indexOf(':') > -1 && (val.indexOf('PM') || val.indexOf('AM') > -1)) ? true : false;
    } else {
        return false;
    }

}

/*********Moves the $file to $dir2 Start *********/
var moveFile = (file, dir2) => {
    //include the fs, path modules
    var fs = require('fs');
    var path = require('path');

    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);
    fs.unlink(file);
    // fs.rename(file, dest, (err)=>{
    // if(err){
    // console.log(err);
    // }else{
    // console.log('Successfully moved');
    // }

    // });
};


function sendGuestSms(req, res) {
    try {
        // var pathFile = "/media/data1/pdf2mong/KOTAK BANK/";
        var pathFile = "/home/kesari/Desktop/bankstat11/";
        console.log("pathFilepathFilepathFile", pathFile);
        fs.readdir(pathFile, function (err, items) {
            if (err) {
                //return res.status(500).json([]);
                console.log("pdfERRRRRRRRRRRRRRRRRRRRRRR", err);
            }
            console.log(items);
            async.eachSeries(items, function (xlsFiles, cb0) {

                console.log(xlsFiles.split('.')[1] ,pathFile + xlsFiles);
                cb0();
            }, function (err) {


            })

            //--------------------------start----------------------------
            async.eachSeries(items, function (xlsFiles, cb0) {
                var extnArr = xlsFiles.split('.');
                var extn = extnArr[extnArr.length - 1];
                if (extn === "pdf") {
                   // var pathFile = "/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles;
                    var pathFile = "/home/kesari/Desktop/bankstat11/AXIS 4361.pdf/ " + xlsFiles;

                    stDataModel
                        .bankTempModel
                        .find({ "filename": xlsFiles })
                        .limit(10)
                        .sort({
                            "callDate": -1
                        })
                        .exec(
                            function (err, bankDataLog) {
                                if (bankDataLog && bankDataLog.length > 0) {
                                    moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                                } else {
                                    fs.readFile(pathFile, function (err, buffer) {
                                        if (err) return console.log(err);
                                        var pdf2table = require('pdf2table');

                                        // req.body.data = req.body.data.split(',');
                                        // var buff = new Buffer(req.body.data[1], 'base64');
                                        pdf2table.parse(buffer, function (err, rows, rowsdebug) {

                                            if (err) {
                                                console.log(err);
                                                return res.json({
                                                    message: err.message,
                                                    data: [],
                                                    success: false
                                                });
                                            }
                                            var data = {};
                                            if (rows.length > 0) {
                                                var lastAmount = 0;
                                                var openingBalance = 0;
                                                var lastParticularIndex = 0;
                                                var bankDetail = {};
                                                for (var i = 0; i < rows.length; i++) {
                                                    if (!validDate(rows[i][0])) {

                                                        bankDetail.bankName = "Kotak Mahindra Bank";

                                                        if (rows[i].indexOf("Branch") > -1) {

                                                            bankDetail.branchName = rows[i][rows[i].indexOf("Branch") + 1];

                                                        }
                                                        if (rows[i].indexOf("Account No.") > -1) {
                                                            bankDetail.accountNumber = rows[i][rows[i].indexOf("Account No.") + 1];
                                                        }
                                                        if (rows[i].indexOf("Opening balance") > -1) {
                                                            bankDetail.openingBalance = rows[i][rows[i].indexOf("Opening balance") + 1].split('INR');
                                                            bankDetail.openingBalance = bankDetail.openingBalance[1].split(',').join('');
                                                            lastAmount = bankDetail.openingBalance;

                                                        }


                                                    }
                                                }


                                                for (var i = 0; i < rows.length; i++) {
                                                    //console.log("dataaaa",validDate(rows[i][1]));
                                                    // console.log("dddddddddddd", rows[i][1]);

                                                    if (validDate(rows[i][1])) {
                                                        data[i] = {};// 
                                                        data[i]["companyId"] = 0;
                                                        data[i]["receiptId"] = "";
                                                        data[i]["receiptType"] = "";
                                                        data[i]["voucherNo"] = "";
                                                        data[i]["processBy"] = "ERP_CROM";
                                                        data[i]["processAt"] = new Date();
                                                        data[i]["filename"] = xlsFiles;
                                                        data[i]["Description"] = "";
                                                        data[i]["Branch_name"] = bankDetail.branchName;
                                                        data[i]["Bank_name"] = bankDetail.bankName;
                                                        data[i]["Bank_accountno"] = bankDetail.accountNumber;
                                                        data[i]["Credit_amount"] = 0;
                                                        data[i]["Debit_amount"] = 0;
                                                        data[i]["SRNO"] = i;
                                                        var dt1 = rows[i][1].split("/")[1] + "/" + rows[i][1].split("/")[0] + "/" + rows[i][1].split("/")[2];
                                                        data[i]["Transaction_date"] = new Date(new Date(dt1).setHours(5, 30, 0, 0));

                                                        for (var j = 1; j < rows[i].length; j++) {

                                                            if (j === 1) {

                                                                data[i]["Date_str"] = rows[i][j];
                                                            } else if (j === (rows[i].length - 1)) {

                                                            }
                                                            else if (j === (rows[i].length - 2)) {
                                                                rows[i][j] = rows[i][j].split(',').join('');
                                                                data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                                            } else if (j === (rows[i].length - 3)) {
                                                                rows[i][j] = rows[i][j].split(',').join('');
                                                                if (rows[i][j]) {
                                                                    data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                                                                } else {
                                                                    data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                                                                }
                                                            } else if (j === (rows[i].length - 4)) {
                                                                var dt2 = rows[i][j].split("/")[1] + "/" + rows[i][j].split("/")[0] + "/" + rows[i][j].split("/")[2];
                                                                data[i]["Value_date"] = new Date(new Date(dt2).setHours(5, 30, 0, 0));
                                                            } else {
                                                                //console.log(rows[i][j]);
                                                                data[i]["Description"] += rows[i][j] + ' ';
                                                                lastParticularIndex = i;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            var dataArr = [];
                                            for (var key in data) {
                                                dataArr.push(data[key]);
                                            }


                                            //console.log(dataArr.sort(dynamicSort('SRNO')));
                                            //console.log(bankDetail.openingBalance);
                                            var y = [...dataArr].reverse();


                                            for (var z = 0; z < y.length; z++) {

                                                var val = ((bankDetail.openingBalance - y[z].Closing_balance) > 0) ? "DR" : "CR";
                                                bankDetail.openingBalance = y[z].Closing_balance;
                                                y[z].Debit_amount = (val == 'DR') ? y[z].Credit_amount : 0
                                                y[z].Credit_amount = (val == 'CR') ? y[z].Credit_amount : 0
                                            }
                                            console.log(y.length);
                                            async.eachSeries(y, async function (item, cb) {
                                                console.log(item);
                                                var findData = await stDataModel.bankTempModel.find({ "Bank_name": item.Bank_name, "Date_str": item.Date_str, "Credit_amount": item.Credit_amount, "Closing_balance": item.Closing_balance });
                                                //console.log(findData);

                                                if (findData.length > 0) {
                                                    console.log("same data");
                                                    cb();
                                                } else {
                                                    console.log("identical data");
                                                    stDataModel.bankTempModel.create(item, function (err) {
                                                        if (err) {
                                                            cb(err)
                                                            // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                                                        } else {

                                                            //move file1.htm from 'test/' to 'test/dir_1/'
                                                            // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                                                            cb();
                                                            //Moves the $file to $dir2 END 

                                                        }
                                                        console.log('Form inclusions saved successfully');
                                                    });
                                                }

                                            }, function (err) {
                                                if (err) {
                                                    console.log(err);
                                                    moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                                                    cb0();
                                                } else {
                                                    moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                                                    cb0();
                                                }
                                            });
                                        });

                                    });
                                }
                            });


                } else {
                    cb0();
                }
            }, function (err) {

                sendGuestSms();
                // return true;

            });
            //--------------------------------end-------------------------------------
        });

    } catch (error) {
        console.log("errorrr isssssssssss", error);
    }
}
console.log("hiii---1");

sendGuestSms();