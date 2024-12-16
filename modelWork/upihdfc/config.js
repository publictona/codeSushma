/*********************************
CORE PACKAGES
**********************************/
var mongodb     = require('mongodb'),
    mongoose    = require('mongoose').Mongoose,
    dbSukhoThai = new mongoose();   // Mongoose Instance creation for SukhoThai
    dbJusPay = new mongoose();   // Mongoose Instance creation for SukhoThai
    dbAws = new mongoose();   // Mongoose Instance creation for SukhoThai
    const path = require('path');
    var express = require('express');
    const app = express();
   
    //ENV configs
	require('dotenv').config()

    //Redis Client 
    const redis = require('redis');

    var redisClient;

    let jusPay = {
        staging : {
            apiUrl: "https://sandbox.juspay.in",
            apiKey: "",
            merchantId: "Kesari_test"
        },
        production : {
            apiUrl: "https://api.juspay.in",
            apiKey: "",
            merchantId: "kesari"
        }
    }

    let razorPay={
        staging : {
            secretKey: "E4jibGTdZS3Xrvqo7ZAUvZxe",
            apiKey: "rzp_test_zA5Pju7Bk5cvv2",
            merchantId: "GMIqC7ZPIN89f3"
        },
        
    }
    
    if(app.get('env') === 'DEV') {
        // dbSukhoThai.connect(process.env.MONGO_URL_TESTST);
        // dbSukhoThai.connect(process.env.SUKHOTHAI_URL_DEV);
        // dbJusPay.connect(process.env.MONGO_JUSPAY_URL_DEV);
        var redisClient = redis.createClient({ host: process.env.REDIS_ERP_HOST, port: process.env.REDIS_ERP_PORT });
        jusPay.staging.apiKey = process.env.JUSPAYTEST;
    }
    if(app.get('env') === 'production') {
        dbSukhoThai.connect(process.env.SUKHOTHAI_URL_PROD);
        // dbJusPay.connect(process.env.MONGO_JUSPAY_URL_PROD);
        var redisClient = redis.createClient({ host: process.env.REDIS_ERP_HOST, port: process.env.REDIS_ERP_PORT });
        jusPay.production.apiKey = process.env.JUSPAYPROD;
        jusPay.staging = jusPay.production;
    } 
    if(app.get('env') === 'AWS') {
        dbAws.connect(process.env.MONGO_URL_AWS);
        // dbSukhoThai.connect(process.env.SUKHOTHAI_URL_AWS); 
        // dbJusPay.connect(process.env.MONGO_JUSPAY_URL_DEV);
        var redisClient = redis.createClient({ host: process.env.REDIS_AWS_HOST, port: process.env.REDIS_AWS_PORT });
        jusPay.production.apiKey = process.env.JUSPAYPROD;
        jusPay.staging = jusPay.production;
    }
    if(app.get('env') === 'LIVETEST') {
        // dbSukhoThai.connect(process.env.SUKHOTHAI_URL_PROD); 
        // dbAws.connect(process.env.MONGO_URL_AWS);
        // dbJusPay.connect(process.env.MONGO_JUSPAY_URL_LIVE_TEST);
        // dbJusPay.connect(process.env.MONGO_JUSPAY_URL_DEV);
        var redisClient = redis.createClient({ host: process.env.REDIS_ERP_HOST, port: process.env.REDIS_ERP_PORT });
        jusPay.production.apiKey = process.env.JUSPAYPROD;
        jusPay.staging = jusPay.production;
    }
    if(app.get('env') === 'localhost') {
        // dbJusPay.connect(process.env.MONGO_JUSPAY_URL_DEV);
        var redisClient = redis.createClient({ host: process.env.REDIS_ERP_HOST, port: process.env.REDIS_ERP_PORT });
        jusPay.staging.apiKey = process.env.JUSPAYTEST;
    }



var kesariMailLogin ={
    url:"mail.kesaritours.in",
    user:"admin",
    password:"Ktpl24x7!n365"
}

var user = {
    "emailId":"holiday@kesari.in",
    "uid":['BF6','II9']
}; 

var mailUsers = {
    "HR":["IT1","II9","EX6"]
};

var zimbraApiUrl ={
    inboxUrl:"https://mail.kesari.in:7071/home/"+user.emailId+"/inbox.json",
    getMessage:"https://mail.kesari.in:7071/home/"+user.emailId+"/"
}

var branchTargetBranchMngr = ["T50","235","H20","DI1","MU6","ID9","IN6","K07","E20","IS8","IS7","IB1","AD3","648","FW9","386","II9"];

const webfeedback = [
    {
        Dept:['KESARI IT'],
        feedback:["Report a site error or bug"]
    },{
        Dept:['MARKETING'],
        feedback:["Website Content","Online Booking Experience"]
    },{
        Dept:['GR & QUALITY CONTROL'],
        feedback:["Suggestions","Appreciation"]
    }
]
//live
var hdfcPosCred={
    secret_Key:"231F8AFA31324170ABE5E55E40E39238",
    client_Key:"QTk3MzZCRjIwMzJCNDkxQ0JGQUFEMDg4MkIxRUUwMUY=",
    payment_Api:"https://callbh.bonushub.co.in/api/ecr/v1/saletxn",
    status_Api:"https://callbh.bonushub.co.in/api/ecr/v1/txnstatus",
    cancel_Api:"https://callbh.bonushub.co.in/api/ecr/v1/canceltxn"
}

var hdfcDevUpiCred={
    merchantName : "Kesari Tours Pvt Ltd",
    merchantId   : "HDFC000008945196",
    merchantKey  : "07a658484cd9f2541263ce0812dcbfd9",
    merchantVPA : "kesari788@hdfcbank",
    keyID : 2114,
    clientID : 18883526,
    username : "HDFC000008945196",
    password : "b76fa5d16a584ccda7550397456da041",
    accountId :18883526,
    androidId :18883526,
    refId:18883526
}

//local
// var hdfcPosCred={
//     secret_Key:"20419096B6A3474D9362924084592B32",
//     client_Key:"QkMyRUNFNDM1MTY3NDMxRkFFRUQ3MERBOEYwQzYwQ0Y",
//     payment_Api:"https://testcallbh.bonushub.co.in:9443/api/ecr/v1/saletxn",
//     status_Api:"https://testcallbh.bonushub.co.in:9443/api/ecr/v1/txnstatus",
//     cancel_Api:"https://testcallbh.bonushub.co.in:9443/api/ecr/v1/canceltxn"
// }
module.exports = {
    'api_url': '//login.kesari.in/',
    'bucket_url': '//erp.kesari.in/bucket/',
    'bucket_path': '/media/bucket/',
    'asterisk_api_url': '//172.16.1.81/asterisknode/',
    'audio_api_url': '//172.16.1.187/cdr/',
    'asterisk_voice_log': '//172.16.1.62/voice-log/?secret=1',
    'asterisk_click2call_url': '//172.16.1.62/callit/ajax.php',
    'smtp': {
        'host': 'smtpcorp.com',
        'port': 25,
        'auth': {
            'user': 'kesarismtp',
            'pass': 'Kesari@@'
        }
    },
    'smsgupshup': {
        'method': 'SendMessage',
        'msg_type': 'TEXT',
        'userid': '2000110537',
        'auth_scheme': 'plain',
        'password': '0QluWiKTm',
        'v': '1.1',
        'format': 'text'
    },
    'smsgupshup_promo': {
        'method': 'SendMessage',
        'msg_type': 'TEXT',
        'userid': '2000126016',
        'auth_scheme': 'plain',
        'password': 'Passw0rd',
        'v': '1.1',
        'format': 'text'
    },
    'FCMserverKey': 'AIzaSyAEapIqkfFfp4dqf4mHkiozdFUnLJ07GtA',
    'dbSukhoThai' : dbSukhoThai,
    'dbJusPay':dbJusPay,
    'dbAws' : dbAws,
    'jwt_secret':'er865432p21',
    "kesariMailLogin":kesariMailLogin,
    "zimbraApiUrl":zimbraApiUrl,
    "DefaultMailUser":user,
    'branchTargetBranchMngr':branchTargetBranchMngr,
    'mailUsers':mailUsers,
    'webfeedback':webfeedback,
    'hdfcPosCred':hdfcPosCred,
    'hdfcDevUpiCred':hdfcDevUpiCred,
    'iosDirectory' : "/media/bucket/iosFiles",
    'selfAppraisalDirectory' : "/media/bucket/selfAppraisal",
    'unlockBudgetExpense':['M13','M99','II9',"E04","admin","723","E66","QJ8"],//removed shubh id F54
    'redisClient' : redisClient,
    'mediaAirTkt':'/media/kesari/air_fast/',
    'dual_bkg':'/media/kesari/air_fast/',
    'jusPay' : jusPay,
    'razorPay':razorPay
};
