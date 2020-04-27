// 头部组件
// 每个页面通用
const {getCookie} = require('./cookie.js')
const {checkUser} = require('./utils.js')

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
    data(){
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
        changeSearch(){
            window.location.href='/?search=' + this.search;
        },
        signIn(){
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
        signUp(){
            layer.open({
                title: '用户注册',
                content: '暂未开放',
                btn: ['注册', '取消'],
                yes: function (index, layero) {
                    layer.closeAll();
                }
            })
        },
        logout(){
            const csrf_token = getCookie('csrf_token')
            const op = {
                'url': '/api/restful/user/',
                'method': 'delete',
                'data': {
                    'token': localStorage.getItem('token')
                },
                'headers': {'X-CSRFToken':csrf_token},
                'success': function(data){
                    window.location.href='/'
                },'error': function(error){
                    window.location.href='/'
                }
            };
            $.ajax(op);
            localStorage.removeItem('token')
        },
        showUserMenu(){
            this.userMenuShow = !this.userMenuShow;
        }
    }
}

module.exports = {
    my_blog_head
}

