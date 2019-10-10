<!-- 测试成绩详情 -->
<template>
  <div class="container">
    <header class="header">
      <span class="title">测试成绩</span>
    </header>
    <div class="courseInfoContainer">
      <div class="floor1">
        <span>产品名称 · 测试课程 · 课程名称 · 辨音</span>
      </div>
      <div class="floor2">
        <span>测试内容：章节一、章节二</span>
      </div>
      <div class="floor3">
        <span>（共50题  对34题 错23题 时常 34分23秒）</span>
      </div>
      <div class="floor4">
        <span>2019-08-07 19:02:17 姓名：张航 成绩：99分</span>
      </div>
    </div>
    <ul class="ulElem">
      <li class="liElem"
        v-for="(item, itemindex) of 20"
        :key="itemindex"
      >
        <span class="liElemTop">
          <span class="serialNumber">1、</span>
          <span class="wordName">because</span>
          <span class="meaning">单词的意思</span>
          <span class="answer">(A)</span>
        </span>
        <span class="liElemBottom">
          <span class="optionSelect active">A、哈哈</span>
          <span class="optionSelect">B、发广告广告</span>
          <span class="optionSelect">C、风格化风格化</span>
          <span class="optionSelect">D、发广告风格豆腐干</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      detailArr: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getDetail()
    },
    getDetail () {
      if (!this.$route.params.hasOwnProperty('id')) {
        this.$message.warning('地址非法')
        this.$router.go(-1)
        return
      }
      this.$API.POST('/census/getOneTestRrecord', { id: this.$route.params.id })
        .then((res) => {
          console.log(_.cloneDeep(res.data), 'res 试卷详情')
          if (res && res.hasOwnProperty('code') && res.code === 0) {
            this.detailArr = res.data
            return false
          }
          this.detailArr = []
        })
        .catch((err) => {
          this.detailArr = []
          this.$message.error('获取试卷详情失败， 联系管理员: ' + err.msg)
          console.log(err, 'err 获取试卷详情失败， 联系管理员')
        })
    }
    //
  }
}
</script>

<style lang="stylus" scoped>
  .container
    display flex
    flex-direction column
    justify-content flex-start
    align-items center
    width 100%
    height 100%
    .header
      box-sizing border-box
      width 100%
      height 56px
      padding 0 130px 30px 130px
      .title
        line-height 56px
        font-size 20px
        font-weight 600
    .courseInfoContainer
      display flex
      flex-direction column
      justify-content center
      align-items center
      width 100%
      height 242px
      border-top 1px solid #ccc
      border-bottom 1px solid #ccc
      .floor1, .floor2, floor3, floor4
        width 100%
        height 28px
        font-size 28px
        line-height 28px
        text-align center
        color #505979
      .floor2
        font-size 22px
        line-height 22px
        margin-top 22px
        color #68708a
      .floor3
        font-size 18px
        line-height 18px
        margin-top 24px
        margin-bottom 40px
        color #9ea4b6
      .floor4
        font-size 16px
        line-height 16px
        color #878da1
    .ulElem
      box-sizing border-box
      width 100%
      flex 1
      padding 0 130px 20px 130px
      list-style none
      overflow-x hidden
      overflow-y auto
      .liElem
        display flex
        flex-direction column
        justify-content flex-start
        align-items center
        width 100%
        height 60px
        margin 20px 0
        list-style none
        font-size 17px
        line-height 17px
        .liElemTop
          width 100%
          margin-bottom 22px
          .serialNumber
            color #4c5576
          .wordName, .meaning
            color #5d6582
          .wordName
            margin-right 42px
          .answer
            font-size 18px
            line-height 18px
            color #6fd6b2
        .liElemBottom
          box-sizing border-box
          display flex
          justify-content flex-start
          align-items center
          width 100%
          padding-left 80px
          .optionSelect
            width 24%
            font-size 17px
            line-height 17px
            color #b2b7c6
          .active
            color #6fd6b2
</style>
