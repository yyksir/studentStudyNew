<template>
  <div class="app">
    <div class="left-menu">
      <div class="logo">
        <img @click="handleGoToHomePage" src="../assets/img/logo.png" title="点击去首页" alt="logo" style="cursor: pointer;">
      </div>
      <a-menu
        mode="inline"
        theme="dark"
        :defaultSelectedKeys="['1']"
        :defaultOpenKeys="['sub1']"
        :inlineCollapsed="collapsed"
        :openKeys="openKeys"
        @openChange="onOpenChange"
      >
          <a-menu-item key="19"><nuxt-link to="/">
            <img class="icon" src="../assets/img/guanli.png">管理首页</nuxt-link>
          </a-menu-item>
          <a-sub-menu key="sub6">
            <span slot="title"><a-icon type="mail" /><span>我的学习</span></span>
            <a-menu-item key="15">
              <nuxt-link to="/study/course/">我的课程</nuxt-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub5">
            <span slot="title"><a-icon type="mail" /><span>教材下载</span></span>
            <a-menu-item key="5">
              <nuxt-link to="/download/downloadCenter/">下载中心</nuxt-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="appstore" /><span>测试中心</span></span>
            <a-menu-item key="l9" >
              <nuxt-link to="/test/courseTest/">课程测试</nuxt-link>
            </a-menu-item>
            <a-menu-item key="l0">
              <nuxt-link to="/test/vocabulary/">词汇量测试</nuxt-link>
            </a-menu-item>
            <a-menu-item key="l1">
              <nuxt-link to="/test/testScore/">测试成绩</nuxt-link>
            </a-menu-item>
            <a-menu-item key="l2">
              <nuxt-link to="/test/generateTestPaper/">生成试卷</nuxt-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title"><a-icon type="appstore" /><span>我的服务</span></span>
            <a-menu-item key="s9">
              <nuxt-link to="/myService/remark/">备忘录</nuxt-link>
            </a-menu-item>
            <a-menu-item key="s10">
              <nuxt-link to="/myService/dictionary/">我的词典</nuxt-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <span slot="title"><a-icon type="appstore" /><span>设置中心</span></span>
            <a-menu-item key="t9">
              <nuxt-link to="/settings/informationManagement/">信息管理</nuxt-link>
            </a-menu-item>
          </a-sub-menu>
      </a-menu>
    </div>
    <div class="right-menu">
      <a-locale-provider :locale="locale">
        <nuxt />
      </a-locale-provider>
    </div>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  data () {
    return {
      collapsed: false,
      rootSubmenuKeys: ['sub6', 'sub5', 'sub2', 'sub3', 'sub4'],
      openKeys: [''],
      locale: zhCN,
    }
  },
  methods: {
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    },
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    handleGoToHomePage () {
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style lang="stylus">
  #__nuxt {
    width 100%
    height 100%
  }
  #__layout {
    width 100%
    height 100%
  }
</style>
<style lang="stylus" scoped>
  .app{
    display flex
    flex-direction row
    width 100%
    height 100%
    .left-menu{
      width 260px
      background: #001529;
      .logo{
        height 160px
        text-align center
        line-height 160px
      }
      .icon{
        width 20px
        height 20px
        margin-right 12px
      }
    }
    .right-menu{
      background #f0f4f5
      flex 1
      header{
          background white
          height 58px
          line-height 58px
          padding-left 40px
          padding-right 40px
          background white
          .name{
              float left
          }
          .endtime{
              float left
          }
          .starttime{
              float right
          }
      }
    }
  }
</style>
