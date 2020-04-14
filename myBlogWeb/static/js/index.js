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
        offset: 1,
        more: true,
        sort_by: 'update_time'
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
        changeNowCategory(item) {
            this.now_category = item;
            this.now_tag = '';
        },
        changeNowTag(item) {
            this.now_tag = item
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
            if (this.start == 0){
                this.blog_lists = []
            }
            if (this.more) {
                let blog_data = getBlogDataFunc(this.start, this.offset, this.category, this.tag, this.sort_by);
                this.start = this.start + this.offset;
                this.more = blog_data.more;
                for (item of blog_data.blog_list) {
                    this.blog_lists.push(item)
                }          
            }
        },
        getBlogUrl(blog_id){
            return '/blog_detail/?blog_id=' + blog_id;
        },
        scroll(blog_list) {
            let isLoading = false
            window.onscroll = () => {
                // 距离底部200px时加载一次
                let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 200
                if (bottomOfWindow && isLoading == false) {
                    isLoading = true
                    this.getBlogList();
                    isLoading = false
                }
            }
        }
    },
    beforeMount() {
        // 在页面挂载前就发起请求
        this.getBlogList()
    },
    mounted() {
        this.scroll(this.blog_lists)
      }
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

function getBlogDataFunc(start, offset, category, tag, sort_by) {
    let blog_data = {};
    const op = {
        'method': 'get',
        'url': '/api/restful/blog_list/',
        'data': {
            'category': category,
            'tag': tag,
            'start': start,
            'offset': offset,
            'sort_by': sort_by
        },
        'async': false,
        'success': function (data) {
            blog_data['blog_list'] = data.blog_list
            blog_data['more'] = data.more
        }, 'error': function (error) {
            console.log(error);
        }
    };
    $.ajax(op);
    return blog_data
}