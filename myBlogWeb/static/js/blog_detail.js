var blog_id = GetQueryValue('blog_id');

const app = new Vue({
    delimiters: ["{[", "]}"],
    el: '#app',
    data: {
        comment_list: getCommentList(),
        comment_count: 0,
        now_comment_li: -1,
        now_reply_li: '-1_-1',
        search: '',
        isLogin: false
    },
    methods: {
        changeSearch(){
            window.location.href='/?search=' + this.search;
        },
        showComment(index) {
            this.now_comment_li = index
        },
        notShowComment() {
            this.now_comment_li = -1
        },
        showReply(c_index, r_index) {
            this.now_reply_li = c_index + '_' + r_index
        },
        notShowReply() {
            this.now_reply_li = '-1_-1'
        },
        getReplyShow(c_index, r_index) {
            let l_index = c_index + '_' + r_index;
            return l_index == this.now_reply_li
        }
    },
    components: {
        'my-blog-head': my_blog_head
    },
})

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
function makeToc(html) {
    const tocs = html.match(/<[hH][1-6].*?>.*?<\/[hH][1-6]>/g);
    console.log(tocs);

    tocs.forEach((item, index) => {
        let h = item.match(/[hH][1-6]/g)[0];
        let itemText = item.replace(/<\/[hH][1-6]>/, '');  // 匹配h标签的文字
        itemText = itemText.replace(/<[hH][1-6].*?>/, '');
        // let _toc = `<div name='toc-title' id='${index}'>${item} </div>`
        let _toc = `<${h} id='${index}'>${itemText}</${h}>`
        html = html.replace(item, _toc)
    });
    var toc_list = toToc(tocs)
    console.log(toc_list);
    // document.getElementById('menu-left').innerHTML = toc_list;
    $('#menu-left').append(toc_list);
    return html
}

function toToc(data) {
    let levelStack = []
    let result = ''
    // const addStartUL = () => { result += '<ul class="catalog-list">'; }
    // const addEndUL = () => { result += '</ul>\n'; }
    const addLI = (index, itemText) => { result += '<li><a name="link" class=""' + 'href="#' + index + '">' + itemText + "</a></li>\n"; }
    data.forEach(function (item, index) {
        let h = item.match(/[hH][1-6]/g)[0];
        let itemText = item.replace(/<\/[hH][1-6]>/, '');  // 匹配h标签的文字
        // itemText = itemText.replace(/<[hH][1-6].*?>/, '');
        itemText = item
        console.log(itemText);

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
        app.comment_count = blog.comment_count;
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
});

function getCommentList() {
    var comment_list;
    var op = {
        'method': 'get',
        'url': '/api/restful/comment_list/',
        'data': {
            'blog_id': blog_id,
            'sort_by': 'update_time'
        },
        'async': false,
        'success': function (data) {
            comment_list = data.comment_list
        }, 'error': function (error) {
            console.log(error);

        }
    };
    $.ajax(op);
    return comment_list
}

// 页面滚动，目录固定
function htmlFixPosition(elFix) {
    function htmlScroll() {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        if (elFix.data_top < top) {
            elFix.style.position = 'fixed';
            elFix.style.top = 0;
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
