var models = require('../models/courierModel.js');
//var STMaster = require('../models/STMasterModel.js')
var model = require('../models/STMasterModel.js');
var ST_BRNMSModel = require('../models/ST_BRNMSModel');
var _ = require('underscore');
const debug = require('debug')('ERP:server');
var q = require('q');
var baseExport = require('../baseExporter.js');
var moment = require('moment');
module.exports = {

    create: async function (req, res) {
        try {
            // req.body.fromdate = baseExport.convertToDateNew(baseExport.dateFormat(req.body.fromdate));
            // req.body.todate = baseExport.convertToDateNew(baseExport.dateFormat(req.body.todate));
            
            req.body.tranDt = baseExport.convertToDateNew(baseExport.dateFormat(new Date()));
            req.body.tranId = req.session.user.F21_IDNO;
            var { tranNo, tranDt, tranId, courierCode, branch, location, noOfBox, description, charges } = req.body;

            var result = await models.findOne({ tranNo: parseInt(tranNo) });
            //  console.log(result);
            if (result) {
                req.body.tranNo = parseInt(req.body.tranNo);
                models.findOneAndUpdate({ tranNo: parseInt(tranNo) }, { $set: (req.body) }, function (error) {
                    if (error) {
                        return res.status(500).json({
                            "Data": "Unsuccessful, Not Updated  Details"
                        });
                    } else {
                        return res.status(200).json({
                            "Data": "Successfully Updated  Details"
                        });
                    }
                });
            } else {


                models.findOne({}, {}, { sort: { tranNo: -1 } }, async function (err, dataTran) {
                    if (err) {
                        console.log(err)

                    }
                    dataTran = JSON.parse(JSON.stringify(dataTran));
                    // console.log("dataTrandataTran", dataTran)


                    var tranNo = 1;
                    if (dataTran && dataTran.tranNo) {
                        tranNo = dataTran.tranNo + 1;
                    }

                    //---------------------------------------
                    var shipmentDoc = new models({
                        tranNo: tranNo,
                        tranDt: tranDt,
                        tranId: tranId,
                        branch: branch,
                        courierCode: courierCode,
                        location: location,
                        noOfBox: noOfBox,
                        description: description,
                        charges: charges,
                        //fromdate : fromdate,
                       // todate:todate

                    });
                    // console.log("shipmentDocshipmentDoc", shipmentDoc)


                    var result = await shipmentDoc.save();

                    return res.status(200).json({
                        "Data": "Successfully Saved Details"
                    });


                });
            }
        } catch (error) {
            console.log(error)
        }
    },

    getData: async function (req, res) {
        try {
            var obj = {};
            var result = await models.find(obj);
            // console.log(result);

            return res.status(200).json({
                "Data": result
            });

        } catch (error) {
            console.log(error)
        }
    },

    getDataById: async function (req, res) {
        try {
            var obj = req.body;
            var result = await models.findOne({ tranNo: parseInt(obj.tranNo) });

            return res.status(200).json({
                "Data": result
            });
        } catch (error) {
            console.log(error);
        }
    },

    //get  Print
    getPrint: async function (req, res) {
        try {

            var shipmentData = await models.findById(req.body.id).lean();
            res.render('shipment/shipmentPrint', { data: shipmentData }, function (err, html) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: false, message: err.message });
                }
                res.status(200).json({ status: true, message: "", html: html });
            });
        } catch (err) {
            res.status(500).send('Error retrieving shipment data.');
        }
    },

    gridData: async function (req, res) {
        try {
            // console.log(req.body);
            var query = {};
            var limit = req.body.limit ? parseInt(req.body.limit) : 500;
            var search_by = req.body.search_by ? req.body.search_by : "";

            var sort_by = "tranNo";
            var order = "desc";
            var page = req.body.page ? parseInt(req.body.page) : 0;
            var columns = req.body.columns ? req.body.columns : [];
            var filter_columns = {};
            var draw = req.body.draw ? parseInt(req.body.draw) : 1;
            var start = req.body.start ? parseInt(req.body.start) : 0;
           
            if (req.body.search_query) {
                var search_query = req.body.search_query;
               

                if (search_query.tranDt) {
                    //console.log("dtttttttttttt", search_query.tranDt)
                    query.tranDt = baseExport.convertToDateNew(moment(new Date(search_query.tranDt)).format('DD/MM/YYYY'));
                }
            } else {
            }

           var table_format = req.body.table_format ? req.body.table_format : "datatable";

            q.all(baseExport.grid('courier', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                //console.log("rrrrrrrrrrrrrr" , result)
                res.json(result);
            });

        } catch (err) {

            console.log("eeeeeeeerrrrrrrrr", err)

        }
    },

    getCourierData: function (req, res) {
        try {

            model.find({ "MasterType": "COURIER" }, function (err, data) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error In Getting List.',
                        success: false,
                        data: []
                    });

                } else {
                    res.status(200).json({ message: 'Success', success: true, data: data });
                    JSON.parse(JSON.stringify(data));
                }
            });
        } catch (e) {
            console.log("errroooooooooooooooooooooooo", e);
        }
    },


    getCourierLocData: function (req, res) {
        model.findOne({}).distinct(("place"), { "MasterType": "COURIER" }, function (err, data) {
            if (!err) {
            return res.json(data);
            } else {
                return res.json(500, {
                    message: 'Error getting Zone.'
                });
            }
        });
    },

};