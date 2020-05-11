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
            if (error.responseJSON.message){
            layer.msg(error.responseJSON.message)
            }else{
                layer.msg('发生错误，请稍后重试')
            }
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

function postComment(blog_id, content){
    const csrf_token = getCookie('csrf_token');
    const token = localStorage.getItem('token');
    let comment_message;
    if (!token){
        layer.msg('请登陆')
        return
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
            if (error.responseJSON.message){
            layer.msg(error.responseJSON.message)
            }else{
                layer.msg('发生错误，请稍后重试')
            }
        }        
    };
    $.ajax(op);
    return comment_message
}

function postReply(comment_id, content, blog_id, replied_id, replied_user_id){
    const csrf_token = getCookie('csrf_token');
    const token = localStorage.getItem('token');
    let reply_message;
    if (!token){
        layer.msg('请登陆')
        return
    }
    let op = {
        "method": "post",
        "url": "/api/restful/reply_list/",
        "data": {
            "token": token,
            "comment_id": comment_id,
            "content": content,
            "blog_id": blog_id,
            "replied_id": replied_id,
            "replied_user_id": replied_user_id
        },
        "async": false,
        "headers": { 'X-CSRFToken': csrf_token },
        "success": function(data){
            layer.msg('回复成功');
            reply_message = data.data.reply_message
        },"error": function(error){
            if (error.responseJSON.message){
                layer.msg(error.responseJSON.message)
                }else{
                    layer.msg('发生错误，请稍后重试')
                }
        }
    };
    $.ajax(op);
    return reply_message;
}

function deleteReply(reply_id, comment_id, blog_id){
    const csrf_token = getCookie('csrf_token');
    const token = localStorage.getItem('token');
    let op = {
        "method": "delete",
        "url": "/api/restful/reply_list/",
        "data": {
            "token": token,
            "reply_id": reply_id,
            "comment_id": comment_id,
            "blog_id": blog_id
        },
        "headers": { 'X-CSRFToken': csrf_token },
        "success": function(data){
            layer.msg('删除成功');
        },"error": function(error){
            if (error.responseJSON.message){
                layer.msg(error.responseJSON.message)
                }else{
                    layer.msg('发生错误，请稍后重试')
                }
        }
    };
    $.ajax(op);
}

function getReplyList(comment_id, start, offset, order_by){
    let reply_data = {};
    let op = {
        "url": "/api/restful/reply_list/",
        "method": "get",
        "async": false,
        "data": {
            "comment_id": comment_id,
            "start": start,
            "offset": offset,
            "order_by": order_by
        },
        "success":function(data){
            reply_data['reply_list'] = data.reply_list;
            reply_data['more'] = data.more;
            reply_data['total'] = data.total;
        },"error":function(error){
            if (error.responseJSON.message){
                layer.msg(error.responseJSON.message)
                }else{
                    layer.msg('发生错误，请稍后重试')
                    return
                }
        }
    };
    $.ajax(op);
    return reply_data
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

function getTs(time){
    var arr = time.split(/[- :]/),
    _date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]),
    timeStr = Date.parse(_date)
    return timeStr
}    
function handlePublishTimeDesc(post_modified){
        // 拿到当前时间戳和发布时的时间戳，然后得出时间戳差
        var curTime = new Date();
        var postTime = new Date(post_modified);                  //部分浏览器不兼容此转换建议所以对此进行补充（指定调用自己定义的函数进行生成发布时间的时间戳）
        
        //var timeDiff = curTime.getTime() - postTime.getTime();
        //上面一行代码可以换成以下（兼容性的解决）
        var timeDiff = curTime.getTime() - getTs(post_modified);
 
        // 单位换算
        var min = 60 * 1000;
        var hour = min * 60;
        var day = hour * 24;
        var week = day * 7;
        var month =  week*4;
        var year = month*12;
 
        // 计算发布时间距离当前时间的周、天、时、分
        var  exceedyear = Math.floor(timeDiff/year);
        var exceedmonth = Math.floor(timeDiff/month);
        var exceedWeek = Math.floor(timeDiff/week);
        var exceedDay = Math.floor(timeDiff/day);
        var exceedHour = Math.floor(timeDiff/hour);
        var exceedMin = Math.floor(timeDiff/min);
 
        
        // 最后判断时间差到底是属于哪个区间，然后return
 
        if(exceedyear<100&&exceedyear>0){
            return exceedyear + '年前';
            }else{
            if(exceedmonth<12&&exceedmonth>0){
                return exceedmonth + '月前';
                }else{
                if(exceedWeek<4&&exceedWeek>0){
                    return exceedWeek + '星期前';
                    }else{
                    if(exceedDay < 7 && exceedDay > 0){
                        return exceedDay + '天前';
                        }else {
                        if (exceedHour < 24 && exceedHour > 0) {
                            return exceedHour + '小时前';
                        } else {
                            return exceedMin + '分钟前';
                        }
                    }
                    }
                }
            }
    }

module.exports = {
    checkUser,
    getUserMessage,
    getReplyList,
    deleteReply,
    GetQueryValue,
    slowScroll,
    postComment,
    postReply,
    handlePublishTimeDesc
}