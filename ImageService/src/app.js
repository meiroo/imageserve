var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var fs = require('fs');
var index = require('./routes/index');
var api_upload = require('./routes/api-upload');
var api_path = require('./routes/api-path');
var api_remove = require('./routes/api-remove');
var api_update = require('./routes/api-update');
var api_html2image = require('./routes/api-html2image');
var log = require('./log');  


//var dtest = require('./database/unittest');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// setup the logger
//var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
//app.use(logger('dev', {stream: accessLogStream}))
app.use(logger('dev'));
log.use(app);



//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(busboy()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

//  POST route: /api/upload/image
//  parameter: 
//         file (from dropzone form)
//         parenturl (upload to which directory)
//  success return: {path:pathobject}
//  error return:{error:errmsg}

//  POST route: /api/upload/folder
//  parameter: 
//         foldername (string)
//         parenturl (add to which directory)
//  success return: {path:pathobject}
//  error return:{error:errmsg}
app.use('/api/upload', api_upload);
app.use('/api/html2image', api_html2image);


//  GET route: /api/path/folder?url=/
//  parameter:
//         url (the folder path as:  /user1/image)
//  success return: {items:[pathobj1,pathobj2,pathobj3...]}
//  noneExisted folder return: {error:cannot find this folder!}
//  error  return:{error:errmsg}


//  GET route: /api/path/image?url=/index.gif
//  parameter:
//         url (the image path as /index.gif)
//  success return: image content pipe to request
//  noneExisted image return:{error:cannot find this image!}
//  error return:{error:errmsg}
app.use('/api/path',api_path);

app.use('/api/update',api_update);

app.use('/api/remove',api_remove);

app.use('/imgapi',api_path);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log(err);
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.error('err='+JSON.stringify(err));
        res.end(err.status);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error('err500='+JSON.stringify(err));
    res.end(err.status);
});


module.exports = app;

app.set('port', process.env.PORT || 3000);


var server = app.listen(app.get('port'), function () {
    
    console.log('Express server listening on http://localhost:' + server.address().port);
});

