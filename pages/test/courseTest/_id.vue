<template>
  <div class="container">
    <header class="header">
      <span class="title">测试中心</span>
      <span class="courseCategory">{{courseName}} · {{categoryObj[category]}}</span>
    </header>
    <main class="mainContainer">
      <div class="mainHeader">
        <span style="margin-right: 32px;">{{unitName}}</span>
        <span style="margin-right: 32px;">用时 {{min}} 分 {{seconds}} 秒</span>
        <span style="margin-right: 32px;">共{{testPaperArr.length > 0 ? testPaperArr.length : 0}}<span style="color: #ff4d4f;">题</span></span>
        <a-switch v-if="category === 3" checkedChildren="美" unCheckedChildren="英" v-model="check" @change="handleVoiceCategoryChange" />
      </div>
      <div class="unansweredContainer">
        <span class="unansweredTitle">未答题号</span>
        <span class="unansweredElem" v-for="unanswered of unansweredArr" :key="unanswered"
          @click="handleUnansweredElemClick(unanswered)"
        >
          {{unanswered}}
        </span>
      </div>
      <div class="mainPagination">
        <a-tooltip placement="left" :title="pagination.isDisabled ? '这题您已经答过了' : ''" :getPopupContainer="(trigger) => { return trigger.parentElement }"
          v-for="(pagination, paginationIndex) of testPaperArr.length > 0 ? testPaperArr : []"
          :key="paginationIndex"
        >
            <!-- :disabled="pagination.isDisabled" -->
          <button class="paginationElem"
            v-bind:class="{
              'active': activeIndex === paginationIndex
            }"
            :disabled="false"
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
            <div class="contentHeaderReading" v-if="category === 1"><!-- 认读 -->
              {{testPaperArr.length > 0 ? testPaperArr[activeIndex].wordName : ''}}
            </div>
            <div class="contentHeaderSpell" v-if="category === 2"><!-- 拼写 -->
              <div class="meaning">{{testPaperArr.length > 0 ? testPaperArr[activeIndex].meaning : ''}}</div>
              <div class="result">{{testPaperArr.length > 0 ? testPaperArr[activeIndex].selected : ''}}</div>
              <!-- <span class="spellElem"
                v-for="(wordName, wordNameIndex) of right"
                :key="wordNameIndex"
              >
                {{wordName || ''}}
              </span> -->
            </div>
            <div class="contentHeaderVoice" v-if="category === 3"><!-- 辨音 -->
              <div class="voiceLeft">
                <canvas id="myCanvas"></canvas>
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
            <div class="contentBodyReading" v-if="category === 1 || category === 3">
              <div class="temp">
                <span class="chooseElem"
                  v-for="(testPaper, testPaperIndex) of testPaperArr.length > 0 ? testPaperArr[activeIndex].optionArr : []"
                  :key="testPaperIndex"
                >
                  <i class="choose" :class="{ 'selectedText' : testPaper.choose }" style="font-style:normal;">{{testPaper.key}}</i>
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
                <!-- <span class="mask" title="此题已经答过, 请选择其他试题或者提交试卷"
                  v-show="testPaperArr.length > 0 && testPaperArr[activeIndex].hasOwnProperty('isDisabled') ? testPaperArr[activeIndex].isDisabled : false"
                ></span> -->
              </div>
            </div>
            <!-- 拼写 -->
            <div class="contentBodySpell" v-if="category === 2">
              <div class="first">
                <span class="firstElem"
                  :class="{
                    'activeSpell': firstIndex === firstActiveIndex,
                  }"
                  v-for="(first, firstIndex) of first"
                  :key="firstIndex"
                  @click="handleSpellElemClick(first, firstIndex, 1)"
                >{{first.val}}</span>
              </div>
              <div class="second">
                <span class="secondElem"
                  :class="{
                    'activeSpell': secondIndex === secondActiveIndex,
                  }"
                  v-for="(second, secondIndex) of second"
                  :key="secondIndex"
                  @click="handleSpellElemClick(second, secondIndex, 2)"
                >{{second.val}}</span>
              </div>
            </div>
            <!-- 辨音 -->
            <!-- <div class="voice" v-if="category === 3">
              辨音
            </div> -->
          </div>
          <div class="contentFooter"><span v-if="category === 2">快捷键 backspace 退格; 空格键 清空重选</span></div>
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
      unansweredArr: [], // 未答题号 数组
      testPaperArr: [],
      courseName: '',
      unitName: '',
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
      // 拼写专用
      right: [],
      first: [],
      firstActiveIndex: '',
      second: [],
      secondActiveIndex: '',
      result: ''
    }
  },
  components: {},
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
    },
    getTestPaper () {
      const params = this.$route.query
      this.category = this.$route.params.id * 1
      this.$API.POST('/course/getSpecialT', params)
        .then((res) => {
          window.addEventListener('popstate', (e) => {
            sessionStorage.removeItem('start')
            sessionStorage.removeItem('storageTestPaperArr')
            sessionStorage.removeItem('resDataCopy')
            this.clearIntervalFn()
            window.removeEventListener('popstate', function () {})
          }, false)
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
              if (this.category !== 2) {
                this.setActiveIndex(true)
                this.isSubmitFn()
                this.setVoice(false)
              }
              // 拼写 时  获取拆分的单词
              if (this.category === 2) {
                this.setActiveIndex(true)
                this.isSubmitFn()
                this.getWordChafen(res.data[this.activeIndex].wordName)
              }
            }
            this.getTestPaperHeader()
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
      sessionStorage.setItem('resDataCopy', JSON.stringify(resDataCopy))
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
        // resDataCopy[index]['selected'] = null
        resDataCopy[index]['selected'] = ''
        resDataCopy[index]['isDisabled'] = false
        // resDataCopy[index]['learntype'] = this.category
      })
      sessionStorage.setItem('storageTestPaperArr', JSON.stringify(resDataCopy))
      this.testPaperArr = resDataCopy
      this.setActiveIndex(true)
      this.isSubmitFn()
      this.setVoice(false)
      // 拼写 时  获取拆分的单词
      if (this.category === 2) {
        this.getWordChafen(resDataCopy[this.activeIndex].wordName)
      }
    },
    // 获取时间差值, 计算答题用时
    getDifferenceTime () {
      this.interval = setInterval(() => {
        let difference = +new Date() - (sessionStorage.getItem('start') * 1)
        this.min = new Date(difference).getMinutes()
        this.seconds = new Date(difference).getSeconds()
      }, 1000)
    },
    getTestPaperHeader () {
      let params = {
        courseId: this.$route.query.courseId * 1, // 选择的课程id
        unitId: this.$route.query.unitId * 1, // 0：全部；其他数：对应选择的unitId
        testType: 3, // 0：学前测；1：学后测；2：学前总测试；3：课程测试  （比如：3）
      }
      if (this.$route.params.hasOwnProperty('testType')) {
        params.testType = this.$route.query.testType * 1
      }
      this.$API.POST('/course/getTestPaperHeader', params)
      .then((res) => {
        if (res && res.hasOwnProperty('code') && res.code === 0) {
          this.courseName = res.data.courseName
          this.unitName = res.data.unitName
        } else {
          this.courseName = ''
          this.unitName = ''
        }
      })
      .catch((err) => {
        this.courseName = ''
        this.unitName = ''
        console.log(err, 'err getTestPaperHeader')
      })
    },
    // 拼写 时  获取拆分的单词
    getWordChafen (wordName) {
      this.$API.POST('/learn/getWordChafen', { wordName: wordName })
        .then((res) => {
          if (res && res.hasOwnProperty('code') && res.code === 0) {
            const resData = res.data
            let firstArr = []
            this.right = []
            let secondtArr = []
            this.second = []
            resData.first.forEach((ele) => {
              firstArr.push({
                isSelected: false,
                val: ele
              })
            })
            resData.second.forEach((ele) => {
              secondtArr.push({
                isSelected: false,
                val: ele
              })
            })
            this.right = resData.right
            this.first = firstArr
            this.second = secondtArr
            document.onkeydown = (e) => {
              let keyCode = e.keyCode
              // 空格键
              if (keyCode === 32) {
                this.testPaperArr[this.activeIndex].selected = ''
                this.testPaperArr[this.activeIndex].isDisabled = false
              }
              // backspace 键
              if (keyCode === 8) {
                this.testPaperArr[this.activeIndex].selected = this.testPaperArr[this.activeIndex].selected.slice(0, this.testPaperArr[this.activeIndex].selected.length - 1)
                if (this.testPaperArr[this.activeIndex].selected === '') {
                  this.testPaperArr[this.activeIndex].isDisabled = false
                }
              }
            }
            // this.setActiveIndex(true)
            // this.isSubmitFn()
          }
        })
        .catch((err) => {
          this.right = []
          this.first = []
          this.second = []
          console.log(err, 'err 获取拆分的单词')
        })
    },
    // 分页点击事件
    handlePaginationClick (pagination, paginationIndex) {
      this.activeIndex = paginationIndex
      // 拼写
      if (this.category === 2) {
        this.firstActiveIndex = ''
        this.secondActiveIndex = ''
        this.getWordChafen(this.testPaperArr[this.activeIndex].wordName)
      }
    },
    handleUnansweredElemClick (unanswered) {
      // this.activeIndex = (unanswered * 1) - 1
      this.handlePaginationClick('', (unanswered * 1) - 1)
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

      const canvas = document.getElementById('myCanvas')
      const cwidth = canvas.width
      const cheight = canvas.height - 2
      const meterWidth = 10 // 频谱条宽度
      const gap = 2 // 频谱条间距
      const capHeight = 2
      const capStyle = '#fff'
      // const meterNum = 800 / (10 + 2) // 频谱条数量
      const meterNum = cwidth // 频谱条数量
      const capYPositionArray = []; // 将上一画面各帽头的位置保存到这个数组
      const ctx = canvas.getContext('2d')
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(1, '#0f0')
      gradient.addColorStop(0.5, '#67C23A')
      gradient.addColorStop(0, '#E4E7ED')

      const drawMeter = function() {
        var array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        var step = Math.round(array.length / meterNum) // 计算采样步长
        ctx.clearRect(0, 0, cwidth, cheight)
        for (var i = 0; i < meterNum; i++) {
          var value = array[i * step]; // 获取当前能量值
          if (capYPositionArray.length < Math.round(meterNum)) {
            capYPositionArray.push(value) // 初始化保存帽头位置的数组，将第一个画面的数据压入其中
          }
          ctx.fillStyle = capStyle;
          // 开始绘制帽头
          if (value < capYPositionArray[i]) { // 如果当前值小于之前值
            ctx.fillRect(i *12,cheight-(--capYPositionArray[i]),meterWidth,capHeight) // 则使用前一次保存的值来绘制帽头
          } else {
            ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight) // 否则使用当前值直接绘制
            capYPositionArray[i] = value
          };
          // 开始绘制频谱条
          ctx.fillStyle = gradient
          ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight)
        }
        requestAnimationFrame(drawMeter)
      }
      requestAnimationFrame(drawMeter)
    },
    // 拼写 点击事件
    handleSpellElemClick (res, index, firstOrSecond) {
      if (firstOrSecond === 1) {
        this.firstActiveIndex = index
        this.secondActiveIndex = ''
      }
      if (firstOrSecond === 2) {
        this.secondActiveIndex = index
        this.firstActiveIndex = ''
      }
      res.isSelected = true
      this.testPaperArr[this.activeIndex].selected += res.val
      this.testPaperArr[this.activeIndex].isDisabled = true
      sessionStorage.setItem('storageTestPaperArr', JSON.stringify(this.testPaperArr))
    },
    // 是否显示提交试卷按钮
    isSubmitFn () {
      if (this.testPaperArr.length < 1) {
        this.isSubmit = false
        return false
      }
      this.unansweredArr = []
      const arr = this.testPaperArr.filter((element, index, array) => {
        if (element.isDisabled === false) {
          this.unansweredArr.push(index + 1)
        }
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
      sessionStorage.removeItem('resDataCopy')
      this.clearIntervalFn()
      this.$router.go(-1)
    },
    // 继续
    handleBtnNextClick () {
      // 拼写
      if (this.category === 2) {
        this.setActiveIndex(true)
        this.isSubmitFn()
        this.firstActiveIndex = ''
        this.secondActiveIndex = ''
        this.getWordChafen(this.testPaperArr[this.activeIndex].wordName)
        return
      }
      this.setActiveIndex(false)
      this.isSubmitFn()
      this.getWordChafen(this.testPaperArr[this.activeIndex].wordName)
    },
    // 提交试卷
    handleBtnSubmitClick () {
      let testPaperArrCopy =  _.cloneDeep(this.testPaperArr)
      testPaperArrCopy.forEach((ele) => {
        ele.hasOwnProperty('optionArr') && delete ele.optionArr
      })
      let params = {
        courseId: this.$route.query.courseId * 1, // 选择的课程id
        unitId: this.$route.query.unitId * 1, // 生成试卷的课程 0：全部；其他数：对应选择的unitId
        testContent: JSON.stringify(testPaperArrCopy),
        learnType: this.category, // 1: '认读', 2: '拼写', 3: '辨音'
        testType: 3, // 0：学前测；1：学后测；2：学前总测试；3：课程测试
        continueTime: this.min + '分' + this.seconds + '秒'
      }
      if (this.$route.params.hasOwnProperty('testType')) {
        params.testType = this.$route.query.testType * 1
      }
      this.$API.POST('/course/commitTestPaper', params)
        .then((res) => {
          if (res && res.hasOwnProperty('code') && res.code === 0) {
            this.$message.success('提交试卷' + res.msg)
            sessionStorage.removeItem('start')
            sessionStorage.removeItem('storageTestPaperArr')
            sessionStorage.removeItem('resDataCopy')
            this.clearIntervalFn()
            this.$router.go(-1)
            return false
          }
          this.$message.error('提交试卷失败')
        })
        .catch((err) => {
          this.$message.error('提交试卷失败: ' + err.msg)
          console.log(err, 'err 提交试卷')
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
      .unansweredContainer
        width 100%
        display flex
        justify-content center
        flex-wrap wrap
        align-items center
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
        min-height 300px
        display flex
        justify-content center
        align-items center
        .content
          box-sizing border-box
          width 497px
          min-height 300px
          display flex
          flex-direction column
          justify-content flex-start
          align-items center
          background-color #fff
          .contentHeader
            box-sizing border-box
            width 100%
            min-height 102px
            padding 0 33px
            padding-top 22px
            font-size 40px
            line-height 102px
            text-align center
            // .contentHeaderReading
            .contentHeaderSpell
              width 100%
              .meaning
                width 100%
                height 14px
                line-height 14px
                text-align left
                font-size 14px
              .result
                width 100%
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
              .spellElem
                color red
            .contentHeaderVoice
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
                #myCanvas
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
            .contentBodyReading
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
                  .selectedText
                    color #67C23A
                  .selected
                    color #67C23A
                    border-color #67C23A
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
            .contentBodySpell
              box-sizing border-box
              display flex
              flex-direction column
              justify-content flex-start
              align-items center
              width 100%
              height 100%
              padding 0 18px
              padding-top 26px
              font-size 16px
              line-height 36px
              .first
                display flex
                justify-content center
                flex-wrap nowrap
                align-items center
                width 100%
                margin-bottom 16px
                .firstElem
                  width 44px
                  height 44px
                  margin-right 10px
                  border-radius 8px
                  text-align center
                  line-height 44px
                  background-color #DCDFE6
                .activeSpell
                  border 2px solid #67C23A
                  line-height 40px
              .second
                display flex
                justify-content center
                align-items center
                flex-wrap nowrap
                width 100%
                .secondElem
                  width 44px
                  height 44px
                  margin-right 10px
                  border-radius 8px
                  text-align center
                  line-height 44px
                  background-color #DCDFE6
                .activeSpell
                  border 2px solid  #67C23A
                  line-height 40px
          .contentFooter
            width 100%
            height 48px
            display flex
            justify-content center
            align-items center
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
