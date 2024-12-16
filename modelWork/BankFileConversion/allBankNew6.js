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
var xlsToJson = require('json2xls');
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


/*********************************
MODULE PACKAGES
**********************************/
//var rsDataModel = require('./models/stDataModel.js');
var stDataModel = require('./models/stDataModel.js');
const { getBankDetails } = require('./controllers/guestSmsMasterController.js');

/*********************************
GLOBLE FUNCTION
**********************************/


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
    var fs = require('fs');
    var path = require('path');
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
                                var result = []
                                if (rows) {
                                    for (var i = 0; i < rows.length; i++) {
                                        var data = {};
                                        // if (rows[i].includes('OPENING BALANCE')) {
                                        //     // Extract opening balance
                                        //     data["openingBalance"] = parseFloat(rows[i].split('OPENING BALANCE')[1].trim().replace(',', ''));
                                        // } else if (rows[i].includes('CLOSING BALANCE')) {
                                        //     // Extract closing balance
                                        //     data["Closing_balance"] = parseFloat(rows[i].split('CLOSING BALANCE')[1].trim().replace(',', ''));
                                        // }
                                        // --------------s-----

                                        // if (j === (rows[i].length - 2)) {
                                        //     rows[i][j] = rows[i][j].split(',').join('');
                                        //     data[i]["Closing_balance"] = parseFloat((rows[i][j]));
                                        // }

                                        // ---------------e----------


                                        // Print the resulting data object
                                         console.log("datadatadatadata", rows[i][0])


                                        // -----------------e
                                        data["filename"] = xlsFiles;
                                        data["processAt"] = new Date();
                                        data["Bank_name"] = "";
                                        data["Bank_accountno"] = "";
                                        data["Description"] = "";
                                        data["Tran_Date"] = "";
                                        data["check_No"] = 0;
                                        data["Value_Date"] = "";
                                        data["withdraw"] = 0;
                                        data["deposit"] = "";
                                        data["openingBalance"] = "";
                                        data["Credit_amount"] = 0;
                                        data["Debit_amount"] = 0;
                                        data["transaction_Amount"] = "";
                                        data["available_Balance"] = 0;
                                        data["currency"] = ""; // from Master
                                        data["division"] = ""; // from Master
                                        data["SRNO"] = i;
                                        data["Closing_balance"] = "";

                                        


                                    }


                                }
                                // console.log("datadatadatadata" ,data);
                                result.push(data);
                                // console.log("resultresult", result);



                            })
                        })
                        break;

                    case 'txt':

                        // fs.readFile(pathFile + xlsFiles, 'utf8', (err, rows) => {
                        //     if (err) {
                        //         console.error(err);

                        //     }
                        //         var result =  JSON.parse(rows);
                        //         console.log("rowstion" ,result.Date)




                        //     if (rows) {
                        //         for (var i = 0; i < rows.length; i++) {
                        //             var data = {};


                        //             data["filename"] = xlsFiles;
                        //             data["processAt"] = new Date();
                        //             data["Bank_name"] = "";
                        //             data["Bank_accountno"] = "";
                        //             data["Description"] = rows.Narration;
                        //             data["Tran_Date"] = "";
                        //             data["check_No"] = 0;
                        //             data["Value_Date"] = "";
                        //             data["withdraw"] = 0;
                        //             data["deposit"] = "";
                        //             data["openingBalance"] = "";
                        //             data["Credit_amount"] = 0;
                        //             data["Debit_amount"] = 0;
                        //             data["transaction_Amount"] = "";
                        //             data["available_Balance"] = 0;
                        //             data["currency"] = ""; // from Master
                        //             data["division"] = ""; // from Master
                        //             data["SRNO"] = i;
                        //             data["Closing_balance"] = "";
                        //         }
                        //         //console.log("txttxttxttxttxttxt", data)
                        //     }

                        //     // console.log("datadatadatadata" ,data);
                        //     result.push(data);
                        //     // console.log("resultresult", result);
                        // })


                        break;

                    case 'xlsx':

                         fs.readFile(pathFile + xlsFiles, (err, buffer) => {

                            if (err) {
                                console.log("errrrrrr", err)
                            }
                            //console.log("bufferbuffer", buffer)

                            xlsx.parse(buffer, function (err, rows, rowsdebug) {

                                if (err) {
                                    console.log(err);
                                    return res.json({
                                        message: err.message,
                                        data: [],
                                        success: false
                                    });
                                }
                                console.log("xlsxlsxlsxls", rows)
                                var result = []
                                if (rows) {
                                    for (var i = 0; i < rows.length; i++) {
                                        var data = {};



                                        data["filename"] = xlsFiles;
                                        data["processAt"] = new Date();
                                        data["Bank_name"] = "";
                                        data["Bank_accountno"] = "";
                                        data["Description"] = "";
                                        data["Tran_Date"] = "";
                                        data["check_No"] = 0;
                                        data["Value_Date"] = "";
                                        data["withdraw"] = 0;
                                        data["deposit"] = "";
                                        data["openingBalance"] = "";
                                        data["Credit_amount"] = 0;
                                        data["Debit_amount"] = 0;
                                        data["transaction_Amount"] = "";
                                        data["available_Balance"] = 0;
                                        data["currency"] = ""; // from Master
                                        data["division"] = ""; // from Master
                                        data["SRNO"] = i;
                                        data["Closing_balance"] = "";
                                    }
                                }
                                // console.log("datadatadatadata" ,data);
                                // console.log("xlsxlsxlsxls", rows)
                                result.push(data);
                                // console.log("resultresult", result);
                            })
                        })
                        break;

                    default:
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












