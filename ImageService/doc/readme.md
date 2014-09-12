---------------
RESTful API

/upload
/get
/policy/type/src/...
	/img_process/resize/w/h/...
	/img_process/watermask/....



-----------------------------
页面 bootstrap（最简单情况）：
Login
某个图片数据区详细：列表，可上传下载。模仿七牛页面。


业务逻辑： 
上传下载：express
图片处理：imageMagick
图片存储：MangoDB？
认证：？？
login数据库：mangoDB

-------------Database----------------
+++++++++User+++++++++++++
userid
user_name
user_pass
user_type
description
registerTime

...
main_path(url)

++++++++Path+++++++++++++++
全路径
path_url : /usera/images/aaa.jpg
image_id : xxx
policy_type: xxx


++++++++Image++++++++++++(FileSystem/GridFS/*Collection*?) 
image_id : xxx
md5 :  xxx
image_type: xxx
content : BSON

++++++++++Policy++++++++
 id
 name
 type
 rule
 description
-----------------------------
NODE Express MongoDB gm