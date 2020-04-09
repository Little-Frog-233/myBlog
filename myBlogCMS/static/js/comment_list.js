$('.comment_list_refresh').on('click', function () {
    document.location.reload();
});

function getCommentList(){
    var comment_list;
    var sort_by = $('#comment_sort_by').val();
    var title = $('#blog_title').val();
    var comment_id = $('#comment_id').val();
    var op = {
        'method': 'get',
        'url': '/api/restful/comment_list/',
        'data': {
            'sort_by': sort_by,
            'title': title,
            'comment_id': comment_id
        },
        'async': false,
        'success': function(data){
            comment_list = data.comment_list;
        },'error': function(error){
            console.log(error);
        }
    };
    $.ajax(op);
    return comment_list
}

function get_html_content(index, item) {
    var html = '<tr>' +
        '<td>' + item.id + '</td>' +
        '<td>' + item.blog_id + '</td>' +
        '<td>' + item.blog_title + '</td>' +
        '<td>' + item.nickname + '</td>' +
        '<td>' + item.content + '</td>' +
        '<td>' + item.like_count + '</td>' +
        '<td>' + item.reply_count+ '</td>' +
        '<td>' + item.update_time + '</td>' +
        '<td>'
        + "<div class='layui-btn-group'>"
        + '<button class="layui-btn layui-btn-danger" onclick="deleteCommentNotice(' + item.id + ',' + item.user_id + ',' + item.blog_id + ')")><i class="layui-icon layui-icon-delete"></i>删除</button>'
        + '<button class="layui-btn layui-btn-normal"><i class="layui-icon layui-icon-edit"></i>回复</button>'
        + '</div>'
        + '</td>' +
        '</tr>';
    return html
}

function loadPageComment() {
    loadPage('demo20', 'biuuu_city_list', getCommentList, get_html_content)
}

$(document).ready(function () {
    loadPageComment();
});

function deleteComment(comment_id, user_id, blog_id){
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'delete',
        'url': '/api/restful/comment_list/',
        'data': {
            'comment_id': comment_id,
            'user_id': user_id,
            'blog_id': blog_id
        },
        "headers": { "X-CSRFToken": csrftoken },
        'success': function(data){
            if (data.status_code == 200){
                layer.msg("删除成功, comment_id: " + comment_id);
                loadPageComment();
            }else{
                layer.msg("删除失败, message: " + data.message)
            }
        },'error': function(data){
            layer.msg("删除失败, message: " + error)
        }
    };
    $.ajax(op);
}

function deleteCommentNotice(comment_id, user_id, blog_id){
    layer.open({
        skin: 'demo-class'
        , title: '警告'
        , content: '确定要删除吗？(删除该评论，该评论下的回复也会一并删除)'
        , btn: ['确定', '再说吧']
        , yes: function (index, layero) {
            layer.closeAll();
            deleteComment(comment_id, user_id, blog_id);
        } //按钮【按钮一】的回调
    });
}

function changeSortBy(value){
    $('#comment_sort_by').val(value);
    loadPageComment();
}

$('.comment_list_filter').on('click', function () {
    loadPageComment();
});