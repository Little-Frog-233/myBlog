from flask import session
from flask_restful import Resource, reqparse, abort
from tools.mysql_tools.mysql_tools import *

class Manager(Resource):
	def get(self):
		'''

		:return:
		'''
		if 'user_id' in session:
			user_id = session['user_id']
		else:
			return {
				'status_code': 400,
				'message': '',
				'category_list': []
			}, 400
		manager_message = getManagerMessage(user_id=user_id)
		if manager_message is not None:
			return {
				'status_code': 200,
				'message': '',
				'manager': manager_message
			}
		else:
			return {
				'status_code': 400,
				'message': 'some error happened, please check log'
			}, 400

	def put(self):
		'''

		:return:
		'''
		if 'user_id' in session:
			user_id = session['user_id']
		else:
			return {
				'status_code': 400,
				'message': '',
				'category_list': []
			}, 400
		if not updateManagerMessage(user_id=user_id):
			return {
				       'status_code': 400,
				       'message': 'some error happened, please check log'
			       }, 400
		else:
			return {
				'status_code': 200,
				'message': 'update successfully'
			}