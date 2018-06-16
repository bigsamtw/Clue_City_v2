let express = require('express');
let router = express.Router();

let bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});

let Promise = require("es6-promise").Promise;
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
    team = req.body.name; 
});

router.post('/teammate', urlencodedParser,function(req,res){
    let mongoCollection = "team";
    let teammate = req.body ;
    mongoOperation.addteammate( mongoCollection , team , teammate);
    res.send(team);
});

router.post('/signal', urlencodedParser, function(req,res){
    var mongoCollection = "user";
    let object = mongoOperation.mongoFindinvite(mongoCollection, be_sender_id);
    object.then((val)=>{
      res.send(val);
    });
});

router.post('/checkresponse', urlencodedParser,function(req,res){
    var mongoCollection = "user";
    let object = mongoOperation.mongoFind_checkresponse(mongoCollection,sender_info);
    object.then((val)=>{
      res.send(val);
    });
});

router.post('/invite', urlencodedParser,function(req,res){ //ok

      sender_info = req.body.sender;
      be_sender_id = {sender:"994408210718019",to:"2054568394572464"};      
    let receiver = req.body.to;
    let mongoCollection = "user";
    mongoOperation.invitation( mongoCollection , receiver ,req.body);
});

router.post('/tellteam',urlencodedParser,function(req,req){     
    let mongoCollection = "team";
    let entry = {clicked : '1'};
    mongoOperation.addteammate( mongoCollection , team , entry);
})

router.post('/teamstart', urlencodedParser,function(req,res){

    let mongoCollection = "team";
    let promise = mongoOperation.mongoFindstart( mongoCollection , team);
    promise.then((val)=>{
      res.send(val);
    })
});
module.exports = router;
