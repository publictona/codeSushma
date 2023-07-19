var express = require('express');
const debug = require('debug')('ERP:server');
var router = express.Router();
var controller = require('../controllers/weddingPlanCheckListController.js');
var baseExport = require('../baseExporter.js');
var q = require('q');
var authentication = require('../authentication.js');


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
            "title": 'Weblink Master',
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
            title: 'weblink'
        });
    });
});

router.post('/grid-view', function(req, res, next) {
    if (req.session.user) {
        var columns = req.body.columns;
        var search_by = req.body.search_by;
        var sort = req.body.sort;
        var order = req.body.order;
        var page = req.body.page;
        q.all(baseExport.grid("weddingPlanCheckList", columns, page, search_by, sort, order)).then(function(result) {
            var grid = JSON.stringify(result);
            grid = JSON.parse(grid);
            res.render('./partials/grid-view', {
                "grid": grid,
                "columns": columns,
                "module": "weddingPlanCheckList"
            });
        });
    } else {
        return res.json(500, {
            message: 'session expired'
        });
    }
});




/*
 * GET 
 */
router.get('/', function(req, res) {

    controller.list(req, res);
});


//     controller.list(req, res);
// });
/*
 * GET get_hotels
 */
router.post('/get_hotel', function(req, res, next) {
    controller.getHotels(req, res);
});


/*
 * GET
 */
router.get('/:id', function(req, res) {
    controller.show(req, res);
});

/*
 * POST
 */
router.post('/', authentication.token, function(req, res) {
    controller.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', authentication.token, function(req, res) {
    controller.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', authentication.token, function(req, res) {
    controller.remove(req, res);
});

module.exports = router;