<!-- 生成试卷 -->
<template>
  <div class="container">
    <header class="header">
      <span class="title">生成试卷</span>
    </header>
    <main class="main">
      <div class="top">
        <span class="label" style="">请选择学习课程</span>
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
      <div class="middle">
        <div>请选择要测试的范围 :</div>
        <div style="width: 100%;box-sizing: border-box;padding: 0 250px">
          <a-radio-group name="radioGroup0" v-model="range">
            <a-radio :value="1">全部</a-radio>
            <a-radio :value="2">备忘本</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="middle" style="margin: 18px 0">
        <div>请选择测试的题量 :</div>
        <div style="width: 100%;box-sizing: border-box;padding: 0 250px">
          <a-radio-group name="radioGroup1" v-model="count">
            <a-radio :value="1">较少</a-radio>
            <a-radio :value="2">普通</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="middle">
        <div>请选择要生成试卷的课程 : (单选)</div>
        <div style="width: 100%;box-sizing: border-box;padding: 0 250px">
          <a-radio-group @change="onChange" v-model="course">
            <a-radio :style="radioStyle" :value="0">全部</a-radio>
            <a-radio :style="radioStyle"
              v-for="(info) of radioArr"
              :key="info.id"
              :value="info.id"
            >
              {{info.unitName}}
            </a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="bottom">
        <span class="btnExport" @click="handleBtnExportClick">生成试卷</span>
      </div>
    </main>
  </div>
</template>

<script>
const downloadStr = '/down/downloadZips'
import {
  URI,
  API
} from '@/assets/config/index.js'
import {
  spliceParams
} from '@/assets/utils/'

export default {
  layout: 'index',
  data () {
    return {
      courseId: 1,
      courseArr: [],
      range: 1,
      count: 1,
      course: 0,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      radioArr: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getCourseArr()
    },
    getCourseArr () {
      this.$API.POST('/course/getServerMyCourse', {})
        .then((res) => {
          if (res && res.data && res.data&& res.data.length > 0) {
            this.courseArr = res.data
            this.getRadioArr()
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
    getRadioArr () {
      if (this.courseArr.length < 1) { return }
      this.$API.POST('/course/getUnitLiBycourse', {
        courseId: this.courseId
      })
        .then((res) => {
          // console.log(res, 'res')
          if (res && res.data && res.data.data && res.data.data.length > 0) {
            this.radioArr = res.data.data
          } else {
            this.radioArr = []
            this.$message.warning('暂无课程列表的数据')
          }
        })
        .catch((err) => {
          this.radioArr = []
          console.log(err, 'err 查询课程列表接口调用失败')
          this.$message.error('查询课程列表接口调用失败, 联系管理员')
        })
    },
    handleCourseChange () {
      console.log(this.courseId, 'courseId')
      this.getRadioArr()
    },
    onChange (e) {
      console.log(e.target.value, 'radio checked')
    },
    handleBtnExportClick () {
      const params = {
        usId: 501,
        cId: this.courseId, // 课程 id
        uId: this.course, // 课程
        sId:  this.range, // 测试范围 1 全部, 2 备忘本
        tId: this.count, // 测试题量 1 较少 2 普通
      }
      const str = spliceParams(params)
      const url = URI + API + downloadStr + str
      window.open(url)
      console.log(url, 'url')
    }
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
      background-color #fff
      .title
        line-height 56px
        font-size 20px
        font-weight 600
    .main
      width 100%
      flex 1
      display flex
      flex-direction column
      justify-content flex-start
      align-items center
      overflow hidden
      .top
        box-sizing border-box
        width 100%
        height 120px
        display flex
        justify-content center
        align-items center
        padding-top 20px
        .label
          margin-right 20px
      .middle
        box-sizing border-box
        width 876px
        padding 30px 35px
        background-color #fff
      .bottom
        width 100%
        padding 15px 0
        display flex
        justify-content center
        align-items center
        .btnExport
          width 135px
          height 40px
          font-size 18px
          line-height 40px
          text-align center
          border-radius 8px
          background-color #ff4d4f
          color #fff
</style>
