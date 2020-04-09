from flask import Blueprint

app_front_blue = Blueprint('app_front', __name__)

from app_front import front_blog, front_picture, front_login, front_main, front_category, front_comment