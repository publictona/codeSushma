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


                                var data = {};








 // ----------------s
                                // Initialize an empty array to store the data objects for each row
                                var dataArray = [];

                                // Assuming you have a loop to iterate over the rows
                                for (var i = 0; i < rows.length; i++) {
                                    // Create a new data object for each row
                                    var data = {};

                                    // Set the values for the data object based on your requirements
                                    // Assuming the data is in the format you provided earlier
                                    var rowData = rows[i][0]; // Get the array within bankStatementData

                                    data["filename"] = rowData[0] || "";
                                    data["processAt"] = new Date();
                                    data["Bank_name"] = rowData[2] || "";
                                    data["Bank_accountno"] = "";
                                    data["Description"] = "";

                                    // Assuming rows[i] contains the data for the current row
                                    //   data["check_No"] = parseFloat(bankStatementData[i].check_No) || 0;
                                    //   data["Value_Date"] = parseFloat(bankStatementData[i].Value_Date) || 0;
                                    //   data["withdraw"] = parseFloat(bankStatementData[i].withdraw) || 0;

                                    data["check_No"] = parseInt(rowData[3]) || 0;
                                    data["Description"] = rows[i][2]; // Set the description based on your data
                                    data["Tran_Date"] = new Date(rows[i][0]); // Set the transaction date based on your data
                                    data["check_No"] = rows[i][3]; // Set the check number based on your data
                                    data["Value_Date"] = new Date(rows[i][1]); // Set the value date based on your data
                                    data["withdraw"] = rows[i][4]; // Set the withdrawal amount based on your data
                                    data["deposit"] = rows[i][5]; // Set the deposit amount based on your data
                                    //data["openingBalance"] = bankDetail["openingBalance"];
                                    data["Credit_amount"] = rows[i][6]; // Set the credit amount based on your data
                                    data["Debit_amount"] = rows[i][7]; // Set the debit amount based on your data
                                    data["transaction_Amount"] = rows[i][8]; // Set the transaction amount based on your data
                                    data["available_Balance"] = rows[i][9]; // Set the available balance based on your data
                                    data["currency"] = rows[i][10]; // Set the currency based on your data
                                    data["division"] = rows[i][11]; // Set the division based on your data
                                    data["SRNO"] = i;
                                    data["Closing_balance"] = rows[i][12]; // Set the closing balance based on your data

                                   

                                


 // Push the data object to the dataArray
                                    dataArray.push(data);
                                }

                                // Now dataArray contains data objects for each row in rows
                                console.log("dataArraydataArraydataArray", dataArray);


   // -----------------------e
                                     if (rows) {
                                    for (var i = 0; i < rows.length; i++) {
                                        // console.log("kjfkdkdfkdk", rows[i])
                                        var bankDetail = {};
                                        var lastAmount = 0;
                                        var openingBalance = 0;
                                        var lastParticularIndex = 0;
                                        // bankDetail.bankName = "AXIS 4361.pdf";
                                        if (!validDate(rows[i][0])) {

                                            bankDetail.bankName = "AXIS 4361.pdf";

                                            // if (rows[i].indexOf("Branch") > -1) {

                                            //     bankDetail.branchName = rows[i].indexOf("Branch") + 1];

                                            // }
                                            if (rows[i][0].indexOf("Account No.") > 1) {
                                                bankDetail.accountNumber = rows[i][0].indexOf("Account No.") + 1;
                                            }
                                            if (rows[i].indexOf("Opening balance") > -1) {
                                                bankDetail.openingBalance = rows[i][rows[i].indexOf("Opening balance") + 1].split('INR');
                                                bankDetail.openingBalance = bankDetail.openingBalance[1].split(',').join('');
                                                lastAmount = bankDetail.openingBalance;

                                            }
                                        }








                                        //console.log("rowsrowsrowsrows", rows["Tran_Date"]);
                                      // console.log("gggggggggggg", rows[i]);
                                        var data = {};

                                        // data["filename"] = xlsFiles;
                                        // data["processAt"] = new Date();
                                        // data["Bank_name"] = "";
                                        // data["Bank_accountno"] = "";
                                        // data["Bank_name"] = rows[i];
                                        // data["Description"] = "";
                                        // // var dt1 = rows[i][1].split("/")[1] + "/" + rows[i][1].split("/")[0] + "/" + rows[i][1].split("/")[2];
                                        // data["Tran_Date"] = new Date(new Date().setHours(5, 30, 0, 0));
                                        // data["check_No"] = 0;
                                        // data["Value_Date"] = 0;
                                        // data["withdraw"] = 0;
                                        // data["deposit"] = "";
                                        // data["openingBalance"] = "";
                                        // data["Credit_amount"] = 0;
                                        // data["Debit_amount"] = 0;
                                        // data["transaction_Amount"] = "";
                                        // data["available_Balance"] = 0;
                                        // data["currency"] = "" // from Master
                                        // data["division"] = ""; // from Master
                                        // data["SRNO"] = i;
                                        // data["Closing_balance"] = "";
                                    }
                                }
                                //console.log("datadatadatadata" ,data);
                                result.push(data);
                                // console.log("resultresult", result);


                                // if(rows[i] === 0){
                                //     data["Value_Date"] = rows[i][0]
                                // }
                                // console.log("hhhhhhhhh",  data["Value_Date"])


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






                                // var dataArr = [];
                                // for (var key in data) {
                                //     dataArr.push(data[key]);

                                // }
                                // console.log("dataArrdataArr", dataArr);

                                // var y = [...dataArr].reverse();
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












