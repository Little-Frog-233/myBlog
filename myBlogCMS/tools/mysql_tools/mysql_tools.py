#coding:utf-8
from tools.mysql_tools.mysql_models import mysqlModel

def verifyManager(username, password):
	db = mysqlModel()
	res = db.verifyManager(username=username, password=password)
	db.close()
	return res

def getManagerMessage(user_id):
	db = mysqlModel()
	res = db.getManagerMessage(user_id=user_id)
	db.close()
	return res

def updateManagerMessage(user_id):
	'''
	更新用户的博客数、阅读数和评论数
	建议每日离线更新
	:param user_id:
	:return:
	'''
	db = mysqlModel()
	res = db.updateManagerMessage(user_id=user_id)
	db.close()
	return res

def getManagerLogo(username):
	db = mysqlModel()
	res = db.getManagerLogo(username=username)
	db.close()
	return res

def getCategories(user_id):
	db = mysqlModel()
	res = db.getCategories(user_id=user_id)
	db.close()
	return res

def getCategoryList(user_id):
	db = mysqlModel()
	res = db.getCategories(user_id=user_id)
	db.close()
	if res is not None:
		category_list = []
		for r in res:
			category_list.append(r['category'])
		return category_list
	return None

def addCategory(category, user_id):
	db = mysqlModel()
	res = db.addCategory(category=category, user_id=user_id)
	db.close()
	return res

def updateCategory(category, user_id):
	db = mysqlModel()
	res = db.updateCategoryCount(category=category, user_id=user_id)
	db.close()
	return res

def deleteCategory(category_id, user_id):
    '''

    '''
    db = mysqlModel()
    res = db.deleteCategory(category_id=category_id, user_id=user_id)
    db.close()
    return res

def updateAllCategories(user_id):
	'''
	更新某一用户的所有category
	建议每日离线更新
	:param user_id:
	:return:
	'''
	category_list = getCategoryList(user_id=user_id)
	if category_list is not None:
		for category in category_list:
			if not updateCategory(category=category, user_id=user_id):
				return False
		return True
	return False

def getTags(user_id):
	db = mysqlModel()
	res = db.getTags(user_id=user_id)
	db.close()
	return res

def getTagDict(user_id):
    db = mysqlModel()
    tags = db.getTags(user_id=user_id)
    tag_dict = {}
    if tags and len(tags) > 0:
        for tag in tags:
            if tag['category'] in tag_dict.keys():
                tag_dict[tag['category']].append(tag['tag'])
            else:
                tag_dict[tag['category']] = [tag['tag']]
        db.close()
    return tag_dict

def addTag(category, tag, user_id):
	db = mysqlModel()
	res = db.addTag(category=category, tag=tag, user_id=user_id)
	db.close()
	return res

def updateTag(category, tag, user_id):
	db = mysqlModel()
	res = db.updateTagCount(category=category, tag=tag, user_id=user_id)
	db.close()
	return res

def updateAllTags(user_id):
	'''
	更新某一用户的所有Tag
	建议每日离线更新
	:param user_id:
	:return:
	'''
	tag_dict = getTagDict(user_id=user_id)
	for category in tag_dict.keys():
		tag_list = tag_dict[category]
		for tag in tag_list:
			if not updateTag(category=category, tag=tag, user_id=user_id):
				return False
	return True

def updateCategoryTag(category, tags, user_id):
	db = mysqlModel()
	if db.updateCategoryCount(category=category, user_id=user_id):
		tag_list = tags.split(',')
		for tag in tag_list:
			if len(tag) <= 0:
				continue
			if not db.updateTagCount(category=category, tag=tag, user_id=user_id):
				db.close()
				return False
		db.close()
		return True
	db.close()
	return False

def addBlog(title, cover_img_url, content, category, tag, user_id):
	db = mysqlModel()
	res = db.addBlog(title=title, cover_img_url=cover_img_url, content=content, category=category, tag=tag, user_id=user_id)
	db.close()
	return res

def updateBlog(id, title, cover_img_url, content, category, tag, user_id):
	db = mysqlModel()
	res = db.updateBlog(id=id, title=title, cover_img_url=cover_img_url, content=content, category=category, tag=tag, user_id=user_id)
	db.close()
	return res

def getBlog(blog_id, user_id):
	db = mysqlModel()
	res = db.getBlog(blog_id=blog_id, user_id=user_id)
	db.close()
	return res

def getBlogList(user_id, sort_by='id'):
	db = mysqlModel()
	blog_list = db.getBlogs(user_id=user_id, sort_by=sort_by)
	db.close()
	return blog_list

def deleteBlog(blog_id, user_id):
	db = mysqlModel()
	res = db.deleteBlog(blog_id=blog_id, user_id=user_id)
	db.close()
	return res

def deleteBlogs(blog_ids, user_id):
	'''

	:param blog_ids: str 不同id之间用,隔开
	:param user_id: int
	:return:
	'''
	blog_id_list = blog_ids.split(',')
	for blog_id in blog_id_list:
		if len(blog_id) <= 0:
			continue
		if not deleteBlog(blog_id=blog_id, user_id=user_id):
			return False
	return True

def getComments(manager_id, sort_by='update_time', blog_title=None, comment_id=None):
    '''
    '''
    db = mysqlModel()
    res = db.getComments(manager_id=manager_id, sort_by=sort_by)
    if blog_title:
        blog_titles = blog_title.split(' ')
        result = []
        for r in res:
            if any([i in r['blog_title'] for i in blog_titles]):
                result.append(r)
        res = result
    if comment_id:
        ids = [int(i) for i in comment_id.split(' ')]
        result = []
        for r in res:
            if r['id'] in ids:
                result.append(r)
        res = result
    db.close()
    return res

def updateBlogCommentCount(manager_id, blog_id):
    db = mysqlModel()
    res = db.updateBlogCommentCount(manager_id=manager_id, blog_id=blog_id)
    db.close()
    return res

def updateAllBlogCommentCount(manager_id):
    '''
    更新所有博客评论数的方法
    建议离线更新
    '''
    blog_list = getBlogList(user_id=manager_id)
    for blog in blog_list:
        if not updateBlogCommentCount(manager_id=manager_id, blog_id=blog['id']):
            return False
    return True

def updateCommentReplyCount(manager_id, comment_id, method='add'):
    '''
    '''
    db = mysqlModel()
    res = db.updateCommentReplyCount(manager_id=manager_id, comment_id=comment_id, method=method)
    db.close()
    return res

def deleteComment(comment_id, user_id, blog_id, manager_id):
    '''
    '''
    db = mysqlModel()
    res = db.deleteComment(comment_id=comment_id, user_id=user_id, blog_id=blog_id, manager_id=manager_id)
    db.close()
    return res

def getReplyList(manager_id, sort_by='update_time', blog_title=None, comment_id=None):
    '''
    '''
    db = mysqlModel()
    res = db.getReplyList(manager_id=manager_id, sort_by=sort_by)
    if blog_title:
        blog_titles = blog_title.split(' ')
        result = []
        for r in res:
            if any([i in r['title'] for i in blog_titles]):
                result.append(r)
        res = result
    if comment_id:
        ids = [int(i) for i in comment_id.split(' ')]
        result = []
        for r in res:
            if r['comment_id'] in ids:
                result.append(r)
        res = result
    db.close()
    return res

def deleteReply(reply_id, comment_id, user_id, manager_id, blog_id):
    '''
    '''
    db = mysqlModel()
    res = db.deleteReply(reply_id=reply_id, comment_id=comment_id, user_id=user_id, manager_id=manager_id, blog_id=blog_id)
    db.close()
    return res