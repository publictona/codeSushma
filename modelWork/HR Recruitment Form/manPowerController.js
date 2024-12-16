var model = require('../models/manPowerRequestModel.js');
var _ = require('underscore');
const debug = require('debug')('ERP:server');
var q = require('q');
var baseExport = require('../baseExporter.js');

module.exports = {

    /**
     * module_documentationController.list()
     */
    list: function (req, res) {
        model.find({}).exec(function (err, module_documentation) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting module_documentation.'
                });
            }
            return res.json(module_documentation);
        });
    },

    /**
     * module_documentationController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        model.findOne({ _id: id }, function (err, module_documentation) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting module_documentation.'
                });
            }
            if (!module_documentation) {
                return res.json(404, {
                    message: 'No such module_documentation'
                });
            }
            return res.json(module_documentation);
        });
    },

    /**
     * module_documentationController.create()
     */
    create: function (req, res) {
        if (req.body.AccessToken) {
            delete req.body.AccessToken;
        };
        req.body.created_on = new Date();
        req.body.created_by = req.session.user.uid;
        var module_documentation = new model(req.body);
        module_documentation.save(function (err, module_documentation) {
            if (err) {
                return res.json(500, {
                    message: 'Error saving module_documentation',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: module_documentation._id
            });
        });
    },

    update: function (req, res) {
        if (req.body.AccessToken) {
            delete req.body.AccessToken;
        };
        var id = req.params.id;
        var NewObj = req.body;

        model.findById(id, function (err, weblink) {
            if (err) {
                return res.json(500, {
                    message: 'Error saving ',
                    error: err
                });
            }

            model.update({ _id: id }, { $set: NewObj }, function (err, tank) {
                if (err) {
                    return res.json(500, {
                        message: 'Error saving ',
                        error: err
                    });
                }

                return res.json({
                    message: 'Updated Successfully',
                    // _id: reception._id
                });

            });

        });

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

            q.all(baseExport.grid('manPowerRequest', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                console.log("rrrrrrrrrrrrrr" , result)
                res.json(result);
            });

        } catch (err) {

            console.log("eeeeeeeerrrrrrrrr" , err)

        }
    },
    
    remove: function (req, res) {
        var id = req.params.id;
        model.findByIdAndRemove(id, function (err, module_documentation) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting module_documentation.'
                });
            }
            return res.json(module_documentation);
        });
    },

    //get HR form Print
    getHrFormPrint: async function (req, res) {
        try {
           
            var hrFormData = await model.findById(req.body.id).lean();
            console.log(hrFormData);
            res.render('man_Power_Request/printHrForm', hrFormData, function (err, html) {
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
};