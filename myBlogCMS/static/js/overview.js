const app = new Vue({
    el: '#app',
    data: {
        manager: getManagerMessage(),
        tag: getTagData(),
        category: getCategoryData(),
        more_tools_show: false
    },
    methods: {
        showMoreTools(){
            this.more_tools_show = !this.more_tools_show
        }
    }
});


function getManagerMessage() {
    var manager_message;
    var op = {
        "method": "get",
        "url": "/api/restful/manager/",
        "data": "",
        "async": false,
        "success": function (data) {
            if (data.status_code == 200) {
                manager_message = data.manager
            }
        },
        "error": function (error) {
            console.log(error);
        }
    };
    $.ajax(op);
    return manager_message
}

function getCategoryData() {
    var category_data;
    var op = {
        'method': 'get',
        'url': '/api/restful/category/',
        'data': '',
        'async': false,
        'success': function (data) {
            console.log(data);
            category_data = data
        },
        'error': function (error) {
            console.log(error);
        }
    };
    $.ajax(op);
    return category_data
}

function getTagData() {
    var tag_data;
    var op = {
        'method': 'get',
        'url': '/api/restful/tag/',
        'data': '',
        'async': false,
        'success': function (data) {
            console.log(data);
            tag_data = data
        },
        'error': function (error) {
            console.log(error);
        }
    };
    $.ajax(op);
    return tag_data
}

function updateAppData(){
    app.manager = getManagerMessage();
    app.tag = getTagData();
    app.category = getCategoryData();
}

function updateNotice(updateFunction) {
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

function updateManager() {
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'put',
        'url': '/api/restful/manager/',
        'data': '',
        "headers": { "X-CSRFToken": csrftoken },
        "success": function (data) {
            if (data.status_code == 200) {
                layer.msg('更新成功')
                updateAppData();
            } else {
                layer.msg('更新失败，message: ' + data.message)
            }
        }, "error": function (error) {
            layer.msg('更新失败，message: ' + error)
        }
    };
    $.ajax(op);
}

function updateCategory() {
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'put',
        'url': '/api/restful/category/',
        'data': '',
        "headers": { "X-CSRFToken": csrftoken },
        "success": function (data) {
            if (data.status_code == 200) {
                layer.msg('更新成功')
                updateAppData();
            } else {
                layer.msg('更新失败，message: ' + data.message)
            }
        }, "error": function (error) {
            layer.msg('更新失败，message: ' + error)
        }
    };
    $.ajax(op);
}

function updateTag() {
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'put',
        'url': '/api/restful/tag/',
        'data': '',
        "headers": { "X-CSRFToken": csrftoken },
        "success": function (data) {
            if (data.status_code == 200) {
                layer.msg('更新成功')
                updateAppData();
            } else {
                layer.msg('更新失败，message: ' + data.message)
            }
        }, "error": function (error) {
            layer.msg('更新失败，message: ' + error)
        }
    };
    $.ajax(op);
}

function updateBlogCommentCount() {
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'put',
        'url': '/api/restful/blog_list/',
        'data': '',
        "headers": { "X-CSRFToken": csrftoken },
        "success": function (data) {
            if (data.status_code == 200) {
                layer.msg('更新成功')
                updateAppData();
            } else {
                layer.msg('更新失败，message: ' + data.message)
            }
        }, "error": function (error) {
            layer.msg('更新失败，message: ' + error)
        }
    };
    $.ajax(op);
}
