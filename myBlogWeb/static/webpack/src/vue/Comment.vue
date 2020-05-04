<template>
<div class="comment-input">
    <div>
    <input type="text" placeholder="   请输入评论..." @focus="showCommentButtonFunc()"  v-model:value="commentContent">
    </div>
    <div style="float: right;margin-top: 10px;" v-show="showCommentButton">
        <button style="background-color: #027fff;color: white;padding: .2rem 1.1rem;" @click="postComment()">评论</button>
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
            let comment_message = postComment(this.blogId, this.commentContent);
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
</script>

<style>

</style>