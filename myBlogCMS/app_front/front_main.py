#coding:utf-8
from flask import session, request, Response, redirect, url_for, flash, render_template
from app_front import app_front_blue
from app import cache

@app_front_blue.route('/')
@cache.cached(timeout=50)
def index():
    if 'user_id' in session:
        return render_template('model_layui.html')
    return redirect(url_for('app_front.login'))

@app_front_blue.route('/overview/')
def overview():
	if 'user_id' in session:
		return render_template('overview.html')
	return render_template('404.html')

@app_front_blue.route('/tool_list/')
def toolList():
	if 'user_id' in session:
		return render_template('tool_list.html')
	return render_template('404.html')
