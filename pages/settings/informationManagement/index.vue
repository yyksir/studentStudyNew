<!-- 信息管理 -->
<template>
  <div class="containerSetting">
    <div>
    </div>
    <a-form-item class="formItem"
      label="账号"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input disabled v-model="userName"/>
    </a-form-item>
    <a-form-item class="formItem"
      label="姓名"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input v-show="isEdit" v-model="trueName"/>
      <a-input v-show="!isEdit" disabled v-model="trueName"/>
    </a-form-item>
    <a-form-item class="formItem"
      label="性别"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-select :disabled="!isEdit" style="width: 100%;"
        @change="handleSexChange"
        v-model="userSex"
      >
        <a-select-option value="男">男</a-select-option>
        <a-select-option value="女">女</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item class="formItem"
      label="出生年月"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input disabled v-show="!isEdit" v-model="userBirth"/>
      <a-date-picker style="width: 100%;" v-show="isEdit"
        :disabled="!isEdit"
        :locale="locale"
        format="YYYY-MM-DD"
        :disabledDate="disabledDate"
        @change="onChange"
      />
    </a-form-item>
    <a-form-item class="formItem"
      label="所在地区"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input v-show="isEdit" v-model="userAddress"/>
      <a-input v-show="!isEdit" disabled v-model="userAddress"/>
    </a-form-item>
    <a-form-item class="formItem"
      label="联系方式"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input v-show="isEdit" v-model="userPhone"/>
      <a-input v-show="!isEdit" disabled v-model="userPhone"/>
    </a-form-item>
    <a-form-item class="formItem"
      label="邮箱"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input v-show="isEdit" v-model="userEmail"/>
      <a-input v-show="!isEdit" disabled v-model="userEmail"/>
    </a-form-item>
    <a-form-item class="formItem"
      v-show="isEdit"
      label="修改密码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input v-model.trim="changePwd"/>
    </a-form-item>
    <a-form-item class="formItem"
      v-show="isEdit"
      label="确认密码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input v-model.trim="confirmPwd"/>
    </a-form-item>
    <a-form-item class="formItem" style="display: flex;justify-content: flex-start;align-items: center;margin-top: 20px;"
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 17 }"
    >
      <div class="btnContainer">
        <span class="btn btnConfirm" v-show="!isEdit" @click="handleBtnModifyClick">修改信息</span>
        <span class="btn btnCancel" v-show="isEdit" @click="handleBtnCancelClick">返回</span>
        <span class="btn btnConfirm" v-show="isEdit" @click="handleBtnConfirmClick">确认修改</span>
      </div>
    </a-form-item>
  </div>
</template>

<script>
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default {
  layout: 'index',
  data () {
    return {
      mode1: 'time',
      locale:{
        'lang': {
          "placeholder": "请选择日期",
          "today": "今天",
          "yearFormat": "YYYY",
          "dateFormat": "MM/DD/YYYY",
          "dayFormat": "DD",
          "monthFormat": "MM"
        }
      },
      isEdit: false,
      // isEdit: true,
      // form: {},
      userName: '', // 账号
      trueName: '', // 姓名
      userSex: '', // 1 男  0 女
      userBirth: null,
      userAddress: '',
      userPhone: '',
      userEmail: '',
      changePwd: '',
      confirmPwd: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      this.$API.POST('/course/getMyInfo', {
      }).then((res) => {
        if (res && res.data && res.data.data) {
          this.setData(res.data.data)
        } else {
          this.setData({})
        }
      })
      .catch((err) => {
        console.log(err, 'err')
        this.setData({})
        this.$message.error('获取用户信息接口调用失败, 联系管理员')
      })
    },
    moment,
    disabledDate (current) {
      // Can not select days before today and today
      return current && current >= moment().endOf('day');
    },
    setData (data) {
      this.userName = data.userName || ''
      this.trueName = data.trueName || ''
      this.userSex = data.userSex === 1 ? '男' : (data.userSex === 0 ? '女' : '')
      this.userBirth = data.userBirth || ''
      this.userAddress = data.userAddress || ''
      this.userPhone = data.userPhone || ''
      this.userEmail = data.userEmail || ''
    },
    // 修改信息按钮被点击
    handleBtnModifyClick () {
      this.isEdit = true
    },
    // 取消修改
    handleBtnCancelClick () {
      this.isEdit = false
    },
    // 性别改变
    handleSexChange (val) {
      // console.log(val, 'val')
    },
    verification () {
      if (!this.trueName) {
        this.$message.warning('姓名不能为空')
        return false
      }
      if (this.userSex === '') {
        this.$message.warning('请选择性别')
        return false
      }
      if (!this.userAddress) {
        this.$message.warning('地址不能为空')
        return false
      }
      if (!this.userPhone) {
        this.$message.warning('电话不能为空')
        return false
      }
      if (!this.userEmail) {
        this.$message.warning('邮箱不能为空')
        return false
      }
      return true
    },
    onChange (val) {
      if (!val) {
        this.userBirth = null
        return false
      }
      this.userBirth = moment(val).format('YYYY-MM-DD')
    },
    handleBtnConfirmClick () {
      if (!this.verification()) {
        return false
      }
      const params = {
        trueName: this.trueName, // 账号
        userSex: this.userSex === '男' ? 1 : 0, // 性别
        userBirth: this.userBirth, // 出生日期
        userAddress: this.userAddress, // 地址
        userPhone: this.userPhone, // 电话
        userEmail: this.userEmail // 邮箱
      }
      if (this.changePwd !== '' || this.confirmPwd !== '') {
        if (this.changePwd !== this.confirmPwd) {
          this.$message.warning('两次填写的密码不一样')
          return false
        }
        params['userPassword'] = this.confirmPwd
      }
      this.$API.POST('/course/uptMyInfo', params)
      .then((res) => {
        this.isEdit = false
        this.$message.success('信息修改成功')
        this.getUserInfo()
      })
      .catch((err) => {
        console.log(err, 'err')
        this.$message.error('修改信息接口调用失败, 联系管理员')
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
  .containerSetting
    width 100%
    height 100%
    box-sizing border-box
    padding 30px
    .formItem
      width 50%
      margin-bottom 0
      .btnContainer
        width 100%
        display flex
        justify-content flex-end
        align-items center
        .btn
          display flex
          justify-content center
          align-items center
          width 135px
          height 40px
          border 1px solid #f5222d
          border-radius 6px
        .btnCancel
          color #f5222d
        .btnConfirm
          margin-left 10px
          background-color #f5222d
          color #fff
</style>
