import Vue from 'vue'
const {getCookie} = require('./src/js/cookie.js')
import my_blog_head from './src/vue/Head.vue'
import my_blog_comment from './src/vue/Comment.vue'
import my_blog_reply_list from './src/vue/ReplyList.vue'
const {getUserMessage, GetQueryValue, slowScroll, handlePublishTimeDesc} = require('./src/js/utils.js')

var blog_id = GetQueryValue('blog_id');

const app = new Vue({
    delimiters: ["{[", "]}"],
    el: '#app',
    data: {
        comment_ids: [],
        comment_list: [],
        comment_count: 0,
        more: true,
        start: 0,
        offset: 3,
        search: '',
        isLogin: 0,
        user_message: {},
        blogId: Number(blog_id),
        comment_reply_id: -1,
        nowReplyId: -1
    },
    methods: {
        checkLogin(){
            let u_m = getUserMessage();
            if (u_m){
                this.isLogin = 1;
                this.user_message = u_m
            }
        },
        changeSearch(){
            window.location.href='/?search=' + this.search;
        },
        getCommentCommit(content){
            // 接收组件发出的comment-commit事件并将返回结果塞入comment_list
            this.comment_count = this.comment_count + 1;
            this.comment_ids.push(content.id);
            this.comment_list.unshift(content);
        },
        getReplyCommit(content){
            this.comment_count = this.comment_count + 1;
            this.comment_list[this.comment_reply_id].reply_list.unshift(content);
            this.comment_list[this.comment_reply_id].reply_count = this.comment_list[this.comment_reply_id].reply_count+1
            this.comment_reply_id = -1;
        },
        getComment(){
            if (this.more){
            let comment_data = getCommentList(this.start, this.offset, this.sort_by)
            this.start = this.start + this.offset;
            this.more = comment_data.more;
            this.comment_count = comment_data.total;
            for (let item of comment_data.comment_list){
                if (!this.comment_ids.includes(item.id)){
                this.comment_list.push(item);
                this.comment_ids.push(item.id);
                }
            }
        }
        },
        getTime(time){
            return handlePublishTimeDesc(time)
        },
        deleteCommentFunc(index, comment_id){
            deleteComment(this.blogId, comment_id);
            this.start = this.start - 1;
            this.comment_count = this.comment_count - 1
            this.comment_list.splice(index, 1)
            if (this.comment_list.length == 0){
                this.getComment();
            }
        },
        showCommentReplyInput(index){
            if (this.comment_reply_id == index){
                this.comment_reply_id  = -1;
                this.nowReplyId = -1;
                return
            }
            this.comment_reply_id = index;
            this.nowReplyId = -1;
        },
        getDeleteReplyCommit(content){
           for(let index in this.comment_list){
               if (this.comment_list[index].id == content.comment_id){
                   for (let reply_index in this.comment_list[index].reply_list){
                       if (this.comment_list[index].reply_list[reply_index].id == content.reply_id){
                        this.comment_list[index].reply_list.splice(reply_index, 1)
                        this.comment_list[index].reply_count = this.comment_list[index].reply_count -1
                       }
                   }
               }
           }
        },
        getNowReplyId(now_reply_id){
            this.nowReplyId = now_reply_id
        }
    },
    components: {
        'my-blog-head': my_blog_head,
        'my-blog-comment': my_blog_comment,
        'my-blog-reply-list': my_blog_reply_list
    },
    beforeMount() {
        // 在页面挂载前就发起请求
        this.checkLogin();
        this.getComment();
    },

})

function getCommentList(start, offset, sort_by) {
    var comment_data = {};
    var op = {
        'method': 'get',
        'url': '/api/restful/comment_list/',
        'data': {
            'blog_id': blog_id,
            'sort_by': sort_by,
            'start': start,
            'offset': offset
        },
        'async': false,
        'success': function (data) {
            comment_data['comment_list'] = data.comment_list;
            comment_data['more'] = data.more;
            comment_data['total'] = data.total;
        }, 'error': function (error) {
            console.log(error);

        }
    };
    $.ajax(op);
    return comment_data
}

function getBlog(blog_id) {
    var blog;
    var op = {
        'method': 'get',
        'url': '/api/restful/blog/',
        'data': 'blog_id=' + blog_id,
        'async': false,
        'success': function (data) {
            if (data.status_code == 200) {
                blog = data.blog
            } else {
                // 请求数据失败跳转到404页面
                window.location.href = '/error/'
            }
        },
        'error': function (error) {
            console.log(error);
            // 请求数据失败跳转到404页面
            window.location.href = '/error/'
        }
    };
    $.ajax(op);
    return blog
}


function deleteComment(blog_id, comment_id){
    const csrf_token = getCookie('csrf_token');
    const token = localStorage.getItem('token');
    if (!token){
        layer.msg('请登陆')
    }
    let op = {
        "method": "delete",
        "url": "/api/restful/comment_list/",
        "data": {
            "token": token,
            "blog_id": blog_id,
            "comment_id": comment_id
        },
        "headers": { 'X-CSRFToken': csrf_token },
        "success": function(data){
            layer.msg('删除成功')
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

function makeToc(html) {
    const tocs = html.match(/<[hH][1-6].*?>.*?<\/[hH][1-6]>/g);
    // console.log(tocs);

    tocs.forEach((item, index) => {
        let h = item.match(/[hH][1-6]/g)[0];
        let itemText = item.replace(/<\/[hH][1-6]>/, '');  // 匹配h标签的文字
        itemText = itemText.replace(/<[hH][1-6].*?>/, '');
        let _toc = `<div name='toc-title' class="anchor" id='${index}'></div>${item}`
        // let _toc = `<div name='toc-title' id='${index}'>${item} </div>`
        // let _toc = `<${h} id='${index}'>${itemText}</${h}>`
        html = html.replace(item, _toc)
    });
    var toc_list = toToc(tocs)
    // console.log(toc_list);
    // document.getElementById('menu-left').innerHTML = toc_list;
    $('#menu-left').append(toc_list);
    return html
}

function toToc(data) {
    let levelStack = []
    let result = ''
    // const addStartUL = () => { result += '<ul class="catalog-list">'; }
    // const addEndUL = () => { result += '</ul>\n'; }
    const addLI = (index, itemText) => { result += '<li><a name="link" class="label"' + 'href="#' + index + '">' + itemText + "</a></li>\n"; }
    data.forEach(function (item, index) {
        let h = item.match(/[hH][1-6]/g)[0];
        let itemText = item.replace(/<\/[hH][1-6]>/, '');  // 匹配h标签的文字
        // itemText = itemText.replace(/<[hH][1-6].*?>/, '');
        itemText = item
        // console.log(itemText);

        let itemLabel = item.match('<\w+?.*?>')  // 匹配h?标签<h?>
        let levelIndex = levelStack.indexOf(itemLabel) // 判断数组里有无<h?>
        // 没有找到相应<h?>标签，则将新增ul、li
        if (levelIndex === -1) {
            levelStack.unshift(itemLabel)
            // addStartUL()
            addLI(index, itemText)
        }
        // 找到了相应<h?>标签，并且在栈顶的位置则直接将li放在此ul下
        else if (levelIndex === 0) {
            addLI(index, itemText)
        }
        // 找到了相应<h?>标签，但是不在栈顶位置，需要将之前的所有<h?>出栈并且打上闭合标签，最后新增li
        else {
            while (levelIndex--) {
                levelStack.shift()
                //   addEndUL()
            }
            addLI(index, itemText)
        }
    })
    // 如果栈中还有<h?>，全部出栈打上闭合标签
    while (levelStack.length) {
        levelStack.shift()
        //   addEndUL()
    }
    return result
}

function compile() {
    if (blog_id != null) {
        var blog = getBlog(blog_id);
        var text = blog.content;
        var title = blog.title;
        document.title = title;
        var cover_img_url = blog.cover_img_url + '&width=800&height=300';
        var update_time = blog.update_time.split(' ')[0];
        var read_count = blog.read_count;
    } else {
        var text = '';
        var title = '';
        var cover_img_url = '';
        var update_time = ''
    }
    var converter = new showdown.Converter();
    var html = converter.makeHtml(text);
    html = makeToc(html);
    $('#update_time').append(update_time);
    document.getElementById("result").innerHTML = html;
    document.getElementById("title").innerHTML = '<h1 class="my_title">' + title + '</h1>';
    $('#cover_img').attr('src', cover_img_url)
}

$(document).ready(function () {
    compile();
    slowScroll();
});

// 页面滚动，目录固定
function htmlFixPosition(elFix) {
    function htmlScroll() {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        // if (elFix.data_top < top) {
        if (5 < top) {
            elFix.style.position = 'fixed';
            elFix.style.top = 70;
            elFix.style.left = elFix.data_left;
        }
        else {
            elFix.style.position = 'static';
        }
    }

    function htmlPosition(obj) {
        var o = obj;
        var t = o.offsetTop;
        var l = o.offsetLeft;
        while (o = o.offsetParent) {
            t += o.offsetTop;
            l += o.offsetLeft;
        }
        obj.data_top = t;
        obj.data_left = l;
    }

    var oldHtmlWidth = document.documentElement.offsetWidth;
    window.onresize = function () {
        var newHtmlWidth = document.documentElement.offsetWidth;
        if (oldHtmlWidth == newHtmlWidth) {
            return;
        }
        oldHtmlWidth = newHtmlWidth;
        elFix.style.position = 'static';
        htmlPosition(elFix);
        htmlScroll();
    }
    window.onscroll = htmlScroll;

    htmlPosition(elFix);
}

var elFix = document.getElementById('menu-left');
htmlFixPosition(elFix);
