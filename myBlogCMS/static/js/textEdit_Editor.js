const app = new Vue({
    delimiters: ["{[", "]}"],
    el: '#app',
    data: {
        title: '',
        categories: getCategories(),
        checked_category: '生活',
        // tags: '',
        checked_tags: []
    },
    methods: {
        tags: function(){
            return getTags(this.checked_category)
        },
        addTag(){
            layer.prompt({
                formType: 2,
                value: '',
                title: '请添加标签',
                // area: ['800px', '350px'] //自定义文本域宽高
            }, function (value, index, elem) {
                console.log(value); //得到value
                if (value != '' && value != undefined){
                    addTagApi(app.checked_category, value);
                }else{
                    layer.msg('标签不能为空')
                }
                layer.close(index);
            });
        },
        moveTag(index){
            for (tag_index in app.checked_tags) {
                if (app.checked_tags[tag_index] == app.tags[index]) {
                    app.checked_tags.splice(tag_index, 1)
                }
            }
            app.tags.splice(index, 1);
        },
        addCategory(){
            layer.prompt({
                formType: 2,
                value: '',
                title: '请添加分类',
                // area: ['800px', '350px'] //自定义文本域宽高
            }, function (value, index, elem) {
                console.log(value); //得到value
                if (value == '' || value == undefined){
                    layer.msg('分类不能为空');
                    return
                }
                if (addCategoryApi(value)){
                    app.categories.push(value);
                }
                layer.close(index);
            });
        },
        cleanTags(){
            this.checked_tags = [];
        }
    }
});

function pageJumpSuccess(method){
    window.location.href = '/blog_success/' + '?method=' + method;
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
    return null;
}
// blog_id为全局变量
const blog_id = GetQueryValue('blog_id');
if (blog_id != null) {
    document.getElementById('text_edit_head').innerHTML = '更新文章';
    document.getElementById('text_edit_submit').innerHTML = '立即更新';
    console.log(blog_id);
    var textAddMethod = 'put';
    const blog = getBlog(blog_id);
    document.getElementById('demo').innerHTML = blog.content;
    $('#title').val(blog.title);
    $('#demo1').attr('src', blog.cover_img_url + '&width=300');
    $('#cover_picture').val(blog.cover_img_url);
    app.title = blog.title;
    app.checked_category = blog.category;
    app.checked_tags = blog.tag.split(',');
}else{
    var textAddMethod = 'post';
}

function getBlog(blog_id){
    let blog='';
    const op = {
        'method': 'get',
        'url': '/api/restful/blog/',
        'data': 'blog_id=' + blog_id,
        'async': false,
        'success': function(data){
            blog = data.blog;
        },
        'error': function(error){
            console.log(error)
        }
    };
    $.ajax(op);
    return blog
}



layui.use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('submit(formDemo)', function (data) {
        data = data.field;
        textAddNotice(data);
        return false;
    });
});

function textAddNotice(data) {
    layer.open({
        skin: 'demo-class'
        , title: '提示'
        , content: '确定要提交吗？'
        , btn: ['确定', '再考虑考虑']
        , yes: function (index, layero) {
            data.tags = app.checked_tags;
            layer.closeAll();
            textAddApi(data)
        } //按钮【按钮一】的回调
    });
}

function textAddApi(data){
    if (data.title.length > 50){
        layer.msg('标题过长，标题应小于50子');
        return
    }
    if(data.text_content == ""){
        layer.msg('文章内容不能为空');
        return
    }
    if (!cover_picture_upload){
        layer.msg('选择的封面还没提交哦');
        return
    }
    if(data.tags.length == 0){
        layer.msg('标签必须要打');
        return
    }
    console.log(data);
    const csrftoken = $("meta[name=csrf-token]").attr("content");
    const title = data.title;
    const cover_picture_url = data.cover_picture;
    const content = data.text_content;
    const category = data.category;
    const tag = data.tags.join(',');
    // let post_data = 'title=' + title + '&content=' + content + '&category=' + category + '&tag=' + tag + '&cover_img_url=' + cover_picture_url;
    let post_data = {
        'title': title,
        'content': content,
        'category': category,
        'tag': tag,
        'cover_img_url': cover_picture_url,
        'blog_id': blog_id
    };
    if (blog_id != null){
        var textAdd_method = '更新';
    }else{
        var textAdd_method = '提交';
    }
    const op = {
        'method': textAddMethod,
        'url': '/api/restful/blog/',
        'data': post_data,
        "headers": {"X-CSRFToken":csrftoken},
        'success': function(data){
            console.log(data);
            if (data.status_code == 200){
                pageJumpSuccess(textAdd_method)
            }else{
                layer.msg('提交失败, message: ' + data.message)
            }
        },
        'error': function(error){
            console.log(error);
            layer.msg('提交失败, message: ' + error)
        }
    };
    $.ajax(op);
}

layui.use('layer', function () {
    var $ = layui.jquery
        , layer = layui.layer;

    if ($(window).width() <= 750) return
});

var cover_picture_upload = true;

layui.use('upload', function () {
    var $ = layui.jquery
        , upload = layui.upload;
    upload.render({
        elem: '#test8'
        , url: '/api/restful/picture/' //改成您自己的上传接口
        // , headers: {"X-CSRFToken":csrftoken}
        , auto: false
        , choose: function (obj) {
            cover_picture_upload = false;
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        //,multiple: true
        , bindAction: '#test9'
        , done: function (res) {
            if (res.status_code == 200) {
                $('#cover_picture').val(res.url);
                console.log(res);
                cover_picture_upload = true;
                layer.msg('封面提交成功');
            } else {
                layer.msg('封面提交失败');
                console.log(res)
            }
        }
    });
});

function getCategories(){
    var category_list = [];
    var op = {
        'method': 'get',
        'url': '/api/restful/category/',
        'data': '',
        'async': false,
        'success': function(data){
            console.log(data);
            category_list = data.category_list
        },
        'error': function(error){
            console.log(error);
        }
    };
    $.ajax(op);
    return category_list
}

function addCategoryApi(category){
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var res;
    var op = {
        'method': 'post',
        'url': '/api/restful/category/',
        'data': 'category=' + category,
        'async': false,
        "headers": {"X-CSRFToken":csrftoken},
        'success': function(data){
            console.log(data);
            if (data.status_code == 200){
                res = true
            }else{
                res = false
            }
        },
        'error': function(error){
            console.log(error);
            res = false;
        }
    };
    $.ajax(op);
    return res
}

function getTags(category) {
    var tags = [];
    var op = {
        'method': 'get',
        'url': '/api/restful/tag/',
        'data': 'category=' + category,
        'async': false,
        'success': function(data){
            console.log(data);
            tags = data.tags
        },
        'error': function(error){
            console.log(error);
        }
    };
    $.ajax(op);
    return tags;
}

function addTagApi(category, tag){
    var csrftoken = $("meta[name=csrf-token]").attr("content");
    var op = {
        'method': 'post',
        'url': '/api/restful/tag/',
        'data': 'category=' + category + '&tag=' + tag,
        "headers": {"X-CSRFToken":csrftoken},
        'success': function(data){
            console.log(data);
            app.checked_category = '';
            app.checked_category = category;
        },
        'error': function(error){
            console.log(error);
        }
    };
    $.ajax(op);
}