var http=require('http');
var fs = require('fs');
var qs=require('querystring');


var str = fs.readFileSync('phone.html');
//console.log('html:   \n\n'+str);
var post_data={"width":100,"head":"false","encode":"true","html":encodeURIComponent(str)};//这是需要提交的数据
var content=qs.stringify(post_data);
//content = "html="+str;
//console.log(content);

var options = {
  host: '127.0.0.1',
  port: 3000,
  path: '/api/html2image/',
  method: 'POST',
  headers:{
  'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
  'Content-Length':content.length,
  }
};

 
var req = http.request(options, function(res) {
  //console.log(res);
   var chunks='';
   var size = 0;
  res.on('data', function(chunk){
    chunks+=chunk;
     console.log("chunk: "+chunk);
  });
  res.on('end', function(){
     //var imageData = Buffer.concat(chunks,size);
     //fs.writeFileSync('outoutout.jpg', imageData,"binary");
     console.log(chunks);
   });
});
req.write(content);
//console.log(content +'\n');
req.end();