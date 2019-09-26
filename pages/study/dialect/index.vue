<template>
    <div class="box">
        <div class="boxLeft">
            <div class="upBtn">
                <a-icon type="down" />
            </div>
            <div class="itemBox">
                <div class="item" v-for="(item,index) of leftgetMyUnit" :class="{'selectTab':currentIndex==index}"  :key="item.id" @click="handleInitUnit(item,index)">
                    <h3 class="itemTitle">
                        {{item.unitName}}
                    </h3>
                    <div class="itemConte">
                        词条{{item.learnCount}}--已学{{item.learnCount}}|错误{{item.learnCount}}
                    </div>
                </div>
            </div>
            <div class="downBtn">
                <a-icon type="up" />
            </div>
        </div>
        <div class="boxright">
22
        </div>

        
    </div>
</template>

<script>
export default {
    layout: 'index',
    data() {
        return {
             query:JSON.parse(this.$route.query.res),
             leftgetMyUnit:[],
             currentIndex:0,
        }
    },
    mounted() {
        this.initData('1');
        this.currentIndex = 0;
    },
    methods:{
        initData(flag) {
            this.$API.POST('/course/getMyUnit',{
                id:this.query.id,
            }).then((res) => {
                if(res&&res.data) {
                    this.leftgetMyUnit =  res.data;
                    if(flag==='1') {
                        this.handleInitUnit(this.leftgetMyUnit[0],0)
                    }
                }
                console.log(res.data)
            }).catch((err) => {
                console.log(err, 'err')
            })
        },
        handleInitUnit(unit,index) {
            let _that = this;
            _that.currentIndex = index;
            let localUnit = unit;
            if(localUnit.isStart=='1') {
                this.getLearningWord(localUnit)
            }else{
                _that.$confirm({
                    title: '提示',
                    content: '是否要进行章节测试',
                    okText: '是',
                    cancelText: '否',
                    onOk() {
                        console.log('章节测试');
                    },
                    onCancel() {
                        _that.uptCourseUnitIsStarted(localUnit);
                    }
                });
            }
            console.log(unit)
        },
        uptCourseUnitIsStarted(localUnit) {
            this.$API.POST('/course/uptCourseUnitIsStarted',{
                id:localUnit.id,
                isStart:1
            }).then((res) => {
                this.resetWordCache(localUnit)
                this.initData('2')
            })
            .catch((err) => {
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            })
        },
        resetWordCache(localUnit) {
            let _localUnit = localUnit;
            this.$API.POST('/learn/resetWordCache',{
                id:_localUnit.id,
            }).then((res) => {
                this.getLearningWord(_localUnit)
            })
            .catch((err) => {
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            })
        },
        getLearningWord(localUnit) {
            this.$API.POST('/learn/getLearningWord',{
                id:localUnit.id,
            }).then((res) => {
               console.log(res)
            })
            .catch((err) => {
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            })
        }

    },

    

}
</script>

<style lang="stylus" scoped>
.box{
    display flex
    flex-direction row
    width 100%
    height 100%
   .boxLeft{
        width: 260px;
        background: #001529;
        overflow-y scroll
        color #ffffff
        position relative
        .upBtn{
            background-color #3A466C
            text-align center
            height 40px
            line-height 40px
            cursor pointer
        }
        .downBtn{
            background-color #3A466C
            text-align center
            position absolute
            bottom 0
            width 100%
            height 40px
            line-height 40px
            cursor pointer
        }
        .itemBox{
            overflow auto
            .item{
                color #ffffff
                padding-bottom 20px
                cursor pointer
                text-align center
                .itemTitle{
                    color #ffffff
                    font-size 18px
                }
            }
            .selectTab{
                background-color #E7355C
            }
        }
    }
    .boxright{
        background: #f0f4f5;
        flex: 1;
        overflow: scroll;
    } 
}



</style>