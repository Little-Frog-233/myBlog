/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function addCookie(key, value){
    document.cookie = key + '=' + value;
}

function deleteCookie(){
    
}

module.exports = {
    getCookie
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const {getCookie} = __webpack_require__(0);

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
            layer.msg(error.responseJSON.message)
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

function postComment(blog_id, content){
    
}

module.exports = {
    checkUser,
    getUserMessage,
    GetQueryValue,
    slowScroll,
    postComment
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// 头部组件
// 每个页面通用
// 组件中涉及到jquery的函数全部写在utils.js中
const { getCookie } = __webpack_require__(0)
const { checkUser, postComment } = __webpack_require__(1)

const head_html = `
<div style="top: 0px;height: 65px">
    <nav style="border-bottom: 1px solid #f1f1f1;top: 0px;z-index: 9999;position: fixed;width: 100%;left: 0;" id='my-blog-head'>
        <div class="container">
            <a href="/" style="background: white;">
                <img src="/show/logo/zndex_logo.png" alt="">
                <!-- <h1 style="color: #007fff;">ZNDEX-Blog</h1> -->
            </a>
            <div id="menu">
                <ul style="background-color: white;">
                    <li><a href="/" style="color: grey; font-size: 16px;">首页</a></li>
                </ul>
                <ul class="my-top">
                    <li>
                        <!-- <div class="layui-form-item">
                        <div class="layui-input-block"> -->
                        <input type="text" name="search" placeholder="搜索ZNDEX" autocomplete="off" v-model="search" @keyup.enter="changeSearch()">
                        <!-- </div>
                    </div> -->
                    </li>
                    <li v-show="isLogin==0">
                        <a href="javascript:void(0)" style="margin-left: 5px;" @click="signIn()">
                            登陆
                        </a>
                    </li>
                    <li v-show="isLogin==0">
                        <a href="javascript:void(0)" @click="signUp()">
                            注册
                        </a>
                    </li>
                    <li v-show="isLogin==1">
                        <a href="javascript:void(0)">
                        <div class="user-menu">
                        <div @click="showUserMenu()">
                            <img :src="'/show/logouser/' + userMessage.picture" alt="" class="user-picture">
                            <p class="user-nickname" >{[userMessage.nickname]}</p>
                            </div>
                            <dl class="menu-list" v-show="userMenuShow">
                                <dd><a href="javascript:void(0)" @click="logout()">退出登陆</a></dd>
                            </dl>
                        </div>
                        </a>
                    </li>
                </ul>
            </div>
            <a id="menu-toggle" href="javascript:void(0)" class=" ">&#9776;</a>
        </div>
    </nav>
</div>
`;

const singIn_html = `
<form action="">
        <div>
            <label for="usermail">邮箱: 
                <input type="text" id="signin_usermail" name="signin_usermail" autocomplete="off" v-model="usermail">
            </label>
        </div>
        <div>
            <label for="password">密码: 
                <input type="password" id="signin_password" name="signin_password" autocomplete="off" v-model="password">
            </label>
        </div>
        <div>
            <label for="captcha">验证码:
                <input type="text" id="signin_captcha" name="signin_captcha" autocomplete="off" v-model="captcha">
            </label>
            <br>
            <img src="/captcha/" alt="" title="点击更换验证码" onclick="this.src='/captcha?'+ Math.random()"/>
        </div>
</form>
`

const logout_html = `
<form action="">
        <div>
            <label for="usermail">邮箱: 
                <input type="text" id="logout_usermail" name="logout_usermail" autocomplete="off" v-model="usermail">
            </label>
        </div>
        <div>
            <label for="password">密码: 
                <input type="password" id="logout_password" name="logout_password" autocomplete="off" v-model="password">
            </label>
        </div>
        <div>
            <label for="password">密码: 
                <input type="password" id="logout_password_re" name="logout_password_re" autocomplete="off" v-model="password">
            </label>
        </div>
        <div>
            <label for="captcha">验证码:
                <input type="text" id="logout_captcha" name="logout_captcha" autocomplete="off" v-model="captcha">
            </label>
            <br>
            <img src="/captcha/" alt="" title="点击更换验证码" onclick="this.src='/captcha?'+ Math.random()"/>
        </div>
</form>
`

const my_blog_head = {
    delimiters: ["{[", "]}"],
    template: head_html,
    data() {
        return {
            userMenuShow: false,
        }
    },
    props: {
        isLogin: {
            type: Number,
            default: 0
        },
        search: {
            type: String,
            default: ''
        },
        userMessage: {

        }
    },
    methods: {
        changeSearch() {
            window.location.href = '/?search=' + this.search;
        },
        signIn() {
            layer.open({
                title: '用户登陆',
                content: singIn_html,
                btn: ['登陆', '取消'],
                yes: function (index, layero) {
                    layer.closeAll();
                    const usermail = $('#signin_usermail').val();
                    const password = $('#signin_password').val();
                    const captcha = $('#signin_captcha').val();
                    checkUser(usermail, password, captcha);
                }
            })
        },
        signUp() {
            layer.open({
                title: '用户注册',
                content: '暂未开放',
                btn: ['注册', '取消'],
                yes: function (index, layero) {
                    layer.closeAll();
                }
            })
        },
        logout() {
            const csrf_token = getCookie('csrf_token')
            const op = {
                'url': '/api/restful/user/',
                'method': 'delete',
                'data': {
                    'token': localStorage.getItem('token')
                },
                'headers': { 'X-CSRFToken': csrf_token },
                'success': function (data) {
                    window.location.href = '/'
                }, 'error': function (error) {
                    window.location.href = '/'
                }
            };
            $.ajax(op);
            localStorage.removeItem('token')
        },
        showUserMenu() {
            this.userMenuShow = !this.userMenuShow;
        }
    }
}

const comment_html = `
<div class="comment-input">
    <div>
    <input type="text" placeholder="   请输入评论..." @focus="showCommentButtonFunc()" v-model:value="commentContent">
    </div>
    <div style="float: right;margin-top: 10px;" v-show="showCommentButton">
        <button style="background-color: #027fff;color: white;padding: .2rem 1.1rem;" @click="postComment()">评论</button>
    </div>
</div>
`

const my_blog_comment = {
    delimiters: ["{[", "]}"],
    template: comment_html,
    data(){
        return {
            commentContent: '',
            showCommentButton: false
        }
    },
    props: {
        inputType: {
            type: String,
            default: 'comment'
        },
        blogId: {
            type: Number
        }
    },
    methods: {
        showCommentButtonFunc(){
            this.showCommentButton = true;
            console.log(this.blogId);
            
        },
        closeCommentButtonFunc(){
            this.showCommentButton = false;
        },
        postComment(){
            if (!this.commentContent){
            layer.msg('评论内容不能为空')
            return
            }
            this.closeCommentButtonFunc();

            this.commentContent = '';
        }
    }
}

module.exports = {
    my_blog_head,
    my_blog_comment
}



/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const {my_blog_head, my_blog_comment} = __webpack_require__(2)
const {getUserMessage, GetQueryValue, slowScroll} = __webpack_require__(1)

var blog_id = GetQueryValue('blog_id');

const app = new Vue({
    delimiters: ["{[", "]}"],
    el: '#app',
    data: {
        comment_list: [],
        comment_count: 0,
        more: true,
        start: 0,
        offset: 5,
        search: '',
        isLogin: 0,
        user_message: {},
        blogId: Number(blog_id)
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
        getComment(){
            if (this.more){
            let comment_data = getCommentList(this.start, this.offset, this.sort_by)
            this.start = this.start + this.offset;
            this.more = comment_data.more
            for (let item of comment_data.comment_list){
                this.comment_list.push(item)
            }

        }
        }
    },
    components: {
        'my-blog-head': my_blog_head,
        'my-blog-comment': my_blog_comment
    },
    beforeMount() {
        // 在页面挂载前就发起请求
        this.checkLogin();
        this.getComment();
    },

})

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
    const addLI = (index, itemText) => { result += '<li><a name="link" class="label"' + 'href="#' + index + '">' + itemText + "</a></li>\n"; }
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
            comment_data['more'] = data.more
        }, 'error': function (error) {
            console.log(error);

        }
    };
    $.ajax(op);
    return comment_data
}

function postComment(content){
    let token = localStorage.getItem('token');
    if (!token){
        layer.msg('请先登录')
        return
    }

}

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


/***/ })
/******/ ]);