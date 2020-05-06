<template>
  <div class="comment-reply-list comment-list">
    <ul>
      <li class="comment-li" v-for="(item, index) in replyListTemp" :key="item.id">
        <div class="comment-item">
          <div class="comment-head">
            <img :src="'/show/logouser/' + item.user_picture" alt class="user-picture" />
          </div>
          <div class="comment-reply-content">
            <div style="font-size: 13px;">
              {{item.user_nickname}}
              <p v-if="item.user_admin==1">(作者)</p>
            </div>
            <div style="margin-top: 10px;">{{item.content}}</div>
            <div style="margin-top: 20px;color: #8a9aa9;">
              <div
                style="font-size: 12px;display: inline-block;float: left;"
              >{{getTime(item.update_time)}}</div>
              <ul class="meta-list content-meta-list comment-meta-list" style="float: right;">
                <li>
                  <i
                    title="点赞"
                    class="iconfont icon-item"
                    style="font-size: 16px;padding: 0px;"
                  >{{item.like_count}}</i>
                </li>
                <li>
                  <i
                    class="iconfont icon-item"
                    title="回复"
                    style="font-size: 16px;padding: 0px;margin-left: 10px;"
                  >&#xe8b4;</i>
                </li>
                <li v-if="userMessage.id == item.user_id">
                  <i
                    class="iconfont icon-item"
                    title="删除"
                    style="font-size: 16px;padding: 0px;margin-left: 10px;"
                    @click
                  >&#xe8b6;</i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-show="more" class="show-more">
        <a @click="getReplies()" href="javascript:void(0)">
      <h5 style="color: rgb(138, 154, 169);">加载更多回复</h5>
      </a>
    </div>
  </div>
</template>

<script>
import my_blog_comment from "./Comment.vue";
const { getReplyList, handlePublishTimeDesc } = require("../js/utils.js");

export default {
  name: "my_blog_reply_list",
  data() {
    return {
      start: 0,
      offset: 1,
      more: true,
      replyListTemp: []
    };
  },
  props: {
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
        dafault: []
    }
  },
  methods: {
    getReplies() {
      if (this.more) {
          let end = this.start + this.offset;
          for (let item of this.replyList.slice(this.start, end)){
              this.replyListTemp.push(item)
          }
          if (end >= this.replyList.length){
              this.more = false
          }
          this.start = this.start + this.offset
      }
    },
    getTime(time) {
      return handlePublishTimeDesc(time);
    }
  },
  created() {
    this.getReplies();
  }
};
</script>

<style>
</style>