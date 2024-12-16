/********************************************
CORE Packages
*********************************************/
var express = require('express'),
    q = require('q'),
    router = express.Router();
var _ = require('underscore');

/********************************************
Module Packages
*********************************************/
var controller = require('../controllers/dailyClosingController.js'),
    baseExport = require('../baseExporter');
var authenticateUser = require('../authenticate');

/********************************************
GET Requests
*********************************************/
router.get('/master', authenticateUser.checkReqSession, function (req, res, next) {
    if (req.session.user) {
        res.render('dailyClosing/closingMaster', {
            "username": req.session.user,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "rsid": req.session.user.F21_IDNO,
            "title": 'Daily Closing',
            "AccessToken": req.session.token,
            "token": req.session.token
        });
    } else {
        res.render("login");
    }
});

router.get('/report', authenticateUser.checkReqSession, function (req, res, next) {
    if (req.session.user) {
        res.render('dailyClosing/report', {
            "username": req.session.user,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "rsid": req.session.user.F21_IDNO,
            "title": 'Daily Closing Report',
            "AccessToken": req.session.token,
            "token": req.session.token
        });
    } else {
        res.render("login");
    }
});


router.get('/reDailyClosing', authenticateUser.checkReqSession, function (req, res, next) {
    if (req.session.user) {
        res.render('dailyClosing/reDailyClosing', {
            "username": req.session.user,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "rsid": req.session.user.F21_IDNO,
            "title": 'Re Daily Closing Report',
            "AccessToken": req.session.token,
            "token": req.session.token
        });
    } else {
        res.render("login");
    }
});

router.get('/getTodaysClosingData', function (req, res) {
    controller.getTodaysClosingData(req, res);
});

router.get('/getDailyClosingDtl/:date', function (req, res) {
    controller.getDailyClosingDtl(req, res);
});

router.get('/getDailyClosingDtlApp/:date/:branch', function (req, res) {
    controller.getDailyClosingDtlApp(req, res);
});

router.get('/getReClosingCorrection/:sdate/:edate/:branch', function (req, res) {
    controller.getReClosingCorrection(req, res);
});


router.get('/checkTodayPettyLeaveLaundry', function (req, res) {
    controller.checkTodayPettyLeaveLaundry(req, res);
});


/********************************************
POST Requests
*********************************************/


router.post('/grid-data', (req, res) => {
    controller.griddata(req, res);
})

router.post('/dailyCollection', authenticateUser.validateToken, function (req, res) {
    controller.getDailyCollection(req, res);
});

router.post('/getDailyClosingDtlApp', function (req, res) {
    controller.getDailyClosingDtlApp(req, res);
});

router.post('/save', function (req, res) {
    controller.create(req, res);
});

router.post('/saveDailyClosingApp', function (req, res) {
    controller.saveDailyClosingApp(req, res);
});


router.post('/getRecloseingData', function (req, res) {
    controller.getRecloseingData(req, res);
});


/********************************************
PUT Requests
*********************************************/
router.put('/updateAppointment', function (req, res) {
    controller.updateAppointment(req, res);
});

router.put('/updateGiftCardValues', function (req, res) {
    controller.updateGiftCardValues(req, res);
})

router.put('/:id', function (req, res) {
    controller.update(req, res);
});

module.exports = router;