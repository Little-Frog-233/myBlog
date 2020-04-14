# coding:utf-8
from Logger import log
import os
import sys
import configparser
import pymysql

current_path = os.path.realpath(__file__)
rootPath = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.dirname(current_path))))
sys.path.append(rootPath)

cfp = configparser.ConfigParser()
cfp.read(os.path.join(rootPath, 'conf/cms.conf'), encoding='utf-8')
username = cfp.get('mysql', 'user')
password = cfp.get('mysql', 'password')
host = cfp.get('mysql', 'host')
port = cfp.get('mysql', 'port')
db = cfp.get('mysql', 'db')
dblink = "mysql+mysqldb://{}:{}@{}:{}/{}?charset=utf8mb4".format(
    username, password, host, port, db)


class mysqlModel:
    def __init__(self):
        self.db = pymysql.connect(host=host, user=username,
                                  password=password, port=3306,
                                  db=db, charset='utf8')
        self.cursor = self.db.cursor()

    def verifyManager(self, username, password):
        '''

        :param username:
        :param password:
        :return:
        '''
        sql = '''select id, password from manager where username='%s'; ''' % username
        self.cursor.execute(sql)
        one = self.cursor.fetchone()
        if one is not None:
            db_password = one[1]
            if password == db_password:
                return int(one[0])
        return None

    def getManagerMessage(self, user_id):
        '''

        :param user_id:
        :return:
        '''
        sql = '''select nickname, blog_count, read_count, comment_count from manager where id={user_id} '''.format(
            user_id=user_id)
        self.cursor.execute(sql)
        one = self.cursor.fetchone()
        if one is not None:
            result = {}
            result['nickname'] = one[0]
            result['blog_count'] = one[1]
            result['read_count'] = one[2]
            result['comment_count'] = one[3]
            return result
        return None

    def updateManagerMessage(self, user_id):
        '''

        :param user_id:
        :return:
        '''
        sql = '''update manager
				set blog_count=(select count(1) from blog where manager_id={user_id}),
				read_count=(select sum(read_count) from blog where manager_id={user_id}),
				 comment_count=(select sum(comment_count) from blog where manager_id={user_id})
				 where id={user_id}'''.format(user_id=user_id)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.updateManagerMessage').logger.error(msg)
            self.db.rollback()
            return False

    def getManagerLogo(self, username):
        '''

        :param username:
        :return:
        '''
        sql = '''select picture from manager where username="%s"; ''' % username
        self.cursor.execute(sql)
        one = self.cursor.fetchone()
        if one is not None:
            return one[0]
        return None

    def getCategories(self, user_id):
        '''

        :return:
        '''
        sql = '''select id, name, blog_count from category where manager_id={user_id}; '''.format(
            user_id=user_id)
        self.cursor.execute(sql)
        results = self.cursor.fetchall()
        if not results or len(results) <= 0:
            return None
        categories = []
        for res in results:
            temp = {}
            temp['id'] = res[0]
            temp['category'] = res[1]
            temp['blog_count'] = res[2]
            categories.append(temp)
        return categories

    def getCategoryId(self, category, user_id):
        '''

        :param category:
        :return:
        '''
        sql = '''select id from category where name='%s' and manager_id=%s ''' % (category, user_id)
        self.cursor.execute(sql)
        one = self.cursor.fetchone()
        if one is not None:
            return int(one[0])
        return None

    def addCategory(self, category, user_id):
        '''

        :param category:
        :return:
        '''
        category = category.replace('"', '\'')
        sql_exist = '''select * from category where name="{category}" and manager_id={user_id} ; '''.format(
            category=category, user_id=user_id)
        self.cursor.execute(sql_exist)
        one = self.cursor.fetchone()
        if one is not None:
            return True
        sql = '''insert into category(name, manager_id) values(%s, %s)'''
        try:
            self.cursor.execute(sql, (category, user_id))
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.addCategory').logger.error(msg)
            self.db.rollback()
            return False

    def deleteCategory(self, category_id, user_id):
        '''
        @description: 
        @param {type} 
        @return: 
        '''
        sql = '''delete from category where id=%s and manager_id=%s ''' % (category_id, user_id)
        sql_tag = '''delete from tag where category_id=%s and manager_id=%s '''%(category_id, user_id)
        sql_category_name = '''select name from category where id={category_id} '''.format(category_id=category_id)
        sql_blog = '''update blog set visible=0 where category='%s' and manager_id={user_id} '''.format(category_id=category_id, user_id=user_id)
        try:
            self.cursor.execute(sql_category_name)
            one = self.cursor.fetchone()
            category_name = one[0]
            self.cursor.execute(sql)
            self.db.commit()
            self.cursor.execute(sql_tag)
            self.db.commit()
            self.cursor.execute(sql_blog%category_name)
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.deleteCategory').logger.error(msg)
            self.db.rollback()
            return False	


    def updateCategoryCount(self, category, user_id):
        '''
        更新分类的文章数
        :param category:
        :return:
        '''
        sql = '''update category set blog_count=(select count(1) from blog where category='{category}' and manager_id={user_id}) where name='{category}' and manager_id={user_id} '''.format(
            category=category, user_id=user_id)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.updateCategoryCount').logger.error(msg)
            self.db.rollback()
            return False
    
    def getTag(self, user_id, category_id):
        '''

        :return:
        '''
        sql = '''select a.name, b.id, b.tag, b.blog_count from category a join tag b on a.id=b.category_id where a.manager_id={user_id} and b.manager_id={user_id} and a.id={category_id}; '''.format(
            user_id=user_id, category_id=category_id)
        self.cursor.execute(sql)
        results = self.cursor.fetchall()
        if not results or len(results) <= 0:
            return None
        tags = []
        for res in results:
            temp = {}
            temp['id'] = res[1]
            temp['category'] = res[0]
            temp['tag'] = res[2]
            temp['blog_count'] = res[3]
            tags.append(temp)
        return tags

    def getTags(self, user_id):
        '''

        :return:
        '''
        sql = '''select a.name, b.id, b.tag, b.blog_count from category a join tag b on a.id=b.category_id where a.manager_id={user_id} and b.manager_id={user_id}; '''.format(
            user_id=user_id)
        self.cursor.execute(sql)
        results = self.cursor.fetchall()
        if not results or len(results) <= 0:
            return None
        tags = []
        for res in results:
            temp = {}
            temp['id'] = res[1]
            temp['category'] = res[0]
            temp['tag'] = res[2]
            temp['blog_count'] = res[3]
            tags.append(temp)
        return tags

    def addTag(self, category, tag, user_id):
        '''

        :param category:
        :param tag:
        :return:
        '''
        category_id = self.getCategoryId(category=category, user_id=user_id)
        if category_id is None:
            return False
        sql_exist = '''select * from tag where tag='{tag}' and category_id={category_id} and manager_id={user_id}; '''.format(
            tag=tag, category_id=category_id, user_id=user_id)
        self.cursor.execute(sql_exist)
        one = self.cursor.fetchone()
        if one is not None:
            return True
        sql = '''insert into tag(tag, category_id, manager_id) VALUES(%s, %s, %s) '''
        try:
            self.cursor.execute(sql, (tag, category_id, user_id))
            self.db.commit()
            # tag_id = self.cursor.lastrowid
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.addTag').logger.error(msg)
            self.db.rollback()
            return False

    def updateTagCount(self, category, tag, user_id):
        '''
        更新标签的文章数
        :param category:
        :param tag:
        :return:
        '''
        category_id = self.getCategoryId(category=category, user_id=user_id)
        if category_id is None:
            return False
        sql = '''update tag set blog_count=(select count(1) from blog where category='{category}' and tag like '%{tag}%' and manager_id={user_id} ) where category_id={category_id} and tag='{tag}' and manager_id={user_id} '''.format(
            category_id=category_id, tag=tag, category=category, user_id=user_id)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.updateTagCount').logger.error(msg)
            self.db.rollback()
            return False

    def getBlog(self, blog_id, user_id):
        '''

        :param blog_id:
        :return:
        '''
        sql = '''select title, cover_img_url, content, category, tag, update_time from blog where id={blog_id} and manager_id={user_id} ; '''.format(
            blog_id=blog_id, user_id=user_id)
        self.cursor.execute(sql)
        one = self.cursor.fetchone()
        if one is not None:
            result = {}
            result['id'] = blog_id
            result['title'] = one[0]
            result['cover_img_url'] = one[1]
            result['content'] = one[2]
            result['category'] = one[3]
            result['tag'] = one[4]
            result['update_time'] = one[5].strftime('%Y-%m-%d %H:%M:%S')
            return result
        return None

    def getBlogs(self, user_id, sort_by='id'):
        '''

        :return:
        '''
        sql = '''select id, title, cover_img_url, content, category, tag, update_time, read_count, comment_count, visible from blog where manager_id={user_id} ; '''.format(
            user_id=user_id)
        self.cursor.execute(sql)
        results = self.cursor.fetchall()
        if not results or len(results) <= 0:
            return None
        blogs = []
        for res in results:
            result = {}
            result['id'] = res[0]
            result['title'] = res[1]
            result['cover_img_url'] = res[2]
            result['content'] = res[3]
            result['category'] = res[4]
            result['tag'] = res[5]
            result['update_time'] = res[6].strftime('%Y-%m-%d %H:%M:%S')
            result['read_count'] = res[7]
            result['comment_count'] = res[8]
            result['visible'] = res[9]
            blogs.append(result)
        if sort_by == 'id':
            blogs = sorted(blogs, key=lambda x: x['id'])
            blogs.reverse()
        elif sort_by == 'update_time':
            blogs = sorted(blogs, key=lambda x: x['update_time'])
            blogs.reverse()
        elif sort_by == 'comment_count':
            blogs = sorted(blogs, key=lambda x: x['comment_count'])
            blogs.reverse()
        elif sort_by == 'read_count':
            blogs = sorted(blogs, key=lambda x: x['read_count'])
            blogs.reverse()
        else:
            pass
        return blogs

    def addBlog(self, title, cover_img_url, content, category, tag, user_id):
        '''

        :param title:
        :param content:
        :param category:
        :param tag:
        :return:
        '''
        title = title.replace('\'', '"')
        content = content.replace('\'', '"')
        if type(tag) is list:
            tag = ','.join(tag)
        sql = '''insert into blog(title, cover_img_url, content, category, tag, manager_id) values(%s, %s, %s, %s, %s, %s)'''
        try:
            self.cursor.execute(
                sql, (title, cover_img_url, content, category, tag, user_id))
            self.db.commit()
            # tag_id = self.cursor.lastrowid
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.addBlog').logger.error(msg)
            self.db.rollback()
            return False

    def updateBlog(self, id, title, cover_img_url, content, category, tag, user_id):
        '''

        :param id:
        :param title:
        :param cover_img_url:
        :param content:
        :param category:
        :param tag:
        :return:
        '''
        title = title.replace('\'', '"')
        content = content.replace('\'', '"')
        sql = '''update blog set title='{title}', content='{content}', cover_img_url='{cover_img_url}', category='{category}', tag='{tag}' where id={id} and manager_id={user_id} '''.format(
            id=id, title=title, cover_img_url=cover_img_url, category=category, tag=tag, content=content, user_id=user_id)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.updateBlog').logger.error(msg)
            self.db.rollback()
            return False

    def deleteBlog(self, blog_id, user_id):
        '''

        :param blog_id:
        :param user_id:
        :return:
        '''
        sql_exist = 'select * from blog where id=%s and manager_id=%s ' % (
            blog_id, user_id)
        sql = '''delete from blog where id=%s and manager_id=%s ''' % (
            blog_id, user_id)
        try:
            self.cursor.execute(sql_exist)
            one = self.cursor.fetchone()
            if one and len(one) > 0:
                self.cursor.execute(sql)
                self.db.commit()
                return True
            else:
                return False
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.deleteBlog').logger.error(msg)
            self.db.rollback()
            return False
    
    def updateBlogVisible(self, blog_id, user_id, visible=0):
        '''
        '''
        sql = '''update blog set visible={visible} where id={blog_id} and manager_id={user_id}; '''.format(blog_id=blog_id, user_id=user_id, visible=visible)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.updateBlogVisible').logger.error(msg)
            self.db.rollback()
            return False
    
    def getComments(self, manager_id, sort_by='update_time'):
        '''
        sort_by: 'update_time', 'blog_id', 'id'
        '''
        sql = '''select a.id, a.blog_id, a.user_id, c.nickname, a.content, a.like_count, a.reply_count, a.update_time, b.title
        from comment a join blog b on a.blog_id=b.id
        join user c on a.user_id=c.id
        where b.manager_id={manager_id}'''.format(manager_id=manager_id)
        try:
            self.cursor.execute(sql)
            results = self.cursor.fetchall()
            if not results or len(results) <= 0:
                return None
            comment_list = []
            for res in results:
                temp = {}
                temp['id'] = res[0]
                temp['blog_id'] = res[1]
                temp['user_id'] = res[2]
                temp['nickname'] = res[3]
                temp['content'] = res[4]
                temp['like_count'] = res[5]
                temp['reply_count'] = res[6]
                temp['update_time'] = res[7].strftime('%Y-%m-%d %H:%M:%S')
                temp['blog_title'] = res[8]
                comment_list.append(temp)
            if sort_by == 'update_time':
                comment_list = sorted(comment_list, key=lambda x:x['update_time'])
                comment_list.reverse()
            elif sort_by == 'blog_id':
                comment_list = sorted(comment_list, key=lambda x:x['blog_id'])
                comment_list.reverse()
            elif sort_by == 'id':
                comment_list = sorted(comment_list, key=lambda x:x['id'])
                comment_list.reverse()
            return comment_list
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.getComments').logger.error(msg)
            self.db.rollback()
            return False
    
    def updateBlogCommentCount(self, manager_id, blog_id):
        '''
        更新博客的评论数
        '''
        sql = '''update blog set comment_count=ifnull(
            (
            select sum(reply_count + 1) from comment where blog_id={blog_id} 
            ), 0)
            where manager_id={manager_id} and id={blog_id}; '''.format(manager_id=manager_id, blog_id=blog_id)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.updateBlogCommentCount').logger.error(msg)
            self.db.rollback()
            return False
    
    def updateCommentReplyCount(self, manager_id, comment_id, method='add'):
        '''
        更新博客评论的回复数
        method: 'add' or 'reduce'
        '''
        sql_add = '''update comment set reply_count=reply_count+1 where id={comment_id} and blog_id in (select id from blog where manager_id={manager_id}); '''.format(manager_id=manager_id, comment_id=comment_id)
        sql_reduce = '''update comment set reply_count=reply_count-1 where id={comment_id} and blog_id in (select id from blog where manager_id={manager_id}) ; '''.format(manager_id=manager_id, comment_id=comment_id)
        try:
            if method == 'add':
                self.cursor.execute(sql_add)
            else:
                self.cursor.execute(sql_reduce)
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.updateupdateCommentReplyCount').logger.error(msg)
            self.db.rollback()
            return False
    
    def deleteComment(self, comment_id, user_id, blog_id, manager_id):
        '''
        
        '''
        ###删除评论
        ###删除该评论下的回复
        sql = '''delete from comment where id={comment_id} and blog_id={blog_id} and user_id={user_id} '''.format(comment_id=comment_id, blog_id=blog_id, user_id=user_id)
        sql_reply = '''delete from reply where comment_id={comment_id} '''.format(comment_id=comment_id)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            self.cursor.execute(sql_reply)
            self.db.commit()
            ###更新博客评论数
            if self.updateBlogCommentCount(manager_id=manager_id, blog_id=blog_id):
                return True
            else:
                return False
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.deleteComment').logger.error(msg)
            self.db.rollback()
            return False
    
    def getReplyList(self, manager_id, sort_by='update_time'):
        '''
        '''
        sql = '''select a.id, a.comment_id, a.replied_id, a.replied_user_id, a.user_id, a.content,
                    b.nickname as reply_nickname, 
                    c.nickname as user_nickname,
                    a.like_count,
                    e.title,
                    a.update_time,
                    d.content as comment_content,
                    e.id as blog_id
                    from reply a left join user b on a.replied_user_id = b.id
                    join user c on a.user_id = c.id
                    join comment d on a.comment_id = d.id
                    join blog e on d.blog_id = e.id
                    where e.manager_id = {manager_id}; '''.format(manager_id=manager_id)
        try:
            self.cursor.execute(sql)
            results = self.cursor.fetchall()
            if not results or len(results) <= 0:
                return None
            reply_list = []
            for res in results:
                temp = {}
                temp['id'] = res[0]
                temp['comment_id'] = res[1]
                temp['replied_id'] = res[2]
                if res[6] == None:
                    temp['reply_nickname'] = ''
                else:
                    temp['reply_nickname'] = res[6]
                temp['user_id'] = res[4]
                temp['user_nickname'] = res[7]
                temp['content'] = res[5]
                temp['like_count'] = res[8]
                temp['title'] = res[9]
                temp['update_time'] = res[10].strftime('%Y-%m-%d %H:%M:%S')
                temp['comment_content'] = res[11]
                temp['blog_id'] = res[12]
                reply_list.append(temp)
            if sort_by == 'update_time':
                reply_list = sorted(reply_list, key=lambda x: x['update_time'])
                reply_list.reverse()
            elif sort_by == 'id':
                reply_list = sorted(reply_list, key=lambda x: x['id'])
                reply_list.reverse()
            elif sort_by == 'like_count':
                reply_list = sorted(reply_list, key=lambda x: x['like_count'])
                reply_list.reverse()
            return reply_list
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.getReplyList').logger.error(msg)
            self.db.rollback()
            return False
    
    def deleteReply(self, reply_id, comment_id, user_id, manager_id, blog_id):
        '''
        '''
        sql = '''delete from reply where id={reply_id} and user_id={user_id} and comment_id={comment_id} '''.format(reply_id=reply_id, user_id=user_id, comment_id=comment_id)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            self.cursor.execute(sql)
            self.db.commit()
            ###更新博客回复数
            if self.updateCommentReplyCount(manager_id=manager_id, comment_id=comment_id, method='reduce') and self.updateBlogCommentCount(manager_id=manager_id, blog_id=blog_id):
                return True
            else:
                return False
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.deleteComment').logger.error(msg)
            self.db.rollback()
            return False
    
    def close(self):
        '''

        :return:
        '''
        self.db.close()


if __name__ == '__main__':
    print(rootPath)
