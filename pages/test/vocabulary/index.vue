<!-- 词汇量测试 -->
<template>
  <div class="container">
    <header class="header">
      <span class="title">词汇量测试</span>
    </header>
    <main class="main">
      <img class="imgBg" src="../../../assets/img/1_03.png" alt="">
      <h1 class="title">英语词汇量测试</h1>
      <div class="content">
        <h2 class="hint">请选择你的测试等级 :</h2>
        <div class="radioGroupContainer">
          <a-radio-group class="radioGroup1" name="radioGroup1" v-model="testLevel">
            <a-radio :value="1">通用</a-radio>
            <a-radio :value="2">幼儿</a-radio><br>
            <a-radio :value="3">小学</a-radio>
            <a-radio :value="4">初中</a-radio><br>
            <a-radio :value="5">高中</a-radio>
            <a-radio :value="6">大学</a-radio><br>
            <a-radio :value="7">出国</a-radio>
          </a-radio-group>
        </div>
      </div>
    </main>
    <footer class="footer">
      <button class="btn" @click="handleBtnStartTestClick">开始测试</button>
    </footer>
  </div>
</template>

<script>
export default {
  layout: 'index',
  data () {
    return {
      testLevel: 1 // 1:通用, 2:幼儿, 3:小学, 4:初中, 5:高中, 6:大学, 7:出国
    }
  },
  methods: {
    handleBtnStartTestClick () {
      console.log(this.testLevel, 'testLevel')
      this.$router.push({
        path: '/test/vocabulary/' + this.testLevel
      })
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
    overflow-y auto
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
      box-sizing border-box
      display flex
      flex-direction column
      justify-content flex-start
      align-items center
      width 100%
      min-height 48px
      margin-bottom 250px
      padding 48px 160px 0 160px
      padding-top 48px
      // overflow-y auto
      overflow hidden
      .imgBg
        display block
        width 144px
        height 128px
        margin 10px 0
      .title
        font-size 22px
        line-height 42px
        margin 0
      .content
        box-sizing border-box
        width 100%
        min-height 100px
        padding 30px
        border-radius 4px
        overflow hidden
        background-color #fff
        .hint
          width 100%
          font-size 18px
          line-height 18px
          color #a1a6b9
        .radioGroupContainer
          display flex
          justify-content center
          align-items center
          width 100%
          min-height 30px
          overflow hidden
          .radioGroup1
            width 50%
            & >>> .ant-radio-wrapper
              width 30%
              margin-bottom 10px
    .footer
      display flex
      justify-content center
      align-items center
      width 100%
      min-height 30px
      overflow hidden
      .btn
        width 136px
        height 44px
        font-size 16px
        line-height 16px
        border-radius 8px
        text-align center
        color #fff
        cursor pointer
        outline none
        background-color #e7355c
</style>
