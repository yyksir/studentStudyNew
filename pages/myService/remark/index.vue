<!-- 备忘录 -->
<template>
  <div class="remarkContainer">
    <header class="headerContainer">
      <span class="remarkText">备忘录</span>
      <div class="btnContainer">
        <a href="javascript:;" class="btnExport btnExportWord">导出单词</a>
        <a href="javascript:;" class="btnExport btnExportWordMeaning">导出词义</a>
        <a href="javascript:;" class="btnExport btnExportExample">导出例句</a>
      </div>
    </header>
    <div class="searchContainer">
      <div class="searchTop">
        <span class="label">学习类型</span>
        <a-select defaultValue="拼音" style="width: 126px;margin-right: 70px;" @change="handleChange">
          <a-select-option value="拼音">拼音</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
        <span class="label" style="">学习课程</span>
        <a-select defaultValue="拼音" style="width: 314px;" @change="handleChange">
          <a-select-option value="拼音">拼音</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </div>
      <div class="searchBottom">
        <span class="label">学习日期</span>
        <a-date-picker style="width: 198px;"
          format="YYYY-MM-DD"
          @change="onChange"
        />
        <span style="font-size: 14px;color: #ccc;margin: 0 10px;">至</span>
        <a-date-picker style="width: 198px;"
          format="YYYY-MM-DD"
          @change="onChange"
        />
        <a-button style="margin-left: 10px;">查询</a-button>
      </div>
    </div>
    <main class="mainContainer">
      <drop-select v-for="item of 6" :key="item">
        <template v-slot:top>
          <div class="contentTop">
            <b style="color: green;font-size: 24px;">because</b> 美[brkoz] 4 :conj.因为，由于 prep.因为某人(某事物) nbecause 英[orkoz] 4
          </div>
        </template>
        <template v-slot:bottom>
          <div class="contentBottom">
            【例】 Because only I have the ability. 因为只有我才有那能耐<br>
            【例】 But because of who I am with you 而是因为我喜欢和你在一起的感觉。<br>
            【例】 But because of who l am when I am with yqu 而是因为我喜欢与你在一起时的那个我。<br>
            【辨形】 well并，好，健康；swell膨胀；farewell告别；dwell居住<br>
            【参考】 well-known adj.著名的；well-read adj.博学的<br>
            【搭配】 as well也；as well as连同；do well in在某方面做得好
          </div>
        </template>
      </drop-select>
    </main>
    <footer class="footerContainer">
      <a-pagination :total="500" :itemRender="itemRender" showQuickJumper />
    </footer>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  layout: 'index',
  data () {
    return {
      meun1: ['菜单1', '菜单2', '菜单3', '菜单4', '菜单5', '1', '2', '3', '5', 6, 7, 8 ,9],
    }
  },
  components: {
    DropSelect: () => import('../../../components/DropSelect.vue')
  },
  methods: {
    moment,
    handleChange () {},
    onChange () {},
    itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <a>上一页</a>;
      } else if (type === 'next') {
        return <a>下一页</a>;
      }
      return originalElement;
    }
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
      .btnContainer
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
          margin-right 0
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
      .contentTop
        width 100%
      .contentBottom
        width 100%
        box-sizing border-box
        padding 0 46px
    .footerContainer
      box-sizing border-box
      display flex
      justify-content center
      align-items center
      width 100%
      height 124px
      padding 0 30px
</style>
