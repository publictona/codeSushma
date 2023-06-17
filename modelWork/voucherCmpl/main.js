/**
 * @Author: Sushma Landge
 */


const express = require('express');
const router = express.Router();


const controller = require('../controllers/tourComplementaryController.js');

router.post('/getComplementaryVou', (req, res, next) => {
    controller.getComplementaryVou(req, res , next);
})


module.exports = router;

