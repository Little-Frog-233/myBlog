$('.reply_list_refresh').on('click', function () {
    document.location.reload();
});

function getReplyList(){
    var reply_list;
    var sort_by = $('#reply_sort_by').val();
    var title = $('#blog_title').val();
    var comment_id = $('#comment_id').val();
    var op = {
        'method': 'get',
        'url': '/api/restful/reply_list/',
        'data': {
            'sort_by': sort_by,
            'title': title,
            'comment_id': comment_id
        },
        'async': false,
        'success': function(data){
            reply_list = data.reply_list;
        },'error': function(error){
            console.log(error);
        }
    };
    $.ajax(op);
    return reply_list
}

function get_html_content(index, item) {
    var html = '<tr>' +
        '<td>' + item.id + '</td>' +
        '<td>' + item.title+ '</td>' +
        '<td>' + item.user_nickname + ' 回复 ' + item.reply_nickname + '</td>' +
        '<td>' + item.content + '</td>' +
        '<td>' + item.like_count + '</td>' +
        '<td>' + item.comment_id + '</td>' +
        '<td>' + item.update_time + '</td>' +
        '<td>'
        + "<div class='layui-btn-group'>"
        + '<button class="layui-btn layui-btn-danger" onclick="deleteReplyNotice('+ item.id + ',' + item.comment_id + ',' + item.user_id + ',' + item.blog_id + ')")><i class="layui-icon layui-icon-delete"></i>删除</button>'
        + '</div>'
        + '</td>' +
        '</tr>';
    return html
}

function loadPageReply() {
    loadPage('demo20', 'biuuu_city_list', getReplyList, get_html_content)
}

$(document).ready(function () {
    loadPageReply();
});

function changeSortBy(value){
    $('#reply_sort_by').val(value);
    loadPageReply();
}

$('.reply_list_filter').on('click', function () {
    loadPageReply();
});

function deleteReply(reply_id, comment_id, user_id, blog_id){
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'delete',
        'url': '/api/restful/reply_list/',
        'data': {
            'reply_id': reply_id,
            'comment_id': comment_id,
            'user_id': user_id,
            'blog_id': blog_id
        },
        "headers": { "X-CSRFToken": csrftoken },
        'success': function(data){
            if (data.status_code == 200){
                layer.msg("删除成功, reply_id: " + reply_id);
                loadPageReply();
            }else{
                layer.msg("删除失败, message: " + data.message)
            }
        },'error': function(data){
            layer.msg("删除失败, message: " + error)
        }
    };
    $.ajax(op);
}

function deleteReplyNotice(reply_id, comment_id, user_id, blog_id){
    layer.open({
        skin: 'demo-class'
        , title: '警告'
        , content: '确定要删除吗？'
        , btn: ['确定', '再说吧']
        , yes: function (index, layero) {
            layer.closeAll();
            deleteReply(reply_id, comment_id, user_id, blog_id);
        } //按钮【按钮一】的回调
    });
}