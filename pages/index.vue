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
        <div>
          <img src="../assets/img/kecheng.png" alt />
        </div>
        <div>
          <img src="../assets/img/ciliang.png" alt />
        </div>
        <div>
          <img src="../assets/img/ceshi.png" alt />
        </div>
        <div>
          <img src="../assets/img/shengcheng.png" alt />
        </div>
        <div>
          <img src="../assets/img/cidian.png" alt />
        </div>
      </div>
    </div>
    <div class="already">
      <div class="title">已学课程</div>
      <div class="list">
        <div class="item">
          <div class="head">
            <div class="little-title">认读课程</div>
            <div class="title">新概念英语一</div>
          </div>
          <div class="foot">
            <div class="txt">已学进度：45%</div>
            <div class="btn">开始学习</div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart">
      <div class="title">学习统计</div>
      <div class="toolbar">
        <div class="week">按周统计</div>
        <div class="week">按月统计</div>
        <div></div>
      </div>
      <div class="example"></div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'index',
  data() {
    return {
      name: "刘亚男"
    };
  },
  mounted() {
    this.$API.POST('/course/getMyCourse',{
      courseName: '小学',
      curPagerNo: 1,
      pageSize: 10,
   
    }).then((res) => {
      console.log(res, 'res')
    })
    .catch((err) => {
      console.log(err, 'err')
    })
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
      .title {
        height: 22px;
        margin-top: 32px;
        margin-bottom: 22px;
        font-size: 22px;
        color: #3a466c;
      }
      .toolbar {
        overflow: hidden;
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
      }
    }
  }
</style>

