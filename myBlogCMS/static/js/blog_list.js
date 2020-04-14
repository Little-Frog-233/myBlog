/**
 * Created by ruicheng on 2020/1/8.
 */
const app = new Vue({
    delimiters: ["{[", "]}"],
    el: '#blog_list',
    data: {
        categories: getCategories()
    }
});

function getCategories() {
    var category_list = [];
    var op = {
        'method': 'get',
        'url': '/api/restful/category/',
        'data': '',
        'async': false,
        'success': function (data) {
            console.log(data);
            category_list = data.category_list
        },
        'error': function (error) {
            console.log(error);
        }
    };
    $.ajax(op);
    return category_list
}

$(document).ready(function () {
    loadPageBlog();
});

$('.blog_list_refresh').on('click', function () {
    document.location.reload();
});

function getBlogList() {
    var blog_category = $('#blog_category').val();
    var blog_sort_by = $('#blog_sort_by').val();
    if (blog_category != undefined) {
        var data = 'category=' + blog_category
    } else {
        var data = ""
    }
    if (blog_sort_by != undefined) {
        data = data + '&sort_by=' + blog_sort_by
    }
    var results;
    var op = {
        "method": "get",
        "url": "/api/restful/blog_list/",
        "data": data,
        "async": false,
        "success": function (data) {
            console.log(data);
            results = data.blog_list;
        },
        "error": function (error) {
            console.log(error);
        }
    };
    $.ajax(op);
    return results
}

function get_html_content(index, item) {
    if (item.visible == 1){
        var visible_html = '<td style="color: blue;">可见</td>'
    }else{
        var visible_html = '<td style="color: red;">不可见</td>'
    }
    var html = '<tr>' +
        '<td>' + item.id + '</td>' +
        '<td style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">' + item.title + '</td>' +
        // '<td style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">' + item.cover_img_url + '</td>' +
        '<td><img src="' + item.cover_img_url + '&width=100&height=60' + '"></td>' +
        '<td>' + item.category + '</td>' +
        '<td>' + item.tag + '</td>' +
        '<td>' + item.read_count + '</td>' +
        '<td>' + item.comment_count + '</td>' +
        visible_html +
        '<td>' + item.update_time + '</td>' +
        '<td>'
        + "<input style='margin-right:10px;' type='checkbox' onclick='showDivAfterChose()' name='' lay-skin='primary' value='" + item.id + "'>"
        + "<div class='layui-btn-group'>"
        // + "<button name="
        // + item.id
        // + " class='layui-btn layui-btn-lg layui-btn-normal deleteApi'"
        // + "onclick='deleteNoticeV2(" + item.task_id +  ")'"
        // + "><i class='layui-icon'></i>删除</button>"

        //    操作按钮
        + "<button class='layui-btn layui-btn-normal layui-btn-sm'"
        + "onclick='blogUpdate(" + item.id + ")'"
        + ">修改</button>"

        + '</div>'
        + '</td>' +
        '</tr>';
    return html
}

function loadPageBlog() {
    loadPage('demo20', 'biuuu_city_list', getBlogList, get_html_content)
}


function blogUpdate(blog_id) {
    window.open('/blog_edit/?blog_id=' + blog_id)
}


function deleteAllNoticeV2() {
    var task_chosen = '';
    $("input[type='checkbox']").each(function () {
        if (this.checked == true) {
            task_chosen = task_chosen + this.value + ','
        }
    });
    console.log(task_chosen);
    layer.open({
        skin: 'demo-class'
        , title: '警告'
        , content: '确定要删除吗？'
        , btn: ['确定', '再说吧']
        , yes: function (index, layero) {
            deleteBlogAllV2(task_chosen);
            layer.closeAll();
        } //按钮【按钮一】的回调
    });
}

// 删除所有选择的app的函数
function deleteBlogAllV2(blog_ids) {
    blog_ids = blog_ids.toString();
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op_delete = {
        "method": "delete",
        "url": "/api/restful/blog_list/",
        "data": "blog_ids=" + blog_ids,
        "headers": { "X-CSRFToken": csrftoken },
        "success": function (data) {
            console.log(data);
            if (data.status_code == 200) {
                loadPageBlog();
                layer.open({
                    skin: 'demo-class',
                    content: '删除成功'
                });
            } else {
                loadPageBlog();
                layer.open({
                    skin: 'demo-class',
                    content: '删除失败, message: ' + data.message
                });
            }
        },
        "error": function (error) {
            console.log(error);
            loadPageBlog();
            layer.open({
                skin: 'demo-class',
                content: '删除失败, message: ' + error
            });
        }
    };
    $.ajax(op_delete);
    closeDivAfterChose()
}

function updateAllVisibleNotice(visible){
    var task_chosen = '';
    $("input[type='checkbox']").each(function () {
        if (this.checked == true) {
            task_chosen = task_chosen + this.value + ','
        }
    });
    console.log(task_chosen);
    layer.open({
        skin: 'demo-class'
        , title: '注意'
        , content: '确定要更新可见吗吗？'
        , btn: ['确定', '再说吧']
        , yes: function (index, layero) {
            updateAllVisible(task_chosen, visible);
            layer.closeAll();
        } //按钮【按钮一】的回调
    });
}

function updateAllVisible(blog_ids, visible){
    blog_ids = blog_ids.toString();
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        "method": "put",
        "url": "/api/restful/blog_list/",
        "data": {
            'type': 'visible',
            'blog_ids': blog_ids,
            'visible': visible
        },
        "headers": { "X-CSRFToken": csrftoken },
        "success": function(data){
            loadPageBlog();
                layer.open({
                    skin: 'demo-class',
                    content: '更新成功'
                });
        },"error": function(error){
            loadPageBlog();
            layer.open({
                skin: 'demo-class',
                content: '更新失败, message: ' + error
            });
        }
    };
    $.ajax(op);
    closeDivAfterChose()
}

var isCheckAll = false;


function showDivAfterChose() {
    var checked = 0;
    $("input[type='checkbox']").each(function () {
        if (this.checked == true) {
            checked += 1
        }
    });
    if (checked > 0) {
        document.getElementById('after-all-chosed').style.display = "";
    } else {
        document.getElementById('after-all-chosed').style.display = "none";
    }
}

function closeDivAfterChose() {
    document.getElementById('after-all-chosed').style.display = "none";
}

function swapCheck() {

    if (isCheckAll) {
        $("input[type='checkbox']").each(function () {
            this.checked = false;
        });
        document.getElementById('after-all-chosed').style.display = "none";
        isCheckAll = false;
    } else {
        $("input[type='checkbox']").each(function () {
            this.checked = true;
        });
        document.getElementById('after-all-chosed').style.display = "";
        isCheckAll = true;
    }
}

$('.task_list_filter').on('click', function () {
    loadPageBlog();
});

function sortById() {
    $('#blog_sort_by').val('id');
    loadPageBlog();
}

function sortByUpdateTime() {
    $('#blog_sort_by').val('update_time');
    console.log($('#blog_sort_by').val());
    loadPageBlog();
}