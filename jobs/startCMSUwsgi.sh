#!/bin/bash

#利用nginx加uwsgi启动后台管理页面
nohup /home/batman/.local/bin/uwsgi --ini /home/batman/Project/myBlog/myBlogCMS/app_uwsgi.ini > /home/batman/Project/myBlog/log/web_cms.log 2>&1 &
