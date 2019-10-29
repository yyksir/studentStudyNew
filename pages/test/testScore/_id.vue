<!-- 测试成绩详情 -->
<template>
  <div class="container">
    <header class="header">
      <span class="title">测试成绩</span>
      <a href="javascript:;" class="btnExport" @click="handleBtnExportClick">导出</a>
    </header>
    <div class="courseInfoContainer">
      <div class="floor1">
        <span>产品名称 · 测试课程 · {{detailObj.courseName}} · {{categoryObj[detailObj.learnType]}}</span>
      </div>
      <div class="floor2">
        <span>测试内容：{{detailObj.unitName}}</span>
      </div>
      <div class="floor3">
        <span>（共 {{detailArr.length}} 题  对 {{detailObj.rightNum}} 题 错 {{detailObj.wrongNum}} 题 时长 {{detailObj.continueTime}}）</span>
      </div>
      <div class="floor4">
        <span>{{detailObj.createTime}} 姓名：{{detailObj.name}} 成绩：{{detailObj.score || 0}}分</span>
      </div>
    </div>
    <ul class="ulElem">
      <li class="liElem"
        v-for="(item, serialIndex) of detailArr"
        :key="item.id"
      >
        <span class="liElemTop">
          <span class="serialNumber">{{serialIndex + 1}}、</span>
          <span class="wordName">{{item.wordName}}</span>
          <span class="meaning">{{item.meaning}}</span>
          <span class="answer" v-if="detailObj.learnType !== 2"
            :class="{
              'correct': item.selected === item.answer,
              'error': item.selected !== item.answer,
            }"
          >( {{item.selected}} )</span>
          <span class="answer" v-if="detailObj.learnType === 2"
            :class="{
              'correct': item.selected === item.wordName,
              'error': item.selected !== item.wordName,
            }"
          >( {{item.selected}} )</span>
        </span>
        <span class="liElemBottom" v-if="detailObj.learnType !== 2">
          <a-tooltip class="optionSelect" style="font-style:normal;" placement="top"
          >
            <template slot="title">
              <span>{{item.optionA}}</span>
            </template>
            <span class="" :class="{'active': item.answer === 'A'}">A、{{item.optionA}}<!-- <span class="bgWhite"></span> --></span>
          </a-tooltip>
          <a-tooltip class="optionSelect" style="font-style:normal;" placement="top"
          >
            <template slot="title">
              <span>{{item.optionB}}</span>
            </template>
            <span class="" :class="{'active': item.answer === 'B'}">B、{{item.optionB}}<!-- <span class="bgWhite"></span> --></span>
          </a-tooltip>
          <a-tooltip class="optionSelect" style="font-style:normal;" placement="top"
          >
            <template slot="title">
              <span>{{item.optionC}}</span>
            </template>
            <span class="" :class="{'active': item.answer === 'C'}">C、{{item.optionC}}<!-- <span class="bgWhite"></span> --></span>
          </a-tooltip>
          <a-tooltip class="optionSelect" style="font-style:normal;" placement="top"
          >
            <template slot="title">
              <span>{{item.optionD}}</span>
            </template>
            <span class="" :class="{'active': item.answer === 'D'}">D、{{item.optionD}}<!-- <span class="bgWhite"></span> --></span>
          </a-tooltip>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  layout: 'index',
  data () {
    return {
      detailObj: {},
      detailArr: [],
      categoryObj: { 1: '认读', 2: '拼写', 3: '辨音' },
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
          if (res && res.hasOwnProperty('code') && res.code === 0) {
            this.detailObj = res.data
            this.detailArr = res.data.testContent
            return false
          }
          this.detailArr = []
        })
        .catch((err) => {
          this.detailObj = {}
          this.detailArr = []
          this.$message.error('获取试卷详情失败， 联系管理员: ' + err.msg)
          console.log(err, 'err 获取试卷详情失败， 联系管理员')
        })
    },
    handleBtnExportClick () {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.$API.GET('/down/downloadTestRecord', { id: 28 })
        .then((res) => {
          console.log(res, 'res 导出试卷 成功')
          // if (res && res.hasOwnProperty('code') && res.code === 0) {
          //   this.detailObj = res.data
          //   this.detailArr = res.data.testContent
          //   return false
          // }
        })
        .catch((err) => {
          console.log(err, 'err 导出试卷失败， 联系管理员')
          this.$message.error('导出试卷失败，， 联系管理员: ' + err.msg)
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
      display flex
      justify-content space-between
      align-items center
      box-sizing border-box
      width 100%
      height 56px
      padding 0 130px 0 130px
      .title
        line-height 56px
        font-size 20px
        font-weight 600
      .btnExport
        width 72px
        height 33px
        border 1px solid #b8bcca
        border-radius 4px
        font-size 13px
        line-height 33px
        text-align center
        color #b8bcca
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
        min-height 20px
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
          .correct
            color #6fd6b2
          .error
            color #f5222d
        .liElemBottom
          box-sizing border-box
          display flex
          justify-content flex-start
          align-items center
          width 100%
          padding-left 80px
          .optionSelect
            position relative
            width 24%
            font-size 17px
            line-height 17px
            color #b2b7c6
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            // .bgWhite
            //   display block
            //   width 30px
            //   height 17px
            //   background-color #fff
            //   position absolute
            //   right 0
            //   top 0
            //   z-index 9
          .active
            color #6fd6b2
</style>
