# coding:utf-8
import os
import sys
import configparser
import pymysql
from Logger import log
from tools.other_tools.des_tools import des_encrypt

current_path = os.path.realpath(__file__)
rootPath = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.dirname(current_path))))
sys.path.append(rootPath)

cfp = configparser.ConfigParser()
cfp.read(os.path.join(rootPath, 'conf/web.conf'), encoding='utf-8')
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
    
    def verifyMailExist(self, usermail):
        '''
        验证邮箱是否存在
        '''
        sql = '''select * from user where usermail='{usermail}' '''.format(usermail=usermail)
        self.cursor.execute(sql)
        one = self.cursor.fetchone()
        if one is not None:
            return True
        return False

    def verifyUser(self, usermail, password):
        '''
        验证用户
        :param usermail: 用户邮箱
        :param password: 用户密码
        :return: 验证成功返回用户id
        '''
        sql = '''select id, password from user where usermail='%s'; ''' % usermail
        self.cursor.execute(sql)
        one = self.cursor.fetchone()
        if one is not None:
            db_password = one[1]
            if des_encrypt(password) == db_password:
                return one[0]
        return None
    
    def addUser(self, usermail, password, nickname, picture):
        '''
        新增用户
        '''
        sql = '''insert into user(usermail, password, nickname, picture) values(%s, %s, %s, %s)'''
        try:
            self.cursor.execute(sql, (usermail, des_encrypt(password), nickname, picture))
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.addUser').logger.error(msg)
            self.db.rollback()
            return False
    
    def getUserMessage(self, user_id):
        '''
        '''
        sql = '''select usermail, nickname, author, picture from user where id={user_id} '''.format(user_id=user_id)
        self.cursor.execute(sql)
        one = self.cursor.fetchone()
        if one is not None:
            res = {}
            res['id'] = int(user_id)
            res['usermail'] = one[0]
            res['nickname'] = one[1]
            res['admin'] = one[2]
            res['picture'] = one[3]
            return res
        return None

    def getUserLogo(self, nickname):
        '''

        :param username:
        :return:
        '''
        sql = '''select picture from user where nickname="%s"; ''' % nickname
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

    def getBlog(self, blog_id, user_id):
        '''
        只显示visible==1的blog内容
        :param blog_id:
        :return:
        '''
        sql = '''select title, cover_img_url, content, category, tag, update_time, read_count, comment_count from blog where id={blog_id} and manager_id={user_id} and visible=1 ; '''.format(
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
            result['read_count'] = one[6]
            result['comment_count'] = one[7]
            return result
        return None
    
    def updateBlogRead(self, blog_id, user_id):
        '''
        '''
        sql = '''update blog set read_count=read_count+1 where id={blog_id} and manager_id={user_id} ;'''.format(
            blog_id=blog_id, user_id=user_id)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.updateBlogRead').logger.error(msg)
            self.db.rollback()
            return False

    def getBlogs(self, user_id, sort_by='id'):
        '''
        
        :return:
        '''
        sql = '''select id, title, cover_img_url, content, category, tag, create_time, read_count, comment_count, like_count from blog where manager_id={user_id} and visible=1 ; '''.format(
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
            result['like_count'] = res[9]
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
    
    def getComment(self, comment_id, manager_id):
        '''
        sort_by: 'update_time', 'blog_id', 'id'
        '''
        sql = '''select a.id, a.blog_id, a.user_id, c.nickname, a.content, a.like_count, a.reply_count, a.update_time, b.title, c.picture as user_picture, c.author as user_admin
        from comment a join blog b on a.blog_id=b.id
        join user c on a.user_id=c.id
        where b.manager_id={manager_id} and a.id={comment_id} '''.format(manager_id=manager_id, comment_id=comment_id)
        try:
            self.cursor.execute(sql)
            res = self.cursor.fetchone()
            if not res:
                return None
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
            temp['user_picture'] = res[9]
            temp['user_admin'] = res[10]
            temp['reply_list'] = []
            return temp
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.getComments').logger.error(msg)
            self.db.rollback()
            return None

    def getComments(self, manager_id, sort_by='update_time'):
        '''
        sort_by: 'update_time', 'blog_id', 'id'
        '''
        sql = '''select a.id, a.blog_id, a.user_id, c.nickname, a.content, a.like_count, a.reply_count, a.create_time, b.title, c.picture as user_picture, c.author as user_admin
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
                temp['user_picture'] = res[9]
                temp['user_admin'] = res[10]
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
            else:
                comment_list = sorted(comment_list, key=lambda x:x[sort_by])
                comment_list.reverse()
            return comment_list
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.getComments').logger.error(msg)
            self.db.rollback()
            return None

    def addComment(self, blog_id, user_id, content, manager_id):
        '''
        '''
        sql = '''insert into comment(blog_id, user_id, content) values(%s, %s, %s)'''
        try:
            self.cursor.execute(sql, (blog_id, user_id, content))
            self.db.commit()
            comment_id = self.cursor.lastrowid
            comment_message = self.getComment(comment_id=comment_id, manager_id=manager_id)
            if self.updateBlogCommentCount(manager_id=manager_id, blog_id=blog_id):
                if comment_message is not None:
                    return comment_message
            else:
                return None
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.addComment').logger.error(msg)
            self.db.rollback()
            return None


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
    
    def getReply(self, reply_id, manager_id):
        '''
        '''
        sql = '''select a.id, a.comment_id, a.replied_id, a.replied_user_id, a.user_id, a.content,
                    b.nickname as reply_nickname, 
                    c.nickname as user_nickname,
                    a.like_count,
                    e.title,
                    a.update_time,
                    d.content as comment_content,
                    e.id as blog_id,
                    c.picture as picture,
                    c.author as user_admin
                    from reply a left join user b on a.replied_user_id = b.id
                    join user c on a.user_id = c.id
                    join comment d on a.comment_id = d.id
                    join blog e on d.blog_id = e.id
                    where e.manager_id = {manager_id} and a.id = {reply_id}; '''.format(manager_id=manager_id, reply_id=reply_id)
        try:
            self.cursor.execute(sql)
            results = self.cursor.fetchone()
            if not results:
                return None
            res = results
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
            temp['user_picture'] = res[13]
            temp['user_admin'] = res[14]
            return temp
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.getReply').logger.error(msg)
            self.db.rollback()
            return None


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
                    e.id as blog_id,
                    c.picture as picture,
                    c.author as user_admin
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
                temp['user_picture'] = res[13]
                temp['user_admin'] = res[14]
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
            return None
    
    def addReply(self, comment_id, user_id, content, manager_id, blog_id, replied_id=None, replied_user_id=None):
        '''
        '''
        sql = '''insert into reply(comment_id, user_id, content, replied_id, replied_user_id) values(%s, %s, %s, %s, %s)'''
        try:
            self.cursor.execute(sql, (comment_id, user_id, content, replied_id, replied_user_id))
            self.db.commit()
            reply_id = self.cursor.lastrowid
            reply_message = self.getReply(reply_id=reply_id, manager_id=manager_id)
            if self.updateCommentReplyCount(manager_id=manager_id, comment_id=comment_id, method='add') and self.updateBlogCommentCount(manager_id=manager_id, blog_id=blog_id):
                if reply_message is not None:
                    return reply_message
            else:
                return None
        except Exception as e:
            msg = 'On line {} - {}'.format(sys.exc_info()[2].tb_lineno, e)
            log('mysqlModel.addReply').logger.error(msg)
            self.db.rollback()
            return None

    def deleteReply(self, reply_id, comment_id, user_id, manager_id, blog_id):
        '''
        '''
        sql = '''delete from reply where id={reply_id} and user_id={user_id} and comment_id={comment_id} '''.format(reply_id=reply_id, user_id=user_id, comment_id=comment_id)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            self.cursor.execute(sql)
            self.db.commit()
            ###更新博客评论回复数和博客评论数
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
