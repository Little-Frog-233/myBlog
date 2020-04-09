/**
 * Created by ruicheng on 2020/3/19.
 */
function updateNotice(updateFunction){
    layer.open({
        skin: 'demo-class'
        , title: '提示'
        , content: '确定要更新吗？'
        , btn: ['确定', '再说吧']
        , yes: function (index, layero) {
            updateFunction();
            layer.closeAll();
        } //按钮【按钮一】的回调
    });
}

function updateManager(){
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'put',
        'url': '/api/restful/manager/',
        'data': '',
        "headers": {"X-CSRFToken":csrftoken},
        "success": function(data){
            if (data.status_code == 200){
                layer.msg('更新成功')
            }else{
                layer.msg('更新失败，message: ' + data.message)
            }
        },"error": function(error){
            layer.msg('更新失败，message: ' + error)
        }
    };
    $.ajax(op);
}

function updateCategory(){
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'put',
        'url': '/api/restful/category/',
        'data': '',
        "headers": {"X-CSRFToken":csrftoken},
        "success": function(data){
            if (data.status_code == 200){
                layer.msg('更新成功')
            }else{
                layer.msg('更新失败，message: ' + data.message)
            }
        },"error": function(error){
            layer.msg('更新失败，message: ' + error)
        }
    };
    $.ajax(op);
}

function updateTag(){
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'put',
        'url': '/api/restful/tag/',
        'data': '',
        "headers": {"X-CSRFToken":csrftoken},
        "success": function(data){
            if (data.status_code == 200){
                layer.msg('更新成功')
            }else{
                layer.msg('更新失败，message: ' + data.message)
            }
        },"error": function(error){
            layer.msg('更新失败，message: ' + error)
        }
    };
    $.ajax(op);
}

function updateBlogCommentCount(){
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'put',
        'url': '/api/restful/blog_list/',
        'data': '',
        "headers": {"X-CSRFToken":csrftoken},
        "success": function(data){
            if (data.status_code == 200){
                layer.msg('更新成功')
            }else{
                layer.msg('更新失败，message: ' + data.message)
            }
        },"error": function(error){
            layer.msg('更新失败，message: ' + error)
        }
    };
    $.ajax(op);
}