<template>
    <div class="boxContent" >
        <div class="toptitle clearfix">
            <span class="titleName" style="margin-right: 32px;">{{courseNameStr}}</span>
            <div class="titleLeft">
                <a-switch checkedChildren="美" unCheckedChildren="英" v-model="check" @change="handleVoiceCategoryChange" />
                <a-icon class="close" type="close" @click="handleCloseRouter" />
            </div>
            
        </div>
        <div class="box clearfix">
            <div class="boxLeft">
                <div class="upBtn" @click="handleDownUnit">
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
                <div class="downBtn" @click="handleUpUnit">
                    <a-icon type="up" />
                </div>
            </div>
            <div class="boxright" >
                <div class="tabBox">
                    <span 
                    v-for="(wordName,index) of wordNameArr" 
                    :key="index" 
                    :class="{'highSeletced':currentTitleIndex==index}" 
                    @click="handtabName(wordName,index)" >
                        {{wordName.wordName}}
                    </span>
                </div>
                <div class="boxShowContent">
                    <div v-if="Object.keys(enVoiceSrc)!=0"   class="boxShosContentInner" v-cloak>
                        <h1>
                            {{enVoiceSrc.wordName}}
                        </h1>
                        <div class="spellBox">
                            <div class="spellSelectName" v-html="spellWord">
                                
                            </div>
                            <div class="spellListSecond ">
                                <span class="itemspan spellPublic"  
                                    v-for="(item,index) in first" 
                                    :key="index"  
                                    @click="handleSpell(item,index,'1')">
                                    <span class="spellPublic" :class="{'highLight':item.isSelected}">
                                    {{item.name}}
                                    </span> 
                                </span>
                            </div>
                            <div class="spellListSecond ">
                                <span class="itemspan "  v-for="(item,index) in second" :key="index"  @click="handleSpell(item,index,'2')">
                                <span class="spellPublic" :class="{'highLight':item.isSelected}">
                                    {{item.name}}
                                    </span> 
                                </span>
                            </div>
                            <audio class="audioDomEn" ref="englishPronu" :src="voice.src">
                                <source class="audioDomEn"  type="audio/mpeg">
                                <embed class="audioDomEn" height="0" width="0" src="">
                                    您的浏览器不支持 audio 元素, 建议使用谷歌浏览器等高级浏览器。
                            </audio>
                            <!-- <div class="spellListSecond ">
                                <span class="itemspan " v-for="(item,index) of nameArr" :key="index" >
                                    <span class="spellPublic" v-for="(name,nameIndex)  of item" :key="nameIndex"   @click="handleSpell(name,nameIndex)">
                                        {{name}}
                                    </span>
                                </span>
                            </div> -->
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
                    <div v-else style="text-align:center">
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
             nameArr:[
                 ['c','d'],
                 ['o','e'],
                 ['f','n'],
                 ['d','t'],
                 ['i','r'],
                 ['o','t'],
                 ['t','l'],
             ],
             currentFirstNameIndex:-1,
             currentSecondNameIndex:-1,
             studyTime:'',//学习的时间
             check:true,//选择的音美音
             courseNameStr:'',//课程名称
             first:[],
             second:[],
             right:[],
             voice:{ //声音
                 src:''
             }

        }
    },
    mounted() {
        this.initData('1');
        this.currentIndex = 0;
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

            this.$API.POST('/learn/getLearningTime',{
                id:this.query.id,
            }).then((res) => {
                console.log("获取时间");
                this.studyTime = res.data;
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
                        _that.$router.push({
                            path:'/test/courseTest/' + localUnit.type,
                            query:{
                                courseId:localUnit.courseId,
                                united:localUnit.unitedId,
                                testType:0,
                            }
                        })
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
            
            _that.$API.POST('/learn/getLearningWord',{
                id:localUnit.id,
            }).then((res) => {
                 console.log(res)
                if(res.code=='0') {
                    _that.handleChangeBackName(res.data)
                }else if(res.code=='1008') {
                    _that.$confirm({
                        title: res.msg,
                        content: '是否要进行单元测试',
                        okText: '是',
                        cancelText: '否',
                        onOk() {
                            _that.$router.push({
                                path:'/test/courseTest/' + localUnit.type,
                                query:{
                                    courseId:localUnit.courseId,
                                    united:localUnit.unitedId,
                                    testType:1,
                                }
                            })
                            console.log('章节后测试');
                        },
                        onCancel() {
                            _that.currentIndex ++;
                            if(_that.currentIndex == _that.leftgetMyUnit.length) {
                                _that.currentIndex  = 0;
                            }
                            _that.handleInitUnit(_that.leftgetMyUnit[_that.currentIndex],0)
                        }
                    })

                }else{
                    _that.enVoiceSrc = {}
                }
            }).catch((err) => {
                 _that.$message.warning('获取数据失败');
                console.log(err, 'err')
            })
        },
        handleChangeBackName(data) {
            let _that = this;
            _that.enVoiceSrc = {};
             _that.courseNameStr = data.courseNameStr;
            _that.enVoiceSrc = data;
                _that.getWordChafenFun(data);
            let  backFlag = _.find(this.wordNameArr, (word)=>{
                return word.wordName==data.wordName;
            });
            if(backFlag==undefined) {
                _that.wordNameArr.unshift(data)
            }
            _that.voice={
                src:_that.urlVoice + data.wordName + (_that.check?1:0) + '.mp3',

            };
        },
        getWordChafenFun(data) {//获取wordname的选择数组
            this.$API.POST('/learn/getWordChafen',{
                wordName:data.wordName
            }).then((res) => { 
                if(res.code=='0') {
                    const getdata  = res.data
                    this.first = getdata.first.map((item)=>{
                        const container = {};
                        container.name = item;
                        container.isSelected = false
                        return container;
                    })
                    this.second = getdata.second.map((item)=>{
                        const container = {};
                        container.name = item;
                        container.isSelected = false
                        return container;
                    })
                    this.right = res.data.right;
                }

            })
            .catch((err) => {
                this.getWordChafen = {};
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            }) 
        },
        handleKnow(isKnow) {
            this.spellWord = ''
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
        handleSpell(name,index,row){
            console.log(name,index,row)
            if(row=='1') {
                if(this.second[index].isSelected) {
                    this.second[index].isSelected =false
                }
                this.first[index].isSelected =true;
            }else{
                if(this.first[index].isSelected) {
                    this.first[index].isSelected =false
                }
                this.second[index].isSelected =true;
            }
            //row 是一行 二行 name就是值 index就是下标
            if(this.spellWord.length>this.right.length) {
                this.spellWord = this.$store.state.name; 
            }
            console.log(this.$store)
            if(this.spellWord.length<=this.right.length) {
                this.spellWord = '';
                this.right.forEach((element,indexIner) => {
                    if(this.first[indexIner].isSelected) {
                        this.spellWord +=this.first[indexIner].name;
                    }
                    if(this.second[indexIner].isSelected) {
                        this.spellWord +=this.second[indexIner].name;
                    }
                    
                });
                this.$store.commit('handlehangeSpellName',this.spellWord)
            }
            //$store.state.name 
            //$store.commit('handlehangeSpellName',name)

            if(this.spellWord.length == this.right.length) {
                let confirmName = '';
                this.right.forEach((ele,index)=>{
                    if(this.spellWord[index]!=ele) {
                         confirmName += `<span style="color: red">${this.spellWord[index] }</span>`;
                    }else{
                        confirmName += this.spellWord[index];
                    }
                    
                })
                this.spellWord = confirmName;
                this.$refs.englishPronu.play();
            }
        },
        handleVoiceCategoryChange(check) {
            console.log(check)
            this.check = check;
        },
        handleCloseRouter() {
            this.$router.go(-1);
        },
        handleDownUnit(){
            this.currentIndex ++;
            if(this.currentIndex>=this.leftgetMyUnit.length) {
                this.currentIndex = 0
            }
            this.handleInitUnit(this.leftgetMyUnit[this.currentIndex],this.currentIndex)
        },
        handleUpUnit() {
            this.currentIndex --;
            if(this.currentIndex<=-1) {
                this.currentIndex = this.leftgetMyUnit.length-1;
            }
            this.handleInitUnit(this.leftgetMyUnit[this.currentIndex],this.currentIndex)
        },
        handtabName(wordName,index) {
            this.currentTitleIndex = index;
            this.handleChangeBackName(wordName);
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
.boxContent{
    height 100%
    width 100%
    .toptitle{
        height 50px
        line-height 50px
        padding: 0 30px 0 20px;
        .titleLeft{
            float right
            .close{
                font-size 20px
                cursor pointer
                vertical-align middle
                margin-left 20px
            }
        }
        .titleName{
            font-size 20px
            font-weight 700
        }
    }
}
.box{

    width 100%
    height calc(100% - 50px)
   .boxLeft{
        width: 260px;
        background: #001529;
        float left
        color #ffffff
        position relative
        height 100%
        overflow auto
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
                padding 10px 0
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
        float left
        overflow: auto
        width calc(100% - 260px)
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
                font-size 18px
                margin-right 15px
                height 52px
                cursor pointer
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
                position relative
                .spellBox{
                    margin: 0 auto;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    .spellSelectName{
                        text-align center
                        margin-bottom 10px
                    }
                    .spellListSecond{
                        overflow hidden
                        .itemspan{
                            display flex
                            flex-direction column
                            float left
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
                            .highLight{
                                border 2px solid #67C23A
                                line-height 40px
                            }
                        }
                    }
                }
                .content{
                    margin-top 140px
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