var express = require('express');
const debug = require('debug')('ERP:server');
var router = express.Router();
var controller = require('../controllers/weddingPlanCheckListController.js');
var baseExport = require('../baseExporter.js');
var q = require('q');
var authentication = require('../authentication.js');
var model = require('../models/weddingPlanCheckListModel.js');


/*
 * GET
 */
router.get('/add', authentication.auth, function(req, res, next) {
    q.all([baseExport.countries()]).then(function(result) {
        var country = JSON.stringify(result[0]);
        country = JSON.parse(country);
        res.render('weddingPlanCheckList/form', {
            "username": req.session.user.cn,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "country": country,
            "title": 'weddingPlanCheckList',
            "AccessToken": req.session.user.token
        });
    });
});

router.get('/master', authentication.auth, function(req, res, next) {
    q.all([baseExport.countries()]).then(function(result) {
        var country = JSON.stringify(result[0]);
        country = JSON.parse(country);
        res.render('weddingPlanCheckList/list', {
            "username": req.session.user.cn,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "country": country,
            "title": 'weddingPlanCheckList',
            "AccessToken": req.session.user.token,
        });
    });
});

router.get('/view/:id', authentication.auth, function(req, res, next) {

    q.all([baseExport.countries()]).then(function(result) {
        var country = JSON.stringify(result[0]);
        country = JSON.parse(country);
        res.render('weddingPlanCheckList/view', {
            "username": req.session.user.cn,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "country": country,
            title: 'weddingPlanCheckList'
        });
    });
});

/*
 * GET 
 */
router.get('/', function(req, res) {

    controller.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    controller.show(req, res);
});

   //app.get('/weddingplan/:id', async (req, res) => {

router.post('/weddingplan', function(req, res) {
    controller.getWeddingPlanChecklistPrint(req, res);
});

/*
 * POST
 */
router.post('/', authentication.token, function(req, res) {
    controller.create(req, res);
});

router.post('/grid-Data',  function(req, res) {
    controller.gridData(req, res);
});

/*
 * PUT
 */
router.put('/:id', authentication.token, function(req, res) {
    controller.update(req, res);
});

module.exports = router;