#ECXServeice


Current API----------------------------------
  POST route: /api/upload/image
  parameter: 
         file (from dropzone form)
         parenturl (upload to which directory)
  success return: {path:pathobject}
  error return:{error:errmsg}

  POST route: /api/upload/folder
  parameter: 
         foldername (string)
         parenturl (add to which directory)
  success return: {path:pathobject}
  error return:{error:errmsg}

  GET route: /api/path/folder?url=/
  parameter:
         url (the folder path as:  /user1/image)
  success return: {items:[pathobj1,pathobj2,pathobj3...]}
  noneExisted folder return: {error:cannot find this folder!}
  error  return:{error:errmsg}


  GET route: /api/path/image?url=/index.gif
  parameter:
         url (the image path as /index.gif)
  success return: image content pipe to request
  noneExisted image return:{error:cannot find this image!}
  error return:{error:errmsg}

---------------------------------------------------------------

mongodb reference
http://mongodb.github.io/node-mongodb-native/contents.html#

node reference
http://shouce.w3cfuns.com/nodejs/all.html

mongodb dao rewrited.
Now:
request->new connection->process->close connection -> response