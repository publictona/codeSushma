// router.get('/pdfData', function (req, res, next) {
//     res.render('inventory/pdfData', {
//         "username": req.session.user.cn,
//         "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
//         "menu": req.session.menu,
//         "title": 'PDF Data',
//         "AccessToken": req.session.user.token
//     });
// });


//WORKING1
// router.get('/pdfData', function (req, res, next) {
//     const tourCode = "E1010120";//"E1260325" ;  // Replace this with the dynamic tour code if needed
//     const uri = `http://localhost:3000/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;

//     request({
//         method: "GET",
//         uri: uri,
//         json: true,
//         timeout: 10000
//     }, function (error, resp, result) {
//        // console.log("resultresultresult",result.TOURNAME)
//         if (error) {
//             console.log('Error fetching tour data:', error);
//             return res.status(500).json({
//                 message: 'Error in request to Kesari Policy PDF',
//                 error: error,
//                 success: false,
//                 data: ""
//             });
//         } else if (result) {
            
//             res.render('inventory/pdfData', {
//                 "username": req.session.user.cn,
//                 "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
//                 "menu": req.session.menu,
//                 "title": 'PDF Data',
//                 "AccessToken": req.session.user.token,
//                 ob: result  // Pass the API result to the EJS template
//             });
//         } else {
//             return res.status(404).json({
//                 message: 'No data found in response from Kesari Policy PDF',
//                 success: false,
//                 data: ""
//             });
//         }
//     });
// });

//WORKING2

// router.get('/pdfData', function (req, res, next) {
//     const tourID = "0";  // Replace this with dynamic values if needed
//     const zone = "Andaman";
//     const tourSeries = "SN";
//     const tourCode = "E1010120";//"E1260325" ;
//    // const uri = `http://localhost:3000/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
//     const uri = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;  // Example for second API`;

//     request({
//         method: "GET",
//         uri: uri,
//         json: true,
//         timeout: 10000
//     }, function (error, resp, resul) {
//         console.log("resul",resul)
//         if (error) {
//             console.log('Error fetching tour resul:', error);
//             return res.status(500).json({
//                 message: 'Error in request to Kesari Policy PDF',
//                 error: error,
//                 success: false,
//                 data: ""
//             });
//         } else if (data) {
            
//             res.render('inventory/pdfData', {
//                 "username": req.session.user.cn,
//                 "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
//                 "menu": req.session.menu,
//                 "title": 'PDF Data',
//                 "AccessToken": req.session.user.token,
//                 "data": data  // Pass the API data to the EJS template
//             });
//         } else {
//             return res.status(404).json({
//                 message: 'No data found in response from Kesari Policy PDF',
//                 success: false,
//                 data: ""
//             });
//         }
//     });
// });

// router.get('/pdfData', function (req, res, next) {
//     const tourCode = "E1260325" ;// "E1010120"; // Replace this with the dynamic tour code if needed
//     const uri = `http://localhost:3000/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;

//     request({
//         method: "GET",
//         uri: uri,
//         json: true,
//         timeout: 10000
//     }, function (error, resp, result) {
//        console.log("resultresultresult",result.TOURNAME)
//         if (error) {
//             console.log('Error fetching tour data:', error);
//             return res.status(500).json({
//                 message: 'Error in request to Kesari Policy PDF',
//                 error: error,
//                 success: false,
//                 data: ""
//             });
//         } else if (result) {
            
//             res.render('inventory/pdfData', {
//                 "username": req.session.user.cn,
//                 "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
//                 "menu": req.session.menu,
//                 "title": 'PDF Data',
//                 "AccessToken": req.session.user.token,
//                 ob: result  // Pass the API result to the EJS template
//             });
//         } else {
//             return res.status(404).json({
//                 message: 'No data found in response from Kesari Policy PDF',
//                 success: false,
//                 data: ""
//             });
//         }
//     });
// });

//both binding

// router.get('/pdfData', async function (req, res, next) {
//     const tourID = "0";  // Replace this with dynamic values if needed
//     const zone = "Andaman";
//     const tourSeries = "SN";
//     const tourCode = "SN220924";  // Replace this with the dynamic tour code if needed
    
//     const apiUrl1 = `http://localhost:3000/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
//     const apiUrl2 = `http://localhost:3000/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;

//     try {
//        // console.log(`Fetching data from API 1: ${apiUrl1}`);
//         console.log(`Fetching data from API 2: ${apiUrl2}`);

//         // Make both API requests concurrently
//         const [result, result2] = await Promise.all([
//             request({
//                 method: "GET",
//                 uri: apiUrl1,
//                 json: true,
//                 timeout: 10000
//             }).catch(err => {
//                 console.error(`Error fetching from API 1: ${err.message}`);
//                 throw err;
//             }),
//             request({
//                 method: "GET",
//                 uri: apiUrl2,
//                 json: true,
//                 timeout: 10000
//             }).catch(err => {
//                 console.error(`Error fetching from API 2: ${err.message}`);
//                 throw err;
//             })
//         ]);

//         // Log the results for debugging
//        // console.log("API 1 Result:", result);
//         console.log("API 2 Result:", result2);
// var res2Arr = result2[0]
//         // Handle the response from both APIs
//         res.render('inventory/pdfData', {
//             "username": req.session.user.cn,
//             "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
//             "menu": req.session.menu,
//             "title": 'PDF Data',
//             "AccessToken": req.session.user.token,
//             ob: result,  // Pass the first API result to the EJS template
//             ob2: res2Arr   // Pass the second API result to the EJS template
//         });

//     } catch (error) {
//         console.error('Error in Promise.all or rendering:', error);
//         return res.status(500).json({
//             message: 'Error in request to Kesari APIs',
//             error: error.message || 'Unknown error',
//             success: false,
//             data: ""
//         });
//     }
// });


//5555555555555555555555
// router.get('/pdfData', function (req, res, next) {
//     // Set your dynamic values here
//     const tourCode = "E1260325";  // Replace this with dynamic value if needed
//     const tourID = "0";           // Replace this with dynamic value if needed
//     const zone = "Andaman";
//     const tourSeries = "SN";

//     // API endpoint to fetch data
//     const uri = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;

//     // Make the external API request
//     request({
//         method: "GET",
//         uri: uri,
//         json: true,
//         timeout: 10000
//     }, function (error, resp, result) {
//         console.log("API Response:", result);  // Log the response to check the structure

//         if (error) {
//             console.log('Error fetching tour data:', error);
//             return res.status(500).json({
//                 message: 'Error in request to Kesari Policy PDF',
//                 error: error,
//                 success: false,
//                 data: ""
//             });
//         } else if (result) {
//             // Render the EJS file with the API data passed as 'ob'
//             res.render('inventory/pdfData', {
//                 "username": req.session.user.cn,
//                 "profile_path": '/AdminLTE/dist/img/user2-160x160.jpg',
//                 "menu": req.session.menu,
//                 "title": 'PDF Data',
//                 "AccessToken": req.session.user.token,
//                 ob: result  // Pass the API result to the EJS template
//             });
//         } else {
//             return res.status(404).json({
//                 message: 'No data found in response from Kesari Policy PDF',
//                 success: false,
//                 data: ""
//             });
//         }
//     });
// });

  // Use request-promise for easier promise handling

//2nd api bindig
// router.get('/pdfData', function (req, res, next) {
//     const tourCode = "E1260325";  // Dynamic value
//     const tourID = "0";           // Dynamic value
//     const zone = "Andaman";
//     const tourSeries = "SN";

//     const uri = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;

//     request({
//         method: "GET",
//         uri: uri,
//         json: true,
//         timeout: 10000
//     }, function (error, resp, result) {
//         console.log("resultresultresult" , result)
//         if (error) {
//             return res.status(500).json({
//                 message: 'Error in request to Kesari Policy PDF',
//                 error: error,
//                 success: false,
//                 data: ""
//             });
//         }

//         if (result && result.length > 0) {
//             const tourData = result[0];  // Access the first object in the array

//             // Render the EJS file with the first object of the array passed as 'ob'
//             res.render('inventory/pdfData', {
//                 username: req.session.user.cn,
//                 profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
//                 menu: req.session.menu,
//                 title: 'PDF Data',
//                 AccessToken: req.session.user.token,
//                 ob: tourData  // Pass the tourData to the EJS template
//             });
//         } else {
//             return res.status(404).json({
//                 message: 'No data found in response from Kesari Policy PDF',
//                 success: false,
//                 data: ""
//             });
//         }
//     });
// });


//both working
 // Use request-promise for easier promise handling


//final
// router.get('/pdfData', function (req, res, next) {
//     const tourCode = "E1260325";  // Dynamic value
//     const tourID = "0";           // Dynamic value
//     const zone = "Andaman";
//     const tourSeries = "SN";

//     const kesariAPI = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;
//     const tourMasZeroDataAPI = `http://localhost:3000/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;

//     // Make both requests concurrently
//     Promise.all([
//         request({ method: "GET", uri: kesariAPI, json: true, timeout: 10000 }),
//         request({ method: "GET", uri: tourMasZeroDataAPI, json: true, timeout: 10000 })
//     ])
//     .then(([kesariResult, tourMasZeroDataResult]) => {
//         // Ensure we have valid data from both APIs
//         if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult) {
//             const tourData = kesariResult[0];  // Access the first object in the array from Kesari API

//             // Render the EJS file with data from both APIs
//             res.render('inventory/pdfData', {
//                 username: req.session.user.cn,
//                 profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
//                 menu: req.session.menu,
//                 title: 'PDF Data',
//                 AccessToken: req.session.user.token,
//                  tourMasZeroData: tourData,  // Pass Kesari data
//                  ob: tourMasZeroDataResult  // Pass the data from the second API
//             });
//         } else {
//             return res.status(404).json({
//                 message: 'No data found from one or both APIs',
//                 success: false,
//                 data: ""
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching data from APIs:', error);
//         return res.status(500).json({
//             message: 'Error in request to one or both APIs',
//             error: error,
//             success: false,
//             data: ""
//         });
//     });
// });

//final with hotel
// router.get('/pdfData', function (req, res, next) {
//     const tourCode = "E1260325";  // Dynamic value
//     const tourID = "0";           // Dynamic value
//     const zone = "Andaman";
//     const tourSeries = "SN";

//     const kesariAPI = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;
//     const tourMasZeroDataAPI = `https://login.kesari.in/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
//    // const FAQLIST  = `https://api.kesari.in/route/faq/`

//     // Make both requests concurrently
//     Promise.all([
//         request({ method: "GET", uri: kesariAPI, json: true, timeout: 10000 }),
//         request({ method: "GET", uri: tourMasZeroDataAPI, json: true, timeout: 10000 })
//     ])
//     .then(([kesariResult, tourMasZeroDataResult]) => {
//         // Ensure we have valid data from both APIs
//         if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult) {
//             const tourData = kesariResult[0];  // Access the first object in the array from Kesari API

//             //--------------- start and End Date---------------------
//             // var startDt = '';
//             // var endDt = '';
//             // tourMasZeroDataResult.TOURMAS.forEach(item => {
//             //     startDt += item.TM_DT1;
//             //     endDt += item.TM_DT1;
//             //     // Use moment to format the date (e.g., 'Do MMM YYYY' format)
//             //     var formattedStartDate = moment(startDt).format('Do MMM YYYY');
//             //     console.log("Formatted Start Date:", formattedStartDate);
            
//             //     // Do more with startDt or formattedStartDate as needed
//             // });

//             const uniqueHotels = [];
//             const seenHotels = new Set();  // Set to keep track of unique hotel names
            
//             tourData.TOURMAS0.forEach(item => {
//                 item.HOTEL.forEach(hotel => {
//                     if (!seenHotels.has(hotel.hotel_name)) {
//                         uniqueHotels.push(hotel);  // Add unique hotels to the array
//                         seenHotels.add(hotel.hotel_name);  // Mark the hotel name as seen
//                     }
//                 });
//             });

//             // Add the filtered unique hotels back to `tourData`
//             tourData.TOURMAS0 = uniqueHotels;

//             //--------------------EMI Calculations-----------------------
//             var amount = 0 || ""
//             tourMasZeroDataResult.TOURMAS0.forEach(item => {

//                  amount += parseInt(item.COST_2DAY) - parseInt(item.DISC_2DAY);
//                  console.log("amountamountamountamount", parseInt(item.COST_2DAY) - parseInt(item.DISC_2DAY))
//             })
//              const emiData = EMICalculator(amount);
//             // Render the EJS file with data from both APIs
//             res.render('inventory/pdfData', {
//                 username: req.session.user.cn,
//                 profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
//                 menu: req.session.menu,
//                 title: 'PDF Data',
//                 AccessToken: req.session.user.token,
//                  tourMasZeroData: tourData,  // Pass Kesari data
//                  ob: tourMasZeroDataResult,
//                  emiData: emiData.EMIs   // Pass the data from the second API
//             });
//         } else {
//             return res.status(404).json({
//                 message: 'No data found from one or both APIs',
//                 success: false,
//                 data: ""
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching data from APIs:', error);
//         return res.status(500).json({
//             message: 'Error in request to one or both APIs',
//             error: error,
//             success: false,
//             data: ""
//         });
//     });
// });


//fffffffffworking without
router.get('/pdfData', function (req, res, next) {
    const tourCode = req.query.tourCode ||"E1260325" // "SZ150924"//"E1260325"; // Dynamic value
    const tourID = "0";           // Dynamic value
    const zone = "Andaman";
    const tourSeries = "SN";
    const newTourCode = tourCode.substring(0, 2);

    const kesariAPI = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;
    const tourMasZeroDataAPI = `https://login.kesari.in/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
    const faqAPI = `https://api.kesari.in/route/faq/`;
    const reviewAPI = `https://login.kesari.in/route/inventory/getTestimonialBySeries`;
    
    //console.log("kesariAPIkesariAPIkesariAPIkesariAPIkesariA", kesariAPI , tourMasZeroDataAPI , faqAPI , reviewAPI)
    // Make both requests concurrently
    Promise.all([
        request({ method: "GET", uri: kesariAPI, json: true, timeout: 10000 }),
        request({ method: "GET", uri: tourMasZeroDataAPI, json: true, timeout: 10000 }),
        request({ method: "GET", uri: faqAPI, json: true, timeout: 10000 }), // Add the FAQ API call
        // request({ method: "POST", uri: reviewAPI, json: true, timeout: 10000 })
        request({ 
            method: "POST", 
            uri: reviewAPI, 
            json: true, 
            body: { tourCode: newTourCode },   // Send tourSeries in the request body
            timeout: 10000 
        })  // Handle the POST request for reviewAPI
    ])

    
    .then(([kesariResult, tourMasZeroDataResult, faqs , reviewAPIResult ]) => {
        // Ensure we have valid data from both APIs
        if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult && faqs  && reviewAPIResult ) {
            const tourData = kesariResult[0];  // Access the first object in the array from Kesari API
           console.log("ctttttttttttt:", faqs)
            const seenHotels = new Set();  // Set to keep track of unique hotel names
            
            tourData.TOURMAS0.forEach(item => {
                item.HOTEL.forEach(hotel => {
                    if (!seenHotels.has(hotel.hotel_name)) {
                        uniqueHotels.push(hotel);  // Add unique hotels to the array
                        seenHotels.add(hotel.hotel_name);  // Mark the hotel name as seen
                    }
                });
            });

          
            // Add the filtered unique hotels back to `tourData`
            tourData.TOURMAS0 = uniqueHotels;

      //=======================month====departure=================================================
      tourData.TOURMAS0.forEach(item => {
        console.log("Departure Date (TM_DT1):", item.TM_DT1);
        console.log("Month:", item.month);
    });
            //--------------------EMI Calculations-----------------------
            var amount = 0 || ""
            tourMasZeroDataResult.TOURMAS0.forEach(item => {
            amount += parseInt(item.COST_2DAY) - parseInt(item.DISC_2DAY);
             })

       
             const emiData = EMICalculator(amount);
             const groupTourFaqs = faqs.filter(faq => faq.category === "Group Tour");
            // console.log("groupTourFaqsgroupTourFaqs" , faqs.category)
              //REVIEW API
            const reviews = reviewAPIResult.Data || [];
           // console.log("reviewsreviews" , reviews)


           var tourname = encodeURIComponent(tourMasZeroDataResult.itinerary.tourname);
         
            // Render the EJS file with data from both APIs
            res.render('inventory/pdfData', {
                username: req.session.user.cn,
                profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
                menu: req.session.menu,
                title: 'PDF Data',
                AccessToken: req.session.user.token,
                 tourMasZeroData: tourData,  // Pass Kesari data
                 ob: tourMasZeroDataResult,
                 review : reviews,
                 emiData: emiData.EMIs,
                 tourname: tourname,
                 faqs: groupTourFaqs,
                 moment: moment,   // Pass the data from the second API  https://www.kesari.in/tourIti/Group-Tours/Europe/E1/ALL-OF-EUROPE
                 tourBookingUrl: `https://www.kesari.in/tourIti/Group-Tours/${zone}/${tourSeries}/${tourname}`//${tourname}//https://www.kesari.in/online/${zone}/${tourSeries}

            });
        } else {
            return res.status(404).json({
                message: 'No data found from one or both APIs',
                success: false,
                data: ""
            });
        }
    })
    .catch(error => {
        console.error('Error fetching data from APIs:', error);
        return res.status(500).json({
            message: 'Error in request to one or both APIs',
            error: error,
            success: false,
            data: ""
        });
    });
});

//fffffffffworking without latest
// router.post('/pdfData', function (req, res, next) {
//     const tourCode = req.body.tourCode || "E1260325" //"SN150924"//"E1260325" // "SZ150924"//"E1260325"; // Dynamic value
//     const tourID = "0";           // Dynamic value
//     const zone = req.body.zone || "Europe"//"Europe"//"Andaman";
//     const tourSeries = req.body.tourSeries || "E1" // "SN"//"SN"
//     const newTourCode = tourCode.substring(0, 2);

//     const kesariAPI = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;
//     const tourMasZeroDataAPI = `https://login.kesari.in/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
//     const faqAPI = `https://api.kesari.in/route/faq/`;
//     const reviewAPI = `https://login.kesari.in/route/inventory/getTestimonialBySeries`;
//     // Make both requests concurrently
//     Promise.all([
//         request({ method: "GET", uri: kesariAPI, json: true, timeout: 10000 }),
//         request({ method: "GET", uri: tourMasZeroDataAPI, json: true, timeout: 10000 }),
//         request({ method: "GET", uri: faqAPI, json: true, timeout: 10000 }), // Add the FAQ API call
//         // request({ method: "POST", uri: reviewAPI, json: true, timeout: 10000 })
//         request({ 
//             method: "POST", 
//             uri: reviewAPI, 
//             json: true, 
//             body: { tourCode: newTourCode },   // Send tourSeries in the request body
//             timeout: 10000 
//         })  // Handle the POST request for reviewAPI
//     ])

    
//     .then(([kesariResult, tourMasZeroDataResult, faqs , reviewAPIResult ]) => {
//         // Ensure we have valid data from both APIs
//         if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult && faqs  && reviewAPIResult ) {
//             var tourData = kesariResult[0];  // Access the first object in the array from Kesari API
        
//             const uniqueHotels = [];
//             const seenHotels = new Set();  // Set to keep track of unique hotel names
            
//             tourData.TOURMAS0.forEach(item => {
//                 item.HOTEL.forEach(hotel => {
//                     if (!seenHotels.has(hotel.hotel_name)) {
//                         uniqueHotels.push(hotel);  // Add unique hotels to the array
//                         seenHotels.add(hotel.hotel_name);  // Mark the hotel name as seen
//                     }
//                 });
//             });

          
//             // Add the filtered unique hotels back to `tourData`
//             tourData.TOURMAS0 = uniqueHotels;

//       //=======================month====departure=================================================
     
//             //--------------------EMI Calculations-----------------------
//             var amount = 0 || ""
//             tourMasZeroDataResult.TOURMAS0.forEach(item => {
//             amount += parseInt(item.COST_2DAY) - parseInt(item.DISC_2DAY);
//              })

       
//              const emiData = EMICalculator(amount);
//              const groupTourFaqs = faqs.filter(faq => faq.category === "Group Tour");
//               //REVIEW API
//             const reviews = reviewAPIResult.Data || [];
//            // console.log("reviewsreviews" , reviews)


//           /// var tourname = encodeURIComponent(tourMasZeroDataResult.itinerary.tourname);
//         //   var tourname = encodeURIComponent(tourMasZeroDataResult.itinerary.tourname)
//         //   .replace(/%20/g, '-')
//         //   .toUpperCase();
         
//             // Render the EJS file with data from both APIs
//             res.render('inventory/pdfData', {
//                 username: req.session.user.cn,
//                 profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
//                 menu: req.session.menu,
//                 title: 'PDF Data',
//                 AccessToken: req.session.user.token,
//                  tourMasZeroData: tourData,  // Pass Kesari data
//                  ob: tourMasZeroDataResult,
//                  review : reviews,
//                  emiData: emiData.EMIs,
//                 // tourname: tourname,
//                  faqs: groupTourFaqs,
//                  moment: moment,   // Pass the data from the second API  https://www.kesari.in/tourIti/Group-Tours/Europe/E1/ALL-OF-EUROPE
//                  tourBookingUrl: `https://www.kesari.in/online/${zone}/${tourSeries}`//`https://www.kesari.in/tourIti/Group-Tours/${zone}/${tourSeries}/${tourname}`//${tourname}//https://www.kesari.in/online/${zone}/${tourSeries}

//             });
//         } else {
//             return res.status(404).json({
//                 message: 'No data found from one or both APIs',
//                 success: false,
//                 data: ""
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching data from APIs:', error);
//         return res.status(500).json({
//             message: 'Error in request to one or both APIs',
//             error: error,
//             success: false,
//             data: ""
//         });
//     });
// });

// router.post('/pdfData', function (req, res, next) {
//     const tourCode = req.body.tourCode || "E1260325";
//     const tourID = "0";           // Dynamic value
//     const zone = req.body.zone || "Europe";
//     const tourSeries = req.body.tourSeries || "E1";
//     const newTourCode = tourCode.substring(0, 2);

//     const kesariAPI = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;
//     const tourMasZeroDataAPI = `https://login.kesari.in/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
//     const faqAPI = `https://api.kesari.in/route/faq/`;
//     const reviewAPI = `https://login.kesari.in/route/inventory/getTestimonialBySeries`;

//     Promise.all([
//         retryRequest({ method: "GET", uri: kesariAPI, json: true, timeout: 20000 }),
//         retryRequest({ method: "GET", uri: tourMasZeroDataAPI, json: true, timeout: 20000 }),
//         retryRequest({ method: "GET", uri: faqAPI, json: true, timeout: 20000 }),
//         retryRequest({ 
//             method: "POST", 
//             uri: reviewAPI, 
//             json: true, 
//             body: { tourCode: newTourCode },
//             timeout: 20000 
//         })
//     ])
//     .then(([kesariResult, tourMasZeroDataResult, faqs, reviewAPIResult]) => {
//         if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult && faqs && reviewAPIResult) {
//             var tourData = kesariResult[0];
//             const uniqueHotels = [];
//             const seenHotels = new Set();

//             tourData.TOURMAS0.forEach(item => {
//                 item.HOTEL.forEach(hotel => {
//                     if (!seenHotels.has(hotel.hotel_name)) {
//                         uniqueHotels.push(hotel);
//                         seenHotels.add(hotel.hotel_name);
//                     }
//                 });
//             });

//             tourData.TOURMAS0 = uniqueHotels;

//             var amount = 0;
//             tourMasZeroDataResult.TOURMAS0.forEach(item => {
//                 amount += parseInt(item.COST_2DAY) - parseInt(item.DISC_2DAY);
//             });

//             const emiData = EMICalculator(amount);
//             const groupTourFaqs = faqs.filter(faq => faq.category === "Group Tour");
//             console.log(faq.category === "Group Tour");
//             const reviews = reviewAPIResult.Data || [];

//             // Render the EJS file as HTML
//             res.render('inventory/pdfData', {
//               //  username: req.session.user.cn,
//                 profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
//                // menu: req.session.menu,
//                 title: 'PDF Data',
//                // AccessToken: req.session.user.token,
//                 tourMasZeroData: tourData,
//                 ob: tourMasZeroDataResult,
//                 review: reviews,
//                 emiData: emiData.EMIs,
//                 faqs: groupTourFaqs,
//                 moment: moment,
//                 tourBookingUrl: `https://www.kesari.in/online/${zone}/${tourSeries}`
//             }, function (err, html) {
//                 if (err) {
//                     return res.status(500).json({
//                         message: 'Error rendering the EJS file',
//                         success: false,
//                         error: err
//                     });
//                 }

//                 // Write the rendered HTML content to a file
//                // const filePath = path.join(__dirname, 'inventory/pdfData');
//                const filePath = path.join(__dirname,'../views/inventory/sss.html');
//                 fs.writeFile(filePath, html, function (err) {
//                     if (err) {
//                         return res.status(500).json({
//                             message: 'Error writing the file',
//                             success: false,
//                             error: err
//                         });
//                     }

//                     // Send the file path as the response
//                     return res.status(200).json({
//                         success: true,
//                         message: 'EJS rendered and saved successfully',
//                         filePath: filePath
//                     });
//                 });
//             });
//         } else {
//             return res.status(404).json({
//                 message: 'No data found from one or more APIs',
//                 success: false,
//                 data: ""
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching data from APIs:', error);
//         return res.status(500).json({
//             message: 'Error in request to one or more APIs',
//             success: false,
//             error: error
//         });
//     });
// });


//ffffff2mail working
// router.get('/pdfData', function (req, res, next) {
//     const tourCode = req.query.tourCode ||"E1260325" // "SZ150924"//"E1260325"; // Dynamic value
//     const tourID = "0";           // Dynamic value
//     const zone = "Andaman";
//     const tourSeries = "SN";
//     const newTourCode = tourCode.substring(0, 2);
//     var emailID = req.body.emailID || "sushmal@kesari.in"

//     const kesariAPI = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;
//     const tourMasZeroDataAPI = `https://login.kesari.in/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
//     const faqAPI = `https://api.kesari.in/route/faq/`;
//     const reviewAPI = `https://login.kesari.in/route/inventory/getTestimonialBySeries`;
    
//     //console.log("kesariAPIkesariAPIkesariAPIkesariAPIkesariA", kesariAPI , tourMasZeroDataAPI , faqAPI , reviewAPI)
//     // Make both requests concurrently
//     Promise.all([
//         request({ method: "GET", uri: kesariAPI, json: true, timeout: 10000 }),
//         request({ method: "GET", uri: tourMasZeroDataAPI, json: true, timeout: 10000 }),
//         request({ method: "GET", uri: faqAPI, json: true, timeout: 10000 }), // Add the FAQ API call
//         // request({ method: "POST", uri: reviewAPI, json: true, timeout: 10000 })
//         request({ 
//             method: "POST", 
//             uri: reviewAPI, 
//             json: true, 
//             body: { tourCode: newTourCode },   // Send tourSeries in the request body
//             timeout: 10000 
//         })  // Handle the POST request for reviewAPI
//     ])

    
//     .then(([kesariResult, tourMasZeroDataResult, faqs , reviewAPIResult ]) => {
//         // Ensure we have valid data from both APIs
//         if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult && faqs  && reviewAPIResult ) {
//             const tourData = kesariResult[0];  // Access the first object in the array from Kesari API
//            console.log("TOURCODE:", tourData.TOUR_ID); 
//             const uniqueHotels = [];
//             const seenHotels = new Set();  // Set to keep track of unique hotel names
            
//             tourData.TOURMAS0.forEach(item => {
//                 item.HOTEL.forEach(hotel => {
//                     if (!seenHotels.has(hotel.hotel_name)) {
//                         uniqueHotels.push(hotel);  // Add unique hotels to the array
//                         seenHotels.add(hotel.hotel_name);  // Mark the hotel name as seen
//                     }
//                 });
//             });

          
//             // Add the filtered unique hotels back to `tourData`
//             tourData.TOURMAS0 = uniqueHotels;

//       //=======================month====departure=================================================
      
//             //--------------------EMI Calculations-----------------------
//             var amount = 0 || ""
//             tourMasZeroDataResult.TOURMAS0.forEach(item => {
//             amount += parseInt(item.COST_2DAY) - parseInt(item.DISC_2DAY);
//              })

       
//              const emiData = EMICalculator(amount);
//              const groupTourFaqs = faqs.filter(faq => faq.category === "Group Tour");
//               //REVIEW API
//             const reviews = reviewAPIResult.Data || [];
//            // console.log("reviewsreviews" , reviews)


//            var tourname = encodeURIComponent(tourMasZeroDataResult.itinerary.tourname);
         
//             // Render the EJS file with data from both APIs
//             res.render('inventory/pdfData', {
//                 username: req.session.user.cn,
//                 profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
//                 menu: req.session.menu,
//                 title: 'PDF Data',
//                 AccessToken: req.session.user.token,
//                  tourMasZeroData: tourData,  // Pass Kesari data
//                  ob: tourMasZeroDataResult,
//                  review : reviews,
//                  emiData: emiData.EMIs,
//                  tourname: tourname,
//                  faqs: groupTourFaqs,
//                  moment: moment,   // Pass the data from the second API  https://www.kesari.in/tourIti/Group-Tours/Europe/E1/ALL-OF-EUROPE
//                  tourBookingUrl: `https://www.kesari.in/tourIti/Group-Tours/${zone}/${tourSeries}/${tourname}`//${tourname}//https://www.kesari.in/online/${zone}/${tourSeries}

//             },function (err, html) {
//                 if (err) {
//                     res.send(err);
//                 }
//                 var mailOptions = {
//                     from: "holiday@kesari.in",
//                     bcc: "",
//                     to:emailID,//req.body.to,
//                     cc: "",
//                     subject:"TOUR ITINERARY PDF",
//                     html: html,
//                     attachments: []
//                 };
//                 var transporter = nodemailer.createTransport(smtpTransport(configAuth.smtp));
//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         res.status(500).json({
//                             message: 'Error in sending mail',
//                             error: error,
//                             status: 500
//                         });
//                     }else{
//                         res.status(200).json({status:200,"message":"brochure created"}); 
//                     }
//                 });
        
         
//         }
//     )} else {
//         return res.status(404).json({
//             message: 'No data found from one or both APIs',
//             success: false,
//             data: ""
//         });
//     }
//     })
//     .catch(error => {
//         console.error('Error fetching data from APIs:', error);
//         return res.status(500).json({
//             message: 'Error in request to one or both APIs',
//             error: error,
//             success: false,
//             data: ""
//         });
//     });
// });

////ffffff2mail working latest
router.get('/pdfData3', function (req, res, next) {
    const tourCode = req.query.tourCode ||"E1260325" // "SZ150924"//"E1260325"; // Dynamic value
    const tourID = "0";           // Dynamic value
    const zone = "Europe";
    const tourSeries = "E1";
    const newTourCode = tourCode.substring(0, 2);
    var emailID = req.body.emailID || "sushmal@kesari.in"

    const kesariAPI = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;
    const tourMasZeroDataAPI = `https://login.kesari.in/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
    const faqAPI = `https://api.kesari.in/route/faq/`;
    const reviewAPI = `https://login.kesari.in/route/inventory/getTestimonialBySeries`;
    
    //console.log("kesariAPIkesariAPIkesariAPIkesariAPIkesariA", kesariAPI , tourMasZeroDataAPI , faqAPI , reviewAPI)
    // Make both requests concurrently
    Promise.all([
        request({ method: "GET", uri: kesariAPI, json: true, timeout: 10000 }),
        request({ method: "GET", uri: tourMasZeroDataAPI, json: true, timeout: 10000 }),
        request({ method: "GET", uri: faqAPI, json: true, timeout: 10000 }), // Add the FAQ API call
        // request({ method: "POST", uri: reviewAPI, json: true, timeout: 10000 })
        request({ 
            method: "POST", 
            uri: reviewAPI, 
            json: true, 
            body: { tourCode: newTourCode },   // Send tourSeries in the request body
            timeout: 10000 
        })  // Handle the POST request for reviewAPI
    ])

    
    .then(([kesariResult, tourMasZeroDataResult, faqs , reviewAPIResult ]) => {
        // Ensure we have valid data from both APIs
        if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult && faqs  && reviewAPIResult ) {
            const tourData = kesariResult[0];  // Access the first object in the array from Kesari API
           console.log("TOURCODE:", tourData.TOUR_ID); 
            const uniqueHotels = [];
            const seenHotels = new Set();  // Set to keep track of unique hotel names
            
            tourData.TOURMAS0.forEach(item => {
                item.HOTEL.forEach(hotel => {
                    if (!seenHotels.has(hotel.hotel_name)) {
                        uniqueHotels.push(hotel);  // Add unique hotels to the array
                        seenHotels.add(hotel.hotel_name);  // Mark the hotel name as seen
                    }
                });
            });

          
            // Add the filtered unique hotels back to `tourData`
            tourData.TOURMAS0 = uniqueHotels;

         //--------------------EMI Calculations-----------------------
            var amount = 0 || ""
            tourMasZeroDataResult.TOURMAS0.forEach(item => {
            amount += parseInt(item.COST_2DAY) - parseInt(item.DISC_2DAY);
             })

       
             const emiData = EMICalculator(amount);
             const groupTourFaqs = faqs.filter(faq => faq.category === "Group Tour");
              //REVIEW API
            const reviews = reviewAPIResult.Data || [];
           // console.log("reviewsreviews" , reviews)


           var tourname = encodeURIComponent(tourMasZeroDataResult.itinerary.tourname);
         
            // Render the EJS file with data from both APIs
            res.render('inventory/pdfData', {
                username: req.session.user.cn,
                profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
                menu: req.session.menu,
                title: 'PDF Data',
                AccessToken: req.session.user.token,
                 tourMasZeroData: tourData,  // Pass Kesari data
                 ob: tourMasZeroDataResult,
                 review : reviews,
                 emiData: emiData.EMIs,
                 tourname: tourname,
                 faqs: groupTourFaqs,
                 moment: moment,   // Pass the data from the second API  https://www.kesari.in/tourIti/Group-Tours/Europe/E1/ALL-OF-EUROPE
                 tourBookingUrl: `https://www.kesari.in/online/${zone}/${tourSeries}`//${tourname}//https://www.kesari.in/online/${zone}/${tourSeries}

            },function (err, html) {
                if (err) {
                    res.send(err);
                }
                var mailOptions = {
                    from: "holiday@kesari.in",
                    bcc: "",
                    to:emailID,//req.body.to,
                    cc: "",
                    subject:"TOUR ITINERARY PDF",
                    html: html,
                    attachments: []
                };
                var transporter = nodemailer.createTransport(smtpTransport(configAuth.smtp));
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(500).json({
                            message: 'Error in sending mail',
                            error: error,
                            status: 500
                        });
                    }else{
                        res.status(200).json({status:200,"message":"brochure created"}); 
                    }
                });
         }
    )} else {
        return res.status(404).json({
            message: 'No data found from one or both APIs',
            success: false,
            data: ""
        });
    }
    })
    .catch(error => {
        console.error('Error fetching data from APIs:', error);
        return res.status(500).json({
            message: 'Error in request to one or both APIs',
            error: error,
            success: false,
            data: ""
        });
    });
});

