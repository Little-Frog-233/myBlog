<template>
<div class="comment-input" :id="'comment-content-input-' + randomId">
    <div>
    <input type="text" :placeholder="inputPlaceHolder" @focus="showCommentButtonFunc()"  v-model:value="commentContent" :id="'comment-content-input-input-' + randomId">
    </div>
    <div style="float: right;margin-top: 10px;" v-show="showCommentButton">
        <button style="background-color: #027fff;color: white;padding: .2rem 1.1rem;" :id="'comment-content-input-input-button-' + randomId" @click="postComment()">评论</button>
    </div>
</div>
</template>

<script>
const { checkUser, postComment } = require('../js/utils.js')

export default {
    name: "my_blog_comment",
    // delimiters: ["{[", "]}"],
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
        inputPlaceHolder: {
            type: String,
            default: '   请输入评论'
        },
        blogId: {
            type: Number,
            default: 0
        },
        commentId: {
            type: Number,
            default: 0
        },
        repliedId: {
            default: null
        },
        repliedUserId: {
            default: null
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
            let comment_message = postComment(this.blogId, this.commentContent);
            // 发射事件，由父组件接收事件
            if (comment_message){
                console.log('咻～');
                this.$emit('comment-commit', comment_message)
            }
            }else if (this.inputType == 'reply'){
                layer.msg('回复功能爷还没整出来')
            }
            this.commentContent = '';
        }
    },
    computed: {
            randomId() {
                var Num = "";
                for (var i = 0; i < 6; i++) {
                    Num += Math.floor(Math.random() * 10);
                }
                return Num;
            }
        },
    created() {
        let body = document.querySelector('body')
        body.addEventListener('click',(e)=>{        
        if(e.target.id == 'comment-content-input-' + this.randomId || e.target.id == 'comment-content-input-input-' + this.randomId || e.target.id == 'comment-content-button-' + this.randomId){
        }else{
            this.showCommentButton = false
        }
        },false)
    },
}
</script>

<style>

</style>