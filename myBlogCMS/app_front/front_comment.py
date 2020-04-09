#coding:utf-8
from flask import session, request, Response, redirect, url_for, flash, render_template
from app_front import app_front_blue

@app_front_blue.route('/comment_list/')
def frontCommentList():
	'''

	:return:
	'''
	if 'user_id' not in session:
		return render_template('404.html')
	return render_template('comment_list.html')

@app_front_blue.route('/reply_list/')
def frontReplyList():
    '''
    '''
    if 'user_id'  not in session:
        return render_template('404.html')
    return render_template('reply_list.html')