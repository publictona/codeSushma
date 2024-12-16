router.post('/pdfData', async (req, res) => {
    try {
      const tourCode = req.body.tourCode || "E1260325";
      const tourID = req.body.tourID || "0";
      const zone = req.body.zone || "Europe";
      const tourSeries = req.body.tourSeries || "E6";
      const newTourCode = tourSeries.substring(0, 2);
  
      const kesariAPI = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;
      const tourMasZeroDataAPI = `https://login.kesari.in/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
      const faqAPI = `https://api.kesari.in/route/faq/`;
      const reviewAPI = `https://login.kesari.in/route/inventory/getTestimonialBySeries`;
  

      // Increase timeout value to 30 seconds
    const requestOptions = {
        method: "GET",
        json: true,
        timeout: 30000 // Increased timeout
      };


      const responses = await Promise.all([
        request({...requestOptions, method: "GET", uri: kesariAPI, json: true, timeout: 10000 }),
        request({...requestOptions, method: "GET", uri: tourMasZeroDataAPI, json: true, timeout: 10000 }),
        request({...requestOptions, method: "GET", uri: faqAPI, json: true, timeout: 10000 }),
        request({
          method: "POST",
          uri: reviewAPI,
          json: true,
          body: { tourCode: newTourCode },
          timeout: 10000
        })
      ]);
  
      const [kesariResult, tourMasZeroDataResult, faqs, reviewAPIResult] = responses;
  
      if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult && faqs && reviewAPIResult) {
        const tourData = kesariResult[0];
        const groupTourFaqs = faqs.filter(faq => faq.category === "Group Tour");
        const myPdfApiData = [{ tourData, groupTourFaqs, reviewAPIResult }];
      
  
        // Process departure data
        const departureData = myPdfApiData[0].tourData.TOURMAS0.forEach(item => {
          const Dates = new Date(item.TM_DT1);
          return {
            TM_DT1: Dates.toLocaleDateString('en-GB', { day: 'numeric' }),
            MONTH: Dates.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            TM_HUB: item.TM_HUB,
            TM_SDESC: item.TM_SDESC
          };
        });
  
        // Unique hotels
        const seenHotels = new Set();
        const uniqueHotels = myPdfApiData[0].tourData.TOURMAS0.forEach(item =>
          item.HOTEL.filter(hotel => {
            if (!seenHotels.has(hotel.hotel_name)) {
              seenHotels.add(hotel.hotel_name);
              return true;
            }
            return false;
          })
        );
  
        myPdfApiData[0].tourData.TOURMAS0 = uniqueHotels;
  
        // EMI calculations
        const amount = parseInt(myPdfApiData[0].tourData.generated_NETCOST) || 0;
        const emiData = EMICalculator(amount);

        
       // const ejsPath = path.join(__dirname, 'inventory/pdfData.ejs');
         res.render('inventory/pdfData', {
          profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
          title: 'PDF Data',
          tourMasZeroData: tourData,
          ob: tourMasZeroDataResult,
          pdfData: myPdfApiData,
          review: reviewAPIResult.Data || [],
          emiData: emiData.EMIs,
          tourname: encodeURIComponent(tourMasZeroDataResult.itinerary.tourname),
          deparMonth: departureData,
          faqs: groupTourFaqs,
          moment: moment,
          tourBookingUrl: `https://www.kesari.in/online/${zone}/${tourSeries}`
        //});
            } ,function (err, html) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error rendering the EJS file',
                        success: false,
                        error: err
                    });
                }

                // Write the rendered HTML content to a file
               const filePath = path.join(__dirname, 'inventory/pdfData.ejs');
            
                fs.writeFile(filePath, html, function (err) {
                    console.log("htmlhtmlhtmlhtml" , html)
                    if (err) {
                        return res.status(500).json({
                            message: 'Error writing the file',
                            success: false,
                            error: err
                        });
                    }

                    // Send the file path as the response
                    return res.status(200).json({
                        success: true,
                        message: 'EJS rendered and saved successfully',
                        filePath: filePath
                    });
                });
            });
        //console.log("htmlhtmlhtmlhtmlhtml" , html)
        // Generate PDF using Puppeteer

       // var  sushma = "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        // await page.setContent(html);
        // const pdfBuffer = await page.pdf({ format: 'A4' });
        // await browser.close();
  
        // // Upload PDF to S3
        // const fileName = `itinerary-${Date.now()}.pdf`;
        //  uploadPDFToS3(pdfBuffer, fileName);
  
        // res.status(200).json({
        //   success: true,
        //   message: 'PDF generated and uploaded successfully',
        //   fileUrl: `https://s3.ap-southeast-1.amazonaws.com/kesari.in/upload/itinerary-pdf/${html}`
        // });


      } else {
        res.status(404).json({
          success: false,
          message: 'No data found from one or both APIs'
        });
      }
    } catch (error) {
      console.error('Error in /pdfData:', error);
      res.status(500).json({
        success: false,
        message: 'Error in generating and uploading PDF',
        error: error.message
      });
    }
  });


  //LAST BINDED
  router.post('/pdfData', async (req, res) => {
    try {
      const tourCode = req.body.tourCode || "E1260325";
      const tourID = req.body.tourID || "0";
      const zone = req.body.zone || "Europe";
      const tourSeries = req.body.tourSeries || "E6";
      const newTourCode = tourSeries.substring(0, 2);
  
      const kesariAPI = `https://login.kesari.in/route/inventory/getTourPackageData/${tourID}/${zone}/${tourSeries}`;
      const tourMasZeroDataAPI = `https://login.kesari.in/route/rsData/getTourMasZeroDataWithTCD/${tourCode}`;
      const faqAPI = `https://api.kesari.in/route/faq/`;
      const reviewAPI = `https://login.kesari.in/route/inventory/getTestimonialBySeries`;
  

      // Increase timeout value to 30 seconds
    const requestOptions = {
        method: "GET",
        json: true,
        timeout: 30000 // Increased timeout
      };


      const responses = await Promise.all([
        request({...requestOptions, method: "GET", uri: kesariAPI, json: true, timeout: 10000 }),
        request({...requestOptions, method: "GET", uri: tourMasZeroDataAPI, json: true, timeout: 10000 }),
        request({...requestOptions, method: "GET", uri: faqAPI, json: true, timeout: 10000 }),
        request({
          method: "POST",
          uri: reviewAPI,
          json: true,
          body: { tourCode: newTourCode },
          timeout: 10000
        })
      ]);
  
      const [kesariResult, tourMasZeroDataResult, faqs, reviewAPIResult] = responses;
  
      if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult && faqs && reviewAPIResult) {
        const tourData = kesariResult[0];
        const groupTourFaqs = faqs.filter(faq => faq.category === "Group Tour");
        const myPdfApiData = [{ tourData, groupTourFaqs, reviewAPIResult }];
      
  
        // Process departure data
        const departureData = myPdfApiData[0].tourData.TOURMAS0.forEach(item => {
          const Dates = new Date(item.TM_DT1);
          return {
            TM_DT1: Dates.toLocaleDateString('en-GB', { day: 'numeric' }),
            MONTH: Dates.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            TM_HUB: item.TM_HUB,
            TM_SDESC: item.TM_SDESC
          };
        });
  
        // Unique hotels
        const seenHotels = new Set();
        const uniqueHotels = myPdfApiData[0].tourData.TOURMAS0.forEach(item =>
          item.HOTEL.filter(hotel => {
            if (!seenHotels.has(hotel.hotel_name)) {
              seenHotels.add(hotel.hotel_name);
              return true;
            }
            return false;
          })
        );
  
        myPdfApiData[0].tourData.TOURMAS0 = uniqueHotels;
  
        // EMI calculations
        const amount = parseInt(myPdfApiData[0].tourData.generated_NETCOST) || 0;
        const emiData = EMICalculator(amount);

        
       // const ejsPath = path.join(__dirname, 'inventory/pdfData.ejs');
         res.render('inventory/pdfData', {
          profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
          title: 'PDF Data',
          tourMasZeroData: tourData,
          ob: tourMasZeroDataResult,
          pdfData: myPdfApiData,
          review: reviewAPIResult.Data || [],
          emiData: emiData.EMIs,
          tourname: encodeURIComponent(tourMasZeroDataResult.itinerary.tourname),
          deparMonth: departureData,
          faqs: groupTourFaqs,
          moment: moment,
          tourBookingUrl: `https://www.kesari.in/online/${zone}/${tourSeries}`
        //});
            },function (err, html) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error rendering the EJS file',
                        success: false,
                        error: err
                    });
                }

                // Write the rendered HTML content to a file
               const filePath = path.join(__dirname, 'inventory/pdfData.ejs');
            
                fs.writeFile(filePath, html, function (err) {
                    console.log("htmlhtmlhtmlhtml" , html)
                    if (err) {
                        return res.status(500).json({
                            message: 'Error writing the file',
                            success: false,
                            error: err
                        });
                    }

                    // Send the file path as the response
                    return res.status(200).json({
                        success: true,
                        message: 'EJS rendered and saved successfully',
                        filePath: filePath
                    });
                });
            });
        //console.log("htmlhtmlhtmlhtmlhtml" , html)
        // Generate PDF using Puppeteer

       // var  sushma = "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        // await page.setContent(html);
        // const pdfBuffer = await page.pdf({ format: 'A4' });
        // await browser.close();
  
        // // Upload PDF to S3
        // const fileName = `itinerary-${Date.now()}.pdf`;
        //  uploadPDFToS3(pdfBuffer, fileName);
  
        // res.status(200).json({
        //   success: true,
        //   message: 'PDF generated and uploaded successfully',
        //   fileUrl: `https://s3.ap-southeast-1.amazonaws.com/kesari.in/upload/itinerary-pdf/${html}`
        // });


      } else {
        res.status(404).json({
          success: false,
          message: 'No data found from one or both APIs'
        });
      }
    } catch (error) {
      console.error('Error in /pdfData:', error);
      res.status(500).json({
        success: false,
        message: 'Error in generating and uploading PDF',
        error: error.message
      });
    }
  });
