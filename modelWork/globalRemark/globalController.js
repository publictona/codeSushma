 // create: function (req, res) {
    //     try {
    //         var obj = req.body;
    //         var dataObj = {};
            
           
    //         dataObj.tourCode = obj.tourcode;
    //         dataObj.rem1=obj.rem1;
    //         dataObj.rem2=obj.rem2;
            
    //         // TM_REMRK1: String,
    //         // TM_REMRK2: String,
           
    //         dataObj.guests = []; 
    //         rsDataModel.historyModel.findOne({ F_TCD: obj.tourCode }).exec(function (err, tourMasData) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Error get Tourmas0 Data',
    //                     data: err,
    //                     success: false
    //                 });
    //             }
    //             var tourMasData = JSON.parse(JSON.stringify(tourMasData));
    //             console.log("tourMasDatatourMasData" , tourMasData)
               
    //                     return res.status(200).json({
    //                         message: 'Data Save',
    //                         data: tourMasData,
    //                         success: true
    //                     });
    //                 });

    //       } catch (e) {
    //         console.logh("errrrrrrrrrrrrr" , e)
    //         debug("############################+ERROR IS +##########################", e);
    //     }
    // },