let express = require('express');
let router = express.Router();

let bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});

let mongoOperation = require("../../cluescity/mongo-express/main.js");
let mongoCollection = "user";

router.get('/',function(req,res){
  res.sendFile('result.html', {
    root : 'CluesCity'
  });
});

router.post('/result', urlencodedParser,function(req,res){
          
//      mongoOperation.mongoFind( mongoCollection , req.body);
});

module.exports = router;