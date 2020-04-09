#coding:utf-8
from flask import session, request, Response, redirect, url_for, flash, render_template
from app_front import app_front_blue

@app_front_blue.route('/category_list/')
def frontCategoryList():
	'''

	:return:
	'''
	if 'user_id' not in session:
		return render_template('404.html')
	return render_template('category_list.html')