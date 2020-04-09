/**
 * Created by ruicheng on 2020/3/3.
 */
const app = new Vue({
    delimiters: ["{[", "]}"],
    el: '#url_app',
    data: {
        navigation_show: true,
        now_url_name: '概览',
        in_urls:['概览'],
        url_list: [{
            name: '概览',
            url: '/overview/'
        }]
    },
    methods: {
        // 增加页眉显示的网页
        addUrl(name, url){
            this.now_url_name = name;
            let urls = [];
            let url_index;
            for (let item_index in this.url_list){
                urls.push(this.url_list[item_index].name);
            }
            if (!urls.includes(name)){
              this.url_list.push({
                name: name,
                url: url
            });
            }
            for (let item_index in this.url_list){
                if (this.url_list[item_index].name == name){
                    url_index = Number(item_index);
                    console.log(url_index);
                }
            }
            if (url_index != (this.url_list.length-1)){
                console.log(this.url_list.length-1, url_index);
                this.url_list.splice(url_index+1, this.url_list.length-url_index-1);
            }
        },
        // 用于点击页眉显示的网页实现页面跳转
        // 用到了jquery
        changePage(url, index){
            this.now_url_name = this.url_list[index].name;
            this.url_list.splice(index+1, this.url_list.length-index);

            var address =url;
            $("iframe").attr("src",address);
            var frame = $("#aa");
            var frameheight = $(window).height();
            console.log(frameheight);
            frame.css("height",frameheight);
        },
        // 用于获取当前选项
        getLayuiThisClass(url_name){
            return {'layui-this': url_name == this.now_url_name}
        },
        getNavigationClass(){
            return {'layui-icon-shrink-right': this.navigation_show, 'layui-icon-spread-left': !this.navigation_show}
        },
        changeNavigationClass(){
            this.navigation_show = !this.navigation_show
        },
        cleanUrl(){
            this.url_list = [{
            name: '概览',
            url: '/overview'
        }];
            this.now_url_name = '概览';
            var address ='/overview';
            $("iframe").attr("src",address);
            var frame = $("#aa");
            var frameheight = $(window).height();
            console.log(frameheight);
            frame.css("height",frameheight);
        }
    }
});