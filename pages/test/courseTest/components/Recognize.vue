<!-- 认读 -->
<template>
  <div class="recognizeCcontainer">
    <div>
      8{{testPaperArrUse[activeIndexUse]}}8
    </div>
    <div class="contentHeader">
      <span v-if="true">
        {{testPaperArrUse.length > 0 ? testPaperArrUse[activeIndexUse].wordName : ''}}
      </span>
      <span v-if="false">
        {{testPaperArrUse.length > 0 ? testPaperArrUse[activeIndexUse].wordName : ''}}
      </span>
      <span v-if="false">
        {{testPaperArrUse.length > 0 ? testPaperArrUse[activeIndexUse].wordName : ''}}
      </span>
    </div>
    <div class="contentBody">
      <div class="reading">
          <!-- v-for="(testPaper, testPaperIndex) of testPaperArrUse.length > 0 &&  testPaperArrUse[activeIndexUse].hasOwnProperty('optionArr') ?  testPaperArrUse[activeIndexUse].optionArr : []" -->
        <span class="chooseElem"
          v-for="(testPaper, testPaperIndex) of testPaperArrUse[activeIndexUse].optionArr"
          :key="testPaperIndex"
        >
          <i class="choose" style="font-style:normal;">{{testPaper.key}}</i>
          <a-tooltip class="chooseHint" style="font-style:normal;" placement="top"
            :class="{ 'selected' : testPaper.choose }"
            @click="handleBtnChooseClick(testPaper, testPaperIndex, activeIndex)"
          >
            <template slot="title">
              <span>{{testPaper.option}}</span>
            </template>
            <span>{{testPaper.option}}</span>
          </a-tooltip>
          ?{{testPaper}}?
        </span>
        <!-- <span class="chooseElem"
          v-for="(testPaper, testPaperIndex) of testPaperArr.length > 0 ? testPaperArr[activeIndex].optionArr : []"
          :key="testPaperIndex"
        >
          <i class="choose" style="font-style:normal;">{{testPaper.key}}</i>
          <a-tooltip class="chooseHint" style="font-style:normal;" placement="top"
            :class="{ 'selected' : testPaper.choose }"
            @click="handleBtnChooseClick(testPaper, testPaperIndex, activeIndex)"
          >
            <template slot="title">
              <span>{{testPaper.option}}</span>
            </template>
            <span>{{testPaper.option}}</span>
          </a-tooltip>
          <span class="mask" title="此题已经答过, 请选择其他试题或者提交试卷"></span>
        </span> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'recognize', // 认读
  // props: {
  //   testPaperArr: {
  //     type: Array,
  //     default: () => { return [] }
  //   },
  //   // 默认展示 第一个 分页
  //   activeIndex: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  props: ['testPaperArr', 'activeIndex'],
  data () {
    this.$watch('testPaperArr', function (newVal, oldVal) {
      console.log(newVal, 'testPaperArr')
      this.testPaperArrs = newVal
    })
    this.$watch('activeIndex', function (newVal, oldVal) {
      console.log(newVal, 'activeIndex')
      this.activeIndexs = newVal
    })
    return {
      testPaperArrUse: [],
      activeIndexUse: 0,
      categoryObj: { 1: '认读', 2: '拼写', 3: '辨音' },
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {}
    //
  }
}
</script>

<style lang="stylus" scoped>
  .recognizeCcontainer
    box-sizing border-box
    width 497px
    min-height 360px
    display flex
    flex-direction column
    justify-content flex-start
    align-items center
    background-color #fff
    .contentHeader
      width 100%
      height 102px
      font-size 40px
      line-height 102px
      text-align center
    .contentBody
      width 100%;
      flex 1
      // 认读
      .reading
        box-sizing border-box
        display flex
        flex-direction column
        justify-content flex-start
        align-items center
        width 100%
        height 100%
        padding 0 18px
        font-size 16px
        line-height 36px
        .chooseElem
          width 100%
          height 36px
          margin 8px 0
          display flex
          justify-content flex-start
          align-items center
          flex-wrap nowrap
          position relative
          .choose
            width 18px
            height 100%
          .chooseHint
            flex 1
            height 100%
            border 1px solid #ccc
            border-radius 4px
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            text-indent 10px
            cursor pointer
          .selected
            color #67C23A
          .mask
            width 100%
            height 100%
            border-radius 4px
            background-color rgba(0, 0, 0, .5)
            position absolute
            left 0
            right 0
            cursor not-allowed
            z-index 999
    .contentFooter
      width 100%
      height 48px
</style>