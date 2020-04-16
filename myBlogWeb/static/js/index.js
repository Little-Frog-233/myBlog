console.log('求职，联系邮箱：1342468180@qq.com')
const app = new Vue({
    delimiters: ["{[", "]}"],
    el: '#app',
    data: {
        categories: getCategory(),
        now_category: '',
        now_tag: '',
        temp_content: `### 在很多情况下，我们会有把 Python 对象进行序列化或反序列化的需求 \n### 比如开发 REST API，比如一些面向对象化的数据加载和保存，都会应用到这个功能。比如这里看一个最基本的例子，这里给到一个 User 的 Class 定义，再给到一个 data 数据，像这样：`,
        blog_lists: [],
        start: 0,
        offset: 2,
        more: true,
        sort_by: 'update_time',
        elFix: '#menu-right',
        search: GetQueryValue('search'),
        searchBarFixed: false, //是否要固定单位
        oldScrollTop: 0, //记录固定单位的初始高度,
        showLoading: false,
        showBackTop: false
    },
    methods: {
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
            console.log('加载完成');
            
        },
        getBlogUrl(blog_id) {
            return '/blog_detail/?blog_id=' + blog_id;
        },
        handleScroll() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let offsetTop = document.querySelector(this.elFix).offsetTop;
            if (scrollTop > offsetTop) {
                this.searchBarFixed = true
                this.showBackTop = true
            } else {
                this.searchBarFixed = false
            }
            if (this.searchBarFixed){
                if (scrollTop < this.oldScrollTop){
                    this.searchBarFixed = false
                    this.showBackTop = false
                }
            }
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
    beforeMount() {
        // 在页面挂载前就发起请求
        this.getBlogList();
    },
    mounted() {
        window.addEventListener('scroll', this.scroll)
        // this.scroll();
        this.oldScrollTop = document.querySelector(this.elFix).offsetTop;
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed() {
        window.removeEventListener('scroll', this.scroll)
        window.removeEventListener('scroll', this.handleScroll)
    },
})

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
            console.log(error);
        }
    };
    $.ajax(op);
    return blog_data
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