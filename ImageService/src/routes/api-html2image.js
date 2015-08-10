var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var MongoDAO = require('../database/mongoDAO');
var util = require('../util');
var phantom = require('phantom-render-stream');
var stream = require('stream');
var crypto = require('crypto');
var policyManager = require('../components/PolicyManager');


router.post('/', function(req, res) {
    //console.log(req);
    console.log('--------------------------------');
    console.log('POST /api/html2image/');

    req.pipe(req.busboy);
    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + val);
      if(!req.params.body){
        req.params.body = {};
      }
      req.params.body[fieldname] = val;
    });

    req.busboy.on('finish', function() {
        //console.log(req.params.body);
        var encode = req.params.body.encode;
        var html;
        if(encode === "true")
            html = decodeURIComponent(req.params.body.html);
        else
            html = (req.params.body.html);

        var head = req.params.body.head;
        if(head === "true"){

        }else{
            html = '<html><head><meta charset="UTF-8"></head><body style="margin:0;">'
            + html + '</body style="background-color:#fff;"></html>';
            console.log('add head ...');
        }

        var width = 0;
        if(req.params.body.width){
            width = req.params.body.width;
        }

        //var content = req.params.body.content;
        if(!html){
            util.sendError(res,'Need the html content!');
            return;
        }



        var render = phantom();

        //render a website url
        console.log('start');

        
        var s = new stream.Readable();
        s._read = function noop() {};
        s.push(html);
        s.push(null);

        res.setHeader('Content-Type', 'image/jpeg'); 
        //res.setHeader('content-disposition', "attachment; filename="+encodeURIComponent(filename)); 
        //console.log("res.header Content-Type:" + result.type + " " + 'content-disposition:' + "attachment; filename="+filename); 

        var imagestream;
        imagestream = s.pipe(render( {format:'jpeg', printMedia :true,quality: '100', width: 100,height:100,maxErrors:10,timeout:30000}));
        imagestream.on('error', function(e){
            console.error("ERR!!!!"+e);
            util.sendError(res,e);
            return;
        });

        //imagestream.pipe(fs.createWriteStream('out.jpg'));
        var out = new stream.Writable();
        imagestream.pipe(out);
        // out.pipe = function(dest) {
        //  dest.write('your string')
        // }
        //out.push(imagestream);

        console.log('begin to pipe to buffer...');
        var chunks=[];
        var size = 0;
        out.write = function(chunk) { // 当有数据流出时，写入数据
            chunks.push(chunk);
            size += chunk.length;
            console.log('new Chunk!');
        }
        out.end = function() { // 当没有数据时，关闭数据流
            console.log('end Chunk! size='+size);
            var imageData = Buffer.concat(chunks,size);
            //console.log(imageData);
            

            policyManager.ProcessHTML2Image(imageData,width,function(err,imageData2){
                 if(err){
                     util.sendError(res,err,dao);
                     return;
                 }
                fs.writeFileSync('out.jpg', imageData2,"binary");
                var dao = new MongoDAO();
                dao.init(function(err,results){
                    if(err){
                        util.sendError(res,err,dao);
                        return;
                    }
                    var md5 = crypto.createHash('md5');
                    md5.update(imageData2);
                    var md5str = md5.digest('hex');
                    console.log('html2image: generating '+'/phone/'+md5str+'.jpg');

                    


                    dao.pathModel.addPathImage('/phone',md5str+'.jpg',null,'image/jpeg',null,imageData2,function(err,result){
                        //console.log("addpathimage:"+result);
                        if(err){
                            util.sendError(res,err,dao);
                            return;
                        }
                        console.log('success: generating '+'/phone/'+md5str+'.jpg');
                        res.send('/phone/'+md5str+'.jpg');
                        res.end();
                    });
                });
            });

             
        }
    });    
});
module.exports = router;