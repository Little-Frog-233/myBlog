const {getCookie} = require('./cookie.js');

function checkUser(usermail, password, captcha){
    const csrf_token = getCookie('csrf_token')
    const op = {
        'url': '/api/restful/user/',
        'method': 'post',
        'data': {
            'usermail': usermail,
            'password': password,
            'captcha': captcha
        },
        'headers': {'X-CSRFToken':csrf_token},
        'success': function(data){
            layer.msg(data.message);
            localStorage.setItem('token', data.token)
            setTimeout("window.location.href='/' ", 1000)
        },'error': function(error){
            layer.msg(error.responseJSON.message)
        }
    };
    $.ajax(op);
}

function getUserMessage(){
    let user_message;
    let token = localStorage.getItem('token');
    if (token){
        var op = {
            'url': '/api/restful/user/',
            'method': 'get',
            'async': false,
            'data': {
                'token': token
            },
            'success': function(data){
                user_message = data.data.user_message
            },'error':function(error){
                localStorage.removeItem('token')
            }
        };
        $.ajax(op);
    }
    return user_message
}
    

function GetQueryValue(queryName) {
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) {
            return pair[1];
        }
    }
    return '';
}

function slowScroll() {
    $(".label").click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body').animate({ scrollTop: targetOffset }, 800);
                return false;
            }
        }
    });
};

function postComment(blog_id, content){
    const csrf_token = getCookie('csrf_token');
    const token = localStorage.getItem('token');
    let comment_message;
    if (!token){
        layer.msg('请登陆')
    }
    let op = {
        'method': 'post',
        'url': '/api/restful/comment_list/',
        'data': {
            'token': token,
            'blog_id': blog_id,
            'content': content,
        },
        'async': false,
        'headers': { 'X-CSRFToken': csrf_token },
        'success': function(data){
            layer.msg('评论成功');
            comment_message = data.data.comment_message
        },'error':function(error){
            layer.msg(error.responseJSON.message)
        }        
    };
    $.ajax(op);
    return comment_message
}

module.exports = {
    checkUser,
    getUserMessage,
    GetQueryValue,
    slowScroll,
    postComment
}