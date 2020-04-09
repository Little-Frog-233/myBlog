#coding:utf-8
'''
所有和博客有关的API
category.api
tag.api
blog.api
comment.api
'''
import os
import configparser
from tools.mysql_tools.mysql_tools import *
from flask import session
from flask_restful import Resource, reqparse, abort

current_path = os.path.realpath(__file__)
root_path = os.path.dirname(os.path.dirname(current_path))
cfp_path = os.path.join(os.path.dirname(root_path), 'conf/cms.conf')
cfp = configparser.ConfigParser()
cfp.read(cfp_path, encoding='utf-8')
default_cover_img_url = cfp.get('blog', 'cover_img_url')

class Category(Resource):
    def get(self):
        if 'user_id' in session:
            user_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400
        category_list = getCategoryList(user_id=user_id)
        categories = getCategories(user_id=user_id)
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
                'category_list': [],
                'categories': [],
                'category_count': 0
            }, 200

    def post(self):
        if 'user_id' in session:
            user_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400
        parser = reqparse.RequestParser()
        parser.add_argument('category', type=str)
        args = parser.parse_args()
        category = args['category']
        if addCategory(category=category, user_id=user_id):
            return {
                'status_code': 200,
                'message': '',
            }
        return {
                'status_code': 400,
                'message': '',
            }, 400

    def put(self):
        if 'user_id' in session:
            user_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400
        if updateAllCategories(user_id=user_id):
            return {
                'status_code': 200,
                'message': 'update successfully',
            }
        return {
                    'status_code': 400,
                    'message': '',
                }, 400

    def delete(self):
        if 'user_id' in session:
            user_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400
        parser = reqparse.RequestParser()
        parser.add_argument('category_id', type=int)
        args = parser.parse_args()
        category_id = args['category_id']
        if deleteCategory(category_id=category_id, user_id=user_id):
            return {
                'status_code': 200,
                'message': 'delete successfully'
            }
        else:
            return {
                'status_code': 400,
                'message': 'some error happened, please check log'
            }, 400

class Tag(Resource):
	def get(self):
		if 'user_id' in session:
			user_id = session['user_id']
		else:
			return {
				'status_code': 400,
				'message': '',
				'category_list': []
			}, 400
		tag_dict = getTagDict(user_id=user_id)
		parser = reqparse.RequestParser()
		parser.add_argument('category', type=str)
		args = parser.parse_args()
		category = args['category']
		if category:
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
			tags = getTags(user_id=user_id)
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
					'tags': [],
                    'tag_count': 0
				}, 200

	def post(self):
		if 'user_id' in session:
			user_id = session['user_id']
		else:
			return {
				'status_code': 400,
				'message': '',
				'category_list': []
			}, 400
		parser = reqparse.RequestParser()
		parser.add_argument('category', type=str)
		parser.add_argument('tag', type=str)
		args = parser.parse_args()
		category = args['category']
		tag = args['tag']
		if addTag(category=category, tag=tag, user_id=user_id):
			return {
				'status_code': 200,
				'message': ''
			}
		else:
			return {
				'status_code': 400,
				'message': ''
			}, 400

	def put(self):
		if 'user_id' in session:
			user_id = session['user_id']
		else:
			return {
				'status_code': 400,
				'message': '',
				'category_list': []
			}, 400
		if updateAllTags(user_id=user_id):
			return {
				'status_code': 200,
				'message': ''
			}
		return {
			       'status_code': 400,
			       'message': ''
		       }, 400

class Blog(Resource):
	def get(self):
		if 'user_id' in session:
			user_id = session['user_id']
		else:
			return {
				'status_code': 400,
				'message': '',
				'category_list': []
			}, 400
		parser = reqparse.RequestParser()
		parser.add_argument('blog_id', type=int)
		args = parser.parse_args()
		blog_id = args['blog_id']
		blog = getBlog(blog_id=blog_id, user_id=user_id)
		if blog is not None:
			return {
				'status_code': 200,
				'message': 'get successfully',
				'blog': blog
			}
		return {
			'status_code': 400,
			'message': 'some error happened in mysql, please check log'
		}, 400

	def post(self):
		'''
		新增blog
		:return:
		'''
		if 'user_id' in session:
			user_id = session['user_id']
		else:
			return {
				'status_code': 400,
				'message': '',
				'category_list': []
			}, 400
		parser = reqparse.RequestParser()
		parser.add_argument('title', type=str)
		parser.add_argument('content', type=str)
		parser.add_argument('cover_img_url', type=str)
		parser.add_argument('category', type=str)
		parser.add_argument('tag', type=str)
		args = parser.parse_args()
		title = args['title']
		content = args['content']
		cover_img_url = args['cover_img_url']
		if not cover_img_url:
			cover_img_url = default_cover_img_url
		category = args['category']
		tag = args['tag']
		# if True:
		# 	print(title, cover_img_url, content, category, tag)
		# 	return {
		# 				'status_code': 200,
		# 				'message': 'add blog successfully'
		# 	}
		if addBlog(title=title, cover_img_url=cover_img_url, content=content, category=category, tag=tag, user_id=user_id):
			return {
				'status_code': 200,
				'message': 'add blog successfully'
			}
		else:
			return {
				'status_code': 400,
				'message': 'some error happened in mysql, please check log'
			}, 400

	def put(self):
		'''

		:return:
		'''
		if 'user_id' in session:
			user_id = session['user_id']
		else:
			return {
				'status_code': 400,
				'message': '',
				'category_list': []
			}, 400
		parser = reqparse.RequestParser()
		parser.add_argument('blog_id', type=int)
		parser.add_argument('title', type=str)
		parser.add_argument('content', type=str)
		parser.add_argument('cover_img_url', type=str)
		parser.add_argument('category', type=str)
		parser.add_argument('tag', type=str)
		args = parser.parse_args()
		id = args['blog_id']
		title = args['title']
		content = args['content']
		cover_img_url = args['cover_img_url']
		if not cover_img_url:
			cover_img_url = default_cover_img_url
		category = args['category']
		tag = args['tag']
		if updateBlog(id=id, title=title, cover_img_url=cover_img_url, content=content, category=category, tag=tag, user_id=user_id):
			return {
						'status_code': 200,
						'message': 'update blog successfully'
			}
		else:
			return {
				'status_code': 400,
				'message': 'some error happened in mysql, please check log'
			}, 400

class BlogList(Resource):
    def get(self):
        '''
        获取blog列表
        :return:
        '''
        if 'user_id' in session:
            user_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400
        parser = reqparse.RequestParser()
        parser.add_argument('category', type=str)
        parser.add_argument('tag', type=str)
        parser.add_argument('sort_by', type=str)
        args = parser.parse_args()
        category = args['category']
        tag = args['tag']
        sort_by = args['sort_by']
        if not sort_by:
            sort_by = 'id'
        blog_list = getBlogList(user_id=user_id, sort_by=sort_by)
        blog_list_res = []
        for blog in blog_list:
            if category:
                if blog['category'] == category:
                    if tag:
                        if len(set(blog['tag'].split(',') | set(tag.split(',')))) > 0:
                            blog_list_res.append(blog)
                        else:
                            continue
                    else:
                        blog_list_res.append(blog)
                else:
                    continue
            else:
                blog_list_res.append(blog)
        return {
            'status_code': 200,
            'message': '',
            'blog_list': blog_list_res
        }

    def delete(self):
        '''

        :return:
        '''
        if 'user_id' in session:
            user_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400
        parser = reqparse.RequestParser()
        parser.add_argument('blog_ids', type=str)
        args = parser.parse_args()
        blog_ids = args['blog_ids']
        if not deleteBlogs(blog_ids=blog_ids, user_id=user_id):
            return {
                'status_code': 400,
                'message': 'some error happened, please check log'
            }, 400
        else:
            return {
                'status_code': 200,
                'message': 'delete successfully'
            }

    def put(self):
        '''
        更新所有博客的数据
        '''
        if 'user_id' in session:
            user_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400
        if not updateAllBlogCommentCount(manager_id=user_id):
            return {
                'status_code': 400,
                'message': 'some error happened, please check log'
            }, 400
        else:
            return {
                'status_code': 200,
                'message': ''
            }

class CommentList(Resource):
    def get(self):
        '''
        '''
        if 'user_id' in session:
            manager_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400
        parser = reqparse.RequestParser()
        parser.add_argument('sort_by', type=str)
        parser.add_argument('title', type=str)
        parser.add_argument('comment_id', type=str)
        args = parser.parse_args()
        sort_by = args['sort_by']
        title = args['title']
        comment_id = args['comment_id']
        comment_list= getComments(manager_id=manager_id, sort_by=sort_by, blog_title=title, comment_id=comment_id)
        return {
            'status_code': 200,
            'message': '',
            'comment_list': comment_list
        }
    
    def delete(self):
        '''
        '''
        if 'user_id' in session:
            manager_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': '',
                'category_list': []
            }, 400
        parser = reqparse.RequestParser()
        parser.add_argument('comment_id', type=int)
        parser.add_argument('user_id', type=int)
        parser.add_argument('blog_id', type=int)
        args = parser.parse_args()
        comment_id = args['comment_id']
        user_id = args['user_id']
        blog_id = args['blog_id']
        if deleteComment(comment_id=comment_id, user_id=user_id, blog_id=blog_id, manager_id=manager_id):
            return {
                'status_code': 200,
                'message': 'delete successfully'
            }
        else:
            return {
                'status_code': 400,
                'message': 'some error happened, please check log'
            }, 400
    
    def post(self):
        '''
        回复评论(后台无法新增评论)
        '''
        pass

class ReplyList(Resource):
    def get(self):
        if 'user_id' in session:
            manager_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': ''
            }, 400
        parser = reqparse.RequestParser()
        parser.add_argument('sort_by', type=str)
        parser.add_argument('title', type=str)
        parser.add_argument('comment_id', type=str)
        args = parser.parse_args()
        sort_by = args['sort_by']
        title = args['title']
        comment_id = args['comment_id']
        reply_list = getReplyList(manager_id=manager_id, blog_title=title, sort_by=sort_by, comment_id=comment_id)
        return {
            'status_code': 200,
            'message': '',
            'reply_list': reply_list
        }
    
    def delete(self):
        '''
        '''
        if 'user_id' in session:
            manager_id = session['user_id']
        else:
            return {
                'status_code': 400,
                'message': ''
            }, 400
        parser = reqparse.RequestParser()
        parser.add_argument('reply_id', type=int)
        parser.add_argument('comment_id', type=int)
        parser.add_argument('user_id', type=int)
        parser.add_argument('blog_id', type=int)
        args = parser.parse_args()
        reply_id = args['reply_id']
        comment_id = args['comment_id']
        user_id = args['user_id']
        blog_id = args['blog_id']
        if deleteReply(reply_id=reply_id, comment_id=comment_id, user_id=user_id, manager_id=manager_id, blog_id=blog_id):
            return {
                'status_code': 200,
                'message': 'delete successfully'
            }
        else:
            return {
                'status_code': 400,
                'message': 'some error happened, please check log'
            }