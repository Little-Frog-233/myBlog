import sys
sys.path.append('../')
from tools.mysql_tools.mysql_tools import * 
from tools.mysql_tools.mysql_models import mysqlModel

if __name__ == '__main__':
    client = mysqlModel()
    # print(client.verifyMailExist('1342468180@qq.com'))
    print(client.getReply(reply_id=7, manager_id=1))
    # print(addComment(blog_id=2, user_id=4, content='厉害了', manager_id=1))