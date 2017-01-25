var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
// post请求会用到
var bodyParser = require('body-parser');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
// parse application/json
app.use(bodyParser.json()); // request entity too large
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置请求头
// application/json  接口返回json数据
// charset=utf-8 解决json数据中中文乱码
app.use("*", function(req, res, next) {
	// 可以跨域
	res.header("Access-Control-Allow-Origin", "http://XX.XX.com");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 4.2.1')
	res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
	next();
});

var index = require('./routes/index');
var users = require('./routes/users');
var upload = require('./routes/upload');

// 路由
app.use('/', index);
app.use('/', users);
app.use('/', upload);

// 404 错误
var errorData_404 = {
	status: '404', 
	msg: 'Not Found!',
};
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.end(JSON.stringify(errorData_404));
});

// 500 
var errorData_500 = {
	status: '500', 
	msg: 'Not Found!',
};
app.use(function(err, req, res, next) {
  errorData_500.msg =  err.message;
  res.end(JSON.stringify(errorData_500));
});

module.exports = app;
