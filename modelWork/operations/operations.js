// ============================
//OPSDATA
//-----------fetch---------------------------
router.get('/guestData', function(req, res) {
    try{
        OPSDATAModel.find({},function(err,data){
            if(err){
                console.log(err);
                res.send(err);
            } 
            data=JSON.parse(JSON.stringify(data));
          //  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhdata" ,data)
            
            res.render('operations/guestDetails',{
                "username" : req.session.user.cn,
               "rsid":req.session.user.uid,
                "profile_path" : '/AdminLTE/dist/img/user2-160x160.jpg',
                "menu" : req.session.menu,
                "userPerm":data,
                "title": 'Tour Guest Details'
            },function(err,html){
                if(err){
                    console.log(err);
                    res.send(err);
                }
                res.send(html);
            });
        });
    }catch(e){
        console.log(e);
    }
});



//-----------guest tour Details fetch---------------------------
router.post('/gridGuestTourDetail',function(req, res) {
     console.log("gridGuestTourDetail");
    controller.gridGuestTourDetail(req, res);
});