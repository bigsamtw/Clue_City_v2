﻿var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
const fs = require('fs');
const http = require('http')
const querystring = require('querystring');
const bodyParser = require('body-parser');
const urlencoderParser = bodyParser.urlencoded({ extended: false })

var loginRouter = require('./routes/server');
var indexRouter = require('./routes/index');
var addfriendRouter = require('./routes/addfriend');
var hardRouter = require('./routes/hard');
var settingRouter = require('./routes/setting');
var mapRouter = require('./routes/map');
var resultRouter = require('./routes/result');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'CluesCity')));
app.use(express.static(__dirname + '/CluesCity'));


app.use('/profile', indexRouter);
app.use('/login',loginRouter);
app.use('/hard',hardRouter);
app.use('/friend',addfriendRouter);
app.use('/setting',settingRouter);
app.use('/map',mapRouter);
app.use('/result',resultRouter);

app.post("/upload", urlencoderParser, function (req, res) {
  req.setEncoding('binary');
  var body = '';   // 文件数据
  var fileName = '';  // 文件名
  // 边界字符串
  var boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
  req.on('data', function (chunk) {
    body += chunk;
  });

  req.on('end', function () {
    var file = querystring.parse(body, '\r\n', ':')

    // 只处理图片文件
    if (file['Content-Type'].indexOf("image") !== -1) {
      //获取文件名
      var fileInfo = file['Content-Disposition'].split('; ');
      for (value in fileInfo) {
        if (fileInfo[value].indexOf("filename=") != -1) {
          //fileName = fileInfo[value].substring(10, fileInfo[value].length-1);
          fileName = "./target.jpg"
          if (fileName.indexOf('\\') != -1) {
            //fileName = fileName.substring(fileName.lastIndexOf('\\')+1);
            fileName = "./target.jpg"
          }
          console.log("File Name : " + fileName);
        }
      }

      // 获取图片类型(如：image/gif 或 image/png))
      var entireData = body.toString();
      var contentTypeRegex = /Content-Type: image\/.*/;

      contentType = file['Content-Type'].substring(1);

      //获取文件二进制数据开始位置，即contentType的结尾
      var upperBoundary = entireData.indexOf(contentType) + contentType.length;
      var shorterData = entireData.substring(upperBoundary);

      // 替换开始位置的空格
      var binaryDataAlmost = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

      // 去除数据末尾的额外数据，即: "--"+ boundary + "--"
      var binaryData = binaryDataAlmost.substring(0, binaryDataAlmost.indexOf('--' + boundary + '--'));

      // 保存文件
      fs.writeFile(fileName, binaryData, 'binary', function (err) {
        console.log(err);
        // res.send('Image has been uploaded.');
      });
    } else {
      // res.send('只能上传图片文件');
    }
    
    runPython(res);

  })
})

function runPython(res) {
  console.log('Python is running')
  var spawn = require("child_process").spawn;
  var process = spawn('python3', ["./compare.py",]);
  process.stdout.on('data', function (data) {
    console.log(data.toString());
    res.send(data.toString());
  })
}


module.exports = app;
