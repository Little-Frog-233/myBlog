// 头部组件
// 每个页面通用

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
                            <img src="http://task.zndex.com/show/logouser/zndex" alt="" class="user-picture">
                            <p class="user-nickname">小蛤蛤</p>
                            <dl>
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
                <input type="text" id="usermail" name="usermail" autocomplete="off" v-model="usermail">
            </label>
        </div>
        <div>
            <label for="password">密码: 
                <input type="password" id="password" name="password" autocomplete="off" v-model="password">
            </label>
        </div>
        <div>
            <label for="captcha">验证码:
                <input type="text" id="captcha" name="captcha" autocomplete="off" v-model="captcha">
            </label>
            <br>
            <img src="http://127.0.0.1:7000/captcha/" alt="" title="点击更换验证码" onclick="this.src='/captcha?'+ Math.random()"/>
        </div>
</form>
`

const my_blog_head = {
    template: head_html,
    props: {
        isLogin: {
            type: Number,
            default: 0
        },
        search: {
            type: String,
            default: ''
        },
        user_message: {

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
                    const usermail = $('#usermail').val();
                    const password = $('#password').val();
                    const captcha = $('#captcha').val();
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
        }
    }
}

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

