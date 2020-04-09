#coding:utf-8
from tools.mysql_tools.mysql_models import mysqlModel

def verifyUser(username, password):
	db = mysqlModel()
	res = db.verifyUser(username=username, password=password)
	db.close()
	return res

def getUserMessage(user_id):
    db = mysqlModel()
    res = db.getUserMessage(user_id=user_id)
    db.close()
    return res

def getUserLogo(username):
	db = mysqlModel()
	res = db.getUserLogo(username=username)
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

def getComments(manager_id, blog_id, sort_by='update_time'):
    '''
    '''
    db = mysqlModel()
    res = db.getComments(manager_id=manager_id, sort_by=sort_by)
    if res is not None:
        result = []
        for r in res:
            if r['blog_id'] == blog_id:
                reply_list = getReplyList(manager_id=manager_id, sort_by=sort_by, comment_id=r['id'])
                r['reply_list'] = reply_list
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

def addComment(blog_id, user_id, content, manager_id):
    '''
    '''
    db = mysqlModel()
    res = db.addComment(blog_id=blog_id, user_id=user_id, content=content, manager_id=manager_id)
    db.close()
    return res

def deleteComment(comment_id, user_id, blog_id, manager_id):
    '''
    '''
    db = mysqlModel()
    res = db.deleteComment(comment_id=comment_id, user_id=user_id, blog_id=blog_id, manager_id=manager_id)
    db.close()
    return res

def getReplyList(manager_id, comment_id, sort_by='update_time'):
    '''
    '''
    db = mysqlModel()
    res = db.getReplyList(manager_id=manager_id, sort_by=sort_by)
    if res is not None:
        result = []
        for r in res:
            if r['comment_id'] == comment_id:
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