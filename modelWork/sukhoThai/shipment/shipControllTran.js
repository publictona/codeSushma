var shipmentSchema = require('../models/shipmentModel');
var ST_BRNMSModel = require('../models/ST_BRNMSModel');
var _ = require('underscore');
const debug = require('debug')('ERP:server');
var q = require('q');
var baseExport = require('../baseExporter.js');

module.exports = {

    shipmentMaster: (req, res) => {
        // console.log(req.body);
        return res.status(200).json({
            "Data": "Successfully get the data"
        });
    },



    shipmentMasterDocument: async function (req, res) {
        try {
        
            var { tranNo, ship_date, ship_time, ship_idNo, ship_brn, ship_toname, ship_toaddress, ship_tocity, ship_toCityFirstChar, ship_topincode, ship_tomobile, ship_content, ship_printnos, ship_fromname, ship_time, ship_fromaddress, ship_fromcity, ship_frompincode, ship_remarks, srNo } = req.body;

            var result = await shipmentSchema.findOne({ tranNo: parseInt(tranNo) });
            if (result) {

                console.log("reqbody" , req.body);
                shipmentSchema.findOneAndUpdate({ tranNo: parseInt(tranNo) }, { $set: (req.body) }, {}, function (error) {
                    if (error) {
                        return res.status(500).json({
                            "Data": "Unsuccessful, Not Updated shipment Details"
                        });
                    } else {
                        return res.status(200).json({
                            "Data": "Successfully Updated shipment Details"
                        });
                    }
                });
            } else {
               const query = {
                    ship_tocity: { $in: [req.body.ship_tocity] }
                }
                console.log("queryqueryquery",query)

                 shipmentSchema.findOne(query ,{tranNo:1}, { sort: { tranNo: -1 } }, async function (err, dataTran) {
                    if(err){
                        console.log(err)

                    }
                    dataTran = JSON.parse(JSON.stringify(dataTran));
                    console.log("dataTrandataTran",dataTran)
                    

                    var tranNo = 1;
                    if (dataTran && dataTran.tranNo) {
                        tranNo = dataTran.tranNo + 1;
                    }
                    console.log("tranNotranNotranNo",tranNo)

                    var shipmentDoc = new shipmentSchema({
                        tranNo: tranNo,
                        srNo: srNo,
                        ship_date: ship_date,
                        ship_time: ship_time,
                        ship_idNo: ship_idNo,
                        ship_brn: ship_brn,
                        ship_toname: ship_toname,
                        ship_toaddress: ship_toaddress,
                        ship_tocity: ship_tocity,
                        ship_toCityFirstChar: ship_toCityFirstChar,
                        ship_topincode: ship_topincode,
                        ship_tomobile: ship_tomobile,
                        ship_content: ship_content,
                        ship_printnos: ship_printnos,
                        ship_fromname: ship_fromname,
                        ship_time: ship_time,
                        ship_fromaddress: ship_fromaddress,
                        ship_fromcity: ship_fromcity,
                        ship_frompincode: ship_frompincode,
                        ship_remarks: ship_remarks,


                    });
                    console.log("shipmentDocshipmentDoc",shipmentDoc)


                    var result = await shipmentDoc.save();

                    return res.status(200).json({
                        "Data": "Successfully Saved shipment Details"
                    });


                });


            }
        } catch (error) {
            console.log(error)
        }
    },

    shipmentMasterDocumentGet: async function (req, res) {
        try {
            var obj = {

            };
            var result = await shipmentSchema.find(obj);
            // console.log(result);

            return res.status(200).json({
                "Data": result
            });

        } catch (error) {
            console.log(error)
        }
    },

    getShipmentDataById: async function (req, res) {
        try {
            var obj = req.body;
            var result = await shipmentSchema.findOne({ tranNo: parseInt(obj.tranNo) });

            return res.status(200).json({
                "Data": result
            });
        } catch (error) {
            console.log(error);
        }
    },

    getShipmentBranchDetails: async function (req, res) {
        try {
            var obj = req.body;
            var ST_BRNMSResult = await ST_BRNMSModel.findOne({ ST_BRN: obj.ST_BRN });
            //console.log(ST_BRNMSResult)
            return res.status(200).json({
                "Data": ST_BRNMSResult
            })
        } catch (error) {
            console.log(error);
        }
    },

    //get checklist Print
    getShipmentPrint: async function (req, res) {
        try {

            var shipmentData = await shipmentSchema.findById(req.body.id).lean();
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

            q.all(baseExport.grid('shipment', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                //console.log("rrrrrrrrrrrrrr" , result)
                res.json(result);
            });

        } catch (err) {

            console.log("eeeeeeeerrrrrrrrr", err)

        }
    },

   
    


};