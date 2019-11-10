<template>
  <div class="container">
    <a-spin style="
      width: 100%;height: 100%;position: fixed;left: 0;top: 0;z-index: 999;
      display: flex;flex-direction: column;;justify-content: center;align-items: center;
      background-color: rgba(0, 0, 0, .5)
      "
      size="large"
      v-show="spinning"
    />
    <header class="header">
      <span class="title">词汇量测试</span>
      <span class="courseCategory">英语词汇量测试 - {{testTitleObj[routeParamsObj.id || 0]}}</span>
    </header>
    <div class="hintInfoContainer">
      <span style="margin-right: 32px;">用时 {{min}} 分 {{seconds}} 秒</span>
      <span style="margin-right: 32px;">
        共 {{testPaperVocabularyArr.length > 0 ? testPaperVocabularyArr.length : 0}}
        <span style="color: #ff4d4f;margin-right: 32px;"> 题</span>
        <span style="color: #67C23A;margin-right: 32px;"> 绿色背景: 已答题号</span>
        <span style="color: #ff4d4f;margin-right: 32px;"> 红色背景: 未答题号</span>
        <span style="color: #303133;margin-right: 32px;"> 题号字体颜色黑色: 当前题</span>
        <span style="color: #303133;margin-right: 32px;"> 当前题号: {{activeIndex + 1}}</span>
      </span>
      <!-- <span>未答题号: {{unansweredArr}}</span> -->
    </div>
    <!-- 未答题号 **************************************************************** -->
    <!-- <div class="unansweredContainer">
      <span class="unansweredTitle">未答题号</span>
      <span class="unansweredElem" v-for="unanswered of unansweredArr" :key="unanswered"
        @click="handleUnansweredElemClick(unanswered)"
      >
        {{unanswered}}
      </span>
    </div> -->

    <div class="paginationContainer">
      <a-pagination class="paginationElem"
        :defaultCurrent="1"
        :total="testPaperVocabularyArr.length"
        :defaultPageSize="1"
        :current="activeIndex + 1"
        @change="onPaginationChange"
      />
    </div>
    <main class="main">
      <div class="paperContentContainer">
        <h1 class="paperTitle">{{chooseElemObj.wordName || ''}}</h1>

        <div class="chooseElem">
          <i class="choose" :class="{ 'selectedText' : chooseElemObj.selected === 'A' }" style="font-style:normal;">A</i>
          <a-tooltip class="chooseHint" style="font-style:normal;" placement="top"
            :class="{ 'selected' : chooseElemObj.selected === 'A' }"
            @click="handleBtnChooseClick('A')"
          >
            <template slot="title">
              <span>{{chooseElemObj.optionA || '暂无试题'}}</span>
            </template>
            <span>{{chooseElemObj.optionA}}</span>
          </a-tooltip>
        </div>
        <div class="chooseElem">
          <i class="choose" :class="{ 'selectedText' : chooseElemObj.selected === 'B' }" style="font-style:normal;">B</i>
          <a-tooltip class="chooseHint" style="font-style:normal;" placement="top"
            :class="{ 'selected' : chooseElemObj.selected === 'B' }"
            @click="handleBtnChooseClick('B')"
          >
            <template slot="title">
              <span>{{chooseElemObj.optionB || '暂无试题'}}</span>
            </template>
            <span>{{chooseElemObj.optionB}}</span>
          </a-tooltip>
        </div>
        <div class="chooseElem">
          <i class="choose" :class="{ 'selectedText' : chooseElemObj.selected === 'C' }" style="font-style:normal;">C</i>
          <a-tooltip class="chooseHint" style="font-style:normal;" placement="top"
            :class="{ 'selected' : chooseElemObj.selected === 'C' }"
            @click="handleBtnChooseClick('C')"
          >
            <template slot="title">
              <span>{{chooseElemObj.optionC || '暂无试题'}}</span>
            </template>
            <span>{{chooseElemObj.optionC}}</span>
          </a-tooltip>
        </div>
        <div class="chooseElem">
          <i class="choose" :class="{ 'selectedText' : chooseElemObj.selected === 'D' }" style="font-style:normal;">D</i>
          <a-tooltip class="chooseHint" style="font-style:normal;" placement="top"
            :class="{ 'selected' : chooseElemObj.selected === 'D' }"
            @click="handleBtnChooseClick('D')"
          >
            <template slot="title">
              <span>{{chooseElemObj.optionD || '暂无试题'}}</span>
            </template>
            <span>{{chooseElemObj.optionD}}</span>
          </a-tooltip>
        </div>

      </div>
    </main>
    <footer class="footer">
      <span class="button" @click="handleBtnCancelClick">
        取消
      </span>
      <span class="button" v-if="!isSubmit" @click="handleBtnNextClick">
        继续测试
      </span>
      <span class="button" v-if="isSubmit" @click="handleBtnSubmitClick">
      <!-- <span class="button" @click="handleBtnSubmitClick"> -->
        提交试卷
      </span>
    </footer>
  </div>
</template>

<script>
export default {
  layout: 'index',
	name: 'testVocabulary',
	data () {
		return {
      spinning: false,
      testTitleObj: {
        1: '通用', 2: '幼儿', 3: '小学', 4: '初中', 5: '高中', 6: '大学', 7: '出国'
      },
      min: 0, // 分钟
      seconds: 0, // 秒钟
      interval: null,
      unansweredArr: [], // 未答题号 数组
      isSubmit: false,
      testPaperVocabularyArr: [], // 试题
      chooseElemObj: {
        // wordName: '',
        // selected: '',
        // optionA: '',
        // optionB: '',
        // optionC: '',
        // optionD: '',
      }, //选项
      activeIndex: 0,
    }
  },
  computed: {
    routeParamsObj () {
      return this.$route.params
    }
  },
  watch: {
    activeIndex (val, oldVal) {
      sessionStorage.setItem('activeIndex', val)
    }
  },
  // created () {
  mounted () {
    this.spinning = true
    this.init()
  },
  methods: {
    init () {
      // this.clearIntervalFn()
      setTimeout(() => {
        this.$nextTick(() => {
          this.getTestPaper()
        })
      }, 3000)
    },
    clearIntervalFn () {
      clearInterval(this.interval)
      this.interval = null
      this.min = 0
      this.seconds = 0
      setTimeout(function () {
        sessionStorage.removeItem('timeVocabulary')
        sessionStorage.removeItem('start')
        sessionStorage.removeItem('testPaperVocabularyArr')
        sessionStorage.removeItem('activeIndex')
      }, 3000)
    },
    // 获取时间差值, 计算答题用时
    getDifferenceTime () {
      this.interval = setInterval(() => {
        let difference = +new Date() - (sessionStorage.getItem('timeVocabulary') * 1)
        this.min = new Date(difference).getMinutes()
        this.seconds = new Date(difference).getSeconds()
      }, 1000)
    },
    isSubmitFn () {
      
      setTimeout(() => {
        if (this.testPaperVocabularyArr.length < 1) {
          this.isSubmit = false
          return false
        }
        this.unansweredArr = []
        const arr = this.testPaperVocabularyArr.filter((element, index, array) => {
          if (element.selected === null) {
            this.unansweredArr.push(index + 1)
          }
          return element.selected === null
        })
        // 判断哪些题 是 未答 [绿色: 已答题号, 红色: 未答题号] 默认给个 绿色
        let andtLi = document.getElementsByClassName('ant-pagination-item')
        for (let m = 0, ml = this.unansweredArr.length; m < ml; m++) {
          for (let i = 0, l = andtLi.length; i < l; i++) {
            if (andtLi[i].getAttribute('title') * 1 === this.unansweredArr[m]) {
              andtLi[i].classList.add('red')
            }
          }
        }
        if (arr.length > 0) {
          this.isSubmit = false
          return false
        }
        if (arr.length === 0) {
          this.isSubmit = true
          return false
        }
        return true
      }, 500)
    },
    getTestPaper () {
      this.spinning = true
      this.$API.POST('/course/getWordNumTestpaper', {type: this.routeParamsObj.id})
        .then((res) => {
          this.spinning = false
          // console.log(_.cloneDeep(res), 'res 词汇量测试试题')
          // 删除课程测试 页面 的 数据
          sessionStorage.removeItem('start')
          sessionStorage.removeItem('resDataCopy')
          sessionStorage.removeItem('storageTestPaperArr')

          if (!sessionStorage.getItem('timeVocabulary')) {
            sessionStorage.setItem('timeVocabulary', +new Date())
          }
          if (!sessionStorage.getItem('activeIndex')) {
            sessionStorage.setItem('activeIndex', 0)
          } else {
            this.activeIndex = sessionStorage.getItem('activeIndex') * 1
          }
          if (res && res.code === 0 && res.data.length > 0) {
            window.addEventListener('popstate', (e) => {
              // sessionStorage.removeItem('start')
              // sessionStorage.removeItem('timeVocabulary')
              // sessionStorage.removeItem('activeIndex')
              // sessionStorage.removeItem('testPaperVocabularyArr')
              this.clearIntervalFn()
              window.removeEventListener('popstate', function () {})
            }, false)
            this.getDifferenceTime()
            if (JSON.parse(sessionStorage.getItem('testPaperVocabularyArr'))) {
              this.testPaperVocabularyArr = JSON.parse(sessionStorage.getItem('testPaperVocabularyArr'))
              this.chooseElemObj = this.testPaperVocabularyArr[this.activeIndex]
              this.isSubmitFn()
              return false
            }
            const resDataArr = _.cloneDeep(res.data)
            resDataArr.forEach(element => {
              element['selected'] = null
            })
            this.testPaperVocabularyArr = resDataArr
            sessionStorage.setItem('testPaperVocabularyArr', JSON.stringify(resDataArr))
            this.chooseElemObj = resDataArr[0]
            this.isSubmitFn()
            return false
          }
          this.$message.warning('暂无试题')
          this.clearIntervalFn()
          window.removeEventListener('popstate', function () {})
          this.chooseElemObj = {}
          this.testPaperVocabularyArr = []
        })
        .catch((err) => {
          this.spinning = false
          this.clearIntervalFn()
          window.removeEventListener('popstate', function () {})
          this.chooseElemObj = {}
          this.testPaperVocabularyArr = []
          console.log(err, 'err 词汇量测试试题')
          this.$message.error('暂无试题' + err.msg)
        })
    },
    // 页码改变
    onPaginationChange (current) {
      // console.log(current, 'current 页码改变')
      this.activeIndex = current - 1
      this.chooseElemObj = this.testPaperVocabularyArr[this.activeIndex]
      /*if (current === this.testPaperVocabularyArr.length) {
        this.isSubmit = true
      }*/
    },
    handleUnansweredElemClick (unanswered) {
      this.activeIndex = (unanswered * 1) - 1
      this.chooseElemObj = this.testPaperVocabularyArr[this.activeIndex]
    },
    // 选项被点击
    handleBtnChooseClick (selectedVal) {
      this.chooseElemObj.selected = selectedVal
      this.testPaperVocabularyArr[this.activeIndex].selected = selectedVal
      sessionStorage.setItem('testPaperVocabularyArr', JSON.stringify(this.testPaperVocabularyArr))
      this.handleBtnNextClick()
      this.isSubmitFn()
      // console.log(_.cloneDeep(this.testPaperVocabularyArr))
    },
    // 取消
    handleBtnCancelClick () {
      sessionStorage.removeItem('timeVocabulary')
      sessionStorage.removeItem('start')
      this.clearIntervalFn()
      this.$router.go(-1)
    },
    // 继续测试
    handleBtnNextClick () {
      const btnNext = document.getElementsByClassName('ant-pagination-next')[0]
      btnNext.click()
    },
    // 交卷
    handleBtnSubmitClick () {
      let testContent = _.cloneDeep(this.testPaperVocabularyArr)
      // 测试用的 全选 A
      /*testContent.forEach((element) => {
        element.selected = 'A'
      })*/
      let params = {
        courseId: -1,
        unitId: -1,
        // testContent: JSON.stringify(this.testPaperVocabularyArr),
        testContent: JSON.stringify(testContent),
        learnType: 1, // 1: '认读', 2: '拼写', 3: '辨音'
        testType: 4, // 0：学前测；1：学后测；2：学前总测试；3：课程测试
        continueTime: this.min + '分' + this.seconds + '秒'
      }
      // console.log(_.cloneDeep(this.testPaperVocabularyArr), 'testPaperVocabularyArr')
      // console.log(testContent, 'testContent')
      // return
      // console.log(_.cloneDeep(params), 'params')
      this.spinning = true
      this.$API.POST('/course/commitTestPaper', params)
        .then((res) => {
          this.spinning = false
          // console.log(res, 'res 提交成功')
          if (res && res.hasOwnProperty('code') && res.code === 0) {
            sessionStorage.removeItem('start')
            sessionStorage.removeItem('timeVocabulary')
            this.clearIntervalFn()
            this.$message.success('提交试卷' + res.msg)
            this.$router.go(-1)
            return false
          }
          this.$message.error('提交试卷失败')
        })
        .catch((err) => {
          this.spinning = false
          console.log(err, 'err 提交失败')
          this.$message.error('提交试卷失败: ' + err.msg)
        })
    },
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
    overflow-y auto
    .header
      position relative
      box-sizing border-box
      width 100%
      height 56px
      padding 0 30px
      .title
        position absolute
        left 54px
        top 0
        line-height 56px
        font-size 20px
        font-weight 600
      .courseCategory
        display block
        width 100%
        height 56px
        line-height 56px
        text-align center
        font-size 22px
        font-weight 600
    .hintInfoContainer
      display flex
      justify-content center
      align-items center
      width 100%
      height 42px
      background-color #fff
    .unansweredContainer
      display flex
      justify-content center
      flex-wrap wrap
      align-items center
      width 90%
      .unansweredTitle
        width 100%
        padding 15px 0
        text-align center
        font-size 18px
        line-height 30px
        color #F56C6C
      .unansweredElem
        display flex
        justify-content center
        align-items center
        width 30px
        height 30px
        margin-bottom 10px
        margin-right 10px
        border-radius 50%
        background-color #E6A23C
        cursor pointer
    .paginationContainer
      display flex
      justify-content center
      align-items center
      width 100%
      height 62px
      // .paginationElem >>> .ant-pagination-prev, .paginationElem >>> .ant-pagination-next
      //   display none
      .paginationElem >>> .ant-pagination-item
        border 0
        border-radius 50%
        // background-color #F56C6C
        // background-color transparent
        background-color #67C23A // 默认给个绿色, 已答题号
      .paginationElem >>> .ant-pagination-item-active
        border 1px solid #303133
      .paginationElem >>> .ant-pagination-item-active a
        color #303133 !important
      .paginationElem >>> .red
        background-color #F56C6C
      // .paginationElem >>> .green
      //   background-color #67C23A
      .paginationElem >>> .ant-pagination-item > a
          color #fff
    .main
      display flex
      justify-content center
      align-items center
      width 100%
      // flex 1
      height auto
      overflow-x hidden
      overflow-y auto
      .paperContentContainer
        width 497px
        min-height 300px
        background-color #fff
        .paperTitle
          // box-sizing border-box
          width 100%
          height 102px
          margin-bottom 0
          // padding 22px 33px 0 33px
          font-size 40px
          line-height: 102px;
          text-align: center;
          color rgba(0, 0, 0, .65)
          // background-color yellowgreen
        .chooseElem
          box-sizing border-box
          display flex
          justify-content flex-start
          align-items center
          width 100%
          height 36px
          margin-bottom 10px
          padding 0 10px
          .choose
            width 30px
            height 100%
            line-height 36px
            text-align center
          .chooseHint
            flex 1
            height 100%
            border 1px solid #ccc
            border-radius 8px
            line-height 36px
            text-indent 20px
            cursor pointer
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          .selectedText
            color #67C23A
          .selected
            color #67C23A
            border-color #67C23A
    .footer
      width 100%
      height 112px
      text-align center
      line-height 112px
      .button
        display inline-block
        width 134px
        height 44px
        margin-right 10px
        text-align center
        line-height 44px
        border-radius 4px
        background-color #e7355c
        color #fff
        cursor pointer
</style>