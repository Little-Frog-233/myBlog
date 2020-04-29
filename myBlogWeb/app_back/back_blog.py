#coding:utf-8
'''
所有和博客有关的API
category.api
tag.api
blog.api
comment.api
所有post方法都需要token验证登陆身份
'''
import os
import configparser
import json
from tools.mysql_tools.mysql_tools import *
from flask import session, request
from flask_restful import Resource, reqparse, abort
from tools.other_tools.des_tools import des_encrypt, des_descrypt
from app import cache

# current_path = os.path.realpath(__file__)
# root_path = os.path.dirname(os.path.dirname(current_path))
# cfp_path = os.path.join(os.path.dirname(root_path), 'conf/web.conf')
# cfp = configparser.ConfigParser()
# cfp.read(cfp_path, encoding='utf-8')
# manager_id = cfp.get('web', 'manager_id')


class Category(Resource):
    def get(self):
        if 'manager_id' not in session:
            return {
                'status_code': 400,
                'message': 'illegal request'
            }, 400
        manager_id = session['manager_id']
        category_list = getCategoryList(user_id=manager_id)
        categories = getCategories(user_id=manager_id)
        if category_list is not None:
            category_count = len(categories)
            return {
                'status_code': 200,
                'message': '',
                'category_list': category_list,
                'categories': categories,
                'category_count': category_count
            }
        return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400

class Tag(Resource):
    def get(self):
        if 'manager_id' not in session:
            return {
                'status_code': 400,
                'message': 'illegal request'
            }, 400
        manager_id = session['manager_id']
        tag_dict = getTagDict(user_id=manager_id)
        parser = reqparse.RequestParser()
        parser.add_argument('category', type=str)
        args = parser.parse_args()
        category = args['category']
        if category and category != "''":
            tags = tag_dict.get(category, None)
            if tags:
                return {
                    'status_code': 200,
                    'message': '',
                    'tags': tags
                }
            else:
                return {
                    'status_code': 400,
                    'message': 'no tags under this category',
                    'tags': []
                }, 400
        else:
            tags = getTags(user_id=manager_id)
            if tags:
                tag_count = len(tags)
                return {
                    'status_code': 200,
                    'message': '',
                    'tags': tags,
                    'tag_count': tag_count
                }
            else:
                return {
                    'status_code': 400,
                    'message': 'no tags under this category',
                    'tags': []
                }, 400

class Blog(Resource):
    def get(self):
        '''
        新增博客缓存
        将博客信息按照blog_id_{blog_id}的形式存储在缓存中
        '''
        if 'manager_id' not in session:
            return {
                'status_code': 400,
                'message': 'illegal request'
            }, 400
        manager_id = session['manager_id']
        parser = reqparse.RequestParser()
        parser.add_argument('blog_id', type=int)
        args = parser.parse_args()
        blog_id = args['blog_id']
        # cache.delete('blog_id_%s'%blog_id)
        blog = cache.get('blog_id_%s'%blog_id)
        if not blog:
            blog = getBlog(blog_id=blog_id, user_id=manager_id)
            if blog is None:
                return {
                    'status_code': 400,
                    'message': 'some error happened in mysql, please check log'
                }, 400
            cache.set('blog_id_%s'%blog_id, blog, timeout=600)
            updateBlogRead(blog_id=blog_id, user_id=manager_id)
        return {
                    'status_code': 200,
                    'message': 'get successfully',
                    'blog': blog
            }

class BlogList(Resource):
    def get(self):
        '''
        获取blog列表
        :return:
        '''
        if 'manager_id' not in session:
            return {
                'status_code': 400,
                'message': 'illegal request'
            }, 400
        manager_id = session['manager_id']
        parser = reqparse.RequestParser()
        parser.add_argument('category', type=str)
        parser.add_argument('tag', type=str)
        parser.add_argument('sort_by', type=str)
        parser.add_argument('start', type=int)
        parser.add_argument('offset', type=int, default=10)
        parser.add_argument('search', type=str)
        args = parser.parse_args()
        category = args['category']
        tag = args['tag']
        sort_by = args['sort_by']
        start = args['start']
        offset = args['offset']
        search = args['search']
        if not sort_by:
            sort_by = 'id'
        blog_list = getBlogList(user_id=manager_id, sort_by=sort_by)
        blog_list_res = []
        if not blog_list:
            return {
            'status_code': 200,
            'message': '',
            'blog_list': blog_list_res
        }
        if search and search != '':
            for blog in blog_list:
                search_list = search.split(' ')
                print(search_list)
                print(any([i in blog['title'] for i in search_list]))
                if any([i in blog['title'] for i in search_list]):
                    blog_list_res.append(blog)
            blog_list = blog_list_res
            blog_list_res = []
        for blog in blog_list:
            if category and category != "''":
                if blog['category'] == category:
                    if tag and tag != "''":
                        if tag in blog['tag']:
                            blog_list_res.append(blog)
                        else:
                            continue
                    else:
                        blog_list_res.append(blog)
                else:
                    continue
            else:
                blog_list_res.append(blog)
        total = len(blog_list_res)
        more = False
        if start is not None:
            end = start + offset
            if end >= len(blog_list_res):
                more = False
            else:
                more = True
            blog_list_res = blog_list_res[start:end]
        return {
            'status_code': 200,
            'message': '',
            'blog_list': blog_list_res,
            'more': more,
            'total': total
        }

class CommentList(Resource):
    '''
    每个comment对象下面包含reply列表
    '''
    def get(self):
        '''
        '''
        if 'manager_id' not in session:
            return {
                'status_code': 400,
                'message': 'illegal request'
            }, 400
        manager_id = session['manager_id']
        parser = reqparse.RequestParser()
        parser.add_argument('blog_id', type=int)
        parser.add_argument('sort_by', type=str, default='update_time')
        parser.add_argument('start', type=int)
        parser.add_argument('offset', type=int, default=10)
        args = parser.parse_args()
        blog_id = args['blog_id']
        sort_by = args['sort_by']
        start = args['start']
        offset = args['offset']
        comment_list = getComments(manager_id=manager_id, blog_id=blog_id, sort_by=sort_by)
        if comment_list is None:
            return {
                'status_code': 400,
                'message': 'some error happened, please check log'
            }
        total = len(comment_list)
        more = False
        if start is not None:
            end = start + offset
            if end >= len(comment_list):
                more = False
            else:
                more = True
            comment_list = comment_list[start:end]
        return {
            'status_code': 200,
            'message': '',
            'comment_list': comment_list,
            'total': total,
            'more': more
        }
    
    def post(self):
        '''
        提交评论，清除blog_id_{blog_id}的缓存
        改用token验证
        user_id通过缓存获取
        '''
        if 'manager_id' not in session:
            return {
                'status_code': 400,
                'message': 'illegal request'
            }, 400
        manager_id = session['manager_id']
        parser = reqparse.RequestParser()
        parser.add_argument('token', type=str)
        parser.add_argument('blog_id', type=int)
        parser.add_argument('content', type=str)
        args = parser.parse_args()
        token = args['token']
        if not token:
            return {
                'status_code': 400,
                'message': 'bad requests'
            }, 400
        blog_id = args['blog_id']
        content = args['content']
        cache.delete(('blog_id_%s'%blog_id)) ###清除blog的缓存
        user_message = cache.get(token) ### 从缓存中获取用户信息
        if user_message is None:
            return {
            'status_code': 400,
            'message': '登陆已过期'
        }, 400
        user_id = user_message['id']
        comment_message = addComment(blog_id=blog_id, user_id=user_id, content=content, manager_id=manager_id)
        if comment_message is not None:
            return {
                'status_code': 200,
                'message': 'add successfully',
                'data': {
                    'comment_message': comment_message
                }
            }
        else:
            return {
                'status_code': 400,
                'message': 'some error happened, please check log'
            }, 400
    
    def delete(self):
        '''
        '''
        pass

class Reply(Resource):
    def post(self):
        '''
        '''
        pass


        
