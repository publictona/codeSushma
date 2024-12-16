/**
 * @Author:Sushma Landge.
 */

/**********************
CORE PACKAGES
 *********************/

const express = require('express');
const router = express.Router();

/**********************
Module PACKAGES
 *********************/

const controller = require('../controllers/airTicketInStockController.js');

/*********************
GET REQUEST
 ********************/
router.get('/master', (req, res, next) => {
    try {
        res.render('airTicketInStock/addEdit', {
            "username": req.session.user.cn,
            "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
            "menu": req.session.menu,
            "kname": req.session.user.cn,
            "rsid": req.session.user.uid,
            
            "department": req.session.user.department,
            "branch": req.session.user.other_info[0].F21_BRANCH,
            "title": 'Rescheduling Email master',
            "AccessToken": req.session.user.token,
            "token": req.session.token
        }, function (err, html) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.send(html);
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/create', (req, res) => {
    controller.create(req, res);
});

router.post('/grid-data', (req, res) => {
    controller.griddata(req, res);
})

router.get('/getData',(req,res)=>{
    controller.getData(req,res);
})

router.put('/update/:id',(req,res)=>{
    controller.update(req,res);
})

router.post('/checkTKT1',(req,res)=>{
    controller.checkTKT1(req,res);
})


  

module.exports = router;
