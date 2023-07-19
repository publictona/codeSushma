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
var model = require("../models/bookingModel.js");
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
                model.find({ "hotelId": req.body.hotel, 'reservations.booked_Date': { $nin: data } }, {}, function (err, data) {
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
        model.find({ 'master_type': "Booking", "booking_FromDate": { $gt: baseExporter.convertToDateNew(baseExporter.dateFormat('2023-05-01')) }, "booking_ToDate": { $lt: baseExporter.convertToDateNew(baseExporter.dateFormat('2023-05-21')) } }, function (err, data) {
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
                        model.find({ master_type: "Room", hotelId: 'Taj Hotel' }, { room_Number: 1 }, { sort: { room_Number: 1 } }, function (err, room) {
                            var room = JSON.parse(JSON.stringify(room));
                            var cData = {};
                            async.eachSeries(room, function (room, cb) {

                                model.aggregate([{ $match: { "room_Number": room.room_Number, 'reservations.booked_Date': { $in: date } } },
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
    },
    //--------------------------------------------------------------

    griddata: async function (req, res) {
        try {
            // console.log(req.body);
            var query = {};
            var limit = req.body.limit ? parseInt(req.body.limit) : 500;
            var search_by = req.body.search_by ? req.body.search_by : "";
            var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
            var order = req.body.order ? req.body.order : "asc";
            var page = req.body.page ? parseInt(req.body.page) : 0;
            var columns = req.body.columns ? req.body.columns : [];
            var filter_columns = {};
            var draw = req.body.draw ? parseInt(req.body.draw) : 1;
            var start = req.body.start ? parseInt(req.body.start) : 0;

            if (req.body.search_query) {
                var search_query = req.body.search_query;
                
            } else {
            }
            var table_format = req.body.table_format ? req.body.table_format : "datatable";

            q.all(baseExport.grid('booking', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                res.json(result);
            });

        } catch (err) {

        }
    },

    create: async function (req, res) {
        try {
            const data = req.body
            const savedData = await model.create(data);
            res.status(200).send({ status: true, msg: "data saved", Data:savedData })

        } catch (err) {
            console.log("errerrerrerrerrerr" ,err);
            res.status(500).send({ msg: msg.err })
        }
    },
           
      roomData: async function (req, res) {
        try {
            var id = req.query.id;
            var data = await model.findById(id);
            //res.json(data);
            res.status(200).json({ status: true, msg: "data saved", data });

        } catch (e) {
            console.log(e);
        }

  
     },
     updateRoom: async function (req, res) {
        try {
            // console.log(req.body);
            // console.log(req.params.id);
            var data = await model.findByIdAndUpdate(req.params.id, { $set: req.body });

            res.status(200).json({ status: true, msg: "data updated" });

        } catch (e) {
            console.log(e);
        }
    },

    getRoomList: function (req, res) {
       try {
           var hotelId = req.params.hotelId;
           if(hotelId){
               model.find({ "hotelId":hotelId }, function (err, roomMaster) {
                   if (err) {
                       return res.status(500).json({
                           message: 'Error In Getting show API Data.',
                           data: err
                       });
                   }
                   if (!roomMaster) {
                       return res.status(404).json({
                           message: 'No Such show API Data',
                           data: []
                       });
                   }
                   return res.status(200).json({
                       message: "success",
                       data: roomMaster
                   });
               });
           }else{
               return res.status(404).json({
                   message: 'No Such show API Data',
                   data: []
               });
           }
       } catch (error) {
           console.log("@@@ ERROR @@@",error);
           return res.status(404).json({
               message: 'No Such show API Data',
               data: []
           });
       }
   },




}