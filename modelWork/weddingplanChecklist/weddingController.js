var model = require('../models/weddingPlanCheckListModel.js');
var _ = require('underscore');
const debug = require('debug')('ERP:server');
var q = require('q');
/**
 * weblinkController.js
 *
 * @description :: Server-side logic for managing prs.
 */
module.exports = {

    /**
     * weblinkController.list()
     */
    list: function (req, res) {
        model.find({ "isActive": true }, function (err, weblink) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting room Subtype.'
                });
            }
            return res.json(weblink);
        });
    },

    /**
     * prController.show() 
     */
    show: function (req, res) {
        var id = req.params.id;
        model.findOne({ _id: id }, function (err, weblink) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting room Subtype.'
                });
            }
            if (!weblink) {
                return res.json(404, {
                    message: 'No such Room'
                });
            }
            return res.json(weblink);
        });
    },

    /**
     * weblinkController.create()
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
        var weblink = new model(req.body);
        weblink.save(function (err, weblink) {
            if (err) {
                return res.json(500, {
                    message: 'Error saving room Subtype',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: weblink._id
            });
        });
    },

    /**
     * weblinkController.update()
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
        model.findById(id, function (err, weblink) {
            if (err) {
                return res.json(500, {
                    message: 'Error saving weblink',
                    error: err
                });
            }
            var old = JSON.stringify(weblink);
            old = JSON.parse(old);
            NewObj.historyData = weblink.historyData || []
            delete old['historyData'];
            NewObj.historyData.push(old);
            model.update({ _id: id }, { $set: NewObj }, function (err, tank) {
                if (err) {
                    return res.json(500, {
                        message: 'Error saving weblink',
                        error: err
                    });
                }
                // if (err) return handleError(err);
                //     debug(tank)
                // res.json(tank);
                return res.json({
                    message: 'Updated Successfully',
                    // _id: reception._id
                });

            });

        });

    },

    /**
     * weblinkController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        model.findByIdAndRemove(id, function (err, weblink) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting room Subtype.'
                });
            }
            return res.json(weblink);
        });
    }
};