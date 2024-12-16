var models = require('../models/ST_IOHDRModel.js');
var moment = require('moment');
var _ = require('underscore');
const debug = require('debug')('ERP:server');
var q = require('q');
var baseExport = require('../baseExporter.js');
var ST_ITEM = require('../models/ST_ITEMModel.js');
var ST_IOHDR = require('../models/ST_IOHDRModel.js');



module.exports = {
    create: function (req, res) {
        try {
            req.body.F_TRANNO = F_TRANNO
            req.body.F_TRANDT = new Date();
            req.body.F_TRANID = req.session.user.F21_IDNO;
            var { F_TRANNO, F_TRANDT, F_TRANID, STPURDT, F_STKREM } = req.body;

            models.findOne({}).sort({ F_TRANNO: -1 }).exec(async function (err, data1) {
                if (err) {
                    res.status(500).send({ msg: err.message});
                }
                data1 = JSON.parse(JSON.stringify(data1));
                if (data1) {
                    req.body.F_TRANNO = data1.F_TRANNO + 1;
                } else {
                    req.body.F_TRANNO = 1;
                }
                for (let i = 0; i < STPURDT.length; i++) {
                    STPURDT[i].F_QTY = (STPURDT[i].F_QTY) ? parseInt(STPURDT[i].F_QTY) : 0;
                }
                var dataDoc = new models({
                    "ST_BRN":req.session.user.ST_BRN,
                   "F_IOTYPE": "O",
                    F_TRANNO: req.body.F_TRANNO,
                    F_TRANID: F_TRANID ? F_TRANID : "",
                    F_TRANDT: F_TRANDT ? F_TRANDT : "",
                    STPURDT: STPURDT ? STPURDT : "",
                    F_STKREM: F_STKREM ? F_STKREM : "",
                    "DBFNAME": "ST_IOHDR",
                    "created_on":new Date(),
                    "created_by":req.session.user.F21_IDNO,
                });
                var data = await dataDoc.save();
                res.status(200).send({ status: true, msg: "Stock Request Data Saved", data })
            });
        } catch (err) {
            console.log(err);
        }
    },

    griddata: async function (req, res) {
        try {
            var query = {};
            var limit = req.body.limit ? parseInt(req.body.limit) : 500;
            var search_by = req.body.search_by ? req.body.search_by : "";
            var sort_by = "_id";
            var order = "desc";
            var page = req.body.page ? parseInt(req.body.page) : 0;
            var columns = req.body.columns ? req.body.columns : [];
            var filter_columns = {};
            var draw = req.body.draw ? parseInt(req.body.draw) : 1;
            var start = req.body.start ? parseInt(req.body.start) : 0;

            if (req.body.search_query) {
                var search_query = req.body.search_query;
            }
            var table_format = req.body.table_format ? req.body.table_format : "datatable";

            q.all(baseExport.grid('ST_IOHDR', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                res.json(result);
            });

        } catch (err) {
            console.log(err);
        }   
    },

    getData: async function (req, res) {
        try {
            var id = req.query.id;
            var data = await models.findById(id);
            //res.json(data);
            res.status(200).json({ status: true, msg: "data saved", data });

        } catch (e) {
            console.log(e);
        }
    },

  

    update: async function (req, res) {
        try {
            var obj = req.body;
            obj.updated_on=new Date();
            obj.updated_by=req.session.user.F21_IDNO;
            for (let i = 0; i < obj.STPURDT.length; i++) {
                obj.STPURDT[i].F_QTY = (obj.STPURDT[i].F_QTY) ? parseInt(obj.STPURDT[i].F_QTY) : 0;
            }
            var data = await models.findByIdAndUpdate(req.params.id, { $set: obj }, { new: true }); 
            res.status(200).json({ status: true, msg: "Stock Request Data Updated", data });
        } catch (e) {
            console.log(e);
        }
    },

    getItemCode: async function (req, res) {
        try {
            await ST_ITEM.find({}, function (err, data) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error In Getting List.',
                        success: false,
                        data: []
                    });

                } else {
                    res.status(200).json({ message: 'Success', success: true,  data  });
                    // console.log("data" , data)
                    JSON.parse(JSON.stringify(data));
                }
            }).select('F_ITEMCD F_ITEMNM ITM_UNIT ITM_RATE');
        } catch (e) {
            console.log("errroooooooooooooooooooooooo", e);
        }
    },

  

    

}