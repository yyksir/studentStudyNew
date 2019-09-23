<template>
  <div class="body">
    <header>
      <div class="title">
        下载中心
      </div>
      <div class="search">
         <a-input-search
            placeholder="搜索课程"
            style="width: 200px"
            @search="onSearch"
          />
      </div>
    </header>
    <div class="choose">

      <div class="item" v-for="(item,index) of course" :key="index">
        <div class="itemContent" :class="{chooseItem:currentIndex==index}" @click="handleChooseCourse(item,index)">
          <!-- <img src="../../../assets/img/guanli.png" alt=""> -->
          <span>
            {{item.name}}
          </span>
        </div>
        
      </div>
    </div>
    <div class="content">
       <div class="list">
        <div class="item">
          <div class="head">
              <div class="little-title">认读课程</div>
              <div class="title">新概念英语一</div>
          </div>
          <div class="foot">
            <div class="txt">
               课程简介
            </div>
            <div class="btn" @click="handleclickDownload('11')">
              下载
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page">
      <a-pagination
        :defaultCurrent="1"
        :total="totalPageNumber"
        showQuickJumper
        @change="onChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'index',
  data () {
    return {
      visible:false,
      currentIndex:0,
      course:[
        {
          name:"全部课程",
          value:''
        },
        {
          name:"免费课程",
          value:'0'
        },
        {
          name:"通用课程",
          value:'1'
        },
        {
          name:"小学课程",
          value:'3'
        },
        {
          name:"初中课程",
          value:'4'
        },
        {
          name:"高中课程",
          value:'5'
        },
      ],
      parames:{
        courseName:"",
        payType:0, //1收费 0免费
        gradeType:'',
        curPagerNo:1,
        pageSize:10,
      },
      totalPageNumber:1,
      getDownloadCenterList:[],
    }
  },
  mounted() {
    this.getCourseList();
  },
  methods:{
    getCourseList() {
      this.$API.POST('/course/getCourseLis',this.parames).then((res) => {
          if (res && res.data ) {
            this.getDownloadCenterList = res.data.list; 
            console.log(res.data)
          }
          this.totalPageNumber = res.data.totalPageNumber;
        })
        .catch((err) => {
          this.$message.warning('获取数据失败');
          console.log(err, 'err')
        })
    },
    handleclickDownload(courseId) {
       this.$API.POST('/course/downCourse',{
         courseId
       }).then((res) => {
         this.$message.warning(res.showMsg);
        })
        .catch((err) => {
          this.$message.warning('获取数据失败');
          console.log(err, 'err')
        })
    },
    onSearch (value) {
      this.parames.courseName = value;
      this.getCourseList();
    },
    onChange (pageNumber) {
      this.parames.curPagerNo = pageNumber;
      this.getCourseList();
    },
    hideModal () {
        this.visible = false
    },
    cancle () {

    },
    handleChooseCourse(item,index) {
      this.currentIndex = index;
      if(item.name =="免费课程") {
        this.parames.payType = 0;
      }else{
        this.parames.gradeType = item.value;
      }
        this.getCourseList();
    },
    
  }

}
</script>

<style lang="stylus" scoped>
.body{
  header {
    padding-left 40px
    padding-right 40px
    background white
    height 56px
    line-height 56px
    .title{
      float left
      font-size 20px
      color #3a466c
    }
    .search{
      float right
    }
  }
  .choose{
    overflow hidden
    margin-top 44px
    padding-left 40px
    .item{
      width 150px
      height 66px
      background white
      border-radius 6px
      margin-right 16px
      float left
      line-height 66px
      cursor pointer
      .itemContent{
        padding-left 30px
      }
      .chooseItem{
        background-color #e7355c
        color #ffffff
      } 
    }
  }
  .content{
    padding-left 40px
    padding-right 40px
    margin-top 36px
    margin-bottom 20px
    .list{
      background white
      border-radius 10px
      padding 40px
      overflow hidden
      .item{
        float left
        margin-right 24px
        width 244px
        height 182px
        .head{
            height 148px
            overflow hidden
            width 100%
            background url(../../../static/bj1.png) no-repeat
            background-size 100% 100%
            .little-title{
              height 16px
              font-size 16px
              margin-top 14px
              margin-left 16px
              color #3a466c
            }
            .title{
              text-align center
              height: 22px;
              margin-top: 32px;
              margin-bottom: 22px;
              font-size: 22px;
              color: #3a466c;
            }
        }
        .foot{
          margin-top 8px
          overflow hidden
          .txt{
            float left
            color #8990a7
          }
          .btn{
            float right
            text-align center
            width 90px
            height 24px
            line-height 24px
            background #e7355c
            color white
            border-radius 6px
            cursor pointer
          }
        }
      }
    }
  }
  .page{
    text-align center
  }
}
</style>
