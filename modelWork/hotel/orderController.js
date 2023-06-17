/**
 * @Author: Sushma Landge
 */

/***********************
 CORE PACKAGES
 **********************/

 var q = require('q');
 // var jwt = require('jsonwebtoken');
 
 var baseExport = require('../baseExporter.js');
 
 /*********************
  MODULE PACKAGES
  ********************/
 
 const model = require('../models/orderMasterNewModel.js');
 
  function order(req, res) {
         try {
 
             // Retrieve the order details from the request body
             const { guestName, hotelId, restaurantId, items, order_date, status, cancellable } = req.body;   
             // "itemName": String,
             // "quantity": Number,
             // "price": Number,
           
 
             // Validate the order details
             if (!guestName || !hotelId || !restaurantId || !status || !cancellable || !Array.isArray(items) || items.length === 0)  {
                 return res.status(400).json({ error: 'Invalid order details' });
             }
             console.log("datatata" ,  guestName, hotelId, restaurantId, items, order_date, status, cancellable)
 
             // Calculate the total amount based on menu item prices and quantities
             let totalAmount = 0;
             for (const item of items) {
                 const { itemName, quantity, price } = item;
 
                 if (!itemName || !quantity || !price) {
                     return res.status(400).json({ error: 'Invalid item details' });
                 }
 
                 totalAmount += price * quantity;
             }
 
 
             const order = new model({
 
                 guestName,
                 hotelId,
                 items,
                 restaurantId,
                 order_date,
                 cancellable,
                 status,
                 total: totalAmount,
                
             });
 
             // Save the order to the database
             order.save()
                 .then(savedOrder => {
                     console.log("savedOrdersavedOrdersavedOrder"  ,savedOrder )
                     res.status(201).json(savedOrder); // Return the created order as the response
                 })
         }
         catch (error) {
             res.status(500).json({ error: 'Failed to create order' });
         };
 
 
  }
 
 
 module.exports = {
 //     create: async function (req, res) {
 //          try {
 //              const data = req.body
 //              const savedData = await model.create(data);
 //              res.status(200).send({ status: true, msg: "data saved", Data:savedData })
 
 //          } catch (err) {
 //              console.log(err);
 //              res.status(500).send({ msg: msg.err })
 //          }
 //   },
 
 
 
 
 
    
 
     // create: async function (req, res) {
     //     try {
 
     //         // Retrieve the order details from the request body
     //         const { guestName, hotelId, restaurantId, items, order_date, status, cancellable } = req.body;
 
     //         // Validate the order details
     //         if (!guestName || !hotelId || !restaurantId || !status || !cancellable || !Array.isArray(items) || items.length === 0)  {
     //             return res.status(400).json({ error: 'Invalid order details' });
     //         }
     //         console.log("datatata" ,  guestName, hotelId, restaurantId, items, order_date, status, cancellable)
 
     //         // Calculate the total amount based on menu item prices and quantities
     //         let totalAmount = 0;
     //         for (const item of items) {
     //             const { itemName, quantity, price } = item;
 
     //             if (!itemName || !quantity || !price) {
     //                 return res.status(400).json({ error: 'Invalid item details' });
     //             }
 
     //             totalAmount += price * quantity;
     //         }
 
 
     //         const order = new model({
 
     //             guestName,
     //             hotelId,
     //             items,
     //             restaurantId,
     //             order_date,
     //             cancellable,
     //             status,
     //             total: totalAmount,
                
     //         });
 
     //         // Save the order to the database
     //         order.save()
     //             .then(savedOrder => {
     //                 console.log("savedOrdersavedOrdersavedOrder"  ,savedOrder )
     //                 res.status(201).json(savedOrder); // Return the created order as the response
     //             })
     //     }
     //     catch (error) {
     //         res.status(500).json({ error: 'Failed to create order' });
     //     };
 
 
     // },
 
 
 
     griddata: async function (req, res) {
         try {
             // console.log(req.body);
             var query = {};
             var limit = req.body.limit ? parseInt(req.body.limit) : 500;
             var search_by = req.body.search_by ? req.body.search_by : "";
             var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
             var order = req.body.order ? req.body.order : "asc";
             var page = req.body.page ? parseInt(req.body.page) : 0;
             var columns = req.body.columns ? req.body.columns : [];
             var filter_columns = {};
             var draw = req.body.draw ? parseInt(req.body.draw) : 1;
             var start = req.body.start ? parseInt(req.body.start) : 0;
 
             if (req.body.search_query) {
                 var search_query = req.body.search_query;
 
             } else {
             }
             var table_format = req.body.table_format ? req.body.table_format : "datatable";
 
             q.all(baseExport.grid('orderMasterNew', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
                 res.json(result);
             });
 
         } catch (err) {
             console.log(err)
 
         }
     },
     roomData: async function (req, res) {
         try {
             var id = req.query.id;
             var data = await model.findById(id);
             //res.json(data);
             res.status(200).json({ status: true, msg: "data saved", data });
 
         } catch (e) {
             console.log(e);
         }
 
 
     },
     updateRoom: async function (req, res) {
         try {
             // console.log(req.body);
             // console.log(req.params.id);
             var data = await model.findByIdAndUpdate(req.params.id, { $set: req.body });
 
             res.status(200).json({ status: true, msg: "data updated" });
 
         } catch (e) {
             console.log(e);
         }
     },
 
     getRoomList: function (req, res) {
         try {
             var hotelId = req.params.hotelId;
             if (hotelId) {
                 model.find({ "hotelId": hotelId }, function (err, roomMaster) {
                     if (err) {
                         return res.status(500).json({
                             message: 'Error In Getting show API Data.',
                             data: err
                         });
                     }
                     if (!roomMaster) {
                         return res.status(404).json({
                             message: 'No Such show API Data',
                             data: []
                         });
                     }
                     return res.status(200).json({
                         message: "success",
                         data: roomMaster
                     });
                 });
             } else {
                 return res.status(404).json({
                     message: 'No Such show API Data',
                     data: []
                 });
             }
         } catch (error) {
             console.log("@@@ ERROR @@@", error);
             return res.status(404).json({
                 message: 'No Such show API Data',
                 data: []
             });
         }
     },
 }
 
 