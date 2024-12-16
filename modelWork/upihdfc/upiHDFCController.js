var hdfcUpiCred = require('../config.js').hdfcDevUpiCred;
var rsDataModel = require('../models/rsDataModel');
const qs = require('qs');
var crypto = require('crypto');
var openpgp = require('openpgp');
const axios = require('axios');
const moment = require('moment');
const request = require('request');
// AES encryption function
function encryptData(text, key) {
    const iv = Buffer.from('', 'hex');
    const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'hex'), iv);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
}
// AES decryption function
function decryptData(encryptedData, key) {
    const iv = Buffer.from('', 'hex');
    const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


async function encryptMessage(message, publicKeyArmored) {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKey // Change 'publicKeys' to 'encryptionKeys'
    });
   // console.log("encryptedencryptedencryptedencryptedencryptedencryptedencryptedencrypted:", encrypted);
    return encrypted;
}


async function decryptMessage(encryptedMessage, privateKeyArmored, passphrase) {
      console.log("encryptedencryptedencryptedencryptedencryptedencryptedencryptedencrypted:", privateKeyArmored);
    
    const privateKey = await openpgp.readPrivateKey({
        armoredKey: privateKeyArmored,
        passphrase: passphrase
    });
    const { data: decrypted } = await openpgp.decrypt({
        message: await openpgp.Message.readArmored(encryptedMessage),
        privateKeys: privateKey
    });
    return decrypted;
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

module.exports = {
    makePayment: function (req, res) {
        res.status(200).json({ status: true, data: [] })
    },
    checkVpa: async function (req, res) {
        try {
            var obj = req.body;
            var clientSecret = await getClientSecret();

            if (clientSecret && clientSecret["resultCode"] == "S") {
                var cSecreteKey = clientSecret.clientSecret;
                var token = await generateToken(cSecreteKey);
                if (token) {
                    var isValidVpa = await verifyVPA(token);
                   // console.log("jjjjjjjjjjjjjjjjjj",token)
                    if (isValidVpa) {
                        res.status(200).json({ status: true, message: "Valid VPA" });
                    } else {
                        res.status(500).json({ status: false, message: "InValid VPA" });
                    }
                } else {
                    res.status(500).json({ status: false, message: "Error In Creating Token" });
                }
            } else {
                res.status(500).json({ status: false, message: "Error In Creating Client Secret" });
            }
        } catch (e) {
            console.log(e);
        }
    }
}
//Handshake Staep to get Client Secret key
async function getClientSecret() {
    var ob = {
        "requestInfo": {
            "pspRefNo": hdfcUpiCred.refId,
            "userName": hdfcUpiCred.username,
            "oldPassword": hdfcUpiCred.password,
            "newPassword": hdfcUpiCred.password
        },
        "deviceInfo": { "deviceId": "1234", "simId": "12345", "geoCode": "1234", "location": "mumbai", "ip": "172.16.50.233", "os": "android", "deviceType": "mobile", "appName": "hdfc", "capability": "12345", "androidId": hdfcUpiCred.androidId, "bluetoothMac": "", "wifiMac": "" }
    }
    var encText = encryptData(JSON.stringify(ob), hdfcUpiCred.merchantKey);
    //console.log(encText);
    try {
        const response = await axios.post("https://upitest.hdfcbank.com/upi/oauth2ClientHandshake", {
            "requestMsg": encText.encryptedData,
            "pgMerchantId": hdfcUpiCred.merchantId,
        });
        // console.log(response.data)
        var respn = decryptData(response.data.resp, hdfcUpiCred.merchantKey);
        return JSON.parse(respn);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
//Generate Token
async function generateToken(sKey) {
    try {
      
        const response = await axios.get("https://upitest.hdfcbank.com/oauth/token?grant_type=password&client_id=" + hdfcUpiCred.clientID + "&client_secret=" + sKey + "&username=" + hdfcUpiCred.username + "&password=" + hdfcUpiCred.password);
        return response.data.access_token;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
//Validate VPA
async function verifyVPA(data1) {
 
 var obj = {
        "vpa": "kesari788@hdfcbank", "reqType": "T"
    }
    var resp = await encryptMessage(JSON.stringify(obj), hdfcUpiCred.publickKey)
    console.log("https://upitestv2.hdfcbank.com/upi/meapi/meCashBackCheckVpa?access_token=" + data1)

    try {
        var response = await axios.post("https://upitestv2.hdfcbank.com/upi/meapi/meCashBackCheckVpa?access_token=" + data1, {
            "pgmerchant_Id": hdfcUpiCred.merchantId,
            "seq_number": generateRandomString(30),
            "data": resp,
            "key_id": hdfcUpiCred.keyID,
            
        });
        console.log("responseresponseresponseresponse", response.data)
        var respn = decryptMessage(response.data, hdfcUpiCred.publickKey);
        var respn = response.data
        return respn;
       
       // return JSON.stringify(response.data);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

//Validate VPA
function generatPayment(data, cb) {
}
//Validate VPA
function checkPaymentStatus(data, cb) {
}


