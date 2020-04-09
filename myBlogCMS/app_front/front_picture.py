#coding:utf-8
import os
import sys
import configparser
import base64
from io import BytesIO
from flask import make_response, request, abort, redirect, url_for, session
from app_front import app_front_blue
from tools.mysql_tools.mysql_tools import *
from tools.other_tools.captcha_tools import get_verify_code
from Logger import log
from PIL import Image

current_path = os.path.realpath(__file__)
root_path = os.path.dirname(os.path.dirname(current_path))
cfp_path = os.path.join(os.path.dirname(root_path), 'conf/cms.conf')
cfp = configparser.ConfigParser()
cfp.read(cfp_path, encoding='utf-8')
file_path = cfp.get('flask', 'file_path')

# 图片保存路径
picture_path = os.path.join(file_path, 'picture')
# logo保存路径
logo_path = os.path.join(file_path, 'logo')
# 用户图片保存路径
logouser_path = os.path.join(file_path, 'logouser')

@app_front_blue.route('/show/picture/')
def showPicture():
	'''

	:return:
	'''
	filename = request.args.get('filename')
	width = request.args.get('width')
	height = request.args.get('height')
	if not filename:
		abort(404)
	try:
		if width or height:
			img = Image.open(os.path.join(picture_path, '%s' % filename))
			if width and height:
				width = int(width)
				height = int(height)
				out = img.resize((width, height))

			elif width:
				width = int(width)
				img_width, img_height = img.size
				if img_width >= width:
					times = img_width // width
				else:
					times = 1
				out = img.resize((img_width // times, img_height // times))
			else:
				height = int(height)
				img_width, img_height = img.size
				if img_height >= height:
					times = img_height // height
				else:
					times = 1
				out = img.resize((img_width // times, img_height // times))
			f = BytesIO()
			out.save(f, 'png')
			f.seek(0)
			response = make_response(f.read())
			response.headers['Content-Type'] = 'image/%s' % 'png'
			return response
		else:
			image_data = open(os.path.join(picture_path, '%s' % filename), "rb").read()
			image_suff = filename.split('.')[-1]
			response = make_response(image_data)
			response.headers['Content-Type'] = 'image/%s' % image_suff
			return response
	except Exception as e:
		function_name = sys._getframe().f_code.co_name
		msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
		log(function_name).logger.error(msg)
		abort(404)

@app_front_blue.route('/show/logo/<string:filename>', methods=['GET'])
def showLogo(filename):
	'''
	展示logo
	:param filename:
	:return:
	'''
	file_dir = logo_path
	if request.method == 'GET':
		if filename is None:
			pass
		else:
			try:
				image_data = open(os.path.join(file_dir, '%s' % filename), "rb").read()
				response = make_response(image_data)
				response.headers['Content-Type'] = 'image/png'
				return response
			except:
				return redirect(url_for('app_front.showLogo', filename='upload_photo.jpg'))
	else:
		pass

@app_front_blue.route('/show/logouser/<string:username>', methods=['GET'])
def showLogouser(username):
	'''
	展示用户头像
	:param username:
	:return:
	'''
	file_dir = logouser_path
	# filename = username
	if request.method == 'GET':
		if username is None:
			pass
		else:
			try:
				filename = getManagerLogo(username)
				image_data = open(os.path.join(file_dir, '%s' % filename), "rb").read()
				response = make_response(image_data)
				response.headers['Content-Type'] = 'image/png'
				return response
			except:
				return redirect(url_for('app_front.showLogo', filename='upload_photo.jpg'))
	else:
		pass

@app_front_blue.route('/captcha/')
def graph_captcha():
	image, code = get_verify_code()
	out = BytesIO() # 在内存中读写bytes
	image.save(out, 'png')
	image.close()
	out.seek(0)
	resp = make_response(out.read())
	resp.content_type = 'image/png'
	code = code.lower()
	if 'captcha' in session:
		session.pop('captcha', None)
	session['captcha'] = code
	return resp