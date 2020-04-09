#coding:utf-8
import sys
sys.path.append('../')
from tools.mysql_tools.mysql_models import mysqlModel
from tools.mysql_tools.mysql_tools import *

if __name__ == '__main__':
    client = mysqlModel()
	# print(client.getTags(user_id=1))
	# print(client.addTag(category='技术', tag='django'))
	# print(client.addCategory('动漫'))
	# print(client.addBlog(title='第一条博客', cover_img_url='http://127.0.0.1:5000/show/picture/?filename=dongman_1.jpg', content='# 第一条博客\n### 用于测试', category='生活', tag='随记'))
	# print(client.updateCategoryCount(category='生活'))
	# print(client.updateTagCount(category='生活', tag='随记', user_id=1))
	# print(client.updateManagerMessage(user_id=1))
    # print(client.getComments(manager_id=1))
    # print(client.updateBlogCommentCount(manager_id=1, blog_id=7))
    print(client.getReplyList(manager_id=1))
    print(client.deleteReply(reply_id=4, comment_id=1, user_id=4, manager_id=1, blog_id=2))

	# print(getCategoryList(user_id=1))
	# print(updateAllCategories(user_id=1))
	# print(getTagDict(user_id=1))
	# print(updateAllTags(user_id=1))