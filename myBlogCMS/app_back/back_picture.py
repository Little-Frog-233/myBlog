# coding:utf-8
import os
import sys
import json
import configparser
from flask import make_response, Response, jsonify, request
from flask_restful import Api, Resource, reqparse, abort
from werkzeug.datastructures import FileStorage
from pypinyin import lazy_pinyin
from werkzeug import secure_filename
from Logger import log
from tools.other_tools.picture_hash_tools import getHash
from tools.other_tools.picture_tools import getSmallPictureTools

current_path = os.path.realpath(__file__)
root_path = os.path.dirname(os.path.dirname(current_path))
cfp_path = os.path.join(os.path.dirname(root_path), 'conf/cms.conf')
cfp = configparser.ConfigParser()
cfp.read(cfp_path, encoding='utf-8')
file_path = cfp.get('flask', 'file_path')
root_url = cfp.get('flask', 'cms_root_url')
picture_path = os.path.join(file_path, 'picture')


class Picture(Resource):
	'''
	单个图片的上传和删除接口
	'''
	def post(self):
		parser = reqparse.RequestParser()
		parser.add_argument('editormd-image-file', type=FileStorage, location='files')
		parser.add_argument('file', type=FileStorage, location='files')
		args = parser.parse_args()
		file = args['editormd-image-file']
		if not file:
			file = args['file']
		if not file:
			return {
						'status_code': 400,
				       'success': 0,
				       'message': 'file is None'
			       }, 400, {"Content-Type": 'text/html', "X-Frame-Options": "SAMEORIGIN"}
		filename = secure_filename(''.join(lazy_pinyin(file.filename)))
		# filename_stuff = filename.split('.')[-1]
		# filename = getHash() + '.' + filename_stuff
		file_path = os.path.join(picture_path, filename)
		if os.path.exists(file_path):
			return {
				       'status_code': 200,
				       'success': 1,
				       'message': 'file already exists',
				       'url': root_url + "/show/picture/?filename=" + filename
			       }, 201, {"Content-Type": 'text/html', "X-Frame-Options": "SAMEORIGIN"}
		file.save(file_path)
		# getSmallPictureTools(file_path, file_path, length=300)
		return {
					'status_code': 200,
			       'success': 1,
			       'message': '',
			       'url': root_url + "/show/picture/?filename=" + filename
		       }, 201, {"Content-Type": 'text/html', "X-Frame-Options": "SAMEORIGIN"}

	def delete(self):
		parser = reqparse.RequestParser()
		parser.add_argument('filename', type=str)
		args = parser.parse_args()
		filename = args['filename']
		file_path = os.path.join(picture_path, filename)
		if not os.path.exists(file_path):
			return {'status_code': 400, 'message': 'picture doesn\'t exist'}, 400
		os.remove(file_path)
		return {'status_code': 200, 'message': 'delete successfully'}, 200


if __name__ == '__main__':
	print(root_path)
