var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var util = require('../util');
var Github = require('github-api-meiroo');



router.get('/file', function(req, res) {
    var github = new Github({
          username: "meiroo",
          password: "meiro1412",
          auth: "basic"
        });

        var repo = github.getRepo('meiroo', 'javascript');

        repo.contents('master', "", function(err, contents) {
            console.log(req);
            if(err){
                util.sendError(res,err);
                return;
            }
            if (req.query && req.query.jsoncallback) { 
                var str =  req.query.jsoncallback + '(' + JSON.stringify(contents) + ')';//jsonp  
                res.end(str);  
              } else {  
                res.end(JSON.stringify(contents));//普通的json  
              }    

        }, true);
});


router.get('/write', function(req, res) {
 
       if(!req.query || !req.query.repo || !req.query.path || !req.query.content || !req.query.commitlog || !req.query.password){
            res.end(req.query.jsoncallback +'({err:"parameter unenough"})');
            return;
        }


        if(req.query.password !== 'meiro1412'){
            res.end(req.query.jsoncallback +'({err:"authentication failed."})');
            return;
        }


        var github = new Github({
          username: "meiroo",
          password: "meiro1412",
          auth: "basic"
        });

        var repo = github.getRepo('meiroo', req.query.repo);

        console.log('---------------');
        console.log(req.query.content);
        console.log('-.-.-.-------------');
        console.log(decodeURIComponent(req.query.content));
        
        repo.write('master', req.query.path, unescape(req.query.content), req.query.commitlog, function(err,contents) {
            if(err){
                res.status(500).end(req.query.jsoncallback +'('+res,err+')');
                return;
            }
            req.query.password = '******';
            if (req.query && req.query.jsoncallback) { 
                var str =  req.query.jsoncallback + '(' + JSON.stringify(req.query) + ')';//jsonp  
                res.end(str);  
            } else {  
               res.end(JSON.stringify(req.query));//普通的json  
            }
        });
});

module.exports = router;