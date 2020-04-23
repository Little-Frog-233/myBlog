// 头部组件
// 每个页面通用

const head = `
<div>
    <nav style="border-bottom: 1px solid #f1f1f1;" id='my-blog-head'>
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
                    <li v-show="!isLogin">
                        <a href="javascript:void(0)" style="margin-left: 5px;">
                            登陆
                        </a>
                    </li>
                    <li v-show="!isLogin">
                        <a href="javascript:void(0)">
                            注册
                        </a>
                    </li>
                    <li v-show="isLogin">
                        <a href="">
                            <img src="http://task.zndex.com/show/logouser/zndex" alt="" class="user-picture">
                        </a>
                    </li>
                </ul>
            </div>
            <a id="menu-toggle" href="javascript:void(0)" class=" ">&#9776;</a>
        </div>
    </nav>
</div>
`;

const my_blog_head = {
    template: head,
    data: function(){
        return {

        }
    },
    propos: ['search', 'isLogin'],
    methods: {
        changeSearch(){
            window.location.href='/?search=' + this.search;
        },
    }
}

