<template>
  <div class="comment-reply-list comment-list">
    <ul>
      <li class="comment-li" v-for="(item, index) in replyList.slice(0, showTotal)" :key="item.id">
        <div class="comment-item">
          <div class="comment-head">
            <img :src="'/show/logouser/' + item.user_picture" alt class="user-picture" />
          </div>
          <div class="comment-reply-content">
            <div style="font-size: 13px;">
              {{item.user_nickname}}
              <p v-if="item.user_admin==1">(作者)</p>
            </div>
            <div style="margin-top: 10px;" v-if="item.replied_id">回复<span style="color: #406599">{{item.reply_nickname}}</span>: {{item.content}}</div>
            <div style="margin-top: 10px;" v-else>{{item.content}}</div>
            <div style="margin-top: 20px;color: #8a9aa9;">
              <div
                style="font-size: 12px;display: inline-block;float: left;"
              >{{getTime(item.update_time)}}</div>
              <ul
                class="meta-list content-meta-list comment-meta-list"
                style="float: right;"
                v-if="isLogin==1"
              >
                <!-- <li>
                  <i
                    title="点赞"
                    class="iconfont icon-item"
                    style="font-size: 16px;padding: 0px;"
                  >{{item.like_count}}</i>
                </li>-->
                <li>
                  <a href="javascript:void(0)" @click="showReplyReplyInput(item.id)">
                    <i
                      class="iconfont icon-item"
                      title="回复"
                      style="font-size: 16px;padding: 0px;margin-left: 10px;"
                    >&#xe8b4;</i>
                  </a>
                </li>
                <li v-if="userMessage.id == item.user_id">
                  <a @click="deleteReplyFunc(item.id)" href="javascript:void(0)">
                    <i
                      class="iconfont icon-item"
                      title="删除"
                      style="font-size: 16px;padding: 0px;margin-left: 10px;"
                    >&#xe8b6;</i>
                  </a>
                </li>
              </ul>
            </div>
            <br>
            <div class="reply-input" v-if="isShowReplyCommentInput == item.id && replyListId==nowReplyListId">
              <reply-comment-input
                :blog-id="blogId"
                :input-place-holder="'   回复' + item.user_nickname"
                :input-type="'reply'"
                :comment-id="item.comment_id"
                :replied-id="item.id"
                :replied-user-id="item.user_id"
                v-on:reply-commit="getReplyCommit"
                style="width: 100%;"
              ></reply-comment-input>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-show="replyCount > showTotal && !isShowMore" class="show-more">
      <a href="javascript:void(0)" @click="showMore()">
        <h5 style="color: rgb(138, 154, 169);">展开剩余{{replyCount - showTotal}}条回复</h5>
      </a>
    </div>
    <ul v-if="isShowMore">
      <li class="comment-li" v-for="(item, index) in replyList.slice(showTotal, )" :key="item.id">
        <div class="comment-item">
          <div class="comment-head">
            <img :src="'/show/logouser/' + item.user_picture" alt class="user-picture" />
          </div>
          <div class="comment-reply-content">
            <div style="font-size: 13px;">
              {{item.user_nickname}}
              <p v-if="item.user_admin==1">(作者)</p>
            </div>
            <div style="margin-top: 10px;" v-if="item.replied_id">'回复' + {{item.reply_nickname}} + ': ' + {{item.content}}</div>
            <div style="margin-top: 10px;" v-else>{{item.content}}</div>
            <div style="margin-top: 20px;color: #8a9aa9;">
              <div
                style="font-size: 12px;display: inline-block;float: left;"
              >{{getTime(item.update_time)}}</div>
              <ul
                class="meta-list content-meta-list comment-meta-list"
                style="float: right;"
                v-if="isLogin==1"
              >
                <!-- <li>
                  <i
                    title="点赞"
                    class="iconfont icon-item"
                    style="font-size: 16px;padding: 0px;"
                  >{{item.like_count}}</i>
                </li>-->
                <li>
                  <a @click="showReplyReplyInput(item.id)" href="javascript:void(0)">
                    <i
                      class="iconfont icon-item"
                      title="回复"
                      style="font-size: 16px;padding: 0px;margin-left: 10px;"
                    >&#xe8b4;</i>
                  </a>
                </li>
                <li v-if="userMessage.id == item.user_id">
                  <a @click="deleteReplyFunc(item.id)" href="javascript:void(0)">
                    <i
                      class="iconfont icon-item"
                      title="删除"
                      style="font-size: 16px;padding: 0px;margin-left: 10px;"
                    >&#xe8b6;</i>
                  </a>
                </li>
              </ul>
            </div>
            <br>
            <div class="reply-input" v-if="isShowReplyCommentInput == item.id">
              <reply-comment-input
                :blog-id="blogId"
                :input-place-holder="'   回复' + item.user_nickname"
                :input-type="'reply'"
                :comment-id="item.comment_id"
                :replied-id="item.id"
                :replied-user-id="item.user_id"
                v-on:reply-commit="getReplyCommit"
                style="width: 100%;"
              ></reply-comment-input>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import my_blog_comment from "./Comment.vue";
const {
  getReplyList,
  handlePublishTimeDesc,
  deleteReply
} = require("../js/utils.js");

export default {
  name: "my_blog_reply_list",
  data() {
    return {
      isShowMore: false,
      showTotal: 2,
      isShowReplyCommentInput: -1
    };
  },
  props: {
    isLogin: {
      type: Number,
      default: 0
    },
    blogId: {
      type: Number
    },
    isLogin: {
      type: Number,
      default: 0
    },
    userMessage: {},
    commentId: {
      type: Number
    },
    replyList: {
      type: Array,
      default: []
    },
    replyCount: {
      type: Number,
      default: 0
    },
    replyListId: {
        type: Number
    },
    nowReplyListId: {
        type: Number
    }
  },
  methods: {
    showMore() {
      if (this.replyCount - this.showTotal < 10) {
        this.isShowMore = true;
      }
    },
    getRepliesAll() {
      this.replyListTemp = this.replyList;
    },
    getTime(time) {
      return handlePublishTimeDesc(time);
    },
    showReplyReplyInput(reply_id) {
    //   layer.msg("功能暂未开放");
    if (this.isShowReplyCommentInput == reply_id){
        this.isShowReplyCommentInput = -1
        this.$emit("now-reply-id", -1);
        return
    }
    this.isShowReplyCommentInput = reply_id;
    this.$emit("now-reply-id", this.replyListId);
    },
    deleteReplyFunc(reply_id) {
      let reply_delete_message = {
        reply_id: reply_id,
        comment_id: this.commentId
      };
      deleteReply(reply_id, this.commentId, this.blogId);
      this.$emit("reply-delete", reply_delete_message);
    },
    getReplyCommit(content){
        this.replyList.unshift(content)
    }
  },
  components: {
    "reply-comment-input": my_blog_comment
  }
};
</script>

<style>
</style>