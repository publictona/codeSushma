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
//const xlsToJson=require('xls-to-json');
var pdf2table = require('pdf2table');
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
const { getBankDetails } = require('./controllers/guestSmsMasterController.js');

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
        var pathFile = "/home/kesari/Desktop/bankstat11/";
        fs.readdir(pathFile, function (err, items) {
            if (err) {

                console.log("pdfERRRRRRRRRRRRRRRRRRRRRRR", err);
            }
            // console.log("itemsitemsitems", items);
            // var jsonObj;
            async.eachSeries(items, function (xlsFiles, cb0) {
                // console.log("fffffffffffffffffffffffffff",xlsFiles);
                var extnArr = xlsFiles.split(".");
                //console.log("extnArrextnArrextnArr", extnArr)
                var extn = extnArr[extnArr.length - 1];
                // console.log("extnextnextn", extn)



                switch (extn) {

                    case 'pdf':
                        fs.readFile(pathFile + xlsFiles, (err, buffer) => {
                            //console.log("bufferbufferbuffer", buffer)
                            if (err) {
                                console.log("errrrrrr", err)
                            }
                            //var pdf2table = require('pdf2table');

                            pdf2table.parse(buffer, function (err, rows, rowsdebug) {
                                //console.log("hhhhhh");
                                if (err) {
                                    console.log(err);
                                    return res.json({
                                        message: err.message,
                                        data: [],
                                        success: false
                                    });
                                }
                                var result = []
                                if (rows.length > 0) {
                                    for (var i = 0; i < rows.length; i++) {
                                        // console.log("kjfkdkdfkdk", rows[i])
                                        var bankDetail = {};
                                        var lastAmount = 0;
                                        var openingBalance = 0;
                                        var lastParticularIndex = 0;
                                        bankDetail.bankName = "AXIS 4361.pdf";



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




                                        //console.log("gggggggggggg" ,rows[i][1])

                                        //var dt1 = rows[i][1].split("/")[1] + "/" + rows[i][1].split("/")[0] + "/" + rows[i][1].split("/")[2];
                                        var data = {};

                                        data["filename"] = xlsFiles;
                                        //data["CLOSING BALANCE"] = ""
                                        data["Amount(INR)"] = "ERP_CROM";
                                        data["processAt"] = new Date();
                                        //data["Bank_name"] = "";
                                        data["Bank_name"] = "";
                                        // data["Account_No"] = accountNumber;
                                        data["Bank_name"] = rows[i];
                                        data["Description"] = "";
                                        // var dt1 = rows[i][1].split("/")[1] + "/" + rows[i][1].split("/")[0] + "/" + rows[i][1].split("/")[2];
                                        // data["Transaction_date"] = new Date(new Date(dt1).setHours(5, 30, 0, 0));
                                        data["check_No"] = 0;
                                        data["value_Date"] = 0;
                                        data["withdraw"] = 0;
                                        data["deposit"] = "";
                                        data["openingBalance"] = bankDetail["openingBalance"];
                                        data["Credit_amount"] = 0;
                                        data["Debit_amount"] = 0;
                                        data["transaction_Amount"] = "";
                                        data["available_Balance"] = 0;
                                        data["currency"] = "" // from Master
                                        data["division"] = ""; // from Master
                                        data["SRNO"] = i;
                                        data["Closing_balance"] = "";
                                    }
                                    console.log(data);
                                    result.push(data);
                                }
                                // console.log("resultresult", result);

                                //    for (var j = 1; j < rows[i].length; j++) {

                                //     if (j === 1) {

                                //         data[i]["Date_str"] = rows[i][j];
                                //     } else if (j === (rows[i].length - 1)) {

                                //     }
                                //     else if (j === (rows[i].length - 2)) {
                                //         rows[i][j] = rows[i][j].split(',').join('');
                                //         data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                //     } else if (j === (rows[i].length - 3)) {
                                //         rows[i][j] = rows[i][j].split(',').join('');
                                //         if (rows[i][j]) {
                                //             data[i]["Credit_amount"] = parseFloat((rows[i][j]));
                                //         } else {
                                //             data[i]["Debit_amount"] = parseFloat((rows[i][j]));
                                //         }
                                //     } else if (j === (rows[i].length - 4)) {
                                //         var dt2 = rows[i][j].split("/")[1] + "/" + rows[i][j].split("/")[0] + "/" + rows[i][j].split("/")[2];
                                //         data[i]["Value_date"] = new Date(new Date(dt2).setHours(5, 30, 0, 0));
                                //     } else {
                                //         //console.log(rows[i][j]);
                                //         data[i]["Description"] += rows[i][j] + ' ';
                                //         lastParticularIndex = i;
                                //     }
                                // }






                                var dataArr = [];
                                for (var key in data) {
                                    dataArr.push(data[key]);

                                }
                                // console.log("dataArrdataArr", dataArr);

                                var y = [...dataArr].reverse();



                                // for (var z = 0; z < y.length; z++) {
                                //     var val = (bankDetail.openingBalance - y[z].Closing_balance > 0) ? "DR" : "CR";
                                //     bankDetail.openingBalance = y[z].Closing_balance;
                                //     y[z].Debit_amount = (val == 'DR') ? y[z].Debit_amount : 0
                                //     y[z].Credit_amount = (val == 'CR') ? y[z].Credit_amount : 0
                                // }


                            })
                        })
                        break;
                }

                // console.log( "xlsFilesxlsFiles" , xlsFiles.split('.')[1] ,pathFileFile + xlsFiles);
                cb0();
            }, function (err) {


            })

        });

    } catch (error) {
        console.log("errorrr isssssssssss", error);
    }
}
sendGuestSms();












