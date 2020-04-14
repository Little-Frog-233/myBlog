console.log('求职，联系邮箱：1342468180@qq.com')
const app = new Vue({
    delimiters: ["{[", "]}"],
    el: '#app',
    data: {
        categories: getCategory(),
        now_category: '',
        now_tag: ''
    },
    methods: {
        getCategoryClass(item){
            return {'layui-this': item == this.now_category}
        },
        getTagClass(item){
            return {'tag-activate': item == this.now_tag}
        },
        getTagStyle(item){
            if (item == this.now_tag){
                return {'color': 'rgb(2, 117, 248)'}
            }
        },
        changeNowCategory(item){
            this.now_category = item;
            this.now_tag = '';
        },
        changeNowTag(item){
            this.now_tag = item
        },
        getTags(){
            return getTag(this.now_category)
        }
    }
})

function getCategory(){
    let category = [];
    let op = {
        'method': 'get',
        'url': '/api/restful/category/',
        'data': '',
        'async': false,
        'success': function(data){
            category = data.category_list
        },'error': function(error){
            console.log(error);
        }
    };
    $.ajax(op);
    return category
}

function getTag(category){
    let tag = [];
    let op = {
        'method': 'get',
        'url': '/api/restful/tag/',
        'data': {
            'category': category
        },
        'async': false,
        'success': function(data){
            tag = data.tags
        },'error': function(error){
            console.log(error);
        }
    };
    $.ajax(op);
    return tag
}