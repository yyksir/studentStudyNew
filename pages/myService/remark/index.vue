<!-- 备忘录 -->
<template>
  <div class="remarkContainer">
    <header class="headerContainer">
      <span class="remarkText">备忘录</span>
      <!-- <div class="btnContainer">
        <a href="javascript:;" class="btnExport btnExportWord"
          @click="handleExportWord"
        >导出单词</a>
        <a href="javascript:;" class="btnExport btnExportWordMeaning"
          @click="handleExportWordMeaning"
        >导出词义</a>
        <a href="javascript:;" class="btnExport btnExportExample"
          @click="handleExportExample"
        >导出例句</a>
      </div> -->
    </header>
    <div class="searchContainer">
      <div class="searchTop">
        <span class="label">学习类型</span>
        <a-select style="width: 126px;margin-right: 70px;"
          v-model="type"
          @change="handleStudyTypeChange"
        >
          <a-select-option
            v-for="item of studyTypeArr"
            :key="item.id"
            :value="item.id"
          >
            {{item.name}}
          </a-select-option>
        </a-select>
        <span class="label" style="">学习课程</span>
        <a-select style="width: 314px;"
          v-model="courseId"
          @change="handleCourseChange"
        >
          <a-select-option
            v-for="course of courseArr"
            :key="course.courseId"
            :value="course.courseId"
          >
            {{course.courseName}}
          </a-select-option>
        </a-select>
      </div>
      <div class="searchBottom">
        <span class="label">学习日期</span>
        <a-date-picker style="width: 198px;"
          format="YYYY-MM-DD"
          @change="handleStartTimeChange"
        />
        <span style="font-size: 14px;color: #ccc;margin: 0 10px;">至</span>
        <a-date-picker style="width: 198px;"
          @change="handleEndTimeChange"
        />
        <a-button style="margin-left: 10px;"
          @click="queryInfo"
        >
          查询
        </a-button>
      </div>
    </div>
    <main class="mainContainer">
      <div style="width: 100%;height: 100%;font-size: 20px;display: flex;justify-content: center;align-items: center;"
        v-if="queryResArr.length < 1"
        ref="ssssssss"
      >
         暂无数据
      </div>
      <drop-select v-else class="dropSelect"
        v-for="queryRes of queryResArr"
        :key="queryRes.id"
      >
        <template v-slot:top>
          <div class="contentTop">
            <img v-if="queryRes.type === 1" src="../../../assets/img/1.png" style="display: block;margin-right: 14px;">
            <img v-if="queryRes.type === 2" src="../../../assets/img/2.png" style="display: block;margin-right: 14px;">
            <img v-if="queryRes.type === 3" src="../../../assets/img/3.png" style="display: block;margin-right: 14px;">

            <b style=";min-width: 80px;color: green;font-size: 24px;">{{queryRes.wordName}}</b>
            <span style="margin-right: 15px;">英&nbsp;&nbsp;&nbsp;{{queryRes.englishPronu}}</span>
            <img src="../../../assets/img/voicePause.png" style="margin-right: 30px;" @click="handleBtnVoiceEnClick">
            <audio id="audioDomEn" refs="audioDomEn">
              <source id="tts_source_en" :src="queryRes.enVoiceSrc" type="audio/mpeg">
              <embed id="tts_embed_en" height="0" width="0" src="">
              您的浏览器不支持 audio 元素, 建议使用谷歌浏览器等高级浏览器。
            </audio>
            <span style="margin-right: 15px;">美&nbsp;&nbsp;&nbsp;{{queryRes.americaPronu}}</span>
            <img src="../../../assets/img/voicePause.png" style="margin-right: 30px;" @click="handleBtnVoiceUSAClick">
            <audio id="audioDomUsa" refs="audioDomUsa">
              <source id="tts_source_usa" :src="queryRes.usaVoiceSrc" type="audio/mpeg">
              <embed id="tts_embed_usa" height="0" width="0" src="">
              您的浏览器不支持 audio 元素, 建议使用谷歌浏览器等高级浏览器。
            </audio>
            <span>{{queryRes.meaning}}</span>
          </div>
        </template>
        <template v-slot:bottom>
          <div class="contentBottom">
            <span style="display: block;width: 100%;">【例】{{queryRes.exampleSentence1}}</span>
            <span style="display: block;width: 100%;">【例】{{queryRes.exampleSentence2}}</span>
            <span style="display: block;width: 100%;">【例】{{queryRes.exampleSentence3}}</span>
          </div>
        </template>
      </drop-select>
    </main>
    <div v-show="queryResArr.length > 0 && queryResArr.length % 2 === 0" style="width: 100%;height: 2px;box-sizing: border-box;padding: 0 30px;">
      <div style="width: 100%;height: 2px;background-color: #fff;"></div>
    </div>
    <footer class="footerContainer">
      <!-- :total="rowsCount" -->
      <a-pagination class="pagination"
        ref="paginationssssss"
        :itemRender="itemRender"
        :total="rowsCount"
        v-model="curPagerNo"
        :defaultPageSize="pageSize"
        showQuickJumper
        @change="handlePageSizeChange"
      >
      </a-pagination>
      <a-button @click="handleBtnConfirmClick">确定</a-button>
    </footer>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  layout: 'index',
  data () {
    return {
      // 学习类型 下拉框
      studyTypeArr: [
        { id: 0, name: '全部'},
        { id: 1, name: '认读'},
        { id: 2, name: '拼写'},
        { id: 3, name: '辩音'}
      ],
      type: 0, // 学习类型
      courseArr: [
        { courseId: 0, courseName: '全部'}
      ],
      courseId: 0, // 学习课程
      curPagerNo: 1, // 当前页
      pageSize: 10, // 一页显示 10 条
      startTimeStr: '',
      endTimeStr: '',
      queryResObj: {},
      queryResArr: [],
      rowsCount: 0, // 一共有多少条数据
      totalPageNumber: 0, // 一共有几页
      urlVoice: 'http://121.40.138.216/'
    }
  },
  components: {
    DropSelect: () => import('../../../components/DropSelect.vue')
  },
  created () {
    this.init()
  },
  methods: {
    moment,
    init () {
      this.getCourseArr()
    },
    getCourseArr () {
      this.$API.POST('/course/getServerMyCourse', {})
        .then((res) => {
          if (res && res.data && res.data&& res.data.length > 0) {
            this.courseArr = res.data
          } else {
            this.courseArr = []
            this.$message.warning('暂无学习课程下拉框的数据')
          }
        })
        .catch((err) => {
          this.courseArr = []
          console.log(err, 'err 查询学习课程下拉框 接口调用失败')
          this.$message.error('查询学习课程下拉框 接口调用失败, 联系管理员')
        })
    },
    // 学习类型改变
    handleStudyTypeChange (val, options) {
      // console.log(val, 'val 学习类型')
      // console.log(options, 'options 学习类型')
    },
    // 学习课程改变
    handleCourseChange (val, options) {
      // console.log(val, 'val 学习课程')
      // console.log(options, 'options 学习课程')
    },
    // 开始时间改变
    handleStartTimeChange (val) {
      if (!val) {
        this.startTimeStr = ''
        return
      }
      this.startTimeStr = moment(val).format('YYYY-MM-DD')
    },
    // 结束时间改变
    handleEndTimeChange (val) {
      if (!val) {
        this.endTimeStr = ''
        return
      }
      this.endTimeStr = moment(val).format('YYYY-MM-DD')
    },
    // 自定义页码的结构
    itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <a href="javascript:;">上一页</a>
      } else if (type === 'next') {
        return <a href="javascript:;">下一页</a>
      }
      return originalElement
    },
    // 页码改变
    handlePageSizeChange (page, pageSize) {
      if (this.queryResArr.length < 1) { return }
      this.curPagerNo = page
      this.pageSize = pageSize
      this.queryInfo()
    },
    isInteger(num) {
      if (!isNaN(num) && num % 1 === 0) {
        return true
      } else {
        return false
      }
    },
    handleBtnConfirmClick () {
      if (!this.totalPageNumber) {
        this.$message.warning('暂无数据, 请点击查询按钮')
        return
      }
        // 第一种方法
      const dom = document.getElementsByClassName('ant-pagination-options-quick-jumper')
      const pageValue = dom[0].children[0].value
      // 第二种方法
      /*const refsPagination = this.$refs.paginationssssss.$el
      const pageValue = refsPagination.children[9].children[0].children[0].value*/
      if (pageValue > this.totalPageNumber) {
        this.$message.warning('页码超出查询范围')
        return
      }
      this.curPagerNo = pageValue * 1
      this.queryInfo()
    },
    // 验证
    verification () {
      if (!this.startTimeStr) {
        this.$message.warning('请选择开始日期')
        return false
      }
      if (!this.endTimeStr) {
        this.$message.warning('请选择截止日期')
        return false
      }
      if (+new Date(this.startTimeStr) >= +new Date(this.endTimeStr)) {
        this.$message.warning('开始日期必须小于截止日期')
        return false
      }
      return true
    },
    // 查询信息
    queryInfo () {
      if (!this.verification()) { return }
      const params = {
        type: this.type,
        courseId: this.courseId,
        startTimeStr: this.startTimeStr,
        endTimeStr: this.endTimeStr,
        curPagerNo: this.curPagerNo,
        pageSize: this.pageSize
      }

      this.$API.POST('/census/getMyUnknow', params)
        .then((res) => {
          if (res && res.data && res.data.list && res.data.list.length > 0) {
            const list = res.data.list
            list.forEach((ele) => {
              // [0 是英式发音, 1 是美式发音]
              ele['enVoiceSrc'] = this.urlVoice + ele.wordName + 0 + '.mp3'
              ele['usaVoiceSrc'] = this.urlVoice + ele.wordName + 1 + '.mp3'
            })
            this.queryResObj = res.data
            this.queryResArr = res.data.list
            this.curPagerNo = res.data.curPagerNo
            this.pageSize = res.data.pageSize
            this.rowsCount = res.data.rowsCount // 一共有几条数据
            this.totalPageNumber = res.data.totalPageNumber // 一共有几页数据
          } else {
            this.setEmptyData()
            this.$message.warning('暂无数据')
          }
        })
        .catch((err) => {
          console.log(err, 'err 查询备忘录接口调用失败')
          this.setEmptyData()
          this.$message.error('查询备忘录接口调用失败, 联系管理员')
        })
    },
    setEmptyData () {
      this.queryResObj = {}
      this.queryResArr = []
      this.curPagerNo = 1
      this.pageSize = 10
      this.rowsCount = 0
      this.totalPageNumber = 0
    },
    // 英式发音
    handleBtnVoiceEnClick () {
      // console.log(this.$refs.audioDomEn, 'audioDomEn')
      const audioDomEn = document.getElementById('audioDomEn')
      audioDomEn.play()
      console.log(audioDomEn, 'audioDomEn')
    },
    // 美式发音
    handleBtnVoiceUSAClick () {
      // console.log(this.$refs.audioDomUsa, 'audioDomUsa')
      const audioDomUsa = document.getElementById('audioDomUsa')
      audioDomUsa.play()
      console.log(audioDomUsa, 'audioDomUsa')
    },
    // 导出单词
    // handleExportWord () {},
    // 导出词义
    // handleExportWordMeaning () {},
    // 导出例句
    // handleExportExample () {}
  }
}
</script>

<style lang="stylus" scoped>
  .remarkContainer
    width 100%;
    height 100%;
    display flex
    flex-direction column
    justify-content flex-start
    align-items center
    .headerContainer
      box-sizing border-box
      display flex
      justify-content space-between
      align-items center
      width 100%
      height 56px
      padding 34px
      background-color #fff
      .remarkText
        font-size 20px
        font-weight 600
      /*.btnContainer
        width 310px
        height 56px
        display flex
        justify-content flex-start
        align-items center
        .btnExport
          width 84px
          height 30px
          margin-right 20px
          border 1px solid #ccc
          border-radius 4px;
          line-height 30px
          text-align center
          color #fff
        .btnExportWord
          border 0
          background-color #f5222d
        .btnExportWordMeaning, .btnExportExample
          color #ccc
        .btnExportExample
          margin-right 0*/
    .searchContainer
      box-sizing border-box
      width 100%
      height 156px
      padding 0 30px
      .searchTop
        width 100%
        margin 36px 0 22px 0
        .label
          display inline-block
          width 86px
          font-size 16px
      .searchBottom
        width 100%
        display flex
        justify-content flex-start
        align-items center
        .label
          width 86px
          font-size 16px
    .mainContainer
      box-sizing border-box
      width 100%
      // flex 1
      min-height 100px
      max-height 540px
      padding 0 30px
      overflow-y scroll
      .dropSelect:nth-child(even)
        background-color transparent
      .dropSelect:nth-child(odd)
        background-color #fff
      .contentTop
        width 100%
        display flex
        justify-content flex-start
        align-items center
      .contentBottom
        width 100%
        box-sizing border-box
        padding 10px 46px
    .footerContainer
      box-sizing border-box
      display flex
      justify-content center
      align-items center
      width 100%
      height 124px
      padding 0 30px
      .pagination
        margin-right 20px
        & /deep/ .ant-pagination-item-active
          background-color #f5222d
          border-color #f5222d
        & /deep/ .ant-pagination-item-active a
          color #fff
</style>
