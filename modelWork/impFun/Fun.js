
//data logic 
//*
module.exports{
hdfcTRavelFestDisc:function(req, res) {
    var obj=req.body;
    var query={"guests":{$exists:true},"guests.billing.HDFCDISC":{$exists:true} };
    if (obj) {
        var search_query = obj;
        if (search_query.F_TCD) { 
            query['tourCode'] = search_query.F_TCD; 
        }
        
        if (search_query.bookingDate) { 
            var date7 = baseExporter.convertToDateNew(search_query.bookingDate.split(' - ')[0]);
            date7.setHours(0, 0, 0);
            var date8 = baseExporter.convertToDateNew(search_query.bookingDate.split(' - ')[1]);
            date8.setHours(23, 59, 59);
            query['bookingDate'] ={$exists:true,$gt:date7,$lt:date8}; 
        }
        if (search_query.travelDate) { 
            var date9 = baseExporter.convertToDateNew(search_query.travelDate.split(' - ')[0]);
            date9.setHours(0, 0, 0);
            var date6 = baseExporter.convertToDateNew(search_query.travelDate.split(' - ')[1]);
            date6.setHours(23, 59, 59);
            query['tourStartDate'] ={$exists:true,$gt:date9,$lt:date6}; 
        }
    }
}

*//