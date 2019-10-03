<template>
  <div class="container">
    <header class="header">
      <span class="title">测试中心{{activeIndex}}-</span>
      <span class="courseCategory">产品名称 · 课程名称 · {{categoryObj[category]}}</span>
    </header>
    <main class="mainContainer">
      <div class="mainHeader">
        <span style="margin-right: 32px;">测试内容 : 章节内容 - 代码写死的一个(未知)</span>
        <span style="margin-right: 32px;">用时 {{min}} 分 {{seconds}} 秒</span>
        <span style="margin-right: 32px;">共{{testPaperArr.length > 0 ? testPaperArr.length : 0}}<span style="color: #ff4d4f;">题</span></span>
        <a-switch checkedChildren="美" unCheckedChildren="英" v-model="check" @change="handleVoiceCategoryChange" />
      </div>
      <div class="mainPagination">
        <a-tooltip placement="left" :title="pagination.isDisabled ? '这题您已经答过了' : ''" :getPopupContainer="(trigger) => { return trigger.parentElement }"
          v-for="(pagination, paginationIndex) of testPaperArr.length > 0 ? testPaperArr : []"
          :key="paginationIndex"
        >
          <button class="paginationElem"
            v-bind:class="{
              'active': activeIndex === paginationIndex,
              'disabled' : pagination.isDisabled
            }"
            :disabled="pagination.isDisabled"
            :title="pagination.isDisabled ? '这题您已经答过了' : ''"
            @click="handlePaginationClick(pagination, paginationIndex)"
          >
            {{paginationIndex + 1}}
          </button>
        </a-tooltip>
      </div>
      <div class="mainContent">
        <div class="content">
          <div class="contentHeader">
            <div class="reading" v-if="category === 1"><!-- 认读 -->
              {{testPaperArr.length > 0 ? testPaperArr[activeIndex].wordName : ''}}
            </div>
            <div class="spell" v-if="category === 2"><!-- 拼写 -->
              {{testPaperArr.length > 0 ? testPaperArr[activeIndex].wordName : ''}}
            </div>
            <div class="voice" v-if="category === 3"><!-- 辨音 -->
              <div class="voiceLeft">
                <canvas id="canvas"></canvas>
                <audio id="audioDomEn" ref="audioDomEn" controls="controls" controlsList="nodownload">
                  <source id="audio"  type="audio/mpeg">
                  您的浏览器不支持 audio 元素, 建议使用谷歌浏览器等高级浏览器。
                </audio>
              </div>
              <div class="voiceRight">
                {{testPaperArr.length > 0 ? testPaperArr[activeIndex].wordName : ''}}
              </div>
            </div>
          </div>
          <div class="contentBody">
            <!-- 认读 -->
            <div class="reading">
              <div class="temp" v-if="category === 1 || category === 3">
                <span class="chooseElem"
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
                </span>
                <span class="mask" title="此题已经答过, 请选择其他试题或者提交试卷"
                  v-show="testPaperArr.length > 0 && testPaperArr[activeIndex].hasOwnProperty('isDisabled') ? testPaperArr[activeIndex].isDisabled : false"
                ></span>
              </div>
            </div>
            <!-- 拼写 -->
            <!-- <div class="spell" v-if="category === 2">
              拼写
            </div> -->
            <!-- 辨音 -->
            <!-- <div class="voice" v-if="category === 3">
              辨音
            </div> -->
          </div>
          <div class="contentFooter"><span v-if="category === 2">快捷键 W 选上; S 选下 A 退格; 空格键 清空重选</span></div>
        </div>
      </div>
    </main>
    <footer class="footer">
      <span class="button" v-if="!isSubmit" @click="handleBtnCancelClick">
        取消
      </span>
      <span class="button" v-if="!isSubmit" @click="handleBtnNextClick">
        继续测试
      </span>
      <span class="button" v-if="isSubmit" @click="handleBtnSubmitClick">
        提交试卷
      </span>
    </footer>
  </div>
</template>

<script>
import {
  URL_VOICE
} from '@/assets/config/index.js'

export default {
  layout: 'index',
  name: 'course-test-type',
  data () {
    return {
      check: true,
      testPaperArr: [],
      categoryObj: { 1: '认读', 2: '拼写', 3: '辨音' },
      category: '', // 1: '认读', 2: '拼写', 3: '辨音'
      categoryVoice: 1, // 音频类型 0是英式发音  1 是美式发音
      min: 0, // 分钟
      seconds: 0, // 秒钟
      total:  0, // 一共有多少道题
      activeIndex: 0, // 默认展示 第一个 分页
      isShowHint: false, // 是否展示 提示信息
      interval: null, // 定时器
      isSelected: false, // 选项是否选中
      isSubmit: false, // 是否可以提交试卷
    }
  },
  components: {
  },
  created () {
    this.init()
  },
  methods: {
    handleVoiceCategoryChange (val) {
      // 音频类型 0 false 是英式发音  1 (true) 是美式发音
      val ? this.categoryVoice = 1 : this.categoryVoice = 0
      this.setVoice(true)
    },
    init () {
      this.clearIntervalFn()
      this.getTestPaper()
    },
    clearIntervalFn () {
      clearInterval(this.interval)
      this.interval = null
    },
    getTestPaper () {
      const params = this.$route.query
      this.category = this.$route.params.id * 1
      // courseId: this.courseId,
      // testScopeType: this.range, // 课程 id
      // testNum: this.count, // 课程
      // unitId:  this.course, // 测试范围 1 全部, 2 备忘本
      this.$API.POST('/course/getSpecialT', params)
        .then((res) => {
          if (!sessionStorage.getItem('start')) {
            sessionStorage.setItem('start', +new Date())
          }
          this.getDifferenceTime()
          if (res && res.data && res.data.length > 0) {
            if (
              sessionStorage.getItem('storageTestPaperArr') === null ||
              sessionStorage.getItem('storageTestPaperArr') === undefined ||
              sessionStorage.getItem('storageTestPaperArr') === 'undefined' ||
              sessionStorage.getItem('storageTestPaperArr') === ''
            ) {
              this.setData(res)
            } else {
              this.testPaperArr = JSON.parse(sessionStorage.getItem('storageTestPaperArr'))
              this.setActiveIndex(true)
              this.isSubmitFn()
              this.setVoice(true)
            }
          } else {
            this.$message.warning('暂无数据')
            this.testPaperArr = []
          }
        })
        .catch((err) => {
          console.log(err, 'err 获取试卷失败')
          this.testPaperArr = []
          this.activeIndex = 0
          this.$message.warning('获取试卷失败')
        })
    },
    setData (res) {
      let resDataCopy = JSON.parse(JSON.stringify(res.data))
      resDataCopy.forEach((ele, index) => {
        resDataCopy[index]['optionArr'] = [
          {
            key: 'A',
            choose: null,
            option: resDataCopy[index].optionA
          },
          {
            key: 'B',
            choose: null,
            option: resDataCopy[index].optionB
          },
          {
            key: 'C',
            choose: null,
            option: resDataCopy[index].optionC
          },
          {
            key: 'D',
            choose: null,
            option: resDataCopy[index].optionD
          }
        ]
        resDataCopy[index]['selected'] = null
        resDataCopy[index]['isDisabled'] = false
      })
      sessionStorage.setItem('storageTestPaperArr', JSON.stringify(resDataCopy))
      this.testPaperArr = resDataCopy
      this.setActiveIndex(true)
      this.isSubmitFn()
      this.setVoice(false)
    },
    // 获取时间差值, 计算答题用时
    getDifferenceTime () {
      this.interval = setInterval(() => {
        let difference = +new Date() - (sessionStorage.getItem('start') * 1)
        this.min = new Date(difference).getMinutes()
        this.seconds = new Date(difference).getSeconds()
      }, 1000)
    },
    // 分页点击事件
    handlePaginationClick (pagination, paginationIndex) {
      this.activeIndex = paginationIndex
    },
    // 选择按钮被点击
    handleBtnChooseClick (testPaper, testPaperIndex, activeIndex) {
      this.testPaperArr[activeIndex].optionArr.forEach((ele, index) => {
        if (testPaperIndex === index) {
          this.testPaperArr[activeIndex].optionArr[index].choose = true
          this.testPaperArr.forEach((elem, elemIndex) => {
            if (activeIndex === elemIndex) {
              this.testPaperArr[elemIndex].selected = this.testPaperArr[activeIndex].optionArr[index].key
              this.testPaperArr[elemIndex].isDisabled = true
            } else {
              // this.testPaperArr[elemIndex].selected = null
              // this.testPaperArr[elemIndex].isDisabled = false
            }
          })
        } else {
          this.testPaperArr[activeIndex].optionArr[index].choose = false
        }
      })
      sessionStorage.setItem('storageTestPaperArr', JSON.stringify(this.testPaperArr))
      this.setActiveIndex()
      this.isSubmitFn()
      this.setVoice(true)
    },
    setActiveIndex (fromAjax) {
      // 初次进入野蛮或者刷新页面时
      if (fromAjax) {
        for (let i = 0, l = this.testPaperArr.length; i < l; i++) {
          if (!this.testPaperArr[i].isDisabled) {
            this.activeIndex = i
            return false
          }
        }
        return false
      }
      // 点击分页按钮时
      if (this.activeIndex >= this.testPaperArr.length - 1) {
        this.activeIndex = this.testPaperArr.length - 1
        return
      }
      this.activeIndex = (this.activeIndex * 1) + 1
    },
    setVoice (setSrc) {
      if (this.category !== 3) {
        return
      }
      // let audioDomEn = this.$refs.audioDomEn
      // audioDomEn.crossOrigin = 'anonymous'
      // audioDomEn.src = URL_VOICE + this.testPaperArr[this.activeIndex].wordName + this.categoryVoice + '.mp3'
      // audioDomEn.play()
      this.startCanvas(setSrc)
    },
    // 是否显示提交试卷按钮
    isSubmitFn () {
      if (this.testPaperArr.length < 1) {
        this.isSubmit = false
        return false
      }
      const arr = this.testPaperArr.filter(function (element, index, array) {
        return element.isDisabled === false
      })
      if (arr.length > 0) {
        this.isSubmit = false
        return false
      }
      if (arr.length === 0) {
        this.isSubmit = true
        this.activeIndex = this.testPaperArr.length - 1
        return false
      }
    },
    // 取消
    handleBtnCancelClick () {
      sessionStorage.removeItem('start')
      sessionStorage.removeItem('storageTestPaperArr')
      this.clearIntervalFn()
      this.$router.go(-1)
    },
    // 继续
    handleBtnNextClick () {
      this.setActiveIndex()
    },
    // 提交试卷
    handleBtnSubmitClick () {
      this.$message.warning('提交试卷')
    },
    startCanvas (setSrc) {
      let audioDomEn = this.$refs.audioDomEn
      if (setSrc) {
        audioDomEn.src = URL_VOICE + this.testPaperArr[this.activeIndex].wordName + this.categoryVoice + '.mp3'
        return
      }
      audioDomEn.crossOrigin = 'anonymous'
      audioDomEn.src = URL_VOICE + this.testPaperArr[this.activeIndex].wordName + this.categoryVoice + '.mp3'

      const AudioContext = window.AudioContext || window.webkitAudioContext
      let audioContext = new AudioContext()
      let analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser = audioContext.createAnalyser()

      let audioSrc = audioContext.createMediaElementSource(audioDomEn)
      audioSrc.connect(analyser)
      analyser.connect(audioContext.destination)

      const canvas = document.getElementById('canvas')
      const cwidth = canvas.width
      const cheight = canvas.height - 2
      const meterWidth = 10 //频谱条宽度
      const gap = 2 //频谱条间距
      const capHeight = 2
      const capStyle = '#fff'
      const meterNum = 800 / (10 + 2) //频谱条数量
      const capYPositionArray = []; //将上一画面各帽头的位置保存到这个数组
      const ctx = canvas.getContext('2d')
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(1, '#0f0')
      gradient.addColorStop(0.5, '#67C23A')
      gradient.addColorStop(0, '#E4E7ED')

      const drawMeter = function() {
        var array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        var step = Math.round(array.length / meterNum) //计算采样步长
        ctx.clearRect(0, 0, cwidth, cheight)
        for (var i = 0; i < meterNum; i++) {
          var value = array[i * step]; //获取当前能量值
          if (capYPositionArray.length < Math.round(meterNum)) {
            capYPositionArray.push(value) //初始化保存帽头位置的数组，将第一个画面的数据压入其中
          }
          ctx.fillStyle = capStyle;
          // 开始绘制帽头
          if (value < capYPositionArray[i]) { //如果当前值小于之前值
            ctx.fillRect(i *12,cheight-(--capYPositionArray[i]),meterWidth,capHeight) //则使用前一次保存的值来绘制帽头
          } else {
            ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight) //否则使用当前值直接绘制
            capYPositionArray[i] = value
          };
          // 开始绘制频谱条
          ctx.fillStyle = gradient
          ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight)
        }
        requestAnimationFrame(drawMeter)
      }
      requestAnimationFrame(drawMeter)
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
      padding 0 30px
      position relative
      .title
        line-height 56px
        font-size 20px
        font-weight 600
        position absolute
        left 54px
        top 0
      .courseCategory
        display block
        width 100%
        height 56px
        line-height 56px
        text-align center
        font-size 22px
        font-weight 600
    .mainContainer
      width 100%;
      flex 1
      overflow-x hidden
      overflow-y auto
      .mainHeader
        width 100%
        height 42px
        line-height 42px
        display flex
        justify-content center
        align-items center
        background-color #fff
      .mainPagination
        width 100%
        height 80px
        display flex
        justify-content center
        align-items center
        .paginationElem
          display flex
          justify-content center
          align-items center
          width 24px
          height 24px
          margin-right 10px
          border-radius 100%
          border 0!important
          color #ccc
          background-color transparent
          outline none!important
          cursor pointer
        .disabled
          cursor not-allowed
        .active
          background-color #ff4d4f
          color #fff
      .mainContent
        width 100%
        min-height 360px
        display flex
        justify-content center
        align-items center
        .content
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
            // .reading
            // .spell
            .voice
              box-sizing border-box
              padding 0 18px
              display flex
              justify-content space-between
              align-items center
              .voiceLeft
                display flex
                flex-direction column
                justify-content flex-start
                align-items center
                width 50%
                #canvas
                  width 100%
                  height 60px
                #audioDomEn
                  width 100%
                  height 22px
                  outline none
              .voiceRight
                width 50%
                font-size 36px
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
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
              .temp
                width 100%
                height 100%
                position relative
                .chooseElem
                  width 100%
                  height 36px
                  margin 8px 0
                  display flex
                  justify-content flex-start
                  align-items center
                  flex-wrap nowrap
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
                  top 0
                  cursor not-allowed
                  z-index 999
          .contentFooter
            width 100%
            height 48px
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
