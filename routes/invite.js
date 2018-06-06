
let express = require('express');
let router = express.Router();

let bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});

let mongoOperation = require("../../cluescity/mongo-express/main.js");
var sender_info = "sender_info"; 
var be_sender_id = "be_sender_id" ; 
var team;

router.use(bodyParser.json());

router.get('/',function(req,res){
  res.sendFile('invite.html', {
    root : 'public'
  });
});

router.post('/team', urlencodedParser,function(req,res){
    let mongoCollection = "team";
    team = req.body; 
    mongoOperation.mongoFind( mongoCollection , req.body);
});

router.post('/teammate', urlencodedParser,function(req,res){
    let mongoCollection = "team";
    mongoOperation.addteammate( mongoCollection , team , req.body);
});

router.post('/signal', urlencodedParser, function(req,res,callback){
    console.log("--------------------------------------");
    console.log(be_sender_id);
    console.log("--------------------------------------");
    let data;

    var get_data = findinvite(be_sender_id);
    get_data.then( function(resolve,reject){
      console.log("tttttttttttttttttttttttttttttttttttttttt");
      console.log(resolve);
      res.send(resolve);
    });
});

function findinvite(be_sender_id){
    var mongoCollection = "user";
      return new Promise((resolve,reject)=> { 
        data = mongoOperation.mongoFindinvite(mongoCollection, be_sender_id);    
        resolve(data);
      });

}

router.post('/checkresponse', urlencodedParser,function(req,res,callback){
    var mongoCollection = "user";
    console.log("test");
    let data = mongoOperation.mongoFind_checkresponse( mongoCollection , sender_info);
      res.send(data);
});

router.post('/invite', urlencodedParser,function(req,res){ //ok
      sender_info = req.body.sender;
      be_sender_id = req.body.to;      
    let receiver = req.body.to;
    let mongoCollection = "user";
    mongoOperation.invitation( mongoCollection , receiver ,req.body);
});

module.exports = router;
