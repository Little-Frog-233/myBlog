$('.category_list_refresh').on('click', function () {
    document.location.reload();
});

function getCategories() {
    var categories;
    var op = {
        'method': 'get',
        'url': '/api/restful/category/',
        'data': '',
        'async': false,
        'success': function (data) {
            console.log(data);
            categories = data.categories
        },
        'error': function (error) {
            console.log(error);
        }
    };
    $.ajax(op);
    return categories
}

function get_html_content(index, item) {
    var html = '<tr>' +
        '<td>' + item.id + '</td>' +
        '<td>' + item.category + '</td>' +
        '<td>' + item.blog_count + '</td>' +
        '<td>'
        + '<button class="layui-btn layui-btn-danger" onclick=deleteCategoryNotice(' + item.id + ',' + item.blog_count + ')><i class="layui-icon layui-icon-delete"></i>删除</button>'
        + '</td>' +
        '</tr>';
    return html
}

function loadPageCategory() {
    loadPage('demo20', 'biuuu_city_list', getCategories, get_html_content)
}

$(document).ready(function () {
    loadPageCategory();
});

function deleteCategory(category_id, blog_count){
    // if (blog_count > 0){
    //     layer.msg("blog_count > 0, 无法删除");
    //     return
    // }
    var delete_data = {
        'category_id': category_id
    }
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        "method": "delete",
        "url": "/api/restful/category/",
        "data": delete_data,
        "headers": { "X-CSRFToken": csrftoken },
        "success": function(data){
            if (data.status_code == 200){
                layer.msg("删除成功, category_id: " + category_id)
                loadPageCategory();
            }else{
                layer.msg("删除失败, message: " + data.message)
            }
        },"error": function(error){
            layer.msg("删除失败, message: " + error)
        }
    };
    $.ajax(op);
}

function deleteCategoryNotice(category_id, blog_count){
    layer.open({
        skin: 'demo-class'
        , title: '警告'
        , content: '确定要删除吗？(删除该分类，该分类下的标签也会一并删除，并且属于该分类的文章将会被隐藏)'
        , btn: ['确定', '再说吧']
        , yes: function (index, layero) {
            layer.closeAll();
            // layer.msg('此功能暂未开放')
            deleteCategory(category_id, blog_count);
        } //按钮【按钮一】的回调
    });
}

function addCategory(category){
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        "method": "post",
        "url": "/api/restful/category/",
        "data": {
            'category': category
        },
        "headers": { "X-CSRFToken": csrftoken },
        "success": function(data){
            if (data.status_code == 200){
                layer.msg("添加成功")
                loadPageCategory();
            }else{
                layer.msg('添加失败, message: ' + data.message)
            }
        },"error": function(error){
            layer.msg('添加失败, message: ' + error)
        }
    };
    $.ajax(op);
}

function addCategoryNotice(value){
    layer.open({
        skin: 'demo-class'
        , title: '提示'
        , content: '确定要添加分类: ' + value + ' 吗?'
        , btn: ['确定', '再说吧']
        , yes: function (index, layero) {
            layer.closeAll();
            addCategory(value);
        } //按钮【按钮一】的回调
    });
}


function addCategoryInput(){
    layer.prompt({
        formType: 2,
        value: '',
        title: '请添加分类',
        // area: ['800px', '350px'] //自定义文本域宽高
    }, function (value, index, elem) {
        console.log(value); //得到value
        layer.close(index);
        addCategoryNotice(value)
    });
}