# coding:utf-8
from flask import Flask, session, request, Response, redirect, url_for, flash, render_template
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_restful import Api
from flask_cache import Cache

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

########################启用缓存###############################
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

########################cookie存放token#######################
@app.after_request
def after_request(response):
    # 调用函数生成csrf token
    csrf_token = generate_csrf()
    # 设置cookie传给前端
    response.set_cookie('csrf_token', csrf_token)
    return response

########################启用csrf保护###########################
app.config['WTF_CSRF_CHECK_DEFAULT'] = False
app.config['WTF_CSRF_METHODS'] = set(app.config.get('WTF_CSRF_METHODS', ['POST', 'PUT', 'PATCH', 'DELETE']))
csrf = CSRFProtect(app)
@app.before_request
def check_csrf():
	path_url = request.path
	except_urls = ['/api/restful/picture/']
	if all([url not in path_url for url in except_urls]):
		csrf.protect()
	# if '/api/upload/panther_znanalysis/png_csv/' not in path_url:
	# 	csrf.protect()

########################注册Restful Api###########################
from app_back.back_picture import Picture
from app_back.back_blog import *
from app_back.back_manager import *
api = Api(app)
api.add_resource(Picture, '/api/restful/picture/')
api.add_resource(Tag, '/api/restful/tag/')
api.add_resource(Category, '/api/restful/category/')
api.add_resource(Blog, '/api/restful/blog/')
api.add_resource(BlogList, '/api/restful/blog_list/')
api.add_resource(Manager, '/api/restful/manager/')
api.add_resource(CommentList, '/api/restful/comment_list/')
api.add_resource(ReplyList, '/api/restful/reply_list/')

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

if __name__ == '__main__':
	app.run()