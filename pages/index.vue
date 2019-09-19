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
        <div class="item" v-for="item of haveStudied" :key="item.id">
          <div class="head">
            <div class="little-title">认读课程</div>
            <div class="title">{{item.courseName}}</div>
          </div>
          <div class="foot">
            <div class="txt">已学进度：{{item.isStart}}%</div>
            <div class="btn">开始学习</div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart">
      <div class="title">学习统计</div>
      <div class="toolbar">
        <div class="weekend week">按周统计</div>
        <div class="mounth week">按月统计</div>
        <div class="timeSelect">
          <a-range-picker @change="onChange" />
        </div>
      </div>
      <div class="example">
        <div id="censusWord">
          <div id="censusWordBox">

          </div>
        </div>
        <div id="censusTime">
          <div id="censusTimeBox">

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
      name: "刘亚男",
      haveStudied:[],
      learningTime:[],
      locabulary:[],
    };
  },
  mounted() {
    this.getHasStudyCourse();
    this.getLearningLocabulary();
    this.getLearningTime();
    this.echartsInit();
    this.initcensusWordBoxechart()
  },
  methods:{
    getHasStudyCourse() {
       this.$API.POST('/course/getMyCourse',{
          courseName: '小学',
          curPagerNo: 1,
          pageSize: 10,
        }).then((res) => {
          if (res && res.data && res.data.list && res.data.list.length>0 ) {
            this.haveStudied = res.data.list;
          }else{
            this.haveStudied = [];
          }
        })
        .catch((err) => {
          this.$message.warning('获取已学课程失败');
          console.log(err, 'err')
        })
    },
    getLearningLocabulary() {
       this.$API.POST('/census/censusWord',{
          censusType: 1,
          // startTimeStr: '2019-08-01',
          // endTimeStr: '2019-10-01',
        }).then((res) => {
          console.log(res)
          if (res && res.data && res.data.list && res.data.list.length>0 ) {
            this.haveStudied = res.data.list;
          }else{
            this.haveStudied = [];
          }
        })
        .catch((err) => {
          this.$message.warning('获取已学课程失败');
          console.log(err, 'err')
        })
    },
    getLearningTime() {
       this.$API.POST('/census/censusTime',{
          censusType: 1,
          // startTimeStr: '2019-08-01',
          // endTimeStr: '2019-10-01',
        }).then((res) => {
          //date 是时间 data是值
          console.log(res)
          if (res && res.data && res.data.list && res.data.list.length>0 ) {
            this.learningTime = res.data.list;
          }else{
            this.learningTime = [];
          }
        })
        .catch((err) => {
          this.$message.warning('获取已学课程失败');
          console.log(err, 'err')
        })
    },
    onChange(date, dateString) {
      console.log(date, dateString);
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
    echartsInit () {
      // 找到容器
      let myChart = this.$echarts.init(document.getElementById('censusTimeBox'))
      // 开始渲染
      myChart.setOption({
        title: {text: '本周学习时长'},
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    },
    initcensusWordBoxechart() {
      let myChart = this.$echarts.init(document.getElementById('censusWordBox'))
      // 开始渲染
      myChart.setOption({
          title: {
              text: '未来一周气温变化',
              subtext: '纯属虚构'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data:['最高气温','最低气温1']
          },
          xAxis:  {
              type: 'category',
              boundaryGap: false,
              data: ['周一','周二','周三','周四','周五','周六','周日']
          },
          yAxis: {
              type: 'value',
              axisLabel: {
                  formatter: '{value} °C'
              }
          },
          series: [
              {
                  name:'最高气温',
                  type:'line',
                  data:[11, 11, 15, 13, 12, 13, 10],
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'}
                      ]
                  },
                  markLine: {
                      data: [
                          {type: 'average', name: '平均值'}
                      ]
                  }
              },
              {
                  name:'最低气温',
                  type:'line',
                  data:[1, -2, 2, 5, 3, 2, 0],
                  markPoint: {
                      data: [
                          {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                      ]
                  },
                  markLine: {
                      data: [
                          {type: 'average', name: '平均值'},
                          [{
                              symbol: 'none',
                              x: '90%',
                              yAxis: 'max'
                          }, {
                              symbol: 'circle',
                              label: {
                                  normal: {
                                      position: 'start',
                                      formatter: '最大值'
                                  }
                              },
                              type: 'max',
                              name: '最高点'
                          }]
                      ]
                  }
              }
          ]
      })

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

        div {
          margin-right: 30px;
          margin-bottom:20px;
          float: left;
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
            background: url('../static/bj1.png') no-repeat;
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
              background: #e7355c;
              color: white;
              border-radius: 6px;
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
        }
        .timeSelect{
          float:right;
        }
      }
      .example{
        #censusWord{
          float:left;
          height:300px;
          width 50%;
          #censusWordBox{
            margin-right 10px
            height 100%
          }
        }
        #censusTime{
          float :left;
          height:300px;
          width 50%;
          #censusTimeBox{
            margin-left 10px
            height 100%
          }
        }
      }
    }
  }
</style>

