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
  
      const requestOptions = {
        method: "GET",
        json: true,
        timeout: 30000
      };
  
      // Fetch data from all the APIs concurrently
      const responses = await Promise.all([
        request({ ...requestOptions, uri: kesariAPI }),
        request({ ...requestOptions, uri: tourMasZeroDataAPI }),
        request({ ...requestOptions, uri: faqAPI }),
        request({
          method: "POST",
          uri: reviewAPI,
          json: true,
          body: { tourCode: newTourCode },
          timeout: 10000
        })
      ]);
  
      const [kesariResult, tourMasZeroDataResult, faqs, reviewAPIResult] = responses;
  
      // Check if all API responses are valid
      if (kesariResult && kesariResult.length > 0 && tourMasZeroDataResult && faqs && reviewAPIResult) {
        const tourData = kesariResult[0];
        const groupTourFaqs = faqs.filter(faq => faq.category === "Group Tour");
  
        // Generate PDF using PDFKit
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
          const pdfBuffer = Buffer.concat(buffers);
          const fileName = `itinerary-${Date.now()}.pdf`;
  
          // Upload the PDF to S3
          await uploadPDFToS3(pdfBuffer, fileName);
  
          // Respond with the URL of the uploaded PDF
          res.status(200).json({
            success: true,
            message: 'PDF generated and uploaded successfully',
            fileUrl: `https://s3.ap-southeast-1.amazonaws.com/kesari.in/upload/itinerary-pdf/${fileName}`
          });
        });
  
        // Write data to the PDF
        doc.fontSize(25).text('Tour Itinerary', { align: 'center' });
        doc.moveDown();
        doc.fontSize(18).text(`Tour Name: ${tourData.TOURNAME}`);
        doc.text(`Zone: ${zone}`);
        doc.text(`Series: ${tourSeries}`);
        doc.text(`FAQs:`);
        groupTourFaqs.forEach(faq => {
          doc.text(`- ${faq.question}: ${faq.answer}`);
        });
  
        // Add more tour data here as needed...
  
        doc.end(); // Finalize the PDF generation
  
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
  