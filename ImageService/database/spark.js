var spark = require('../public/js/spark-md5.min');
var fs = require('fs');

//f3cf7e65f37cede3703957b44065fcb9 

var hexHash = spark.hash('Hi there'); 
console.log(hexHash);