/*********************************
CORE PACKAGES
**********************************/
var express     = require('express'),
    q           = require('q'),
    router      = express.Router();


/*********************************
MODULE PACKAGES
**********************************/
var authentication    = require('../authentication.js'),
    baseExport        = require('../baseExporter.js'),
    controller        = require('../controllers/loadContractSupplierController.js');
var adMasterModel=require('../models/adMasterModel.js');



/*********************************
GET REQUESTS
**********************************/
router.get('/master',function(req, res, next) {
            res.render('loadContractSupplier/master',{
            "username" : req.session.user.cn,
            "profile_path" : '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu" : req.session.menu,
            "title": 'Web Banner Master',
            "AccessToken":req.session.user.token,
        });

});


/*********************************
POST REQUESTS
**********************************/
router.post('/grid-data', function(req, res, next) {
    try {
        var query = {};
        var limit = req.body.limit ? parseInt(req.body.limit) : 50;
        var search_by = req.body.search_by ? req.body.search_by : "";
        var sort_by = req.body.sort_by ? req.body.sort_by : "_id";
        var order = req.body.order ? req.body.order : "desc";
        var page = req.body.page ? parseInt(req.body.page) : 0;
        var columns = req.body.columns ? req.body.columns : [];
        var filter_columns = {};
        var draw = req.body.draw ? parseInt(req.body.draw) : 1;
        var start = req.body.start ? parseInt(req.body.start) : 0;
        var search_query = req.body.search_query ? req.body.search_query : "";
        if (search_query) {
          if (search_query.date1) {
            var date1 = baseExporter.convertToDateNew(search_query.date1.split(' - ')[0]);
            date1.setHours(0, 0, 0);
            var date2 = baseExporter.convertToDateNew(search_query.date1.split(' - ')[1]);
            date2.setHours(23, 59, 59);
    
            query["publishDate"] = {
              '$gte': date1,
              '$lte': date2,
            };
          }
          if (search_query.date2) {
            var date3 = baseExporter.convertToDateNew(search_query.date2.split(' - ')[0]);
            date3.setHours(0, 0, 0);
            var date4 = baseExporter.convertToDateNew(search_query.date2.split(' - ')[1]);
            date4.setHours(23, 59, 59);
    
            query["artWorkReadyOn"] = {
              '$gte': date3,
              '$lte': date4,
            };
          }
          if (search_query.publication) {
            query.adPublication=search_query.publication;
          }
          if (search_query.mediaType) {
            query.adMedia=search_query.mediaType
          }
          
        } 
        var table_format = req.body.table_format ? req.body.table_format : "datatable";
        q.all(baseExport.grid('F_SUPPCONTRACT', columns, page, search_by, "_id", order, query, limit, start, draw, "", table_format)).then(function(result) {          
              res.json(result);
        });
      }catch(e){
          debug(e,"error is");
      }
});

router.post('/getMaster', function(req, res, next) {
    controller.getMaster(req,res);
});

router.post('/saveAd', function(req, res, next) {
    controller.saveAd(req,res);
});

router.post('/getDetails', function(req, res, next) {
    controller.getDetails(req,res);
});

module.exports = router;
