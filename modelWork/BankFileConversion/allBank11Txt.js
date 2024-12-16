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
const txtToJson = require("txt-file-to-json");

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
                                            //console.log(rows[i].length,rows[i]);
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
                        fs.readFile(pathFile + xlsFiles, "utf8", (err, line) => {

                            if (err) {
                                console.log("errrrrrr", err)

                            }
                            var lnn=line.split('\n');
                            //console.log(lnn);
                            var dataArr=[];
                            for(var i=0;i<lnn.length;i++){
                                if(lnn[i].substr(0,8).split('/').length==3){
                                    var ob={};
                                    // console.log(lnn[i].split('  '));
                                    ob.date=lnn[i].substr(0,8).trim();
                                    ob.narration=lnn[i].substr(10,40).trim();
                                    ob.chequeNo=lnn[i].substr(52,16).trim();
                                    ob.value=lnn[i].substr(70,8).trim();
                                    ob.debit=lnn[i].substr(80,18).trim();
                                    ob.credit=lnn[i].substr(100,18).trim();
                                    ob.closing=lnn[i].substr(120,19).trim();
                                    // console.log(ob);
                                    dataArr.push(ob);
                                }
                                else if(lnn[i].indexOf("**Continue**")>-1){
                                    
                                }else if(lnn[i].indexOf('--------')>-1){
                                    // var x=lnn[i].split('  ');
                                    // for(j=0;j<x.length;j++){
                                    //     console.log(x[j].length);
                                    // }
                                    // console.log("ccccccccccccccccccccccccc");
                                }
                                else{
                                    if(lnn[i-1]){
                                        if(lnn[i-1].substr(0,8).split('/').length==3){
                                            if(dataArr[(dataArr.length-1)] && dataArr[(dataArr.length-1)].narration.indexOf(lnn[i].trim())==-1){
                                            dataArr[(dataArr.length-1)].narration+=lnn[i].trim();
                                            }
                                        }
                                    }
                                    if(lnn[i-2]){
                                        if(lnn[i-2].substr(0,8).split('/').length==3){
                                            if(dataArr[(dataArr.length-1)] && dataArr[(dataArr.length-1)].narration.indexOf(lnn[i].trim())==-1){
                                                dataArr[(dataArr.length-1)].narration+=lnn[i].trim();
                                            }
                                        }
                                    }
                                }
                            };
                            console.log(dataArr);
                            //console.log("hhhhhh", typeof(line));
                            /*if (line > 0) {
                                var jsonObject = {}
                                let isParsingData = false;
                                for (var line of lines) {
                                    if (line === '--------  ----------------------------------------  ----------------  --------  ------------------  ------------------  ------------------') {
                                        // This line indicates the start of the data section
                                        isParsingData = true;
                                        continue;
                                    }

                                    // for (var i = 0; i < rows.length; i++) {
                                    //     // console.log("dataaaa",validDate(rows[i][0]));
                                    //     // console.log("dddddddddddd", rows[i][0]);

                                    //     if (validDate(rows[i][0])) {
                                    //         //console.log(rows[i].length,rows[i]);
                                    //         //console.log(rows[i].length,rows[i]);
                                    //         data[i] = {};// 

                                    //         data[i]["processBy"] = "ERP_CROM";
                                    //         data[i]["processAt"] = new Date();
                                    //         data[i]["filename"] = xlsFiles;



                                    if (isParsingData) {
                                        const [date, narration, chqRefNo, valueDt, withdrawalAmt, depositAmt, closingBalance] = line.split(/\s{2,}/);
                                        if (date && date.trim() !== 'Date') {
                                            console.log( date && date.trim() !== 'Date')
                                          var data = {
                                          Narration : narration,
                                        }
                                        console.log("hhjhg", data)
                                        }
                                        //console.log( "hhjhg" ,line.Date)
                                    }

                                }





                            }*/
                        })

                        break;

                    // case 'txt':
                    // fs.readFile(pathFile + xlsFiles,"utf8", (err, buffer) => {

                    //     if (err) {
                    //         console.log("errrrrrr", err)
                    //     }

                    //     console.log("hhhhhh" ,buffer);
                    //     pdf2table.parse(buffer, function (err, rows, rowsdebug) {
                    //         //console.log("hhhhhh");
                    //         if (err) {
                    //             console.log(err);
                    //             return res.json({
                    //                 message: err.message,
                    //                 data: [],
                    //                 success: false
                    //             });
                    //         }
                    //         var data = {}
                    //         if (rows.length > 0) {
                    //             var bankDetail = {};

                    //             console.log("hhhhhh" ,rows);
                    //             // --------------start------------
                    //             for (var i = 0; i < rows.length; i++) {
                    //                 if (!validDate(rows[i][0])) {

                    //                     bankDetail.bankName = "AXIS 4361.pdf";

                    //                     if (rows[i].indexOf("Branch") > -1) {

                    //                         bankDetail.branchName = rows[i][rows[i].indexOf("Branch") + 1];

                    //                     }
                    //                     if (rows[i].indexOf("Account No.") > -1) {
                    //                         bankDetail.accountNumber = rows[i][rows[i].indexOf("Account No.") + 1];
                    //                     }
                    //                     if (rows[i].indexOf("Opening balance") > -1) {
                    //                         bankDetail.openingBalance = rows[i][rows[i].indexOf("Opening balance") + 1].split('INR');
                    //                         bankDetail.openingBalance = bankDetail.openingBalance[1].split(',').join('');
                    //                         lastAmount = bankDetail.openingBalance;

                    //                     }
                    //                 }
                    //             }

                    //             for (var i = 0; i < rows.length; i++) {
                    //              console.log("dataaaa",validDate(rows[i][1]));
                    //                // console.log("dddddddddddd", rows[i][1]);

                    //                 if (validDate(rows[i][1])) {
                    //                     data[i] = {};// 
                    //                     data[i]["companyId"] = 0;
                    //                     data[i]["receiptId"] = "";
                    //                     data[i]["receiptType"] = "";
                    //                     data[i]["voucherNo"] = "";
                    //                     data[i]["processBy"] = "ERP_CROM";
                    //                     data[i]["processAt"] = new Date();
                    //                     data[i]["filename"] = xlsFiles;
                    //                     data[i]["Description"] = "";
                    //                     data[i]["Branch_name"] = bankDetail.branchName;
                    //                     data[i]["Bank_name"] = bankDetail.bankName;
                    //                     data[i]["Bank_accountno"] = bankDetail.accountNumber;
                    //                     data[i]["Credit_amount"] = 0;
                    //                     data[i]["Debit_amount"] = 0;
                    //                     data[i]["SRNO"] = i;






                    //                     for (var j = 1; j < rows[i].length; j++) {

                    //                         if (j === 1) {

                    //                             data[i]["Date_str"] = rows[i][j];
                    //                         } else if (j === (rows[i].length - 1)) {

                    //                         }
                    //                         else if (j === (rows[i].length - 2)) {
                    //                             rows[i][j] = rows[i][j].split(',').join('');
                    //                             data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                    //                         } else if (j === (rows[i].length - 3)) {
                    //                             rows[i][j] = rows[i][j].split(',').join('');
                    //                             if (rows[i][j]) {
                    //                                 data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                    //                             } else {
                    //                                 data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                    //                             }
                    //                         } else if (j === (rows[i].length - 4)) {
                    //                             var dt2 = rows[i][j].split("/")[1] + "/" + rows[i][j].split("/")[0] + "/" + rows[i][j].split("/")[2];
                    //                             data[i]["Value_date"] = new Date(new Date(dt2).setHours(5, 30, 0, 0));
                    //                         } else {
                    //                             //console.log(rows[i][j]);
                    //                             data[i]["Description"] += rows[i][j] + ' ';
                    //                             lastParticularIndex = i;
                    //                         }
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //         var dataArr = [];
                    //         for (var key in data) {
                    //             dataArr.push(data[key]);
                    //         }
                    //        // console.log("dataArr", dataArr);
                    //        // console.log("srno", dataArr.sort(dynamicSort('SRNO')));
                    //         //console.log(bankDetail.openingBalance);
                    //         var y = [...dataArr].reverse();

                    //         for (var z = 0; z < y.length; z++) {

                    //             var val = ((bankDetail.openingBalance - y[z].Closing_balance) > 0) ? "DR" : "CR";
                    //             bankDetail.openingBalance = y[z].Closing_balance;
                    //             y[z].Debit_amount = (val == 'DR') ? y[z].Credit_amount : 0
                    //             y[z].Credit_amount = (val == 'CR') ? y[z].Credit_amount : 0
                    //         }

                    //        // console.log(y.length);
                    //         async.eachSeries(y, async function (item, cb) {
                    //           //  console.log(item);
                    //             var findData = await stDataModel.bankTempModel.find({ "Bank_name": item.Bank_name, "Date_str": item.Date_str, "Credit_amount": item.Credit_amount, "Closing_balance": item.Closing_balance });
                    //             //console.log(findData);

                    //             if (findData.length > 0) {
                    //                 console.log("same data");
                    //                 cb();
                    //             } else {
                    //                 console.log("identical data");
                    //                 stDataModel.bankTempModel.create(item, function (err) {
                    //                     if (err) {
                    //                         cb(err)
                    //                         // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                    //                     } else {

                    //                         //move file1.htm from 'test/' to 'test/dir_1/'
                    //                         // moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                    //                         cb();
                    //                         //Moves the $file to $dir2 END 

                    //                     }
                    //                     console.log('Form inclusions saved successfully');
                    //                 });
                    //             }

                    //         }, function (err) {
                    //             if (err) {
                    //                 console.log(err);
                    //                 moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stFaildBank');
                    //                 cb0();
                    //             } else {
                    //                 moveFile("/media/data1/pdf2mong/KOTAK BANK/" + xlsFiles, '/media/bucket/stDoneBank');
                    //                 cb0();
                    //             }
                    //         });

                    //         // ---------------end-----------

                    //     })
                    // })

                    // break;

                    // case 'txt':
                    //     //const fs = require('fs');
                    //     function textToJson(filePath , callback) {
                    //         var filePath = pathFile + xlsFiles

                    //         fs.readFile(pathFile + xlsFiles, 'utf-8', (err, data) => {
                    //             if (err) {
                    //                 return callback(err, null);
                    //             }
                    //             //console.log("FFFFFFF" , data)

                    //             const lines = data.split('\n');
                    //             const jsonObject = {};

                    //             let isParsingData = false;

                    //             for (const line of lines) {
                    //                 if (line === '--------  ----------------------------------------  ----------------  --------  ------------------  ------------------  ------------------') {
                    //                     // This line indicates the start of the data section
                    //                     isParsingData = true;
                    //                     continue;
                    //                 }

                    //                 if (isParsingData) {
                    //                     const [date, narration, chqRefNo, valueDt, withdrawalAmt, depositAmt, closingBalance] = line.split(/\s{2,}/);

                    //                     if (date && date.trim() !== 'Date') {
                    //                         jsonObject[date.trim()] = {
                    //                             Narration: narration,
                    //                             Chq_Ref_No: chqRefNo,
                    //                             Value_Dt: valueDt,
                    //                             Withdrawal_Amt: withdrawalAmt,
                    //                             Deposit_Amt: depositAmt.trim(),
                    //                             Closing_Balance: closingBalance.trim(),
                    //                         };
                    //                         console.log("FFFFFFF" , jsonObject)
                    //                     }
                    //                 } else {
                    //                     // Extract other relevant information before the data section
                    //                     if (line.includes('Account Branch :')) {
                    //                         jsonObject['Account_Branch'] = line.replace('Account Branch :', '').trim();
                    //                     } 
                    //                     // Add more fields as needed
                    //                 }
                    //             }

                    //             callback(null, jsonObject);
                    //         });
                    //     }

                    // case 'txt':
                    //     function textToJson(filePath, callback) {
                    //         fs.readFile(filePath, 'utf-8', (err, data) => {
                    //             if (err) {
                    //                 return callback(err, null);
                    //             }

                    //             const lines = data.split('\n');
                    //             const jsonObject = {};

                    //             let isParsingData = false;

                    //             for (let i = 0; i < lines.length; i++) {
                    //                 const line = lines[i];

                    //                 if (line.trim() === '--------  ----------------------------------------  ----------------  --------  ------------------  ------------------  ------------------') {
                    //                     // This line indicates the start of the data section
                    //                     isParsingData = true;
                    //                     continue;
                    //                 }

                    //                 if (isParsingData) {
                    //                     const columns = line.split(/\s{2,}/);

                    //                     // Check if there are enough columns to extract data
                    //                     if (columns.length >= 7) {
                    //                         const [date, narration, chqRefNo, valueDt, withdrawalAmt, depositAmt, closingBalance] = columns;

                    //                         if (date.trim() !== 'Date') {
                    //                             jsonObject[date.trim()] = {
                    //                                 Tran_Date:date.trim(),
                    //                                 Description: narration.trim(),
                    //                                 Chq_Ref_No: chqRefNo.trim(),
                    //                                 Value_Dt: valueDt.trim(),
                    //                                 withdraw: withdrawalAmt.trim(),
                    //                                 deposit: depositAmt.trim(),
                    //                                 Closing_balance: closingBalance.trim(),
                    //                                 processBy :"ERP_CROM",
                    //                                 processAt:new Date(),
                    //                                 filename:xlsFiles,
                    //                                 Debit_amount:"",





                    //                                 // data[i]["processBy"] = "ERP_CROM";
                    //                                 // data[i]["processAt"] = new Date();
                    //                                 // data[i]["filename"] = xlsFiles;
                    //                                 // data[i]["Description"] = "";
                    //                                 // data[i]["Bank_name"] = "";
                    //                                 // data[i]["Branch_name"] = "";
                    //                                 // data[i]["Bank_accountno"] = bankDetail.accountNumber;
                    //                                 // data[i]["Credit_amount"] = "";
                    //                                 // data[i]["Debit_amount"] = "";
                    //                                 // data[i]["Tran_Date"] = "";
                    //                                 // data[i]["Value_Date"] = "";
                    //                                 // data[i]["check_No"] = "";
                    //                                 // data[i]["Transaction_amount"] = 0;
                    //                                 // data[i]["available_Balance"] = 0;
                    //                                 // data[i]["withdraw"] = 0;
                    //                                 // data[i]["deposit"] = "";
                    //                                 // data[i]["currency"] = ""; // from Master
                    //                                 // data[i]["division"] = ""; // from Master
                    //                                 // data[i]["Opening_balance"] = bankDetail.openingBalance;
                    //                                 // data[i]["Closing_balance"] = "";
                    //                                 // data[i]["SRNO"] = i;
                    //                             };
                    //                         }
                    //                     }
                    //                 } else {
                    //                     // Extract other relevant information before the data section
                    //                     if (line.includes('Account Branch :') > -1) {
                    //                         jsonObject['Account_Branch'] = line.replace('Account Branch :', '').trim();
                    //                     } else if (line.includes('Account No :')) {
                    //                         jsonObject['Account_No'] = line.replace('Account No :', '').trim();
                    //                     } else if (line.includes('Cust ID :')) {
                    //                         jsonObject['Cust_ID'] = line.replace('Cust ID :', '').trim();
                    //                     }
                    //                     // Add more fields as needed
                    //                 }
                    //             }

                    //             callback(null, jsonObject);
                    //         });
                    //     }

                    // var filePath = pathFile + xlsFiles; // Construct the full file path

                    // textToJson(filePath, (err, result) => {
                    //     if (err) {
                    //         console.error('Error:', err);
                    //     } else {
                    //         console.log(JSON.stringify(result, null, 2));
                    //     }
                    // });

                    //  break;

                    case 'xlsx':
                        // const workbook = XLSX.readFile(pathFile + xlsFiles); // Replace 'your_file.xlsx' with the path to your XLS file
                        // //console.log(workbook)
                        // // Specify the sheet you want to convert to JSON (for example, the first sheet)
                        // const sheetName = workbook.SheetNames[0];
                        // //console.log(sheetName)
                        // const worksheet = workbook.Sheets[sheetName];
                        // console.log(worksheet)

                        // // Convert the worksheet to a JSON object
                        // const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        // // console.log(jsonData)
                        // // Save the JSON data to a file (optional)
                        // fs.writeFileSync('output.json', JSON.stringify(jsonData, null, 2), 'utf-8');

                        // // Alternatively, you can use the JSON data in memory
                        // console.log(jsonData);




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

