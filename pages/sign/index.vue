<template>
  <div class="loginContainer">
    <a-spin class="mask" size="large" v-if="isLoading" />
    <div  class="headerTop">
      <div class="headerLeft">
        专注于打造智能教育平台
      </div>
      <div class="headerRight">
        服务热线:13137122626
      </div>
    </div>
    <div class="content clearfix">
      <div class="contentTitle">
        <img src="../../assets/img/ct_dlzx.png" alt />
      </div>
      <div class="contentBox">
         <div class="contenLeft">
          <div class="contenLeftImg">
            <img src="../../assets/img/png_ct2.png" alt />
          </div>
        </div>
      <div class="contentRight">
        <div class="contentRightBox">
          <div class='contentRightBoxTitle'>
            我是学生
          </div>
          <a-form
            id="components-form-demo-normal-login"
            :form="form"
            class="login-form"
            @submit="handleSubmit"
          >
            <a-form-item>
              <a-input placeholder="用户名"
                v-decorator="[
                  'userName',
                  { rules: [{ required: true, message: '请输入用户名!' }] }
                ]"
              >
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input placeholder="密码" type="password"
                v-decorator="[
                  'password',
                  { rules: [{ required: true, message: '请输入密码!' }] }
                ]"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-item>
            <a-form-item style="margin-top: 52px;">
              <!-- <a-checkbox
                v-decorator="[
                  'remember',
                  {
                    valuePropName: 'checked',
                    initialValue: true,
                  }
                ]"
              >
                Remember me
              </a-checkbox> -->
              <!-- <a class="login-form-forgot" href="javascript:;">Forgot password</a> -->
              <a-button class="login-form-button" type="primary" html-type="submit">
                登录
              </a-button>
              <!-- 或者 <a href="javascript:;">现在去注册!</a> -->
            </a-form-item>
          </a-form>
        </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p >
        <img src="../../assets/img/footer.png">
        <a href="http://www.beian.miit.gov.cn" target="_blank">豫ICP备19036666号-3  </a> | © 2019-现在 词唐教育 版权所有</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'signIn',
  data () {
    return {
      // userName: '',
      // password: '',
      isLoading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.signIn(values)
        }
      })
    },
    signIn (values) {
      const params = {
        userName: values.userName,
        userPassword: values.password,
        userType: 1
      }
      this.isLoading = true
      // userType ['0 管理员', '1 校长', '2 教师']
      this.$API.POST('/system/doStLogin', params)
        .then((res) => {
          if (res && res.hasOwnProperty('code') && res.code === 0) {
            const resDataObj = res.data
            this.$Cookies.set('session', resDataObj.token, { expires: 1 })
            sessionStorage.setItem('userInfo', JSON.stringify(resDataObj))
            setTimeout(() => {
              this.isLoading = false
              this.$router.push({ path: '/', redirect: true })
            }, 2000)
            return false
          }
          console.log(res, 'res 94 sign/index.vue')
          this.isLoading = false
          this.$message.warning(res.showMsg)
        })
        .catch((err) => {
          console.log(err, 'err 登录失败')
          this.isLoading = false
          if (err.message && err.message === 'timeout of 20000ms exceeded') {
            this.$message.warning('请求超时')
            return
          }
          this.$message.warning('登录失败')
        })
    }
    //
  }
}
</script>

<style scoped lang="stylus">
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
.clearfix:after {
    content: "";
    display: block;
    overflow:hidden;
    visibility:hidden;
    height: 0;
    clear: both;
}
.clearfix {
    zoom: 1;
}
.loginContainer
  width 100%
  height 100%
  background #eee url(../../assets/img/login_bj.png) no-repeat top center
  background-size 100% 100%
  .mask
    box-sizing border-box
    width 100%
    height 100%
    padding-bottom 100px
    display flex
    justify-content center
    align-items center
    position fixed
    left 0
    top 0
    z-index 9999
    background-color rgba(0, 0, 0, .5)
    & >>> .ant-spin-text
      color #000
  .headerTop
    box-sizing  border-box
    width 100%
    height 70px
    padding 0 20px
    line-height 70px
    font-size 18px
    font-weight 700 
    background-color #fff
    .headerLeft{
      float left
    }
    .headerRight{
      float right
    }
  .content
    height calc(100% - 100px)
    box-sizing  border-box
    // padding 0px 40px 0 40px
    overflow-y scroll
    background-color transparent
    .contentTitle
      height 60px
      // margin-top 30px
      // padding-left 30px
      margin-top 50px
      padding-left 100px
    .contentBox
      box-sizing  border-box
      height calc(100% - 60px)
      // padding-top 40px
      padding-top 50px
      .contenLeft
        float left
        width 50%
        .contenLeftImg
          // margin-top 50px
          margin-top 34px
          text-align center
      .contentRight
        float: left;
        // height: 300px;
        width: 50%;
        .contentRightBox
          width: 473px;
          height: 360px;
          background-color: #fff;
          border-radius: 17px;
          padding: 30px;
          .contentRightBoxTitle
            text-align: left;
            font-size: 21px;
            font-weight: 700;
            margin-bottom: 30px;
           .login-form-button
            width: 100%
            background: #5D6BBA
            height 40px
  

</style>
