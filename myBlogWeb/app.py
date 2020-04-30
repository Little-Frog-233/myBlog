# coding:utf-8
import os
import configparser
from flask import Flask, session, request, Response, redirect, url_for, flash, render_template
from flask_cache import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_restful import Api

current_path = os.path.realpath(__file__)
root_path = os.path.dirname(current_path)
cfp_path = os.path.join(os.path.dirname(root_path), 'conf/web.conf')
cfp = configparser.ConfigParser()
cfp.read(cfp_path, encoding='utf-8')
manager_id = cfp.get('web', 'manager_id')
root_url = cfp.get('flask', 'web_root_url')

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

########################启用缓存###############################

# 配置redis作为缓存
redis_config = {
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_HOST': '127.0.0.1',
    'CACHE_REDIS_PORT': 6379,
    'CACHE_REDIS_DB': '1',
    'CACHE_REDIS_PASSWORD': ''
 }
# app.config.from_object(redis_config)
# cache = Cache(app, config={'CACHE_TYPE': 'simple'})
cache = Cache(app, config=redis_config)

########################cookie存放token#######################
@app.after_request
def after_request(response):
    # 调用函数生成csrf token
    csrf_token = generate_csrf()
    # 设置cookie传给前端
    response.set_cookie('csrf_token', csrf_token)
    # if 'token' in session:
    #     # 说明处于登陆状态，设置cookie
    #     response.set_cookie('token', session['token'])
    # else:
    #     # 说明登陆状态已过期
    #     response.set_cookie('token', '')
    return response

@app.before_request
def before_request():
    session['manager_id'] = manager_id
    return

########################启用csrf保护###########################
app.config['WTF_CSRF_CHECK_DEFAULT'] = False
app.config['WTF_CSRF_METHODS'] = set(app.config.get('WTF_CSRF_METHODS', ['POST', 'PUT', 'PATCH', 'DELETE']))
csrf = CSRFProtect(app)
@app.before_request
def check_csrf():
	path_url = request.path
	except_urls = []
	if all([url not in path_url for url in except_urls]):
		csrf.protect()
	# if '/api/upload/panther_znanalysis/png_csv/' not in path_url:
	# 	csrf.protect()

########################注册Restful Api###########################
from app_back.back_blog import *
from app_back.back_user import *
api = Api(app)
api.add_resource(Blog, '/api/restful/blog/')
api.add_resource(BlogList, '/api/restful/blog_list/')
api.add_resource(Category, '/api/restful/category/')
api.add_resource(Tag, '/api/restful/tag/')
api.add_resource(CommentList, '/api/restful/comment_list/')
api.add_resource(ReplyList, '/api/restful/reply_list/')

api.add_resource(User, '/api/restful/user/')
api.add_resource(UserRegister, '/api/restful/user_register/')
api.add_resource(UserActive, '/api/restful/user_active/')

########################注册蓝图###########################
from app_front import app_front_blue
app.register_blueprint(app_front_blue)

########################限制器###########################
limiter = Limiter(app=app, key_func=get_remote_address, default_limits=["5/minute"])
@limiter.request_filter
def filter_func():
	"""
	定义一个限制器的过滤器函数,如果此函数返回True,
	则不会施加任何限制.一般用这个函数创建访问速度
	限制的白名单,可以使用某些celeb集中处理需要
	limiter.exempt的情况
	"""
	path_url = request.path
	forbidden_url = []
	if all([i not in path_url for i in forbidden_url]):
		return True
	else:
		return False

@app.route('/error/')
def error():
    return render_template('404.html')

if __name__ == '__main__':
	app.run()