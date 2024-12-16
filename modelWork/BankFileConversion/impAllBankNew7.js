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
var pdf2table = require('pdf2table');
var xlsx = require('xlsx');
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


// function validDate(val) {
//     if (val) {
//         return (val.indexOf('/') > -1 && val.indexOf(':') > -1 && (val.indexOf('PM') || val.indexOf('AM') > -1)) ? true : false;
//     } else {
//         return false;
//     }

// }


function validDate(dateStr) {
    if (typeof dateStr !== 'string' || dateStr.trim() === '') {
        return false;
    }
    // Split the date string into day, month, and year
    var [day, month, year] = dateStr.split('-').map(Number);

    // Check if the day, month, and year are valid
    if (
        !Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year) &&
        day >= 1 && day <= 31 &&
        month >= 1 && month <= 12 &&
        year >= 1900 && year <= 2099
    ) {
        return true;
    }

    return false;
}

// Example usage:
//console.log("ffffffffffff", validDate('09/08/2023'))




// function validDate(val) {
//     if (val) {
//         return (val.indexOf('-') > -1) ? true : false;
//     } else {
//         return false;
//     }

// }
// console.log("ffffffffffff", validDate(''))



// function validDate(val) {
//     if (val) {
//         return (val.indexOf('-') > -1) ? true : false;
//     } else {
//         return false;
//     }

// }
//console.log( "ffffffffffff", validDate('2023'))

/*********Moves the $file to $dir2 Start *********/
var moveFile = (file, dir2) => {
    //include the fs, path modules
    var fs = require('fs');
    var path = require('path');

    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);
    fs.unlink(file);

};


function sendGuestSms(req, res) {
    try {
        var pathFile = "/home/kesari/Desktop/bankstat11/";
        fs.readdir(pathFile, function (err, items) {
            if (err) {

                console.log("pdfERRRRRRRRRRRRRRRRRRRRRRR", err);
            }
            // console.log("itemsitemsitems", items);

            async.eachSeries(items, function (xlsFiles, cb0) {
                var extnArr = xlsFiles.split(".");
                var extn = extnArr[extnArr.length - 1];
                switch (extn) {
                    case 'pdf':
                        fs.readFile(pathFile + xlsFiles, (err, buffer) => {

                            if (err) {
                                console.log("errrrrrr", err)
                            }
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
                                    var accountNumber;
                                    var bankDetail = {};



                                    for (var i = 0; i < rows.length; i++) {
                                        if (rows[i][0]) {
                                            //console.log("customerID", rows[i][1])

                                            bankDetail.bankName = "AXIS 4361.pdf";
                                            if (rows[i][0].indexOf("Customer ID")) {
                                                bankDetail.customerID = rows[i][0].indexOf("Customer ID");
                                            }

                                            if (rows[i].indexOf("Opening balance") > -1) {
                                                bankDetail.openingBalance = rows[i][rows[i].indexOf("Opening balance") + 1].split('INR');
                                                bankDetail.openingBalance = bankDetail.openingBalance[1].split(',').join('');
                                                lastAmount = bankDetail.openingBalance;

                                            }
                                        }
                                    }
                                   // console.log("bankDetailbankDetail", bankDetail)

                                    //console.log("hhh" , rows)

                                   


                                    for (var i = 0; i < rows.length; i++) {
                                        // console.log("dataaaa",validDate(rows[i][0]));
                                        // console.log("dddddddddddd", rows[i][0]);

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
                                            //data[i]["Branch_name"] = bankDetail.branchName;
                                            data[i]["Bank_name"] = bankDetail.bankName;
                                            data[i]["Bank_accountno"] = bankDetail.accountNumber;
                                            data[i]["Credit_amount"] = 0;
                                            data[i]["Debit_amount"] = 0;
                                            data[i]["SRNO"] = i;
                                          
                                            var dt1 = rows[i][1].split("-")[1] + "-" + rows[i][1].split("-")[0] + "-" + rows[i][1].split("-")[2];
                                            data[i]["Transaction_date"] = new Date(new Date(dt1).setHours(5, 30, 0, 0));
                                           // console.log( data[i]["Transaction_date"])
                                            //console.log( data[i])
                                            for (var j = 1; j < rows[i].length; j++) {

                                                if (j === 1) {

                                                    data[i]["Date_str"] = rows[i][j];
                                                  //  console.log(data[i]["Date_str"])
                                                } else if (j === (rows[i].length - 1)) {

                                                }
                                                else if (j === (rows[i].length - 2)) {
                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                                    //console.log(data[i]["Closing_balance"])
                                                } else if (j === (rows[i].length - 3)) {
                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    if (rows[i][j]) {
                                                        data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                                                    } else {
                                                        data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                                                    }
                                                   // console.log("ggggggggg" , data[i]["Credit_amount"])
                                                   // console.log("ggggggggg" , data[i]["Debit_amount"])
                                                } else if (j === (rows[i].length - 4)) {
                                                    var dt2 = rows[i][j].split("/")[1] + "/" + rows[i][j].split("/")[0] + "/" + rows[i][j].split("/")[2];
                                                   // console.log("ggggggggg" ,dt2)
                                                    
                                                    data[i]["Value_date"] = new Date(new Date(dt2).setHours(5, 30, 0, 0));
                                                   // console.log(data[i]["Value_date"])
                                                } else {
                                                    //console.log(rows[i][j]);
                                                    data[i]["Description"] += rows[i][j] + ' ';
                                                    lastParticularIndex = i;
                                                    //console.log("ggggggggg" ,data[i]["Description"])
                                                }
                                            }
                                        }
                                    }
                                    //console.log(rows)
                                }
                                var dataArr = [];
                                for (var key in data) {
                                    dataArr.push(data[key]);
                                }

                                  console.log("dataArrdataArr", dataArr);

                                 var y = [...dataArr].reverse();

                                 for (var z = 0; z < y.length; z++) {
                                     var val = (bankDetail.openingBalance - y[z].Closing_balance > 0) ? "DR" : "CR";
                                     bankDetail.openingBalance = y[z].Closing_balance;
                                     y[z].Debit_amount = (val == 'DR') ? y[z].Debit_amount : 0
                                     y[z].Credit_amount = (val == 'CR') ? y[z].Credit_amount : 0
                                 }

                            })
                        })
                        break;

                }


                cb0();
            }, function (err) {


            })

        });

    } catch (error) {
        console.log("errorrr isssssssssss", error);
    }
}
sendGuestSms();

