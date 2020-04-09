#coding:utf-8
from datetime import timedelta
from flask import session, request, Response, redirect, url_for, flash, render_template
from app_front import app_front_blue
from tools.mysql_tools.mysql_tools import *
from Logger import log
from app import cache

@app_front_blue.route('/login', methods=['GET', 'POST'])
def login():
	'''
	登陆页面
	:return:
	'''
	if 'user_id' in session:
		return redirect(url_for('app_front.index'))
	if request.method == 'POST':
		if request.form['post-action'] and request.form['post-action'] == 'login':
			username = request.form['username']
			password = request.form['password']
			captcha = request.form['captcha']
			if not captcha:
				session.pop('username', None)
				flash('captcha can\'t be empty')
				return redirect(url_for('app_front.login'))
			if captcha:
				captcha = captcha.lower()
				if captcha != session['captcha']:
					log('login').logger.error(captcha + session['captcha'])
					flash('captcha wrong')
					return redirect(url_for('app_front.login'))
			user_id = verifyManager(username=username, password=password)
			if not user_id:
				session.pop('user_id', None)
				flash('username or password invalid')
				# return redirect(url_for('index', name='world'))
				return redirect(url_for('app_front.login'))
			else:
				user_message = getManagerMessage(user_id=user_id)
				session['user_id'] = user_id
				session['username'] = username
				session['nickname'] = user_message['nickname']
				session['is_login'] = True
				return redirect(url_for('app_front.index'))
		else:
			return redirect(url_for('app_front.login'))
	###登陆时间
	session.permanent = True
	app_front_blue.permanent_session_lifetime = timedelta(minutes=7200)
	return render_template('login.html')

@app_front_blue.route('/logout', methods=['GET'])
def logout():
	# 如果用户名存在，则从会话中移除该用户名
	session.pop('user_id', None)
	session.pop('username', None)
    # 清除缓存
	cache.clear()
	return redirect(url_for('app_front.login'))