
/*
descDate: async function (req, res) {
    try {
        var obj = req.body;

        var tourDate = new Date();
        if (req.body.date) {
            tourDate = convertToDate(req.body.date).setHours(5, 30, 0, 0);
            tourDate = new Date(tourDate);
        }
        var query = {
            "tourCode": req.body.TOURCODE.substring(0, 2)
        };
        // console.log("query" , query);


        var getTourSrDec = await model.find({ $regex: { tourCode: obj.TOURCODE } })
        if (!getTourSrDec) {
            res.status(400).send({ status: false, msg: "some err" });
        }

        console.log("getTourSrDec", getTourSrDec);

        res.status(200).json({ Status: true, data: getTourSrDec })


    }

    catch (err) {
        console.log("err", err)
        res.status(500).send({ status: false, msg: err.msg })
    }
}


//=============================================================================

getItineraryFromSeriesWithLatestDate:  async function (req, res) {
    try {
        const tourCode = req.body.tourCode;

        // Validate the tour code
        if (!tourCode) {
            return res.status(400).json({ error: 'Tour code is required' });
        }

        // Extract the first 2 characters from the tour code
        const firstTwoChars = tourCode.substring(0, 2);
        console.log("first " , firstTwoChars)

        // Create a query to find documents with the first three characters of the tour code
        const query = { tourCode: { $regex: `^${firstTwoChars}` } };
        console.log("query " , query)


        // Sort the documents in descending order based on the created_at field
        const sortOptions = { created_at: -1 };



        // Execute the query with sorting
 model.find(query).sort(sortOptions).toArray(function (err, result) {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Failed to fetch data from the database' });
            }

            console.log('Matching documents:', result);
            res.status(200).json(result);
        });

    } catch (err) {
        console.log("errrrrrrrrrrrrrrrrr" , err)
         res.status(500).json({ error: 'An unexpected error occurred' });
    }

}


//====================================last update working"=========================
getTestimonialSeries: function (req, res) {
    try{
        var tourCode = req.body.tourCode.substring(0, 2);

                console.log("tourCode", tourCode)

        // Validate the tour code
        if (!tourCode) {
            return res.status(400).json({ error: 'Tour code is required' });
        }


        // Create a query to find documents with the first three characters of the tour code
        const query = { tourCode: { $regex: `^${tourCode}` } };
        console.log("query ", query)


        // Sort the documents in descending order based on the created_at field
        const sortOptions = { created_at: -1 };
        console.log("sortOptionssortOptions ", sortOptions)


       
        testimonialModel.findOne(query).sort(sortOptions).exec(function (err, result) {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch data from the database' });
            }
            result = JSON.parse(JSON.stringify(result));
            console.log('Matching documents:', result);
            res.status(200).send({ status: true, Data: result });
        })

    } catch(err){
        res.status(500).send({status:false , msg: err.msg  });
    }
},

getItineraryFromSeriesWithLatestDate: function (req, res) {
        testimonialModel.findOne({}).exec(function (err, result) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to fetch data from the database' });
                }
                console.log('Matching documents:', result);
                res.status(200).send({ status: true, result });
            })
    },

*/