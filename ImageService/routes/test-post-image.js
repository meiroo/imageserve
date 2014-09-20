var http = require('http');
var equal = require('assert').equal;
var qs = require('querystring');
var fs = require('fs');
var util = require('util');
 

var boundary = '----' + new Date().getTime();
//console.log(boundary);
var data={parenturl:'/'}
var options = {

    host:'localhost',//远端服务器域名

    port:3000,//远端服务器端口号

    method:'POST',

    path:'/api/upload/image',//上传服务路径

    headers:{
        'Content-Type':'multipart/form-data; boundary=' + boundary,
        'Connection':'keep-alive',
        'Content-Length': 20000  ,
        'parenturl':'/'
    }

};

var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    equal(200, res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
 
    res.on('data',function (chunk) {
         console.log('BODY: ' + chunk);
    });
});

//console.log("begine");
//req.write(qs.stringify(data));
 
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

var mkfield = function (field, value) {
  return util.format('Content-Disposition: form-data; name="%s"\r\n\r\n%s\r\n', field, value);
}
var data = [];

data.push(mkfield('parenturl', '/'));

var body = 
    util.format('--%s\r\n', boundary)
    + data.join(util.format('\r\n--%s\r\n', boundary))
    + util.format('--%s\r\n', boundary)
    +util.format('Content-Disposition: form-data; name="file"; filename="%s"\r\n', 'app.js')
    +util.format('Content-Type: %s\r\n\r\n', 'text/plain');util.format('Content-Type: multipart/form-data; boundary=%s\r\n\r\n', boundary)
    + util.format('\r\n--%s', boundary);

console.log(body);
//req.write(qs.stringify(data));
req.write(body);

console.log('before end');
var fileStream = fs.createReadStream('./test.png',{bufferSize:18000});

    fileStream.pipe(req,{end:false});

    fileStream.on('end',function(){

        req.end('\r\n--' + boundary + '--');

    });
