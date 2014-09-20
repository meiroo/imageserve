import os
import re

#src_dir = 'D:\\src\\src\\M-GLEngine'
#src_dir = 'D:\\src\\TCLEngineAndroid\\example\\MS818_UI5.5\\jni'
src_dir = 'D:\\src\\ECXService\\ImageService'
exclude_dir = ['node_modules', 'obj','js']
#exclude_dir = ['freetype', 'GL', 'lib3ds', 'libpng']


#--------------------------------------------------
#--------------------------------------------------

_comment_line = re.compile('[\t\s]*//.*?\n',re.I)
_comment_line2 = re.compile('[\t\s]*/\*.*?\*/',re.I|re.S)
_empty_line = re.compile('[\t\s]*\n+?',re.I)

file_count = 0
code_count = 0


def printFileName(dir):
	list = os.listdir(dir)
	for item in list:
		itempath = os.path.join(dir,item)
		if not os.path.isfile(itempath):
			if item in exclude_dir:
				continue
			printFileName(itempath)
		else:
			name = os.path.splitext(item)[0]
			ext = os.path.splitext(item)[1]
			if ext not in ['.js']:
				continue
			print item


def getFileLine(itempath):
	f = open(itempath,'r')
	buffer = f.read()
	f.close()
	print 'ori-line: ',buffer.count('\n')+1

	buffer = _comment_line.sub('\n',buffer)
	buffer = _comment_line2.sub('\n',buffer)
	buffer = _empty_line.sub('\n',buffer)
	cc = buffer.count('\n')+1
	print 'code-line: ',cc
	global code_count
	code_count = code_count + cc


def printFileNameAndLine(dir):
	list = os.listdir(dir)
	for item in list:
		itempath = os.path.join(dir,item)
		if not os.path.isfile(itempath):
			if item in exclude_dir:
				continue
			printFileNameAndLine(itempath)
		else:
			name = os.path.splitext(item)[0]
			ext = os.path.splitext(item)[1]
			if ext not in ['.js','.JS','.html','.HTML']:
				continue

			global file_count
			file_count = file_count+1
			print file_count, ' :',itempath
			#if file_count == 1:
			getFileLine(itempath)


printFileNameAndLine(src_dir)
print 'final code_count ',code_count
