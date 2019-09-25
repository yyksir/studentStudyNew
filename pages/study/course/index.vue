<template>
    <div class="body">
      <header>
        <div class="title">
          我的课程
        </div>
        <div class="search">
          <a-input-search placeholder="搜索课程" style="width: 200px"
            @search="onSearch"
          />
        </div>
      </header>
      <div class="content">
        <div class="list">
        <div class="item" v-for="item of getMyCourse" :key="item.id" >
          <div class="head" :class="{'recognize':'1'==item.type,'spell':'2'==item.type,'dialect':'3'==item.type}">
            <!-- 1 认读2 拼写3 辨音
            .recognize
            .spell
            .dialect 
          -->
            <div class="little-title">{{item.type=='1'?"认读":item.type=='2'?"拼写":"辨音"}}课程</div>
            <div class="title">{{item.courseName}}</div>
            <div class="delteItem" @click="handleDeleteItem(item)">
              <a-icon style="color:#000"  type="delete" />
            </div>
          </div>
          <div class="foot">
            <div class="txt">已学进度：0%</div>
            <!--  0 开始学习 1  继续学习 2 重新学习 -->
            <div 
            class="btn" 
            @click="handleStartStudy(item)"
            :class="{'start':'0'==item.isStart,'go':'1'==item.isStart,'restart':'2'==item.isStart}">
              {{item.isStart=='1'?"继续学习":(item.isStart=='2'?"重新学习":"开始学习")}}
            </div>
          </div>
        </div>
        </div>
      </div>
      <div class="page">
        <a-pagination showQuickJumper :defaultCurrent="1" :total="totalPage" @change="onChange" />
      </div>
      
      <a-modal 
        title="提示"
        v-model="visible"
        @cancel="handleCancel"
        :footer="null"
      >
        <div style="position:relative;overflow: hidden;">
          <div v-if="selectItem.isStart=='0'">
            <a-button type="primary" style="float:left"   @click="handlePageTest">
              章节学前测试
            </a-button>
            <a-button  type="primary" style="position: absolute;top: 50%;left: 50%;transform:translate(-50%,-50%);"   @click="handleActionStusy">
              开始学习
            </a-button>
            <a-button type="primary" style="float:right"  @click="handleTotal">
              学前总测试
            </a-button> 
        </div>
        <div v-else-if="selectItem.isStart=='1'">
          <a-button type="primary" style="float:left"   @click="handlePageTest">
            继续学习
          </a-button>
          <a-button type="primary" style="float:right"  @click="handleDeleteStudyRecord">
            删除学习记录
          </a-button> 

        </div>
        </div>
      </a-modal>
    </div>
</template>

<script>
export default {
  layout: 'index',
  data () {
    return {
      visible:false,
      parames:{
        courseName:'',
        curPagerNo:1,
        pageSize:10,
      },
      totalPage:1,
      getMyCourse:[],
      selectItem:{},
    }
  },
  mounted() {
    this.getMyCourseData();
  },
  methods:{
    getMyCourseData() {
      this.$API.POST('/course/getMyCourse',this.parames).then((res) => {
        console.log((res))
          if (res && res.data&& res.data.list.length>0 ) {
            this.getMyCourse = res.data.list;
            
          }else{
            this.getMyCourse = [];
          }
          this.totalPage = res.data.totalPageNumber
        })
        .catch((err) => {
          this.$message.warning('获取数据失败');
          console.log(err, 'err')
        })
    },
    onSearch (value) {
      this.parames.courseName = value;
      this.getMyCourseData();
    },
    onChange (pageNumber) {
      this.parames.curPagerNo = pageNumber;
      this.getMyCourseData();
    },
    handleCancel() {
      this.visible = false
    },
    handlePageTest () {//章节测试
      console.log("cancel")
    },
    handleActionStusy() {//开始学习
    //item.type=='1'?"认读":item.type=='2'?"拼写":"辨音"
      if(this.selectItem.type=='1') {
        this.$router.push({path: '/study/recognize/',
        query: {
          parames: JSON.stringify(this.selectItem) 
          } 
        })
      }else if(this.selectItem.type=='2'){
        this.$router.push({path: '/study/spell/',
        query: {
          parames:JSON.stringify(this.selectItem) 
          } 
        })
      }else{
        this.$router.push({path: '/study/dialect/',
        query: {
          parames:this.selectItem
          } 
        })
      }
    },
    handleTotal() { //总测试

    },
    handleDeleteItem(item) {
      this.$confirm({
        title: '提示',
        content: '你确实想删除此课程吗?(删除后可重新下载)',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          this.$API.POST('/course/delMyCourse',{
            id:item.id
          }).then((res) => {
          console.log((res))
            this.$message.success(res.data);
            this.getMyCourseData()
          })
          .catch((err) => {
            this.$message.warning('获取数据失败');
            console.log(err, 'err')
          })
        },
      });
    },
    handleStartStudy(item) {
      this.visible = true;
      this.selectItem = item;
      console.log(item)
    },
    handleuptCourseIsStarted() {
      this.$API.POST('/course/uptCourseIsStarted',{
        id:this.selectItem.id,
      }).then((res) => {
        console.log(res.data)
      }).catch((err) => {
        console.log(err, 'err')
      })
    },
    handleDeleteStudyRecord() {

    }
  }
}
</script>

<style lang="stylus" scoped>
  .body{
    header{
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
            background-size 100% 100%
            position relative
            &:hover {
            .delteItem{
                display  block;
              }
            }
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
            .delteItem{
              background-color: rgba(255,255,255,0.5);
              position: absolute;
              bottom: 0;
              width: 100%;
              text-align: center;
              cursor: pointer;
              display none
            }
          }
          .recognize{
             background: url('../../../static/bj1.png') no-repeat;
          }
          .spell{
            background: url('../../../static/bj2.png') no-repeat;
          }
          .dialect{
            background: url('../../../static/bj3.png') no-repeat;
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
              cursor pointer
              color white
              border-radius 6px
            }
            .start{
              background: #e7355c;
            }
            .go{
              background: #3BBCA3;
            }
            .restart{
              background-color :#23AAEA;
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
