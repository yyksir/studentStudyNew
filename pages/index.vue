<template>
  <div class="body">
    <header>
      <div class="name">欢迎您！{{name}}</div>
      <div class="endtime">账号截止日期</div>
      <div class="starttime">上次学习时间</div>
    </header>
    <div class="caozuo">
      <div class="title">快捷操作</div>
      <div class="list">
        <div @click="handlQuickOperation('1')">
          <img src="../assets/img/kecheng.png" alt />
        </div>
        <div @click="handlQuickOperation('2')">
          <img src="../assets/img/ciliang.png" alt />
        </div>
        <div @click="handlQuickOperation('3')">
          <img src="../assets/img/ceshi.png" alt />
        </div>
        <div @click="handlQuickOperation('4')">
          <img src="../assets/img/shengcheng.png" alt />
        </div>
        <div @click="handlQuickOperation('5')">
          <img src="../assets/img/cidian.png" alt />
        </div>
      </div>
    </div>
    <div class="already">
      <div class="title">已学课程</div>
      <div class="list">
        <div class="item" v-for="item of haveStudied" :key="item.id" @click="handleStartStudy(item)">
          <div class="head" :class="{'recognize':'1'==item.type,'spell':'2'==item.type,'dialect':'3'==item.type}">
            <!-- 1 认读2 拼写3 辨音
            .recognize
            .spell
            .dialect 
          -->
            <div class="little-title">{{item.type=='1'?"认读":item.type=='2'?"拼写":"辨音"}}课程</div>
            <div class="title">{{item.courseName}}</div>
          </div>
          <div class="foot">
            <div class="txt">已学进度：0%</div>
            <!--  0 开始学习 1  继续学习 2 重新学习 -->
            <div class="btn" :class="{'start':'0'==item.isStart,'go':'1'==item.isStart,'restart':'2'==item.isStart}">
              {{item.isStart=='0'?"开始学习":(item.isStart=='1'?"继续学习":"重新学习")}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart">
      <div class="title">学习统计</div>
      <div class="toolbar">
        
        <div class="week" :class="{weekend:curentIndex==index}" v-for="(item,index) of tab" :key="index" @click="handleseletced(index)">按周统计</div>
        <div class="timeSelect">
          <a-range-picker @change="onChange" />
        </div>
      </div>
      <div class="example">
        <div id="censusWord">
          <div id="censusWordBox" ref="censusWordBox">

          </div>
        </div>
        <div id="censusTime">
          <div id="censusTimeBox" ref="censusTimeBox">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'index',
  data() {
    return {
      name: "您",
      tab:[
        {
          name:'按周统计',
        },
        {
          name:'按月统计'
        }

      ],
      curentIndex:0,
      parames:{
          censusType: 1,
          startTimeStr: '',//2019-08-01
          endTimeStr: '',//2019-10-01
      },
      haveStudied:[],
      learningTime:{
        data:[],
        date:[],
      },
      locabulary:{
        data:[],
        legend:[],
        series:[],
      },
    };
  },
  created() {
    
  },
  mounted() {
    this.getHasStudyCourse();
   // this.echartsInit();
    this.echartsData();
  },
  methods:{
    getHasStudyCourse() {
       this.$API.POST('/course/getMyCourse',{
          courseName: '小学',
          curPagerNo: 1,
          pageSize: 10,
        }).then((res) => {
          if (res && res.data ) {
            this.haveStudied = res.data.list;
          }else{
            this.haveStudied = [];
          }
        })
        .catch((err) => {
          this.$message.warning('获取数据失败');
          console.log(err, 'err')
        })
    },
    echartsData() {
      this.getLearningLocabulary();
      this.getLearningTime();
    },
    getLearningLocabulary() {
       this.$API.POST('/census/censusWord',this.parames).then((res) => {
          if (res && res.data ) {
            this.locabulary ={
                data : res.data.data,
                legend : res.data.legend,
                series : res.data.series,
            }
          }else{
            this.locabulary.data = [];
            this.locabulary.legend = [];
            this.locabulary.series = [];
          }
          this.echartsInit1(this.locabulary.legend,this.locabulary.data,this.locabulary.series)
        })
        .catch((err) => {
          this.locabulary.data = [];
          this.locabulary.legend = [];
          this.locabulary.series = [];
          this.echartsInit1(this.locabulary.legend,this.locabulary.data,this.locabulary.series)
          this.$message.warning('获取数据失败');
          console.log(err, 'err')
        })
    },
    getLearningTime() {
       this.$API.POST('/census/censusTime',this.parames).then((res) => {
          //date 是时间 data是值
          if (res && res.data ) {
            this.learningTime.data = res.data.data;
            this.learningTime.date = res.data.date;
          }else{
            this.learningTime.data = [];
            this.learningTime.date = [];
          }
          console.log(this.learningTime)
          this.echartsInit(this.learningTime.date,this.learningTime.data )
        })
        .catch((err) => {
          this.learningTime.data = [];
          this.learningTime.date = [];
          console.log(this.learningTime)
          this.echartsInit(this.learningTime.date,this.learningTime.data )
          this.$message.warning('获取数据失败');
          console.log(err, 'err')
        })
    },
    onChange(date, dateString) {
      if(dateString[0]!='') {
        this.parames.censusType = 3;
      }
      this.parames.startTimeStr = dateString[0];
      this.parames.endTimeStr =dateString[1];
      this.echartsData();
    },
    handleseletced(index) {
      this.curentIndex = index;
      this.parames.censusType = index +1;
      this.parames.startTimeStr = '';
      this.parames.endTimeStr ='';
      this.echartsData();
    },
    handlQuickOperation(index) {
      let getIndex = index;
      switch(getIndex) {
        case "1":
          this.$router.push('/test/courseTest/');
          break;
        case "2":
        this.$router.push('/test/vocabulary/');
          break;
        case "3":
        this.$router.push('/test/testScore/');
          break;
        case "4":
        this.$router.push('/test/generateTestPaper/');
          break;
        case "5":
        this.$router.push('/myService/dictionary/');
          break;
      }
    },
    echartsInit (date,data) {
      // 找到容器date 是时间 data是值
      let myChartTime = this.$echarts.init(this.$refs.censusTimeBox);
      // 开始渲染
      myChartTime.setOption(
        {
        title: {text: '本周学习时长'},
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: date
        },
        yAxis: {},
        series:[{
          data: data,
          type: 'bar'
          }],
      });
      
    },
    echartsInit1(legend,data,series) {
      let myChartWord = this.$echarts.init(this.$refs.censusWordBox);
      myChartWord.setOption({
          title: {
              text: '本周学习单词量',
              // subtext: '纯属虚构'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
               data:legend //legend
          },
          xAxis:  {
              type: 'category',
              boundaryGap: false,
              data: data//横坐标data
          },
          yAxis: {
              type: 'value',
              axisLabel: {
                  formatter: '{value} 个'
              }
          },
          series:  series
      });
    },
    handleStartStudy(course) {
      console.log(course)
    }
  }
}
</script>


<style lang="stylus" scoped>
  .body {
    header {
      height: 58px;
      line-height: 58px;
      padding-left: 40px;
      padding-right: 40px;
      background: white;
      .name {
        float: left;
        color: #313a56;
        margin-right: 30px;
      }
      .endtime {
        float: left;
      }
      .starttime {
        float: right;
      }
    }
    .caozuo {
      padding-left: 40px;
      .title {
        height: 22px;
        margin-top: 32px;
        margin-bottom: 22px;
        font-size: 22px;
        color: #3a466c;
      }
      .list {
        overflow: hidden;
        min-height:180px;
        div {
          margin-right: 30px;
          margin-bottom:20px;
          float: left;
          cursor pointer
        }
      }
    }
    .already {
      padding-left: 40px;
      padding-right: 36px;
      .title {
        height: 22px;
        margin-top: 32px;
        margin-bottom: 22px;
        font-size: 22px;
        color: #3a466c;
      }
      .list {
        background: white;
        border-radius: 10px;
        padding: 40px;
        overflow: hidden;
        .item {
          float: left;
          margin-right: 24px;
          margin-bottom:24px;
          width: 244px;
          height: 182px;
          .head {
            height: 148px;
            overflow: hidden;
            width: 100%;
           
            background-size: 100% 100%;
            .little-title {
              height: 16px;
              font-size: 16px;
              margin-top: 14px;
              margin-left: 16px;
              color: #3a466c;
            }
            .title {
              text-align: center;
            }
          }
          .recognize{
             background: url('../static/bj1.png') no-repeat;
          }
          .spell{
            background: url('../static/bj2.png') no-repeat;
          }
          .dialect{
            background: url('../static/bj3.png') no-repeat;
          }
          .foot {
            margin-top: 8px;
            overflow: hidden;

            .txt {
              float: left;
              color: #8990a7;
            }
            .btn {
              float: right;
              text-align: center;
              width: 90px;
              height: 24px;
              line-height: 24px;
              color: white;
              border-radius: 6px;
              cursor pointer
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
    .chart {
      padding-left: 40px;
      padding-right 40px;
      .title {
        height: 22px;
        margin-top: 32px;
        margin-bottom: 22px;
        font-size: 22px;
        color: #3a466c;
      }
      .toolbar {
        overflow: hidden;
        margin-bottom 20px
        .week {
          width: 106px;
          height: 38px;
          line-height: 38px;
          margin-right: 16px;
          text-align: center;
          float: left;
          font-size: 14px;
          background: white;
          cursor pointer
        }
        .weekend{
          background-color #e7355c
          color #ffffff
        }
        .timeSelect{
          float:right;
        }
      }
      .example{
        overflow hidden
        
        #censusWord{
          float:left;
          height:300px;
          width 50%;
          #censusWordBox{
            margin-right 10px
            height 100%;
            background-color #ffffff

          }
        }
        #censusTime{
          float :left;
          height:300px;
          width 50%;
          #censusTimeBox{
            margin-left 10px
            height 100%
            background-color #ffffff
          }
        }
      }
    }
  }
</style>

