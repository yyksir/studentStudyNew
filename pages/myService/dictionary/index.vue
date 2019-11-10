<!-- 我的词典 -->
<template>
  <div class="dictionaryConatiner">
    <a-spin style="
      width: 100%;height: 100%;position: fixed;left: 0;top: 0;z-index: 999;
      display: flex;flex-direction: column;;justify-content: center;align-items: center;
      background-color: rgba(0, 0, 0, .5)
      "
      size="large"
      v-show="spinning"
    />
    <header class="dictionaryHeader">
      <span class="dictionaryText">我的词典</span>
    </header>
    <main class="dictionaryMainContainer">
      <div class="left">
        <div class="textareaContainer" style="position: relative;">
            <!-- onpropertychange="this.style.height = this.scrollHeight + 'px';" -->
            <!-- oninput="this.style.height='auto';this.style.height = this.scrollHeight + 'px'" -->
          <textarea class="textarea" ref="textarea" placeholder="请输入关键字进行翻译"
            v-model="translate"
            @input="oninput()"
          ></textarea>
          <a-icon class="btnClearTextarea" type="close" style="cursor: pointer;"
            @click="handleBtnClearTextareaClick"
          />
          <div class="histroy">
            <div class="histroyTop">
              <span class="histroyTitle">历史记录</span>
              <a href="javascript:;" class="btnClear"
                v-if="this.storageArr.length > 0"
                @click="handleBtnClearHistroyClick"
              >清除</a>
            </div>
            <div class="tagContainer">
              <a-tag
                v-for="(tag, tagIndex) of storageArr"
                :key="tagIndex"
                @click="handleTagClick(tag)"
              >{{tag}}</a-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="textareaContainer searchResContainer"
          v-text="searchRes"
        >
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import {
  debounce
} from '@/assets/utils/index.js'

export default {
  layout: 'index',
  data () {
    return {
      spinning: false,
      searchRes: '',
      storageArr: [],
      translate: ''
    }
  },
  created () {
    setTimeout(() => {
      this.$nextTick(() => {
        this.storageArr = Object.keys(localStorage)
      })
    }, 3000)
  },
  methods: {
    oninput () {
      const textareaDom = this.$refs.textarea
      textareaDom.height = 'auto'
      textareaDom.height = textareaDom.scrollHeight + 'px'
      if (!this.translate) { return }
      debounce(() => {
        this.queryInfo()
      }, 500)
    },
    // 查询翻译结果
    queryInfo (tag) {
      let params = {
        translate: ''
      }
      if (tag) {
        params.translate = tag
      } else {
        params.translate = this.translate
      }
      this.spinning = true
      this.$API.POST('/census/translate', params)
        .then((res) => {
          this.spinning = false
          if (res && res.hasOwnProperty('code') && res.data) {
            if (this.translate && res.data) {
              localStorage.setItem(this.translate, this.translate)
            }
            this.searchRes=  res.data || ''
            this.storageArr = Object.keys(localStorage)
          } else {
            this.searchRes=  ''
            this.$message.warning('暂无数据')
          }
        })
        .catch((err) => {
          this.spinning = false
          console.log(err, 'err 翻译接口调用失败')
          // this.setEmptyData()
          this.$message.error(err.message + '翻译接口调用失败, 联系管理员')
        })
    },
    // 历史记录标签被点击
    handleTagClick (tag) {
      this.translate = tag
      this.queryInfo(tag)
    },
    // 清除历史记录
    handleBtnClearHistroyClick () {
      this.storageArr.length > 0 && this.storageArr.forEach((ele) => {
        localStorage.removeItem(ele)
      })
      this.storageArr = Object.keys(localStorage)
    },
    // 清除输入内容
    handleBtnClearTextareaClick () {
      if (this.translate === ''){ return }
      this.translate = ''
    }
    //
  }
}
</script>

<style lang="stylus" scoped>
  .dictionaryConatiner
    width 100%
    height 100%
    display flex
    flex-direction column
    justify-content flex-start
    align-items center
    .dictionaryHeader
      box-sizing border-box
      display flex
      justify-content space-between
      align-items center
      width 100%
      height 56px
      padding 34px
      background-color #fff
      .dictionaryText
        font-size 20px
        font-weight 600
    .dictionaryMainContainer
      display flex
      justify-content space-between
      align-items center
      flex-wrap nowrap
      box-sizing border-box
      width 100%
      flex 1
      padding 0 30px
      padding-top 30px
      .left
        width 49%
        height 100%
        background-color transparent
      .right
        width 49%
        height 100%
        // background-color purple
      .textareaContainer
        width 100%
        min-height 220px
        // padding-top 1px
        border-radius 8px
        .textarea
          box-sizing border-box
          width 100%
          min-height 220px
          padding 20px
          border 1px solid rgba(0,0,0,0.12)
          border-radius 8px
          overflow: auto hidden;
          outline none
          resize none
          background-color #fff
        .btnClearTextarea
          display block
          width 20px
          height 20px
          position absolute
          right 10px
          top 10px
        .histroy
          box-sizing border-box
          width 100%
          min-height 112px
          margin-top 40px
          padding: 20px;
          border 1px solid rgba(0,0,0,0.12)
          border-radius 8px
          .histroyTop
            width 100%
            height 16px;
            display flex
            justify-content space-between
            align-items center
            .btnClear
              color #aaa
          .tagContainer
            width 100%
            min-height 40px
            margin-top 16px
            display flex
            justify-content flex-start
            align-items center
            flex-wrap wrap
            overflow hidden
      .searchResContainer
          box-sizing border-box
          padding 20px
          background-color #fff
</style>
