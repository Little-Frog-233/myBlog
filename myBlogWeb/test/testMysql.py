import sys
sys.path.append('../')
from tools.mysql_tools.mysql_tools import * 

if __name__ == '__main__':
    print(addComment(blog_id=2, user_id=4, content='厉害了', manager_id=1))