getTourSeries: function (req, res) {
    var query = {
        'TOURCODE': { $ne: "" },
        'TOURNAME': { $ne: "" }
    };
    if (req.query) {
        if ((Object.keys(req.query)).length > 0) {
            var tourseries = JSON.parse((Object.keys(req.query))[0]);
            if (tourseries.q.length === 2) {
                query['TOURCODE'] = (tourseries.q).toUpperCase();
            }
        }
    }
    model.find(query).select('TOURCODE TOURNAME F_FROMDY1 TOUR_DAYS TOUR_ID TM_ZONE').exec(function (err, ress) {
        if (!err) {
            return res.json(ress);
        } else
            return res.json(500, {
                message: 'Error getting tourname:list.'
            });
    })
},