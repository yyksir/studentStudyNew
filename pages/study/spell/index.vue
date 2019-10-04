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
        <div class="boxright" >
            <div class="tabBox">
                <span 
                v-for="(wordName,index) of wordNameArr" 
                :key="index" 
                :class="{'highSeletced':currentTitleIndex==index}" 
                @click="getLearningWord(wordName)" >
                    {{wordName.wordName}}
                </span>
            </div>
            <div class="boxShowContent">
                <div v-if="Object.keys(enVoiceSrc)!=0"   class="boxShosContentInner" v-cloak>
                    <h1>
                        {{enVoiceSrc.wordName}}
                    </h1>
                    <div class="spellBox">
                        <div class="spellSelectName">
                            {{spellWord}}
                        </div>
                        <div class="spellListFirst ">
                            <span class="itemspan spellPublic" v-for="(item,index) of getWordChafen.first" :key="index" @click="handleSpell(item,index)">
                                {{item}}
                            </span>
                        </div>
                        <div class="spellListSecond ">
                            <span class="itemspan spellPublic" v-for="(item,index) of getWordChafen.second" :key="index" @click="handleSpell(item,index)">
                                {{item}}
                            </span>
                        </div>
                    </div>
                    <div class="content" >
                        <p>翻译:{{enVoiceSrc.meaning}}</p>
                        <p >
                            {{enVoiceSrc.exampleSentence1}}
                        </p>
                         <p >
                            {{enVoiceSrc.exampleSentence2}}
                        </p>
                         <p >
                            {{enVoiceSrc.exampleSentence3}}
                        </p>

                    </div>
                </div>
                <div v-else>
                    暂无数据
                </div>
            </div>
            <div class="btnBox">
                <div >
                    <a-button type="primary" @click="handleKnow('0')">错误/不认识</a-button>
                    <a-button type="danger" @click="handleKnow('1')">下一题</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'index',
    data(){
        return {
            query:JSON.parse(this.$route.query.res),
             leftgetMyUnit:[],//单元的开合JSON.parse(this.$route.query.res)
             currentIndex:0,//左侧tab的下标
             pronunciation:1,//the前面是ip   后面就是1和0  1代表美式发音0代表英式发音  
             enVoiceSrc:{},//获取到的翻译返回值
             urlVoice: 'http://121.40.138.216/',
             wordNameArr:[],//度过单词的集合
             currentTitleIndex:0,//显示title的下标
             getWordChafen:{},//离散数组得到的词
             spellWord:'',//拼接成的单词
        }
    },
    mounted() {
        this.initData('1');
        this.currentIndex = 0;
        console.log('mouted')
        window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
    },
    methods:{
        initData(flag) {
            this.$API.POST('/course/getMyUnit',{
                id:this.query.id,
            }).then((res) => {
                if(res&&res.data) {
                    this.leftgetMyUnit =  res.data;
                    if(flag==='1') {
                        this.handleInitUnit(this.leftgetMyUnit[this.currentIndex],0)
                    }
                }
                console.log(res.data)
            }).catch((err) => {
                console.log(err, 'err')
            })
        },
        handleInitUnit(unit,index) {
            this.wordNameArr
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
                console.log(res)
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
                console.log(res)
                if(res.code=='0') {
                    this.getLearningWord(_localUnit)
                }
            })
            .catch((err) => {
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            })
        },
        getLearningWord(localUnit) {
            let _that  = this;
            _that.enVoiceSrc = {};
            _that.$API.POST('/learn/getLearningWord',{
                id:localUnit.id,
            }).then((res) => {
                 console.log(res)
                if(res.code=='0') {
                    _that.enVoiceSrc = res.data;
                     _that.getWordChafenFun(res.data);
                    let  backFlag = _.find(this.wordNameArr, (word)=>{
                        return word.wordName==res.data.wordName;
                    });
                    if(backFlag==undefined) {
                        this.wordNameArr.unshift(res.data)
                    }

                   
                }else{
                    _that.enVoiceSrc = {}
                }
            }).catch((err) => {
                 _that.$message.warning('获取数据失败');
                console.log(err, 'err')
            })
        },
        getWordChafenFun(data) {//获取wordname的选择数组
            this.$API.POST('/learn/getWordChafen',{
                wordName:data.wordName
            }).then((res) => { 
                if(res.code=='0') {
                    this.getWordChafen = res.data;
                }
                console.log(res)
            })
            .catch((err) => {
                this.getWordChafen = {};
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            }) 
        },
        handleKnow(isKnow) {
            this.$API.POST('/learn/doLearn',{
                courseId:this.enVoiceSrc.courseId,
                unitId:this.enVoiceSrc.unitId,
                wordId:this.enVoiceSrc.id,
                isKnow:isKnow,
                type:this.query.type,
            }).then((res) => { 
                if(res.code=='0') {
                    this.getLearningWord(this.leftgetMyUnit[this.currentIndex]) 
                }
                console.log(res)
            })
            .catch((err) => {
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            }) 
            
        },
        beforeunloadFn(e) {
            console.log('刷新或关闭')
            // ...
        },
        handleSpell(name,index){
            this.spellWord +=name;
        }

    },
    beforeRouteEnter (to, from, next) {
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当守卫执行前，组件实例还没被创建
        next(vm => {
            // 通过 `vm` 访问组件实例
             console.log('进去')
        })
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        // const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
        // if (true) {
             console.log('likai')
              next()  
          //  }
            
        // } else {
        //     next(false)
        // }
    },
    destroyed() {
        console.log('销毁')
        window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
    }
    

}
</script>

<style lang="stylus" scoped>
[v-cloak] {

     display: none;

}
.box{
    display flex
    flex-direction row
    width 100%
    height 100%
   .boxLeft{
        width: 260px;
        background: #001529;
        overflow-y auto
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
        .tabBox{
            height 53px
            background-color #ffffff
            padding 0 20px
            line-height 53px
            margin-bottom: 10px
            white-space: nowrap
            overflow: hidden
            span {
                float left
                overflow auto
                font-size 18px
                margin-right 15px
            }
            .highSeletced{
                border-bottom: 3px solid #e7355c;
                color: #e7355c
                font-weight: 700
                cursor pointer
            }
        }
        .boxShowContent{
            min-height 300px
            padding 50px 100px 0
            .boxShosContentInner{
                height 100%
                .spellBox{
                    text-align center
                    .spellSelectName{
                        text-align center
                        margin-bottom 10px
                    }
                    .spellPublic{
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        text-align: center;
                        line-height: 40px;
                        background-color #fff
                        margin-left 10px
                        margin-bottom 10px
                        cursor pointer
                    }
                }
                .content{
                    margin-top 30px
                }
            }
        }
        .btnBox{
            text-align center
            margin-top 30px
        }
    } 
}
</style>