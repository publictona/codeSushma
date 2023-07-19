/*********************************
CORE PACKAGES
**********************************/
const _ = require("underscore");
var baseExport = require("../baseExporter.js");
const async = require("async");
const moment = require("moment-timezone");
const q = require("q");
var baseExporter = require('../baseExporter.js');
/*********************************
MODULE PACKAGES
**********************************/
var stDataModel = require("../models/stDataModel.js");
function arrayDate(F_Date, T_Date, cb) {

    var fromDate = baseExporter.convertToDateNew(baseExporter.dateFormat(F_Date));
    var toDate = baseExporter.convertToDateNew(baseExporter.dateFormat(T_Date));
    var Date = [];
    while (fromDate <= toDate) {
        var mon = fromDate.getMonth() + 1;
        var yrs = fromDate.getFullYear();
        var datee = fromDate.getDate() + '-' + mon + '-' + yrs;
        Date.push(datee);
        fromDate.setDate(fromDate.getDate() + 1);
    }
    if (Date) {
        cb(null, Date);
    } else {
        cb(err);
    }
}

function arrayDate1(F_Date, T_Date, cb) {

    var fromDate = baseExporter.convertToDateNew(baseExporter.dateFormat(F_Date));
    var toDate = baseExporter.convertToDateNew(baseExporter.dateFormat(T_Date));
    var Date = {};
    var setob = {};
    while (fromDate <= toDate) {

        var mon = fromDate.getMonth() + 1;
        var yrs = fromDate.getFullYear();
        var datee = fromDate.getDate() + '-' + mon + '-' + yrs;

        setob[datee] = { 'day': fromDate.getDate(), 'month': mon, 'year': yrs }
        // Date.=setob;
        fromDate.setDate(fromDate.getDate() + 1);
    }
    if (setob) {
        cb(null, setob);
    } else {
        cb(err);
    }
}

module.exports = {

    availableRoom: function (req, res) {
        console.log(req.body);
        var fromDate = baseExporter.convertToDateNew(baseExporter.dateFormat(req.body.fromDate));
        var toDate = baseExporter.convertToDateNew(baseExporter.dateFormat(req.body.toDate));

        arrayDate(fromDate, toDate, function (err, data) {
            if (err) {
                console.log(err);
            }
            if (data) {
                stDataModel.BC_MASTERModel.find({ "hotelId": req.body.hotel, 'reservations.booked_Date': { $nin: data } }, {}, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    res.status(200).json({
                        status: true,
                        data: data
                    });
                });
            }
        })
    },
    bookingdata1: function (req, res) {

        console.log({ 'master_type': "Booking", "booking_fromDate": { $gte: baseExporter.convertToDateNew(baseExporter.dateFormat('2023-05-01')) }, "booking_ToDate": { $lte: baseExporter.convertToDateNew(baseExporter.dateFormat('2023-05-21')) } });
        stDataModel.BC_MASTERModel.find({ 'master_type': "Booking", "booking_FromDate": { $gt: baseExporter.convertToDateNew(baseExporter.dateFormat('2023-05-01')) }, "booking_ToDate": { $lt: baseExporter.convertToDateNew(baseExporter.dateFormat('2023-05-21')) } }, function (err, data) {
            if (err) {
                console.log(err);
            }
            if (data) {
                var cal_Date = [];
                var initDate = baseExporter.dateFormat1(new Date());
                var fromDate = baseExporter.convertToDateNew(baseExporter.dateFormat('2023-05-01'));
                var toDate = baseExporter.convertToDateNew(baseExporter.dateFormat('2023-05-31'));
                while (fromDate <= toDate) {

                    var mon = fromDate.getMonth() + 1;

                    var yrs = fromDate.getFullYear();

                    var datee = fromDate.getDate() + '-' + mon + '-' + yrs;
                    var setob = {};
                    setob[datee] = { 'day': fromDate.getDate(), 'month': mon, 'year': yrs }
                    cal_Date.push(setob);
                    fromDate.setDate(fromDate.getDate() + 1);
                }



                console.log(initDate);
                res.status(200).json({ status: true, data: { data, cal_Date } });
            }
        })


    },
    bookingdata: function (req, res) {
        var form_Date = '2023-05-01';
        var to_Date = '2023-05-31';
        arrayDate1(form_Date, to_Date, function (err, data) {
            if (err) {
                console.log(err);
            }
            if (data) {

                arrayDate(form_Date, to_Date, function (err, date) {
                    if (err) {
                        console.log(err);
                    }
                    if (data) {
                        // stDataModel.BC_MASTERModel.find({"hotelId":"Taj Hotel",'reservations.booked_Date':{$in:date}},{room_Number:1,'reservations.booked_Date':1},function(err,data1){
                        //     console.log(JSON.stringify(data1));
                        //     res.status(200).json({status:true,data:{data,data1}});
                        // })
                        // stDataModel.BC_MASTERModel.aggregate([{$match:{"hotelId":"Taj Hotel",'reservations.booked_Date':{$in:date}}},
                        //         {$unwind: "$reservations"},{$unwind: "$reservations.booked_Date"},{$group:{_id:"$room_Number",data:{$push:"$reservations.booked_Date"}}}], function(err,data1){
                        //     if(err){
                        //         console.log(err);
                        //     }
                        //     console.log("ddddddddddddddd",data1);
                        //     stDataModel.BC_MASTERModel.find({master_type:"Room",hotelId:'Taj Hotel'},{room_Number:1},function(err, room){
                        //         console.log(room);                                    
                        //         res.status(200).json({status:true,data:{data,room,data1}});
                        //     })

                        // });
                        stDataModel.BC_MASTERModel.find({ master_type: "Room", hotelId: 'Taj Hotel' }, { room_Number: 1 }, { sort: { room_Number: 1 } }, function (err, room) {
                            var room = JSON.parse(JSON.stringify(room));
                            var cData = {};
                            async.eachSeries(room, function (room, cb) {

                                stDataModel.BC_MASTERModel.aggregate([{ $match: { "room_Number": room.room_Number, 'reservations.booked_Date': { $in: date } } },
                                { $unwind: "$reservations" }, { $unwind: "$reservations.booked_Date" }, { $group: { _id: "$room_Number", data: { $push: "$reservations.booked_Date" } } }], function (err, data1) {
                                    if (err) {
                                        console.log(err);
                                        cb(err);
                                    }

                                    var data1 = JSON.parse(JSON.stringify(data1));

                                    if (!data1.length) {

                                        cData[room.room_Number] = data1;
                                        cb();

                                    } else {
                                        cData[room.room_Number] = data1[0].data;
                                        cb();
                                    }
                                    console.log("cccccccccccc", cData);
                                });



                            }, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.status(200).json({ status: true, data: { data, cData } });
                                }
                            })
                        });
                    }
                })
            }
        });
    }




}