<template>
  <div class="app">

      <div class="left-menu">
          
           <div class="logo">
                <img src="../assets/img/logo.png" alt="">
            </div>
           <a-menu
            :defaultSelectedKeys="['1']"
            :defaultOpenKeys="['sub1']"
            mode="inline"
            theme="dark"
            :inlineCollapsed="collapsed"
            >
            
             <a-menu-item key="19"><nuxt-link to="/"><img class="icon" src="../assets/img/guanli.png">管理首页</nuxt-link></a-menu-item>
            <a-sub-menu key="sub6">
                <span slot="title"><a-icon type="mail" /><span>我的学习</span></span>
                <a-menu-item key="15"><nuxt-link to="mycourse">我的课程</nuxt-link></a-menu-item>   
            </a-sub-menu>
            <a-sub-menu key="sub5">
                <span slot="title"><a-icon type="mail" /><span>教材下载</span></span>
                <a-menu-item key="5"><nuxt-link to="downpage">下载中心</nuxt-link></a-menu-item>
              
                
            </a-sub-menu>
            <a-sub-menu key="sub2">
                <span slot="title"><a-icon type="appstore" /><span>测试中心</span></span>
                <a-menu-item key="l9">课程测试</a-menu-item>
                <a-menu-item key="l0">词汇量测试</a-menu-item>
                <a-menu-item key="l1">测试成绩</a-menu-item>
                <a-menu-item key="l2">生成试卷</a-menu-item>
            </a-sub-menu>
             <a-sub-menu key="sub3">
                <span slot="title"><a-icon type="appstore" /><span>我的服务</span></span>
                <a-menu-item key="s9">备忘录</a-menu-item>
               
                <a-menu-item key="s10">我的词典</a-menu-item>
            </a-sub-menu>
             <a-sub-menu key="sub4">
                <span slot="title"><a-icon type="appstore" /><span>设置中心</span></span>
                <a-menu-item key="t9"><nuxt-link to="msgmange">信息管理</nuxt-link></a-menu-item>
                
            </a-sub-menu>
        </a-menu>
      </div>
      <div class="right-menu">
         
          <nuxt/>
      </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            collapsed: false,
        }
    },
    methods: {
        toggleCollapsed () {
            this.collapsed = !this.collapsed
        },
    },
}
</script>
<style lang="stylus">
#__nuxt{
    width 100%
    height 100%
   
}
 #__layout{
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