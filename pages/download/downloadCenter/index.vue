<template>
  <div class="body">
    <a-spin style="
      width: 100%;height: 100%;position: fixed;left: 0;top: 0;z-index: 999;
      display: flex;flex-direction: column;;justify-content: center;align-items: center;
      background-color: rgba(0, 0, 0, .5)
      "
      size="large"
      v-show="spinning"
    />
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
       <div class="list" v-if="getDownloadCenterList.length>0">
        <div class="item" v-for="item in getDownloadCenterList" :key="item.id">
          <div class="head">
              <div class="little-title">{{course[currentIndex].name}}</div>
              <div class="title">{{item.courseName}}</div>
          </div>
          <div class="foot">
            <div class="txt">
               课程简介
            </div>
            <div class="btn" :class="{'download':item.isDown=='1', 'hasDownLoad':item.isDown=='0'}" @click="handleclickDownload(item)" v-text="item.isDown=='1'?'已下载':'下载'">
            </div>
          </div>
        </div>
      </div>
      <div v-else style="text-align: center;">
        暂无数据
      </div>
    </div>
    <div class="page">
      <a-pagination
          :total="totalPageNumber"
          v-model="parames.curPagerNo"
          :defaultPageSize="parames.pageSize"
          showQuickJumper
          @change="onChange"
        >
      </a-pagination>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'index',
  data () {
    return {
      spinning: true,
      visible:false,
      currentIndex:0,
      course:[
        {
          name:"全部课程",
          value:'-1'
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
          name:"幼儿课程",
          value:'2'
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
        {
          name:"大学课程",
          value:'6'
        },
        {
          name:"出国课程",
          value:'5'
        },
      ],
      parames:{
        courseName:"",
        type:"-1",
        curPagerNo:1,
        pageSize:10,
      },
      totalPageNumber:0,
      getDownloadCenterList:[],
    }
  },
  mounted() {
    this.getCourseList();
  },
  methods:{
    getCourseList() {
      this.spinning = true
      this.$API.POST('/course/getCourseLis',this.parames).then((res) => {
          this.spinning = false
          if (res && res.data ) {
            this.getDownloadCenterList = res.data.list; 
            console.log(res.data)
          }
          this.totalPageNumber = res.data.rowsCount;
          console.log(this.totalPageNumber)
        })
        .catch((err) => {
          this.spinning = false
          this.$message.warning('获取数据失败');
          console.log(err, 'err')
        })
    },
    handleclickDownload(item) {
      if(item.isDown=='1') {
        this.$message.warning('该课程已经下载,请到我的课程查看');
        return;
      }
      this.spinning = true
      this.$API.POST('/course/downCourse',{
        courseId:item.id,
      }).then((res) => {
        this.spinning = false
        this.$message.warning(res.showMsg);
        this.getCourseList();
      }).catch((err) => {
        this.spinning = false
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
      this.parames.type = item.value;
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
      margin-bottom 20px
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
            
            color white
            border-radius 6px
            cursor pointer
          }
          .download{
            background-color #F6AB00
          }
          .hasDownLoad{
           background-color  #e7355c
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
