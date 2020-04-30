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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
            if (error.responseJSON.message){
            layer.msg(error.responseJSON.message)
            }else{
                layer.msg('发生错误，请稍后重试')
            }
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

function postComment(blog_id, content){
    const csrf_token = getCookie('csrf_token');
    const token = localStorage.getItem('token');
    let comment_message;
    if (!token){
        layer.msg('请登陆')
    }
    let op = {
        'method': 'post',
        'url': '/api/restful/comment_list/',
        'data': {
            'token': token,
            'blog_id': blog_id,
            'content': content,
        },
        'async': false,
        'headers': { 'X-CSRFToken': csrf_token },
        'success': function(data){
            layer.msg('评论成功');
            comment_message = data.data.comment_message
        },'error':function(error){
            if (error.responseJSON.message){
            layer.msg(error.responseJSON.message)
            }else{
                layer.msg('发生错误，请稍后重试')
            }
        }        
    };
    $.ajax(op);
    return comment_message
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

function getTs(time){
    var arr = time.split(/[- :]/),
    _date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]),
    timeStr = Date.parse(_date)
    return timeStr
}    
function handlePublishTimeDesc(post_modified){
        // 拿到当前时间戳和发布时的时间戳，然后得出时间戳差
        var curTime = new Date();
        var postTime = new Date(post_modified);                  //部分浏览器不兼容此转换建议所以对此进行补充（指定调用自己定义的函数进行生成发布时间的时间戳）
        
        //var timeDiff = curTime.getTime() - postTime.getTime();
        //上面一行代码可以换成以下（兼容性的解决）
        var timeDiff = curTime.getTime() - getTs(post_modified);
 
        // 单位换算
        var min = 60 * 1000;
        var hour = min * 60;
        var day = hour * 24;
        var week = day * 7;
        var month =  week*4;
        var year = month*12;
 
        // 计算发布时间距离当前时间的周、天、时、分
        var  exceedyear = Math.floor(timeDiff/year);
        var exceedmonth = Math.floor(timeDiff/month);
        var exceedWeek = Math.floor(timeDiff/week);
        var exceedDay = Math.floor(timeDiff/day);
        var exceedHour = Math.floor(timeDiff/hour);
        var exceedMin = Math.floor(timeDiff/min);
 
        
        // 最后判断时间差到底是属于哪个区间，然后return
 
        if(exceedyear<100&&exceedyear>0){
            return exceedyear + '年前';
            }else{
            if(exceedmonth<12&&exceedmonth>0){
                return exceedmonth + '月前';
                }else{
                if(exceedWeek<4&&exceedWeek>0){
                    return exceedWeek + '星期前';
                    }else{
                    if(exceedDay < 7 && exceedDay > 0){
                        return exceedDay + '天前';
                        }else {
                        if (exceedHour < 24 && exceedHour > 0) {
                            return exceedHour + '小时前';
                        } else {
                            return exceedMin + '分钟前';
                        }
                    }
                    }
                }
            }
    }

module.exports = {
    checkUser,
    getUserMessage,
    GetQueryValue,
    slowScroll,
    postComment,
    handlePublishTimeDesc
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
                    <li v-if="isLogin==0">
                        <a href="javascript:void(0)" style="margin-left: 5px;" @click="signIn()">
                            登陆
                        </a>
                    </li>
                    <li v-if="isLogin==0">
                        <a href="javascript:void(0)" @click="signUp()">
                            注册
                        </a>
                    </li>
                    <li v-if="isLogin==1">
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
    <input type="text" placeholder="   请输入评论..." @focus="showCommentButtonFunc()"  v-model:value="commentContent">
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
            type: Number,
            default: 0
        },
        commentId: {
            type: Number,
            default: 0
        }
    },
    methods: {
        showCommentButtonFunc(){
            this.showCommentButton = true;
            // if (this.commentContent){
            // this.showCommentButton = true;
            // }else{
            //     this.showCommentButton = false;
            // }            
        },
        closeCommentButtonFunc(){
            this.showCommentButton = false;
        },
        postComment(){
            if (!this.commentContent){
            layer.msg('评论内容不能为空')
            return
            }
            if (this.commentContent.length > 140){
                layer.msg('字数过多')
                return
            }
            this.closeCommentButtonFunc();
            if (this.inputType == 'comment'){
            comment_message = postComment(this.blogId, this.commentContent);
            // 发射事件，由父组件接收事件
            if (comment_message){
                console.log('咻～');
                this.$emit('comment-commit', comment_message)
            }
            }
            this.commentContent = '';
        }
    }
}

module.exports = {
    my_blog_head,
    my_blog_comment
}



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const {my_blog_head} = __webpack_require__(2)
const {getUserMessage, GetQueryValue, slowScroll} = __webpack_require__(1)

// console.log('求职，联系邮箱：1342468180@qq.com')
const app = new Vue({
    delimiters: ["{[", "]}"],
    el: '#app',
    data: {
        categories: getCategory(),
        now_category: '',
        now_tag: '',
        blog_lists: [],
        start: 0,
        offset: 2,
        more: true,
        sort_by: 'update_time',
        elFix: '#menu-right',
        search: GetQueryValue('search'),
        searchBarFixed: false, //是否要固定单位
        oldScrollTop: 70, //记录固定单位的初始高度,
        showLoading: false,
        showBackTop: false,
        login: 0,
        user_message: {}
    },
    methods: {
        checkLogin(){
            console.log('check user');
            let u_m = getUserMessage();
            if (u_m){
                console.log('change status');
                this.login = 1;
                this.user_message = u_m
            }
        },
        getCategoryClass(item) {
            return { 'layui-this': item == this.now_category }
        },
        getTagClass(item) {
            return { 'tag-activate': item == this.now_tag }
        },
        getTagStyle(item) {
            if (item == this.now_tag) {
                return { 'color': 'rgb(2, 117, 248)' }
            }
        },
        changeSearch(){
            window.location.href='/?search=' + this.search;
        },
        changeNowCategory(item) {
            this.now_category = item;
            this.now_tag = '';
            this.more = true;
            this.start = 0;
            this.getBlogList();
        },
        changeNowTag(item) {
            this.now_tag = item
            this.more = true;
            this.start = 0;
            this.getBlogList();
        },
        getTags() {
            return getTag(this.now_category)
        },
        getContent(content) {
            const converter = new showdown.Converter();
            content = converter.makeHtml(content);
            const max_length = 130;
            content = content.replace(/<.*?>/g, '')
            if (content.length > max_length) {
                c_1 = content.substr(0, max_length);
                content = c_1 + '...'
                return content
            } else {
                return content + '...'
            }
        },
        getBlogList() {
            if (this.start == 0) {
                this.blog_lists = []
            }

            if (this.more) {
                let blog_data = getBlogDataFunc(this.start, this.offset, this.now_category, this.now_tag, this.sort_by, this.search);
                this.start = this.start + this.offset;
                this.more = blog_data.more;
                for (item of blog_data.blog_list) {
                    this.blog_lists.push(item)
                }
            }
        },
        getBlogUrl(blog_id) {
            return '/blog_detail/?blog_id=' + blog_id;
        },
        handleScroll() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let offsetTop = document.querySelector(this.elFix).offsetTop;
            // if (scrollTop > offsetTop) {
            if (scrollTop > 55) {
                this.searchBarFixed = true
                this.showBackTop = true
            } else {
                this.searchBarFixed = false
                this.showBackTop = false
            }
            // if (this.searchBarFixed){
            //     if (scrollTop < this.oldScrollTop){
            //         this.searchBarFixed = false
            //         this.showBackTop = false
            //     }
            // }
        },
        getBarFixedClass(){
            return {'active': this.searchBarFixed}
        },
        scroll() {
            let diffHeight = 200;
            if ( document.body.offsetWidth <= 900){
                diffHeight = 100;
            }
            let isLoading = false
            // 距离底部200px时加载一次
            let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= diffHeight
            if (this.more){
            if (bottomOfWindow && isLoading == false) {
                isLoading = true
                this.showLoading = true
                this.getBlogList(), 5000;
                this.showLoading = false
                isLoading = false
            }}
        }
    },
    components: {
        'my-blog-head': my_blog_head
    },
    beforeMount() {
        // 在页面挂载前就发起请求
        this.checkLogin();
        this.getBlogList();
    },
    mounted() {
        // 挂载以后发起请求
        window.addEventListener('scroll', this.scroll)
        // this.scroll();
        this.oldScrollTop = document.querySelector(this.elFix).offsetTop;
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
        window.removeEventListener('scroll', this.scroll)
        window.removeEventListener('scroll', this.handleScroll)
    },
})

$(document).ready(function () {
    slowScroll();
});


function getCategory() {
    let category = [];
    let op = {
        'method': 'get',
        'url': '/api/restful/category/',
        'data': '',
        'async': false,
        'success': function (data) {
            category = data.category_list
        }, 'error': function (error) {
            console.log(error);
        }
    };
    $.ajax(op);
    return category
}

function getTag(category) {
    let tag = [];
    let op = {
        'method': 'get',
        'url': '/api/restful/tag/',
        'data': {
            'category': category
        },
        'async': false,
        'success': function (data) {
            tag = data.tags
        }, 'error': function (error) {
            console.log(error);
        }
    };
    $.ajax(op);
    return tag
}

function getBlogDataFunc(start, offset, category, tag, sort_by, search) {
    let blog_data = {};
    const op = {
        'method': 'get',
        'url': '/api/restful/blog_list/',
        'data': {
            'category': category,
            'tag': tag,
            'start': start,
            'offset': offset,
            'sort_by': sort_by,
            'search': search
        },
        'async': false,
        'success': function (data) {
            blog_data['blog_list'] = data.blog_list;
            blog_data['more'] = data.more;
            if(search){
                layer.msg('为您搜索到' + data.total + '条博客');
            }
        }, 'error': function (error) {
            console.log(error.responseJSON);
        }
    };
    $.ajax(op);
    return blog_data
}



/***/ })
/******/ ]);