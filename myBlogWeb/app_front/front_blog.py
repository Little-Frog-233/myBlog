#coding:utf-8
import os
import configparser
from flask import session, request, Response, redirect, url_for, flash, render_template
from app_front import app_front_blue

current_path = os.path.realpath(__file__)
root_path = os.path.dirname(os.path.dirname(current_path))
cfp_path = os.path.join(os.path.dirname(root_path), 'conf/web.conf')
cfp = configparser.ConfigParser()
cfp.read(cfp_path, encoding='utf-8')
manager_id = cfp.get('web', 'manager_id')

@app_front_blue.route('/')
def index():
    if 'manager_id' not in session:
        session['manager_id'] = manager_id
    return render_template('index.html')

@app_front_blue.route('/blog_detail/')
def blogDetail():
    if 'manager_id' not in session:
        session['manager_id'] = manager_id
    return render_template('blog_detail.html')

@app_front_blue.route('/blog_detail/temp/')
def blogDetailTemp():
	return render_template('blog_detail_temp.html')