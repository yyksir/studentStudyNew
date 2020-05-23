<template>
<div>
  <div class="app clearfix">
      <a-spin style="
        width: 100%;height: 100%;position: fixed;left: 0;top: 0;z-index: 999;
        display: flex;flex-direction: column;;justify-content: center;align-items: center;
        background-color: rgba(0, 0, 0, .5)
        "
        size="large"
        v-show="spinning"
      />
    <div class="left-menu"
      :class="{
        'maxWidth': !collapsed,
        'minWidth': collapsed
      }"
    >
      <a-button class="btnToogle" type="link" @click="toggleCollapsed">
        <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
      </a-button>
      <div class="logo">
        <img v-show="!collapsed" @click="handleGoToHomePage" src="../assets/img/logo.png" title="点击去首页" alt="logo" style="cursor: pointer;">
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
          <a-menu-item key="19">
            <nuxt-link to="/">
              <img class="icon" src="../assets/img/guanli.png">
              <span v-show="!collapsed">管理首页</span>
            </nuxt-link>
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
      <a-popconfirm title="你确定退出吗?" okText=" 确定" cancelText="取消" v-if="userName !== ''"
        @confirm="handleBtnSignOutClick"
      >
        <div class="signOutContainer">
          <span v-show="!collapsed">{{userName}}</span>
          
          <img class="" style="display: block;width: 20px;height: 22px;" src="../assets/img/signout.png">
          <!-- </nuxt-link> -->
        </div>
      </a-popconfirm>
    </div>
    <div class="right-menu">
      <a-locale-provider :locale="locale">
        <nuxt />
      </a-locale-provider>
      
    </div>
  </div>
  <div class="footer">
        <p >
          <img src="../assets/img/footer.png">
          <a href="http://www.beian.miit.gov.cn" target="_blank">豫ICP备19036666号-3  </a> | © 2019-现在 词唐教育 版权所有</p>
      </div>
</div>
  
  
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  // middleware: 'userAuth', // 是否登录 改为不需要 前端判断， 故 注释掉 middleware
  data () {
    return {
      spinning: false,
      collapsed: false,
      rootSubmenuKeys: ['sub6', 'sub5', 'sub2', 'sub3', 'sub4'],
      openKeys: [''],
      locale: zhCN,
      userName: ''
    }
  },
  mounted () {
    this.spinning = true
    setTimeout(() => {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (!userInfo) {
        this.spinning = false
        this.$router.push({
          path: '/engStudy/sign/',
          redirect: true
        })
        return false
      }
      this.userName = userInfo && userInfo.trueName
      this.spinning = false
    }, 3000)
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
    },
    handleBtnSignOutClick () {
      if(!this.$Cookies.get('session')) {
        this.$message.error('退出失败， 联系管理员')
        return
      }
      this.spinning = true
      // this.$API.POST('/system/loginOut', { id: this.$Cookies.get('session') })
      this.$API.POST('/system/loginOut', {})
        .then((res) => {
          setTimeout(() => {
            console.log(res, 'res 退出 成功')
            sessionStorage.removeItem('start') // 计时器
            sessionStorage.removeItem('storageTestPaperArr') // 试题
            sessionStorage.removeItem('userInfo')
            sessionStorage.removeItem('resDataCopy')
            this.$Cookies.remove('session') // token
            this.spinning = false
            this.$router.push({
              path: '/sign',
              redirect: true
            })
          }, 1500)
        })
        .catch((err) => {
          this.spinning = false
          console.log(err, 'err 退出失败 联系管理员')
          this.$message.error('退出失败， 联系管理员: ' + (err.msg || err.message))
        })
    }
    //display flex
    //flex-direction row
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
  #__layout > div
    width 100%
    height 100%
  .clearfix：after{
    content:"."; 
    display:block; 
    clear:both; 
    height:0; 
    overflow:hidden; 
    visibility:hidden;
    } 
</style>
<style lang="stylus" scoped>
.footer{
    height: 30px;
    line-height: 30px;
    background: #fff;
    text-align: center;
}
.footer img {
    position: relative;
    width: 14px;
    vertical-align: middle;
    top: -2px;
    margin: 5px;
}
.footer p {
  font-family:Avenir,Helvetica,Arial,sans-serif;
   margin: 0;
   font-size: 12px;
}
.footer a {
  margin: 0;
  font-family:Avenir,Helvetica,Arial,sans-serif;
   color #2c3e50;
   &:hover{
     color #1890ff;
   }
}
  .app{
    
    width 100%
    height calc(100% - 30px)

    .left-menu{
      width 260px
      background: #001529;
      height 100%
      float left
      position relative
      .btnToogle {
        position absolute
        right 0
        top 0
      }
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
      .signOutContainer {
        box-sizing border-box
        width 100%
        height 68px
        padding 0 24px 0 33px
        display flex
        justify-content space-between
        align-items center
        color rgba(255, 255, 255, .65)
        cursor pointer
      }
    }
    .maxWidth {
      width 260px
    }
    .minWidth {
      width 80px
    }
    .right-menu{
      background #f0f4f5
      width: calc(100% - 260px);
      float: left;
      height 100%
      overflow auto
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
