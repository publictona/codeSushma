/*
//mobile
                                    <div class="form-group row col-sm-12">
                                        <label for="ship_to_mobile" class="col-sm-4 col-form-label fs15--design">Ship To Mobile</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" id="ship_to_mobile" name="ship_tomobile" 
                                                   minlength="10" 
                                                   maxlength="10"
                                                   title="Mobile number must have exactly 10 digits." />
                                        </div>
                                    </div>

//date
                                    <div class="form-group row col-sm-12">
                                        <label for="" class="col-sm-4 col-form-label fs15--design">Ship Date:</label>
                                        <div class="col-sm-8">
                                            <input type="date" class="form-control date-picker" id="dateNow"
                                                name="ship_date" placeholder="Enter Refiling Due Date" required />
                                        </div>
                                    </div>


//time
                                    <div class="form-group row col-sm-12">
                                        <label for="appt" class="col-sm-4 col-form-label fs15--design">Select a Ship
                                            Time:</label>
                                        <div class="col-sm-8">
                                            <input type="time" class="form-control" id="appt" name="ship_time"
                                                required />
                                        </div>
                                    </div>

//uppercase
                                          <div class="form-group row col-sm-12">
                                        <label for="" class="col-sm-4 col-form-label fs15--design">Ship From
                                            City:</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" id="ship_fromcity"
                                                name="ship_fromcity" oninput="this.value = this.value.toUpperCase();" />
                                        </div>
                                    </div>

 //pincode                                   

                                    <div class="form-group row col-sm-12">
                                        <label for="" class="col-sm-4 col-form-label fs15--design">Ship From
                                            PinCode:</label>
                                        <div class="col-sm-8">
                                            <input type="number" class="form-control" id="" name="ship_frompincode"
                                                minlength="6" maxlength="6" pattern="\d{6}" />
                                        </div>
                                    </div>

                                    */


/*
getSupplier: function (req, res) {
     var F_CATCODE = req.params.cat;
     var F_PLACECD = req.params.place;
     //var F_PLACECD = req.params.place;
     model.find(({ F_CATCODE: F_CATCODE, F_PLACECD: F_PLACECD }), function (err, data) {
         if (err) {
             res.status(500).json({ status: false, msg: err });
         }
         // console.log("datadatadata",data)
         res.status(200).json({ status: 200, data: data });
     }).select("F_NAME F_PLACECD F_CATCODE")
 }


  getPlaces: function (req, res) {
var F_CATCODE = req.params.id;
model.find({ F_CATCODE: F_CATCODE }).distinct(("F_PLACECD"), function (err, data) {
if (err) {
res.status(500).json({ status: false, msg: err });
}
console.log("datadatadata", data)
res.status(200).json({ status: true, data: data });
})
},
 */


//sort dataTable

// gridData only write
var sort_by = "_id";
var order = "desc";
//end

//var sort_by = sort_by ? sort_by : "_id"; //req.body.sort;
var sort_by = "_id"; wrong
var order = "desc";
//var order = req.body.order ? req.body.order : "desc";

//dateFormat

//  {
//     data: "DC_DATE",
//     sTitle: "Date#",
//     visible: true,
//     className: "fs14--design column-12",
//     render: function (data, type, row) {
//         var html = "";
//         return dateFormat(row.DC_DATE);
//     }

// },

// get Data From Other Collection DropDown
// function getReasons() {
//     $.get("/route/dishonouredChq/getReasonsMaster", function (result) {
//         var category_json = "";
//         if (result.length > 0) {
//             category_json = '<option value="">Select Reason</option>'
//             for (var i = 0; i < result.length; i++) {
//                 if (result[i] && result[i] != "" && result[i] != "XXXXXXXXXXXX") {
//                     // console.log(result[i], "result hiii")
//                     if (result[i]) {
//                         //category_json += '<option value="' + result[i] + '">' + result[i] + '</option>';
//                         category_json += '<option value="' + result[i].REAS_DS + '">' + result[i].REAS_DS + '</option>';
//                     }
//                 }
//             }
//         } else {
//             category_json = "";
//         }
//         $('.REAS_DS').html(category_json);
//     });


    //     .spa-loc span{
    //         width: 100% !important;
    //     }

    //     <div class="form-group row col-sm-12">
    //     <label for="" class="col-sm-4 col-form-label fs15--design">SPA Location </label>

    //     <div class="col-sm-8 spa-loc">

    //             <select class="form-control branchCodeGlobal "  name="F_SPALOCN[]" data-placeholder="Choose anything" multiple>

    //             </select>


    //     </div>
    // </div>


// }

// show_TRANNO_details: function(req, res) {
//     var id = req.params.id;
//     JBRK_DTLModel.find({ F_MSTNO: parseInt(id) }).exec(function (err, result1) {
//         if (err) {
//             return res.json(500, {
//                 message: 'Error getting details.'
//             });
//         }
//         console.log("resultresult", result1)
//         res.status(200).json({ status: 200, data: result1 });
//         // var result = JSON.stringify(result1); 
//     })
// }

//if I want to add any value which is hidden  type and i want to push in a data object i e formData
//http://localhost:5002/route/STMaster/master#

// formData.F_TYPE = $('#F_TYPE').val();

// // and I want to set type and then get Department and anything

// <form id="frm_grid_search1">
//     <input type="hidden" name="F_TYPE" id="F_TYPE" value="Department">
// </form>

// //====================================gridData =================================================
// if (req.body.search_query) {
//     var search_query = req.body.search_query;

//     if (search_query.F_TYPE) {
//         query.F_TYPE = search_query.F_TYPE;
//     }
// } else {
// }


// //=========================gridData from And To Date Filter=====================================================
// if (req.body.search_query) {

//     var search_query = req.body.search_query;
//     if (search_query.fromDt) {
//         query.tranDt = { $gte: baseExport.convertToDateNew(baseExport.dateFormat(new Date(search_query.fromDt))) }
//     }
//     if (search_query.toDt) {
//         query.tranDt = { $lte: baseExport.convertToDateNew(baseExport.dateFormat(new Date(search_query.toDt))) }
//     }

//     if (search_query.fromDt && search_query.toDt) {
//         query.tranDt = { $gte: baseExport.convertToDateNew(baseExport.dateFormat(new Date(search_query.fromDt))), $lte: baseExport.convertToDateNew(baseExport.dateFormat(new Date(search_query.toDt))) }
//     }
//     console.log(search_query);
// } else {
// }

// //-----------------AJAX BINDING   POST REQUEST ID--------------------------------------------
// function setStatus(id) {
//                 var obj = {};
//                 var _id = id.getAttribute('data-id');
//                 obj.STATUS = id.value;

//                 if (obj.STATUS) {
//                     $.ajax({
                    
//                         url: "/route/commonReceipt/checkStatus/" + _id,
//                         type: "post",
//                         contentType: "application/json; charset=utf-8",
//                         data: JSON.stringify(obj),
//                         dataType: "json",
//                         success: function (result) {
//                           //  console.log("statusssssssssssss",result);
//                             notification({ type: "success", message: "Successfully marked Status" });
//                             DrawTableInquiry.ajax.reload();
//                         }
//                     });
//                 }
//             }


// //====================dATAtABLE===========================REMEMBER dATA pASS==> data-id="' + row._id + '"
// data: "STATUS",
//                     sTitle: "Status",
//                     visible: true,
//                     className: "col-350",
//                     render: function (data, type, row) {
//                         var html = '<select class="form-control status" data-id="' + row._id + '" onchange="setStatus(this)">';
//                         html += '<option value=""></option>';
//                         html += '<option value="Pending" ' + ((row.STATUS && row.STATUS === "Pending") ? selected = "selected" : "") + '>Pending</option>';
//                         html += '<option value="In-Progress" ' + ((row.STATUS && row.STATUS === "In-Progress") ? selected = "selected" : "") + '>In-Progress</option>';
//                         html += '<option value="Cancelled" ' + ((row.STATUS && row.STATUS === "Cancelled") ? selected = "selected" : "") + '>Cancelled</option>';
//                         html += '<option value="Invalid" ' + ((row.STATUS && row.STATUS === "Invalid") ? selected = "selected" : "") + '>Invalid</option>';
                       
//                         html += '</select>';
//                         return html;
//                     }



//    //--------------------SUKHOTHAI---------------------------------------- 
//    //CREATE
//    "created_on":new Date(),
//    "created_by":req.session.user.F21_IDNO,    

//    //UPDATE  
//    obj.updated_on=new Date();
//    obj.updated_by=req.session.user.F21_IDNO;


   
//    //-----------------GRIDDATA filter by branch  on dataTable---------------------------------------
//    http://localhost:5002/route/addStockReq/master
//    var query = {ST_BRN :req.session.user.ST_BRN};

//    //==============================================================
//    2024-8-0004.pdf

//    //====================================IMG==========REMEMBER path===============
//    <img src="/assets/images/pdfAssets/call-2.png" style="width: 18px; margin-right: 6px;" />

//    //=============================SCROLL datatable=================================
//    .scroll-tb{
//         overflow-y: scroll;
//         height: 72vh;
//     }


//     //----------------------button EDIT LINK----------------------------------
//                     {
//                         data: "tranNo",
//                         sTitle: "Id",
//                         visible: true,
//                         render: function (data, type, row) {
//                             var html =
//                                 ' <a style="color:purple" data-id="' + row
//                                     .tranNo +
//                                 '" onclick="updataDealMaster(this) " >' + row.tranNo + '</a>';
//                             return html;
//                         }
//                     },



// render: function (data, type, row) {
//     //console.log(row);
//     var html =
//         ' <a style="color:purple" data-id="' + row
//             ._id +
//         '" onclick="getUser(this) ">' + row.candidateName + '</a>';
//     return html;
// }

// //---------------------------on tranano EDIT-----------------------------

// {
//     data: "tranNo",
//     sTitle: "Id",
//     visible: true,
//     render: function (data, type, row) {
//         var html =
//             ' <a style="color:purple" data-id="' + row
//                 .tranNo +
//             '" onclick="getUser(this) " >' + row.tranNo + '</a>';
//         return html;
//     }
// },

// <div class="card scroll-tb"></div>

//------------------------------------------------------------------------
 //For Date SEARCH IN mongodb
// {
//     "F31_APPTDT": {
//         "$gte": ISODate("2024-01-01T00:00:00.000Z"),
//         "$lt": ISODate("2024-01-31T00:00:00.000Z")
//     }
// }

//-----------------------xls file------------------------------------------------------
<script src="//cdn.rawgit.com/rainabba/jquery-table2excel/1.1.0/dist/jquery.table2excel.min.js">
</script>

function createXls(val) {
    $("#" + val).table2excel({
      filename: "groomingReport.xls"
    });
  }

  <span class="btn btn-success mb-4" onclick="createXls('GroomingReportTable')"><i
  class="fa fa-file-excel-o"></i> Generate XLS</span>


  //-------------------------Normal filter Object-----------------------------------------------
  // POST API
   getFeedbackView: function (req, res) {
    try {
        var obj = req.body;
        var query = {};
        if (obj.category) {
            query["feedBack_Category"] = obj.category;
        }

        if (obj.date) {
            query["feedbackDate"] = baseExport.convertToDateNew(obj.date);
        }

        if (obj.tourcode) {
            query["tcd"] = obj.tourcode;
        }

        if (obj.zone) {
            query["zone"] = obj.zone;
        }

        if (obj.feedBackLink) {
            query["feedBackLink"] = {
                $elemMatch: { feedBack_Rating: obj.feedBackLink.feedBack_Rating }
            };
        }

        console.log(query);
        rsModel.guestWebFeedBackModel.find(query, {}, { sort: { feedBackDate: -1 } }, function (err, fbData) {
            if (err) {
                res.status(500).json({ msg: err });
            } else {
                fbData = JSON.parse(JSON.stringify(fbData));
                res.status(200).json({ status: true, data: fbData, message: "FeedBack Get Successfully" });
            }
        }) 
    } catch (err) {
        console.log(err);
    }

}

//EJS BINDING

function getFeedback() {

    const obj = {
        category: $('.masterType').val(),
        date: $('.feedbackDate').val(),
        tourcode: $('.tourcode').val(),
        zone: $('.zone').val(),
        feedBackLink: getFeedBackLinkValue()
    };

    console.log("Fetching feedback with:", obj);

    $.ajax({
        url: "/route/feedBackLink/getFeedbackView",
        type: "post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (result) {
            console.log(result.data)
            if (result.data) {
                renderFeedbackTable(result.data);
                //  bindFilterOptions(result.data); // Bind ratings to dropdown
            } else {
                $('#guestFeedback tbody').html('<tr><td colspan="7" class="text-center">No feedback available.</td></tr>');
            }
        },
        error: function (err) {
            console.error("Error fetching feedback:", err);
            alert('Failed to fetch feedback. Please try again.');
        }
    });
}


//HTML 

<div class="hamburger-content">
<form id="frm_grid_search" name="frm_grid_search">
    <div class="bgff">
        <label>TOURCODE</label>
        <input type="text" class="form-control tourcode" name="tourcode" />
    </div>
    <div class="bgff">
        <label>Feedback Type</label>
        <select class="form-control masterType" name="masterType">
            <option value=""></option>
            <option value="BEFORE TOUR">BEFORE TOUR</option>
            <option value="ON TOUR">ON TOUR</option>
            <option value="AFTER TOUR">AFTER TOUR</option>
        </select>
    </div>
    <div class="bgff">
        <label>Feedback Date</label>
        <input type="text" class="form-control datepicker feedbackDate" name="fromCallNumber" />
    </div>

    <div class="bgff">
        <label>Zone</label>
        <input type="text" class="form-control zone" name="zone" />
    </div>

    <div class="bgff">
        <label>Rating</label>
        <input type="text" class="form-control feedBackLink" name="feedBackLink" />

    </div>

    <div class="bgff">
        <span class="btn btn-primary btn-guest height-30 btn-block" onclick="getFeedback()"
            style="">SEARCH</span>

    </div>
</form>
</div>

//--------------------------------------------------------------------------------
