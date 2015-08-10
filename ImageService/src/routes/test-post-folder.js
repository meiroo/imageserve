var http=require('http');
var qs=require('querystring');
 
var post_data={parenturl:'/',url:'newfolder3'};//这是需要提交的数据
var content=qs.stringify(post_data);

var options = {
  host: '127.0.0.1',
  port: 3000,
  path: '/api/upload/folder',
  method: 'POST',
  headers:{
  'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
  'Content-Length':content.length,
  //'Connection':'keep-alive',
  //'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp'
  }
};
//console.log("post options:\n",options);
//console.log("content:",content);
//console.log("\n");
 
var req = http.request(options, function(res) {
  //console.log("statusCode: ", res.statusCode);
  //console.log("headers: ", res.headers);
  var _data='';
  res.on('data', function(chunk){
     _data += chunk;
  });
  res.on('end', function(){
     console.log("\n--->>\nresult:",_data)
   });
});
req.write(content);
console.log(content +'\n');
req.end();