#coding:utf-8
from flask import session, request, Response, redirect, url_for, flash, render_template
from app_front import app_front_blue

@app_front_blue.route('/')
def index():
    return render_template('index.html')

@app_front_blue.route('/blog_detail/')
def blogDetail():
	return render_template('blog_detail.html')

@app_front_blue.route('/blog_detail/temp/')
def blogDetailTemp():
	return render_template('blog_detail_temp.html')