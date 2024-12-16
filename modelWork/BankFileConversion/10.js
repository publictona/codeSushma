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
//var xlsx = require('xlsx');
const xml2js = require('xml2js');

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
var kesariBankPdfModel = require('./models/kesariBankPdfModel.js');
const { costingmastersModel } = require('./models/rsDataModel.js');
//const excelToJson = require('xlsx-to-json');
const XLSX = require('xlsx');
const xlsToJson = require('json2xls');

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

        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}




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

                console.log("pdfERRRRRRRRRRRRR", err);
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


                                            bankDetail.bankName = "AXIS 4361.pdf";
                                            if (rows[i][0].indexOf("Statement of Axis Account No :") > -1) {
                                                bankDetail.accountNumber = rows[i][0].split('Statement of Axis Account No :')[1];
                                                bankDetail.accountNumber = bankDetail.accountNumber.split('for the period')[0].trim();
                                            }

                                            if (rows[i].indexOf("OPENING BALANCE") > -1) {
                                                // console.log("OPENING BALANCE", rows[i])
                                                // bankDetail.openingBalance = rows[i][rows[i].indexOf("OPENING BALANCE") + 1].split('INR');
                                                // bankDetail.openingBalance = bankDetail.openingBalance[1].split(',').join('');
                                                // lastAmount = bankDetail.openingBalance;

                                            }
                                        }
                                    }
                                    // console.log("bankDetailbankDetail", bankDetail)
                                    // console.log("vvvvvvvvv" , rows)
                                    for (var i = 0; i < rows.length; i++) {
                                        // console.log("dataaaa",validDate(rows[i][0]));
                                        // console.log("dddddddddddd", rows[i][0]);

                                        if (validDate(rows[i][0])) {
                                            //   console.log(rows[i].length,rows[i]);
                                            //console.log(rows[i].length,rows[i]);
                                            data[i] = {};// 

                                            data[i]["processBy"] = "ERP_CROM";
                                            data[i]["processAt"] = new Date();
                                            data[i]["filename"] = xlsFiles;
                                            data[i]["Description"] = "";
                                            data[i]["Bank_name"] = "";
                                            data[i]["Branch_name"] = "";
                                            data[i]["Bank_accountno"] = bankDetail.accountNumber;
                                            data[i]["Credit_amount"] = "";
                                            data[i]["Debit_amount"] = "";
                                            data[i]["Tran_Date"] = "";
                                            data[i]["Value_Date"] = "";
                                            data[i]["check_No"] = "";
                                            data[i]["Transaction_amount"] = 0;
                                            data[i]["available_Balance"] = 0;
                                            data[i]["withdraw"] = 0;
                                            data[i]["deposit"] = "";
                                            data[i]["currency"] = ""; // from Master
                                            data[i]["division"] = ""; // from Master
                                            data[i]["Opening_balance"] = bankDetail.openingBalance;
                                            data[i]["Closing_balance"] = "";
                                            data[i]["SRNO"] = i;



                                            //console.log(rows[i][5])


                                            for (var j = 0; j < rows[i].length; j++) {
                                                if (j === 0) {
                                                    data[i]["Tran_Date"] = rows[i][j];

                                                } else if (j === 1) {
                                                    data[i]["Value_Date"] = rows[i][j];

                                                } else if (j === (rows[i].length - 3)) {
                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    if (rows[i][j]) {
                                                        data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                                                    } else {
                                                        data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                                                    }

                                                }
                                                else if (j === (rows[i].length - 2)) {
                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    data[i]["Closing_balance"] ? parseFloat((rows[i][j])) : "";
                                                    //  console.log(data[i]["Closing_balance"])
                                                }
                                                if (rows[i].length === 7) {
                                                    //console.log(rows[i])

                                                    if (j === 2) {
                                                        data[i]["Description"] += rows[i][j] + ' ';
                                                        lastParticularIndex = i;
                                                    } else if (j === 3) {

                                                        rows[i][j] = rows[i][j].split(',').join('');
                                                        data[i]["check_No"] = data[i]["check_No"] ? parseFloat((rows[i][j])) : "";
                                                    } else if (j === 4) {

                                                        rows[i][j] = rows[i][j].split(',').join('');
                                                        data[i]["Transaction_amount"] = parseFloat((rows[i][j]));
                                                    } else if (j === (rows[i].length - 1)) {


                                                        data[i]["Branch_name"] += rows[i][j] + ' ';
                                                        //console.log("bbbbbbbbbb" , data[i]["Branch_name"])
                                                        lastParticularIndex = i;

                                                    } else if (j === (rows[i].length - 2)) {
                                                        rows[i][j] = rows[i][j].split(',').join('');
                                                        data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                                        //console.log(data[i]["Closing_balance"])
                                                    }

                                                }

                                                if (rows[i].length === 8) {
                                                    //console.log(rows[i])

                                                    if (j === 2) {
                                                        data[i]["Description"] += rows[i][j] + ' ';
                                                        lastParticularIndex = i;
                                                    } else if (j === 3) {

                                                        rows[i][j] = rows[i][j].split(',').join('');
                                                        data[i]["check_No"] = data[i]["check_No"] ? parseFloat((rows[i][j])) : "";
                                                    } else if (j === 4) {

                                                        rows[i][j] = rows[i][j].split(',').join('');
                                                        data[i]["Transaction_amount"] = parseFloat((rows[i][j]));
                                                    } else if (j === (rows[i].length - 1)) {


                                                        data[i]["Branch_name"] += rows[i][j] + ' ';
                                                        //console.log("bbbbbbbbbb" , data[i]["Branch_name"])
                                                        lastParticularIndex = i;

                                                    } else if (j === (rows[i].length - 2)) {
                                                        rows[i][j] = rows[i][j].split(',').join('');
                                                        data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                                        //console.log(data[i]["Closing_balance"])
                                                    }

                                                }

                                                // if (j === 0) {
                                                //     data[i]["Tran_Date"] = rows[i][j];

                                                // } else if (j === 1) {
                                                //     data[i]["Value_Date"] = rows[i][j];

                                                // }
                                                // else if (j === 2) {
                                                //     data[i]["Description"] += rows[i][j] + ' ';
                                                //     lastParticularIndex = i;
                                                // } else if (j === 3) {

                                                //     rows[i][j] = rows[i][j].split(',').join('');
                                                //     data[i]["check_No"] = parseFloat((rows[i][j]));
                                                // } else if (j === 4) {

                                                //     rows[i][j] = rows[i][j].split(',').join('');
                                                //     data[i]["Transaction_amount"] = parseFloat((rows[i][j]));
                                                // } else if (j === (rows[i].length - 1)) {


                                                //     data[i]["Branch_name"] += rows[i][j];
                                                //     lastParticularIndex = i;

                                                // } else if (j === (rows[i].length - 2)) {
                                                //     rows[i][j] = rows[i][j].split(',').join('');
                                                //     data[i]["available_Balance"] = parseFloat((rows[i][j]));
                                                //     //console.log(data[i]["Closing_balance"])
                                                // } else if (j === (rows[i].length - 2)) {
                                                //     rows[i][j] = rows[i][j].split(',').join('');
                                                //     data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                                //     //console.log(data[i]["Closing_balance"])
                                                // } else if (j === (rows[i].length - 3)) {
                                                //     rows[i][j] = rows[i][j].split(',').join('');
                                                //     if (rows[i][j]) {
                                                //         data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                                                //     } else {
                                                //         data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                                                //     }

                                                // }

                                            }


                                            // for (var j = 1; j < rows[i].length; j++) {

                                            //     if (j === 1) {

                                            //         data[i]["Tran_Date"] = rows[i][j];
                                            //         //console.log(data[i]["Tran_Date"])

                                            //     }
                                            //     else if (j === (rows[i].length - 1)) {

                                            //         data[i]["Branch_name"] += rows[i][j] + "";
                                            //         lastParticularIndex = i;

                                            //     }
                                            //     else if (j === (rows[i].length - 2)) {
                                            //         rows[i][j] = rows[i][j].split(',').join('');
                                            //         data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                            //         //console.log( "cb",data[i]["Closing_balance"])
                                            //     } else if (j === (rows[i].length - 3)) {
                                            //         rows[i][j] = rows[i][j].split(',').join('');
                                            //         if (rows[i][j]) {
                                            //             data[i]["Credit_amount"] = data[i]["Credit_amount"] ? parseFloat((rows[i][j])) : "";
                                            //         } else {
                                            //             data[i]["Debit_amount"] = data[i]["Debit_amount"] ? parseFloat((rows[i][j])) : "";
                                            //         }
                                            //         // console.log("ggggggggg" , data[i]["Credit_amount"])
                                            //         // console.log("ggggggggg" , data[i]["Debit_amount"])
                                            //     } else if (j === (rows[i].length - 4)) {
                                            //         var dt2 = rows[i][j].split("/")[1] + "/" + rows[i][j].split("/")[0] + "/" + rows[i][j].split("/")[2];
                                            //         // console.log("ggggggggg" ,dt2)

                                            //         data[i]["Value_date"] = new Date(new Date(dt2).setHours(5, 30, 0, 0));
                                            //         //console.log(data[i]["Value_date"])
                                            //     }
                                            //     else if (j === (rows[i].length - 5)) {
                                            //         rows[i][j] = rows[i][j].split(',').join('');
                                            //         data[i]["Transaction_amount"] = parseFloat((rows[i][j]));

                                            //         //console.log("ggggggggg" ,data[i]["Amount(INR)"])
                                            //     }
                                            //     else {
                                            //         data[i]["Description"] += rows[i][j] + ' ';
                                            //         lastParticularIndex = i;

                                            //     }
                                            // }


                                        }
                                    }
                                    //console.log(rows)
                                }
                                var dataArr = [];
                                for (var key in data) {
                                    dataArr.push(data[key]);
                                }

                                // console.log("dataArrdataArr", dataArr);

                                var y = [...dataArr].reverse();
                                //console.log("yyyy", y);

                                for (var z = 0; z < y.length; z++) {
                                    var val = (bankDetail.openingBalance - y[z].Closing_balance > 0) ? "DR" : "CR";
                                    bankDetail.openingBalance = y[z].Closing_balance;
                                    y[z].Debit_amount = (val == 'DR') ? y[z].Debit_amount : 0
                                    y[z].Credit_amount = (val == 'CR') ? y[z].Credit_amount : 0
                                }
                                // -------------------------- save------kesariBankPdfModel-----------

                                // async.eachSeries(y, async function (item, cb) {
                                //     console.log(item);
                                //     var findData = await stDataModel.bankTempModel.find({ "Bank_name": item.Bank_name, "Date_str": item.Date_str, "Credit_amount": item.Credit_amount, "Closing_balance": item.Closing_balance });
                                //     //console.log(findData);

                                //     if (findData.length > 0) {
                                //         console.log("same data");
                                //         cb();
                                //     } else {
                                //         console.log("identical data");
                                //         stDataModel.bankTempModel.create(item, function (err) {
                                //             if (err) {
                                //                 cb(err)
                                //                 // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                                //             } else {

                                //                 //move file1.htm from 'test/' to 'test/dir_1/'
                                //                 // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                                //                 cb();
                                //                 //Moves the $file to $dir2 END 

                                //             }
                                //             console.log('Form inclusions saved successfully');
                                //         });
                                //     }

                                // }, function (err) {
                                //     if (err) {
                                //         console.log(err);
                                //         moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                                //         cb0();
                                //     } else {
                                //         moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                                //         cb0();
                                //     }
                                // });

                                // ----------------------------e-------------------

                            })
                        })
                        break;

                    case 'txt':
/*
                   
                    const filePath = pathFile + xlsFiles; // Replace with the actual path to your TXT file
                    
                    fs.readFile(filePath, 'utf-8', (err, data) => {
                      if (err) {
                        console.error('Error reading the file:', err);
                        return;
                      }
                    
                      const lines = data.split('\n'); // Split the text into lines
                    
                      const jsonObject = {};
                    
                      // Iterate through each line and parse key-value pairs
                      for (const line of lines) {
                        const [key, value] = line.split(':'); // Split each line by colon
                        if (key && value) {
                          jsonObject[key.trim()] = value.trim(); // Remove leading/trailing whitespace
                        }
                      }
                    
                      // Now you can use the jsonObject in your code
                      console.log(jsonObject);
                    });

                    */
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


                                        bankDetail.bankName = "AXIS 4361.pdf";
                                        if (rows[i][0].indexOf("Statement of Axis Account No :") > -1) {
                                            bankDetail.accountNumber = rows[i][0].split('Statement of Axis Account No :')[1];
                                            bankDetail.accountNumber = bankDetail.accountNumber.split('for the period')[0].trim();
                                        }

                                        if (rows[i].indexOf("OPENING BALANCE") > -1) {
                                            // console.log("OPENING BALANCE", rows[i])
                                            // bankDetail.openingBalance = rows[i][rows[i].indexOf("OPENING BALANCE") + 1].split('INR');
                                            // bankDetail.openingBalance = bankDetail.openingBalance[1].split(',').join('');
                                            // lastAmount = bankDetail.openingBalance;

                                        }
                                    }
                                }
                                // console.log("bankDetailbankDetail", bankDetail)
                                // console.log("vvvvvvvvv" , rows)
                                for (var i = 0; i < rows.length; i++) {
                                    // console.log("dataaaa",validDate(rows[i][0]));
                                    // console.log("dddddddddddd", rows[i][0]);

                                    if (validDate(rows[i][0])) {
                                        //   console.log(rows[i].length,rows[i]);
                                        //console.log(rows[i].length,rows[i]);
                                        data[i] = {};// 

                                        data[i]["processBy"] = "ERP_CROM";
                                        data[i]["processAt"] = new Date();
                                        data[i]["filename"] = xlsFiles;
                                        data[i]["Description"] = "";
                                        data[i]["Bank_name"] = "";
                                        data[i]["Branch_name"] = "";
                                        data[i]["Bank_accountno"] = bankDetail.accountNumber;
                                        data[i]["Credit_amount"] = "";
                                        data[i]["Debit_amount"] = "";
                                        data[i]["Tran_Date"] = "";
                                        data[i]["Value_Date"] = "";
                                        data[i]["check_No"] = "";
                                        data[i]["Transaction_amount"] = 0;
                                        data[i]["available_Balance"] = 0;
                                        data[i]["withdraw"] = 0;
                                        data[i]["deposit"] = "";
                                        data[i]["currency"] = ""; // from Master
                                        data[i]["division"] = ""; // from Master
                                        data[i]["Opening_balance"] = bankDetail.openingBalance;
                                        data[i]["Closing_balance"] = "";
                                        data[i]["SRNO"] = i;



                                        //console.log(rows[i][5])


                                        for (var j = 0; j < rows[i].length; j++) {
                                            if (j === 0) {
                                                data[i]["Tran_Date"] = rows[i][j];

                                            } else if (j === 1) {
                                                data[i]["Value_Date"] = rows[i][j];

                                            } else if (j === (rows[i].length - 3)) {
                                                rows[i][j] = rows[i][j].split(',').join('');
                                                if (rows[i][j]) {
                                                    data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                                                } else {
                                                    data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                                                }

                                            }
                                            else if (j === (rows[i].length - 2)) {
                                                rows[i][j] = rows[i][j].split(',').join('');
                                                data[i]["Closing_balance"] ? parseFloat((rows[i][j])) : "";
                                                //  console.log(data[i]["Closing_balance"])
                                            }
                                            if (rows[i].length === 7) {
                                                //console.log(rows[i])

                                                if (j === 2) {
                                                    data[i]["Description"] += rows[i][j] + ' ';
                                                    lastParticularIndex = i;
                                                } else if (j === 3) {

                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    data[i]["check_No"] = data[i]["check_No"] ? parseFloat((rows[i][j])) : "";
                                                } else if (j === 4) {

                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    data[i]["Transaction_amount"] = parseFloat((rows[i][j]));
                                                } else if (j === (rows[i].length - 1)) {


                                                    data[i]["Branch_name"] += rows[i][j] + ' ';
                                                    //console.log("bbbbbbbbbb" , data[i]["Branch_name"])
                                                    lastParticularIndex = i;

                                                } else if (j === (rows[i].length - 2)) {
                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                                    //console.log(data[i]["Closing_balance"])
                                                }

                                            }

                                            if (rows[i].length === 8) {
                                                //console.log(rows[i])

                                                if (j === 2) {
                                                    data[i]["Description"] += rows[i][j] + ' ';
                                                    lastParticularIndex = i;
                                                } else if (j === 3) {

                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    data[i]["check_No"] = data[i]["check_No"] ? parseFloat((rows[i][j])) : "";
                                                } else if (j === 4) {

                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    data[i]["Transaction_amount"] = parseFloat((rows[i][j]));
                                                } else if (j === (rows[i].length - 1)) {


                                                    data[i]["Branch_name"] += rows[i][j] + ' ';
                                                    //console.log("bbbbbbbbbb" , data[i]["Branch_name"])
                                                    lastParticularIndex = i;

                                                } else if (j === (rows[i].length - 2)) {
                                                    rows[i][j] = rows[i][j].split(',').join('');
                                                    data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                                    //console.log(data[i]["Closing_balance"])
                                                }

                                            }

                                            // if (j === 0) {
                                            //     data[i]["Tran_Date"] = rows[i][j];

                                            // } else if (j === 1) {
                                            //     data[i]["Value_Date"] = rows[i][j];

                                            // }
                                            // else if (j === 2) {
                                            //     data[i]["Description"] += rows[i][j] + ' ';
                                            //     lastParticularIndex = i;
                                            // } else if (j === 3) {

                                            //     rows[i][j] = rows[i][j].split(',').join('');
                                            //     data[i]["check_No"] = parseFloat((rows[i][j]));
                                            // } else if (j === 4) {

                                            //     rows[i][j] = rows[i][j].split(',').join('');
                                            //     data[i]["Transaction_amount"] = parseFloat((rows[i][j]));
                                            // } else if (j === (rows[i].length - 1)) {


                                            //     data[i]["Branch_name"] += rows[i][j];
                                            //     lastParticularIndex = i;

                                            // } else if (j === (rows[i].length - 2)) {
                                            //     rows[i][j] = rows[i][j].split(',').join('');
                                            //     data[i]["available_Balance"] = parseFloat((rows[i][j]));
                                            //     //console.log(data[i]["Closing_balance"])
                                            // } else if (j === (rows[i].length - 2)) {
                                            //     rows[i][j] = rows[i][j].split(',').join('');
                                            //     data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                            //     //console.log(data[i]["Closing_balance"])
                                            // } else if (j === (rows[i].length - 3)) {
                                            //     rows[i][j] = rows[i][j].split(',').join('');
                                            //     if (rows[i][j]) {
                                            //         data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                                            //     } else {
                                            //         data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                                            //     }

                                            // }

                                        }


                                        // for (var j = 1; j < rows[i].length; j++) {

                                        //     if (j === 1) {

                                        //         data[i]["Tran_Date"] = rows[i][j];
                                        //         //console.log(data[i]["Tran_Date"])

                                        //     }
                                        //     else if (j === (rows[i].length - 1)) {

                                        //         data[i]["Branch_name"] += rows[i][j] + "";
                                        //         lastParticularIndex = i;

                                        //     }
                                        //     else if (j === (rows[i].length - 2)) {
                                        //         rows[i][j] = rows[i][j].split(',').join('');
                                        //         data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                        //         //console.log( "cb",data[i]["Closing_balance"])
                                        //     } else if (j === (rows[i].length - 3)) {
                                        //         rows[i][j] = rows[i][j].split(',').join('');
                                        //         if (rows[i][j]) {
                                        //             data[i]["Credit_amount"] = data[i]["Credit_amount"] ? parseFloat((rows[i][j])) : "";
                                        //         } else {
                                        //             data[i]["Debit_amount"] = data[i]["Debit_amount"] ? parseFloat((rows[i][j])) : "";
                                        //         }
                                        //         // console.log("ggggggggg" , data[i]["Credit_amount"])
                                        //         // console.log("ggggggggg" , data[i]["Debit_amount"])
                                        //     } else if (j === (rows[i].length - 4)) {
                                        //         var dt2 = rows[i][j].split("/")[1] + "/" + rows[i][j].split("/")[0] + "/" + rows[i][j].split("/")[2];
                                        //         // console.log("ggggggggg" ,dt2)

                                        //         data[i]["Value_date"] = new Date(new Date(dt2).setHours(5, 30, 0, 0));
                                        //         //console.log(data[i]["Value_date"])
                                        //     }
                                        //     else if (j === (rows[i].length - 5)) {
                                        //         rows[i][j] = rows[i][j].split(',').join('');
                                        //         data[i]["Transaction_amount"] = parseFloat((rows[i][j]));

                                        //         //console.log("ggggggggg" ,data[i]["Amount(INR)"])
                                        //     }
                                        //     else {
                                        //         data[i]["Description"] += rows[i][j] + ' ';
                                        //         lastParticularIndex = i;

                                        //     }
                                        // }


                                    }
                                }
                                //console.log(rows)
                            }
                            var dataArr = [];
                            for (var key in data) {
                                dataArr.push(data[key]);
                            }

                            // console.log("dataArrdataArr", dataArr);

                            var y = [...dataArr].reverse();
                            //console.log("yyyy", y);

                            for (var z = 0; z < y.length; z++) {
                                var val = (bankDetail.openingBalance - y[z].Closing_balance > 0) ? "DR" : "CR";
                                bankDetail.openingBalance = y[z].Closing_balance;
                                y[z].Debit_amount = (val == 'DR') ? y[z].Debit_amount : 0
                                y[z].Credit_amount = (val == 'CR') ? y[z].Credit_amount : 0
                            }
                            // -------------------------- save------kesariBankPdfModel-----------

                            // async.eachSeries(y, async function (item, cb) {
                            //     console.log(item);
                            //     var findData = await stDataModel.bankTempModel.find({ "Bank_name": item.Bank_name, "Date_str": item.Date_str, "Credit_amount": item.Credit_amount, "Closing_balance": item.Closing_balance });
                            //     //console.log(findData);

                            //     if (findData.length > 0) {
                            //         console.log("same data");
                            //         cb();
                            //     } else {
                            //         console.log("identical data");
                            //         stDataModel.bankTempModel.create(item, function (err) {
                            //             if (err) {
                            //                 cb(err)
                            //                 // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                            //             } else {

                            //                 //move file1.htm from 'test/' to 'test/dir_1/'
                            //                 // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                            //                 cb();
                            //                 //Moves the $file to $dir2 END 

                            //             }
                            //             console.log('Form inclusions saved successfully');
                            //         });
                            //     }

                            // }, function (err) {
                            //     if (err) {
                            //         console.log(err);
                            //         moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                            //         cb0();
                            //     } else {
                            //         moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                            //         cb0();
                            //     }
                            // });

                            // ----------------------------e-------------------

                        })
                    })
                    break;

                    case 'xlsx':



                        // const workbook = XLSX.readFile(pathFile + xlsFiles); // Replace 'your_file.xlsx' with the path to your XLS file

                        // // Specify the sheet you want to convert to JSON (for example, the first sheet)
                        // const sheetName = workbook.SheetNames[0];
                        // const worksheet = workbook.Sheets[sheetName];

                        // // Convert the worksheet to a JSON object
                        // const jsonData = XLSX.utils.sheet_to_json(worksheet);

                        // // Save the JSON data to a file (optional)
                        // fs.writeFileSync('output.json', JSON.stringify(jsonData, null, 2), 'utf-8');

                        // // Alternatively, you can use the JSON data in memory
                        // console.log(jsonData);


                        // fs.readFile(pathFile + xlsFiles, (err, buffer) => {

                        //     if (err) {
                        //         console.log("errrrrrr", err)
                        //     }
                        //     xlsToJson.parse(buffer, function (err, rows, rowsdebug) {

                        //         if (err) {
                        //             console.log(err);
                        //             return res.json({
                        //                 message: err.message,
                        //                 data: [],
                        //                 success: false
                        //             });
                        //         }
                        //         var data = {};
                        //         if (rows.length > 0) {
                        //             var lastAmount = 0;
                        //             var openingBalance = 0;
                        //             var lastParticularIndex = 0;
                        //             var accountNumber;
                        //             var bankDetail = {};

                        //             for (var i = 0; i < rows.length; i++) {
                        //                 if (rows[i][0]) {


                        //                     bankDetail.bankName = "AXIS 4361.pdf";
                        //                     if (rows[i][0].indexOf("Statement of Axis Account No :") > -1) {
                        //                         bankDetail.accountNumber = rows[i][0].split('Statement of Axis Account No :')[1];
                        //                         bankDetail.accountNumber = bankDetail.accountNumber.split('for the period')[0].trim();
                        //                     }

                        //                     if (rows[i].indexOf("OPENING BALANCE") > -1) {
                        //                         // console.log("OPENING BALANCE", rows[i])
                        //                         // bankDetail.openingBalance = rows[i][rows[i].indexOf("OPENING BALANCE") + 1].split('INR');
                        //                         // bankDetail.openingBalance = bankDetail.openingBalance[1].split(',').join('');
                        //                         // lastAmount = bankDetail.openingBalance;

                        //                     }
                        //                 }
                        //             }
                        //             // console.log("bankDetailbankDetail", bankDetail)
                        //             // console.log("vvvvvvvvv" , rows)
                        //             for (var i = 0; i < rows.length; i++) {
                        //                 // console.log("dataaaa",validDate(rows[i][0]));
                        //                 // console.log("dddddddddddd", rows[i][0]);

                        //                 if (validDate(rows[i][0])) {
                        //                     //   console.log(rows[i].length,rows[i]);
                        //                     //console.log(rows[i].length,rows[i]);
                        //                     data[i] = {};// 

                        //                     data[i]["processBy"] = "ERP_CROM";
                        //                     data[i]["processAt"] = new Date();
                        //                     data[i]["filename"] = xlsFiles;
                        //                     data[i]["Description"] = "";
                        //                     data[i]["Bank_name"] = "";
                        //                     data[i]["Branch_name"] = "";
                        //                     data[i]["Bank_accountno"] = bankDetail.accountNumber;
                        //                     data[i]["Credit_amount"] = "";
                        //                     data[i]["Debit_amount"] = "";
                        //                     data[i]["Tran_Date"] = "";
                        //                     data[i]["Value_Date"] = "";
                        //                     data[i]["check_No"] = "";
                        //                     data[i]["Transaction_amount"] = 0;
                        //                     data[i]["available_Balance"] = 0;
                        //                     data[i]["withdraw"] = 0;
                        //                     data[i]["deposit"] = "";
                        //                     data[i]["currency"] = ""; // from Master
                        //                     data[i]["division"] = ""; // from Master
                        //                     data[i]["Opening_balance"] = bankDetail.openingBalance;
                        //                     data[i]["Closing_balance"] = "";
                        //                     data[i]["SRNO"] = i;






                        //                     for (var j = 0; j < rows[i].length; j++) {


                        //                         if (j === 0) {
                        //                             data[i]["Tran_Date"] = rows[i][j];

                        //                         } else if (j === 1) {
                        //                             data[i]["Value_Date"] = rows[i][j];

                        //                         }
                        //                         else if (j === 2) {
                        //                             data[i]["Description"] += rows[i][j] + ' ';
                        //                             lastParticularIndex = i;
                        //                         } else if (j === 3) {

                        //                             rows[i][j] = rows[i][j].split(',').join('');
                        //                             data[i]["check_No"] = parseFloat((rows[i][j]));
                        //                         } else if (j === 4) {

                        //                             rows[i][j] = rows[i][j].split(',').join('');
                        //                             data[i]["Transaction_amount"] = parseFloat((rows[i][j]));
                        //                         } else if (j === (rows[i].length - 1)) {


                        //                             data[i]["Branch_name"] += rows[i][j];
                        //                             lastParticularIndex = i;

                        //                         } else if (j === (rows[i].length - 2)) {
                        //                             rows[i][j] = rows[i][j].split(',').join('');
                        //                             data[i]["available_Balance"] = parseFloat((rows[i][j]));
                        //                             //console.log(data[i]["Closing_balance"])
                        //                         } else if (j === (rows[i].length - 2)) {
                        //                             rows[i][j] = rows[i][j].split(',').join('');
                        //                             data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                        //                             //console.log(data[i]["Closing_balance"])
                        //                         } else if (j === (rows[i].length - 3)) {
                        //                             rows[i][j] = rows[i][j].split(',').join('');
                        //                             if (rows[i][j]) {
                        //                                 data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                        //                             } else {
                        //                                 data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                        //                             }

                        //                         }

                        //                     }





                        //                 }
                        //             }
                        //             //console.log(rows)
                        //         }
                        //         var dataArr = [];
                        //         for (var key in data) {
                        //             dataArr.push(data[key]);
                        //         }

                        //         // console.log("dataArrdataArr", dataArr);

                        //         var y = [...dataArr].reverse();
                        //         //console.log("yyyy", y);

                        //         for (var z = 0; z < y.length; z++) {
                        //             var val = (bankDetail.openingBalance - y[z].Closing_balance > 0) ? "DR" : "CR";
                        //             bankDetail.openingBalance = y[z].Closing_balance;
                        //             y[z].Debit_amount = (val == 'DR') ? y[z].Debit_amount : 0
                        //             y[z].Credit_amount = (val == 'CR') ? y[z].Credit_amount : 0
                        //         }
                        //         // -------------------------- save------kesariBankPdfModel-----------

                        //         // async.eachSeries(y, async function (item, cb) {
                        //         //     console.log(item);
                        //         //     var findData = await stDataModel.bankTempModel.find({ "Bank_name": item.Bank_name, "Date_str": item.Date_str, "Credit_amount": item.Credit_amount, "Closing_balance": item.Closing_balance });
                        //         //     //console.log(findData);

                        //         //     if (findData.length > 0) {
                        //         //         console.log("same data");
                        //         //         cb();
                        //         //     } else {
                        //         //         console.log("identical data");
                        //         //         stDataModel.bankTempModel.create(item, function (err) {
                        //         //             if (err) {
                        //         //                 cb(err)
                        //         //                 // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                        //         //             } else {

                        //         //                 //move file1.htm from 'test/' to 'test/dir_1/'
                        //         //                 // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                        //         //                 cb();
                        //         //                 //Moves the $file to $dir2 END 

                        //         //             }
                        //         //             console.log('Form inclusions saved successfully');
                        //         //         });
                        //         //     }

                        //         // }, function (err) {
                        //         //     if (err) {
                        //         //         console.log(err);
                        //         //         moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                        //         //         cb0();
                        //         //     } else {
                        //         //         moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                        //         //         cb0();
                        //         //     }
                        //         // });

                        //         // ----------------------------e-------------------

                        //     })
                        // })
                        break;
                       
                    case 'xls':
                    // const workbook = XLSX.readFile(pathFile + xlsFiles); // Replace 'your_file.xlsx' with the path to your XLS file

                    // // Specify the sheet you want to convert to JSON (for example, the first sheet)
                    // const sheetName = workbook.SheetNames[0];
                    // const worksheet = workbook.Sheets[sheetName];

                    // // Convert the worksheet to a JSON object
                    // const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // // Save the JSON data to a file (optional)
                    // fs.writeFileSync('output.json', JSON.stringify(jsonData, null, 2), 'utf-8');

                    // // Alternatively, you can use the JSON data in memory
                    // console.log(jsonData);


                    // fs.readFile(pathFile + xlsFiles, (err, buffer) => {

                    //     if (err) {
                    //         console.log("errrrrrr", err)
                    //     }
                    //     xlsToJson.parse(buffer, function (err, rows, rowsdebug) {

                    //         if (err) {
                    //             console.log(err);
                    //             return res.json({
                    //                 message: err.message,
                    //                 data: [],
                    //                 success: false
                    //             });
                    //         }
                    //         var data = {};
                    //         if (rows.length > 0) {
                    //             var lastAmount = 0;
                    //             var openingBalance = 0;
                    //             var lastParticularIndex = 0;
                    //             var accountNumber;
                    //             var bankDetail = {};

                    //             for (var i = 0; i < rows.length; i++) {
                    //                 if (rows[i][0]) {


                    //                     bankDetail.bankName = "AXIS 4361.pdf";
                    //                     if (rows[i][0].indexOf("Statement of Axis Account No :") > -1) {
                    //                         bankDetail.accountNumber = rows[i][0].split('Statement of Axis Account No :')[1];
                    //                         bankDetail.accountNumber = bankDetail.accountNumber.split('for the period')[0].trim();
                    //                     }

                    //                     if (rows[i].indexOf("OPENING BALANCE") > -1) {
                    //                         // console.log("OPENING BALANCE", rows[i])
                    //                         // bankDetail.openingBalance = rows[i][rows[i].indexOf("OPENING BALANCE") + 1].split('INR');
                    //                         // bankDetail.openingBalance = bankDetail.openingBalance[1].split(',').join('');
                    //                         // lastAmount = bankDetail.openingBalance;

                    //                     }
                    //                 }
                    //             }
                    //             // console.log("bankDetailbankDetail", bankDetail)
                    //             // console.log("vvvvvvvvv" , rows)
                    //             for (var i = 0; i < rows.length; i++) {
                    //                 // console.log("dataaaa",validDate(rows[i][0]));
                    //                 // console.log("dddddddddddd", rows[i][0]);

                    //                 if (validDate(rows[i][0])) {
                    //                     //   console.log(rows[i].length,rows[i]);
                    //                     //console.log(rows[i].length,rows[i]);
                    //                     data[i] = {};// 

                    //                     data[i]["processBy"] = "ERP_CROM";
                    //                     data[i]["processAt"] = new Date();
                    //                     data[i]["filename"] = xlsFiles;
                    //                     data[i]["Description"] = "";
                    //                     data[i]["Bank_name"] = "";
                    //                     data[i]["Branch_name"] = "";
                    //                     data[i]["Bank_accountno"] = bankDetail.accountNumber;
                    //                     data[i]["Credit_amount"] = "";
                    //                     data[i]["Debit_amount"] = "";
                    //                     data[i]["Tran_Date"] = "";
                    //                     data[i]["Value_Date"] = "";
                    //                     data[i]["check_No"] = "";
                    //                     data[i]["Transaction_amount"] = 0;
                    //                     data[i]["available_Balance"] = 0;
                    //                     data[i]["withdraw"] = 0;
                    //                     data[i]["deposit"] = "";
                    //                     data[i]["currency"] = ""; // from Master
                    //                     data[i]["division"] = ""; // from Master
                    //                     data[i]["Opening_balance"] = bankDetail.openingBalance;
                    //                     data[i]["Closing_balance"] = "";
                    //                     data[i]["SRNO"] = i;






                    //                     for (var j = 0; j < rows[i].length; j++) {


                    //                         if (j === 0) {
                    //                             data[i]["Tran_Date"] = rows[i][j];

                    //                         } else if (j === 1) {
                    //                             data[i]["Value_Date"] = rows[i][j];

                    //                         }
                    //                         else if (j === 2) {
                    //                             data[i]["Description"] += rows[i][j] + ' ';
                    //                             lastParticularIndex = i;
                    //                         } else if (j === 3) {

                    //                             rows[i][j] = rows[i][j].split(',').join('');
                    //                             data[i]["check_No"] = parseFloat((rows[i][j]));
                    //                         } else if (j === 4) {

                    //                             rows[i][j] = rows[i][j].split(',').join('');
                    //                             data[i]["Transaction_amount"] = parseFloat((rows[i][j]));
                    //                         } else if (j === (rows[i].length - 1)) {


                    //                             data[i]["Branch_name"] += rows[i][j];
                    //                             lastParticularIndex = i;

                    //                         } else if (j === (rows[i].length - 2)) {
                    //                             rows[i][j] = rows[i][j].split(',').join('');
                    //                             data[i]["available_Balance"] = parseFloat((rows[i][j]));
                    //                             //console.log(data[i]["Closing_balance"])
                    //                         } else if (j === (rows[i].length - 2)) {
                    //                             rows[i][j] = rows[i][j].split(',').join('');
                    //                             data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                    //                             //console.log(data[i]["Closing_balance"])
                    //                         } else if (j === (rows[i].length - 3)) {
                    //                             rows[i][j] = rows[i][j].split(',').join('');
                    //                             if (rows[i][j]) {
                    //                                 data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                    //                             } else {
                    //                                 data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                    //                             }

                    //                         }

                    //                     }





                    //                 }
                    //             }
                    //             //console.log(rows)
                    //         }
                    //         var dataArr = [];
                    //         for (var key in data) {
                    //             dataArr.push(data[key]);
                    //         }

                    //         // console.log("dataArrdataArr", dataArr);

                    //         var y = [...dataArr].reverse();
                    //         //console.log("yyyy", y);

                    //         for (var z = 0; z < y.length; z++) {
                    //             var val = (bankDetail.openingBalance - y[z].Closing_balance > 0) ? "DR" : "CR";
                    //             bankDetail.openingBalance = y[z].Closing_balance;
                    //             y[z].Debit_amount = (val == 'DR') ? y[z].Debit_amount : 0
                    //             y[z].Credit_amount = (val == 'CR') ? y[z].Credit_amount : 0
                    //         }
                    //         // -------------------------- save------kesariBankPdfModel-----------

                    //         // async.eachSeries(y, async function (item, cb) {
                    //         //     console.log(item);
                    //         //     var findData = await stDataModel.bankTempModel.find({ "Bank_name": item.Bank_name, "Date_str": item.Date_str, "Credit_amount": item.Credit_amount, "Closing_balance": item.Closing_balance });
                    //         //     //console.log(findData);

                    //         //     if (findData.length > 0) {
                    //         //         console.log("same data");
                    //         //         cb();
                    //         //     } else {
                    //         //         console.log("identical data");
                    //         //         stDataModel.bankTempModel.create(item, function (err) {
                    //         //             if (err) {
                    //         //                 cb(err)
                    //         //                 // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                    //         //             } else {

                    //         //                 //move file1.htm from 'test/' to 'test/dir_1/'
                    //         //                 // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                    //         //                 cb();
                    //         //                 //Moves the $file to $dir2 END 

                    //         //             }
                    //         //             console.log('Form inclusions saved successfully');
                    //         //         });
                    //         //     }

                    //         // }, function (err) {
                    //         //     if (err) {
                    //         //         console.log(err);
                    //         //         moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                    //         //         cb0();
                    //         //     } else {
                    //         //         moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                    //         //         cb0();
                    //         //     }
                    //         // });

                    //         // ----------------------------e-------------------

                    //     })
                    // })
                     break;


                    default:
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

