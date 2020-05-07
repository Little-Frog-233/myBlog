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
            <div style="margin-top: 10px;">{{item.content}}</div>
            <div style="margin-top: 20px;color: #8a9aa9;">
              <div
                style="font-size: 12px;display: inline-block;float: left;"
              >{{getTime(item.update_time)}}</div>
              <ul class="meta-list content-meta-list comment-meta-list" style="float: right;" v-if="isLogin==1">
                <!-- <li>
                  <i
                    title="点赞"
                    class="iconfont icon-item"
                    style="font-size: 16px;padding: 0px;"
                  >{{item.like_count}}</i>
                </li> -->
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
            <div style="margin-top: 10px;">{{item.content}}</div>
            <div style="margin-top: 20px;color: #8a9aa9;">
              <div
                style="font-size: 12px;display: inline-block;float: left;"
              >{{getTime(item.update_time)}}</div>
              <ul class="meta-list content-meta-list comment-meta-list" style="float: right;" v-if="isLogin==1">
                <!-- <li>
                  <i
                    title="点赞"
                    class="iconfont icon-item"
                    style="font-size: 16px;padding: 0px;"
                  >{{item.like_count}}</i>
                </li> -->
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
  </div>
</template>

<script>
import my_blog_comment from "./Comment.vue";
const { getReplyList, handlePublishTimeDesc } = require("../js/utils.js");

export default {
  name: "my_blog_reply_list",
  data() {
    return {
        isShowMore: false,
        showTotal: 2
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
    }
  },
  methods: {
    showMore(){
        if (this.replyCount - this.showTotal < 10){
        this.isShowMore = true;
        }
    },
    getRepliesAll(){
        this.replyListTemp = this.replyList
    },
    getTime(time) {
      return handlePublishTimeDesc(time);
    }
  },
};
</script>

<style>
</style>