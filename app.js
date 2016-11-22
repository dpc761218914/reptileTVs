var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var superagent = require('superagent');
var cheerio = require('cheerio');
var charset = require('superagent-charset');
charset(superagent);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//爬电视剧前台页面
app.get('/tv_name',function (req, res, next) {
    res.render("index",{title:"express"});
});

//处理请求
app.post('/getTvs',function (req, res, next) {
    var url=req.body.url;
    superagent.get(url)
      .charset('gb2312') //这里设置编码
      .end(function (err, sres) {
        if (err) {
          return next(err);
        }
        var $ = cheerio.load(sres.text);
        var items = "";
        $('tbody td a').each(function (index, element) {
          var $element = $(element);
            items=items+$element.attr('href')+"<br/>"//拼接HTML
        });
          res.send(items);
      });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
