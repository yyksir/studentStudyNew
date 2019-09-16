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
            <div class="item">

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
                        <div class="btn">
                            下载
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="page">
            <a-pagination showQuickJumper :defaultCurrent="2" :total="500" @change="onChange" />
        </div>
        
    </div>
</template>

<script>
export default {
    layout:"index",
    data(){
        return {
            visible:false
        }
    },
    methods:{
        onSearch(){

        },
        onChange(pageNumber) {
            console.log('Page: ', pageNumber);
        },
        hideModal() {
            this.visible = false
        },
        cancle(){
            
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
              background url(../static/bj1.png) no-repeat
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