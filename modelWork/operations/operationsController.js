// gridGuestTourDetail: async function (req, res) {
//     try {
//         console.log(req.body);
//         var query = {};
//         var limit = req.body.limit ? parseInt(req.body.limit) : 500;
//         var search_by = req.body.search_by ? req.body.search_by : "";
//         var sort_by = req.body.sort_by ? req.body.sort_by : "enquiry_date";
//         var order = req.body.order ? req.body.order : "asc";
//         var page = req.body.page ? parseInt(req.body.page) : 0;
//         var columns = req.body.columns ? req.body.columns : [];
//         var filter_columns = {};
//         var draw = req.body.draw ? parseInt(req.body.draw) : 1;
//         var start = req.body.start ? parseInt(req.body.start) : 0;

//         if (req.body.search_query) {
//             var search_query = req.body.search_query;

//         } else {
//         }
//         var table_format = req.body.table_format ? req.body.table_format : "datatable";
//         console.log()

//         q.all(baseExport.grid('OPSDATA', columns, page, search_by, sort_by, order, query, limit, start, draw, "", table_format)).then(function (result) {
//             console.log("jjjjjjjjjjjjjjjjjjjjjjjjres1", result)
//             res.json(result);
//         });


//     } catch (err) {
//         console.log(err)

//     }
// },
