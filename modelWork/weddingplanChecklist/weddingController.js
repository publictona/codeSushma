var model = require('../models/weddingPlanCheckListModel.js');
var _ = require('underscore');
const debug = require('debug')('ERP:server');
var q = require('q');
var baseExport = require('../baseExporter.js');
/**
 * weddingChecklistController.js
 *
 * @description :: Server-side logic for managing prs.
 */
module.exports = {

    /**
     *checklistController.list()
     */
    list: function (req, res) {
        model.find({ "isActive": true }, function (err, checklist) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting data Subtype.'
                });
            }
            return res.json(checklist);
        });
    },

    /**
     * prController.show() 
     */
    show: function (req, res) {
        var id = req.params.id;
        model.findOne({ _id: id }, function (err, checklist) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting data Subtype.'
                });
            }
            if (!checklist) {
                return res.json(404, {
                    message: 'No such data'
                });
            }
            return res.json(checklist);
        });
    },

    /**
     * weddingController.create()
     */
    create: function (req, res) {
        req.body.created_by = req.session.user.uid;
        var checkList = req.body.checkList;
        var filtered_checkList = [];
        for (var i = 0; i < checkList.length; i++) {
            if (checkList[i]) {
                filtered_checkList.push(checkList[i]);
            }
        }
        req.body.checkList = filtered_checkList;
        var checklist = new model(req.body);
        checklist.save(function (err, checklist) {
            if (err) {
                return res.json(500, {
                    message: 'Error saving data Subtype',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: checklist._id
            });
        });
    },

    /**
     * checklistController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        var checkList = req.body.checkList;
        var filtered_checkList = [];
        for (var i = 0; i < checkList.length; i++) {
            if (checkList[i]) {
                filtered_checkList.push(checkList[i]);
            }
        }
        debug(filtered_checkList);
        req.body.checkList = filtered_checkList;
        var NewObj = req.body;
        //  debug()
        model.findById(id, function (err, checklist) {
            if (err) {
                return res.json(500, {
                    message: 'Error saving checklist',
                    error: err
                });
            }
            var old = JSON.stringify(checklist);
            old = JSON.parse(old);
            NewObj.historyData = checklist.historyData || []
            delete old['historyData'];
            NewObj.historyData.push(old);
            model.update({ _id: id }, { $set: NewObj }, function (err, tank) {
                if (err) {
                    return res.json(500, {
                        message: 'Error saving checklist',
                        error: err
                    });
                }
               
                return res.json({
                    message: 'Updated Successfully',
                   
                });

            });

        });

    },

   

    
//get checklist Print
    getWeddingPlanChecklistPrint: async function (req, res) {
        try {
           
            var weddingPlanData = await model.findById(req.body.id).lean();
            res.render('weddingPlanCheckList/checkListPrint', weddingPlanData, function (err, html) {
                if (err) {
                    console.log(err);
                    res.status(500).json({status:false,message:err.message});
                }
                res.status(200).json({status:true,message:"",html:html});
            });
        } catch (err) {
            res.status(500).send('Error retrieving wedding plan data.');
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

            q.all(baseExport.grid('weddingPlanCheckList', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
              //  console.log("rrrrrrrrrrrrrr" , result)
                res.json(result);
            });

        } catch (err) {

            console.log("eeeeeeeerrrrrrrrr" , err)

        }
    },


};