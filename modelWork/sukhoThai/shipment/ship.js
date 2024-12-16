/********************************************
CORE Packages
*********************************************/
var express = require('express');
var router = express.Router();


/********************************************
Module Packages
*********************************************/
var controller = require('../controllers/shipmentController.js');

/********************************************
GET Requests
*********************************************/
//Venkatesh - 09/05/2022

router.get('/shipment',  function (req, res, next) {
  res.render('shipment/shipmentMaster', {
      "username": req.session.user,
      "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
      "title": 'Fuel Transaction',
      "AccessToken": req.session.token,
      "menu": req.session.menu
      // "token":req.session.token
  });
});


/********************************************
POST Requests
*********************************************/


router.post('/shipmentMaster', function (req, res) {
  // controller.documentMaster(req, res);
  controller.shipmentMasterDocument(req, res);
});

router.post('/getShipmentrDocument', function(req, res){
  controller.shipmentMasterDocumentGet(req, res);
});

router.post('/getShipmentDataById', function(req, res){
  controller.getShipmentDataById(req,res);
});

router.post('/getShipmentBranchDetails', function(req,res){
  controller.getShipmentBranchDetails(req,res);
})

router.post('/shipmentPrint', function(req, res) {
    controller.getShipmentPrint(req, res);
});

router.post('/grid-Data',  function(req, res) {
    controller.gridData(req, res);
});

module.exports = router;