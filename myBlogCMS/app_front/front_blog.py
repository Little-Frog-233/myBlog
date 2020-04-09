#coding:utf-8
from flask import session, request, Response, redirect, url_for, flash, render_template
from app_front import app_front_blue

@app_front_blue.route('/blog_edit/')
def frontTextEdit():
	'''

	:return:
	'''
	if 'user_id' not in session:
		return render_template('404.html')
	return render_template('textEdit_Editor.html')

@app_front_blue.route('/blog_list/')
def frontBlogList():
	'''

	:return:
	'''
	if 'user_id' not in session:
		return render_template('404.html')
	return render_template('blog_list.html')

@app_front_blue.route('/blog_success/')
def frontBlogSuccess():
	'''

	:return:
	'''
	if 'user_id' not in session:
		return render_template('404.html')
	method = request.args.get('method')
	if method:
		data = {'method': method}
		return render_template('blog_upload_success.html', data=data)
	return render_template('blog_upload_success.html')