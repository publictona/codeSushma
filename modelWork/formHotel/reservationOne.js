router.post('/reservationDetails', async (req, res) => {
    try {
        const { F_TCD } = req.body;

        const filterCriteria = { F_TCD, F_CATCODE: "HOTEL" };

        // Fetch initial hotel data from TR_HOTEL with F_CATCODE 'HOTEL'
        const hotelData = await rsDataModel.tr_hotelModel.find(filterCriteria).lean().select("F_TCD F_SUPPNO F_CHKIN F_CHKOUT F_STATUS F_NIGHTS");
        if (!hotelData.length) {
            console.warn("No hotel data found in TR_HOTEL with F_CATCODE 'HOTEL'.");
        }

        // Filter unique F_TCD values
        const uniqueHotelData = hotelData.filter((value, index, self) =>
            index === self.findIndex((t) => t.F_TCD === value.F_TCD)
        );

        const tourAggData = await rsDataModel.tr_hotelModel.aggregate([
            { $match: { F_TCD: F_TCD, F_CATCODE: "HOTEL" } },
            // Add more stages as needed here for specific aggregations, e.g., $group, $project, etc.
        ]);

        const supplierF_SUPPNO = tourAggData.map(item => item.F_SUPPNO);

        // Define supplier filter criteria
        const supplierFilterCriteria = { F_CATCODE: "HOTEL", F_SUPPNO: { $in: supplierF_SUPPNO } };

        // Fetch supplier data from f_supmstModel with F_CATCODE 'HOTEL'
        const supplierData = await rsDataModel.f_supmstModel.find(supplierFilterCriteria).lean().select("F_SUPPNO F_PLACE F_NAME F_ADD1 F_ADD2 F_ADD3 F_STATE F_PIN F_TEL");
        if (!supplierData.length) {
            console.warn("No supplier data found in f_supmstModel with F_CATCODE 'HOTEL'.");
        }
        // Create a map of supplier data by F_SUPPNO for fast lookup
        const supplierMap = supplierData.reduce((acc, supplierItem) => {
            acc[supplierItem.F_SUPPNO] = supplierItem;
            return acc;
        }, {});

        // Merge hotelData with supplierData based on F_SUPPNO
        const mergedDetails = hotelData.map(hotelItem => {
            const supplierItem = supplierMap[hotelItem.F_SUPPNO] || {}; // Get supplier data or an empty object if no match
            return {
                ...hotelItem,
                ...supplierItem  // Merge supplier properties into hotelItem if found
            };
        });

        mergedDetails.forEach(item => {
            if (item.F_CHKIN && item.F_CHKOUT) {
                const startDate = moment(item.F_CHKIN).format("D MMM YYYY"); // e.g., "7 NOV 2022"
                const endDate = moment(item.F_CHKOUT).format("D MMM YYYY");   // e.g., "14 NOV 2022"
                console.log("formattedDate", startDate, startDate)
                item.formattedDate = `${startDate} - ${endDate}`;
            } else {
                item.formattedDate = "Date not available";
            }
        });

        console.log("mergedDetailsmergedDetails", mergedDetails)

        // Combine all results into a single response
        const reservationData = { hotelData, tourAggData, supplierData };

        // Render the EJS template and return HTML in the response
        res.render('reservationDetails/details', {
            profile_path: '/AdminLTE/dist/img/user2-160x160.jpg',
            title: 'Guest Request Details',
            hotelData: uniqueHotelData,
            mergedData: mergedDetails,
            data: reservationData
        }, function (err, html) {
            if (err) {
                console.error("Error rendering EJS template:", err);
                return res.status(500).send("Error rendering template");
            }
            res.setHeader('Content-Type', 'text/html'); // Set header to HTML for clarity in Postman
            res.send(html);
        });
    } catch (err) {
        console.error("Error fetching Details requested From Guest:", err);
        res.status(500).json({ status: false, msg: "Internal server error" });
    }
});