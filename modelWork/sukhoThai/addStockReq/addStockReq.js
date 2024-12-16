

/********************************************
CORE Packages
*********************************************/
var express = require('express');
var router = express.Router();


/********************************************
Module Packages
*********************************************/
var controller = require('../controllers/addStockReqController.js');

/********************************************
GET Requests
*********************************************/


router.get('/master', function (req, res, next) {
    res.render('addStockRequest/list', {
        "username": req.session.user,
        "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
        "title": 'Stock Request',
        "AccessToken": req.session.token,
        "menu": req.session.menu
    });
});

router.post('/create', (req, res) => {
    controller.create(req, res);
});

router.post('/grid-data', (req, res) => {
    controller.griddata(req, res);
})

router.get('/getData', (req, res) => {
    controller.getData(req, res);
})
router.get('/getData1', (req, res) => {
    controller.getData1(req, res);
})

router.put('/update/:id', (req, res) => {
    controller.update(req, res);
})

router.get('/getItemCode', function (req, res) {
    controller.getItemCode(req, res);
});

router.post('/getItemCodeUnit' , function(req, res){
    controller.getItemCodeUnit(req, res)
})




module.exports = router;