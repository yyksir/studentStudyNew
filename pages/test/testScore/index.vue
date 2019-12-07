<!-- 测试成绩 -->
<template>
  <div class="container">
    <a-spin style="
      width: 100%;height: 100%;position: fixed;left: 0;top: 0;z-index: 999;
      display: flex;flex-direction: column;;justify-content: center;align-items: center;
      background-color: rgba(0, 0, 0, .5)
      "
      size="large"
      v-show="loading"
    />
    <header class="header">
      <span class="title">测试成绩</span>
    </header>
    <main class="mainContainer">
        <!-- :scroll="{ x: 1400, y: 550 }" -->
      <a-table class="tableElem"
        :dataSource="tableData"
        :columns="tableColumns"
        :pagination="false"
      >
        <!-- :loading="loading" -->
        <!-- <a slot="action" slot-scope="text" href="javascript:;">action</a> -->
        <div class="btnContainer" slot="action" slot-scope="text">
          <span class="icon iconfont icon-chakan" @click="handleBtnDetailClick(text)">查看</span>
          <a-popconfirm title="确定要删除此条信息吗 ？" placement="left" okText="确定" cancelText="取消"
            @confirm="handleConfirm(text)"
          >
            <span class="icon iconfont icon-shanchu"><span>删除</span></span>
          </a-popconfirm>
        </div>
        <div slot="overview" slot-scope="overview">
          <span style="display: block;">共{{overview.totalNum}}题</span>
          <span style="display: block;color: #67C23A;">对{{overview.rightNum}}题</span>
          <span style="display: block;color: #F56C6C">错{{overview.wrongNum}}题</span>
        </div>
      </a-table>
      <div class="paginationContainer">
        <div class="paginationSl">
          <a-pagination class="pagination"
            :itemRender="itemRender"
            :total="rowsCount"
            v-model="curPagerNo"
            :defaultPageSize="pageSize"
            showQuickJumper
            @change="handlePageSizeChange"
          >
          </a-pagination>
          <a-button @click="handleBtnConfirmClick">确定</a-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
const columns = [
  // { title: '测试内容', width: 200, dataIndex: 'courseName', key: 'courseName', fixed: 'left', align: 'center' }, // 其他的 width 之前是 150
  { title: '测试内容', width: 120, dataIndex: 'courseName', key: 'courseName', fixed: 'false', align: 'center' },
  // { title: '测试时间', width: 160, dataIndex: 'createTime', key: 'createTime', align: 'center' },
  { title: '测试时间', width: 80, dataIndex: 'createTime', key: 'createTime', align: 'center' },
  // { title: '测试词汇', dataIndex: 'testType', key: 'testType', width: 150, align: 'center' },
  { title: '测试词汇', dataIndex: 'testType', key: 'testType', width: 80, align: 'center' },
  {
    title: '测试总览',
    // width: 150,
    width: 80,
    dataIndex: 'overview',
    align: 'center',
    key: 'overview',
    scopedSlots: { customRender: 'overview' },
  },
  // { title: '测试时长', dataIndex: 'continueTime', key: 'continueTime', width: 150, align: 'center' },
  { title: '测试时长', dataIndex: 'continueTime', key: 'continueTime', width: 80, align: 'center' },
  // { title: '测试成绩', dataIndex: 'score', key: 'score', width: 150, align: 'center' },
  { title: '测试成绩', dataIndex: 'score', key: 'score', width: 80, align: 'center' },
  {
    title: '操作',
    key: 'operation',
    // fixed: 'right',
    fixed: 'false',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'action' },
  }
]
import moment from 'moment'

export default {
  layout: 'index',
  data () {
    return {
      tableData: [],
      tableColumns: columns,
      loading: false,
      rowsCount: 0, // 一共有多少条数据
      curPagerNo: 1,
      pageSize: 6,
      totalPageNumber: 0 // 一共有几页
      // queryResArr: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.queryInfo()
    },
    queryInfo () {
      this.loading = true
      this.$API.POST('/census/getTestRrecord', {
        curPagerNo: this.curPagerNo,
        pageSize: this.pageSize
      })
        .then((res) => {
          this.loading = false
          if (res && res.data && res.data.list && res.data.list.length < 1) {
            this.$message.warning('暂无数据')
          } else if (res && res.data && res.data.list && res.data.list.length > 0) {
            this.setData(res.data)
          } else {
            console.log(res, 'res error')
            this.$message.warning('查询学习成绩列表接口调用失败, 请联系管理员')
          }
        })
        .catch((err) => {
          this.loading = false
          console.log(err, 'err 查询学习成绩列表接口调用失败')
          this.setData({})
          this.$message.error('查询学习成绩列表接口调用失败, 联系管理员')
        })
    },
    setData (data) {
      this.rowsCount = data.rowsCount || 0
      this.curPagerNo = data.curPagerNo || 0
      this.pageSize = data.pageSize || 10
      this.totalPageNumber = data.totalPageNumber || 0
      if (!data.list) {
        this.tableData = []
        return
      }
      let resArr = data.list
      resArr.forEach((ele, index) => {
        resArr[index].createTime = moment(resArr[index].createTime).format('YYYY-MM-DD')
        if(ele.testType===1){
          ele.testType = '学后测'
        }else if(ele.testType===2){
          ele.testType = '学前总测试'
        }else if(ele.testType===3){
          ele.testType = '课程测试'
        }else if(ele.testType===4){
          ele.testType = '词汇量测试'
        }else{
          ele.testType = '学前测'
        }
       // resArr[index].testType = resArr[index].testType === 0 ? '学前测' : (resArr[index].testType === 1 ? '学后测' : '学前总测试')
        resArr[index]['key'] = resArr[index].id
        resArr[index].score = resArr[index].score + '分'
        resArr[index]['overview'] = {
          totalNum: resArr[index].totalNum,
          rightNum: resArr[index].rightNum,
          wrongNum: resArr[index].wrongNum
        }
      })
      console.log(resArr, 'resArr')
      // return
      this.tableData = resArr
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
      console.log(page, pageSize)
      // if (this.queryResArr.length < 1) { return }
      if (this.tableData.length < 1) { return }
      this.curPagerNo = page
      this.pageSize = pageSize
      this.queryInfo()
    },
    // 分页的确定按钮
    handleBtnConfirmClick () {
      if (!this.totalPageNumber) {
        this.$message.warning('暂无数据, 请点击查询按钮')
        return
      }
        // 第一种方法
      const dom = document.getElementsByClassName('ant-pagination-options-quick-jumper')
      const pageValue = dom[0].children[0].value
      if (pageValue > this.totalPageNumber) {
        this.$message.warning('页码超出查询范围')
        return
      }
      this.curPagerNo = pageValue * 1
      this.queryInfo()
    },
    // 查看
    handleBtnDetailClick (text) {
      console.log(text, 'text 查看')
      if (!text.id) {
        console.log('缺失 ID')
        return
      }
      this.$router.push({
        path: '/test/testScore/' + text.id
      })
    },
    // 删除
    handleConfirm (text) {
      this.loading = true
      this.$API.POST('/census/delTestRrecord', {
        id: text.id
      })
      .then((res) => {
        this.loading = false
        this.$message.success('删除成功')
        this.queryInfo()
      })
      .catch((err) => {
        this.loading = false
        this.$message.success('删除失败, 请联系管理员')
        console.log(err, 'err 删除失败')
      })
    },
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
    .mainContainer
      display flex
      flex-direction column
      justify-content flex-start
      align-items center
      box-sizing border-box
      width 100%
      // height auto
      flex 1
      padding 40px
      padding-bottom 0
      // .tableElem /deep/ .ant-spin-nested-loading,
      // .tableElem /deep/ .ant-spin-nested-loading .ant-spin-container,
      // .tableElem /deep/ .ant-spin-nested-loading .ant-spin-container .ant-table,
      // .tableElem /deep/ .ant-spin-nested-loading .ant-spin-container .ant-table .ant-table-content,
      // .tableElem /deep/ .ant-spin-nested-loading .ant-spin-container .ant-table .ant-table-content .ant-table-scroll,
      // .tableElem /deep/ .ant-spin-nested-loading .ant-spin-container .ant-table .ant-table-content .ant-table-fixed-left,
      // .tableElem /deep/ .ant-spin-nested-loading .ant-spin-container .ant-table .ant-table-content .ant-table-fixed-right
      //   width 100%
      //   height 100% !important
      .tableElem /deep/ .ant-spin-nested-loading .ant-spin-container .ant-table .ant-table-content .ant-table-scroll .ant-table-body table .ant-table-tbody tr
        height 106px
      .tableElem
        width 100%
        flex 1
        .btnContainer
          height 100%
          display flex
          flex-direction column
          justify-content center
          align-items center
          .icon
            cursor pointer
          .icon::before
            margin-right 10px
      .paginationContainer
        box-sizing border-box
        display flex
        flex-direction column
        justify-content flex-start
        align-items center
        width 100%
        height 136px
        padding-top 30px
        .paginationSl
          width 100%
          height 100%
          box-sizing border-box
          display flex
          justify-content center
          align-items flex-start
        .pagination
          margin-right 20px
          & /deep/ .ant-pagination-item-active
            background-color #f5222d
            border-color #f5222d
          & /deep/ .ant-pagination-item-active a
            color #fff
</style>
