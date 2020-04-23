'''
所有和用户有关的API
'''
import os
import json
import configparser
import datetime
from datetime import timedelta
from tools.mysql_tools.mysql_tools import *
from tools.other_tools.des_tools import des_encrypt, des_descrypt
from flask import session, request
from flask_restful import Resource, reqparse, abort
from app import app, cache

class User(Resource):
    def post(self):
        '''
        验证用户
        token: {
            'id': 用户id,
            'end_time': token过期时间
        }
        '''
        parser = reqparse.RequestParser()
        parser.add_argument('usermail', type=str)
        parser.add_argument('password', type=str)
        args = parser.parse_args()
        usermail = args['usermail']
        password = args['password']
        id = verifyUser(usermail=usermail, password=password)
        if id is None:
            return {
                'status_code': 400,
                'message': '',
                'token': ''
            }, 400
        token = {
            'id': id
        }
        user_message = getUserMessage(user_id=id)
        token = des_encrypt(json.dumps(token, ensure_ascii=False).encode('utf-8'))
        cache.set(token, user_message, timeout=60) # 设置缓存，缓存token timeout单位为秒
        return {
            'status_code': 200,
            'message': '',
            'token': token
        }
    
    def get(self):
        '''
        获取用户信息
        '''
        parser = reqparse.RequestParser()
        parser.add_argument('token', type=str)
        args = parser.parse_args()
        token = args['token']
        if not token:
            return {
                'status_code': 400,
                'message': ''
            }, 400
        user_message = cache.get(token) ### 从缓存中获取用户信息
        if user_message is None:
            return {
            'status_code': 400,
            'message': 'bad request'
        }, 400
        return {
            'status_code': 200,
            'messaga': '',
            'data': {
                'user_message': user_message
            }
        }
    
    def delete(self):
        '''
        '''
        parser = reqparse.RequestParser()
        parser.add_argument('token', type=str)
        args = parser.parse_args()
        token = args['token']
        cache.delete(token) # 删除缓存中的用户信息
        return {
            'status_code': 200,
            'message': ''
        }

class UserRegister(Resource):
    '''
    用户注册
    '''
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('usermail', type=str)
        parser.add_argument('password', type=str)
        parser.add_argument('nickname', type=str)
        parser.add_argument('picture', type=str)
        parser.add_argument('captcha', type=str)
        args = parser.parse_args()
        usermail = args['usermail']
        password = args['password']
        nickname = args['nickname']
        picture = args['picture']
        captcha = args['captcha']
        if 'captcha' in session:
            if captcha != session['captcha']:
                return {
                    'status_code': 400,
                    'message': '验证码错误'
                }, 400
        else:
            return {
                'status_code': 400,
                'message': '系统错误'
            }, 400
        if verifyMailExist(usermail=usermail):
            return {
                'status_code': 400,
                'message': '邮箱已经注册'
            }, 400
        now_time = datetime.datetime.now()
        time_delta = timedelta(days=7)
        end_time = (now_time + time_delta).strftime('%Y-%m-%d %H:%M:%S')
        user_message = {
            'usermail': usermail,
            'password': password,
            'nickname': nickname,
            'picture': picture,
            'end_time': end_time
        }
        user_token = des_encrypt(json.dumps(user_message, ensure_ascii=False).encode('utf-8'))
        # sendMail(usermail=usermail)
        return {
            'status_code': 200,
            'message': '已发送注册激活邮件'
        }

class UserActive(Resource):
    '''
    用户激活
    '''
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('token', type=str)
        args = parser.parse_args()
        token = args['token']
        if not token:
            return {
                'status_code': 400,
                'message': ''
            }, 400
        user_message = json.loads(des_descrypt(token))
        usermail = user_message['usermail']
        password = user_message['password']
        nickname = user_message['nickname']
        picture = user_message['picture']
        end_time = user_message['end_time']
        if datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') > end_time:
            return {
                'status_code': 400,
                'message': '激活时间已过'
            }, 400
        if addUser(usermail=usermail, password=password, nickname=nickname, picture=picture):
            return {
                'status_code': 200,
                'message': '激活成功'
            }
        else:
            return {
                'status_code': 400,
                'message': '激活失败'
            }, 400