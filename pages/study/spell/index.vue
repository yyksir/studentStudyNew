<template>
    <div class="boxContent" >
      <a-spin style="
        width: 100%;height: 100%;position: fixed;left: 0;top: 0;z-index: 999;
        display: flex;flex-direction: column;;justify-content: center;align-items: center;
        background-color: rgba(0, 0, 0, .5)
        "
        size="large"
        v-show="spinning"
      />
        <div class="toptitle clearfix">
            <span class="titleName" style="margin-right: 32px;">{{courseNameStr}}</span>
            <span style="margin-right: 32px;">本次学习时长: {{hours}}小时{{minitus}}分钟{{seconds}}秒</span>
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
                            词条{{item.wordCount||item.learnCount}}--已学{{item.learnCount}}|错误{{item.learnCount}}
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
                        <div class="boxShosContentInnerSelect">               
                            <div class="spellBox">
                                <h1  class="spellSelectName" v-html="spellWord"></h1>
                                <div class="spellListSecond ">
                                    <span class="itemspan spellPublic"  
                                        v-for="(item,index) in first" 
                                        :key="index"  
                                        @click="handleSpell(item,index,'1')">
                                        <span class="spellPublic" :class="{'highLight':item.isSelected=='1','errLight':item.isSelected=='2'}">
                                        {{item.name}}
                                        </span> 
                                    </span>
                                </div>
                                <div class="spellListSecond ">
                                    <span class="itemspan "  v-for="(item,index) in second" :key="index"  @click="handleSpell(item,index,'2')">
                                    <span class="spellPublic" :class="{'highLight':item.isSelected=='1','errLight':item.isSelected=='2'}">
                                        {{item.name}}
                                        </span> 
                                    </span>
                                </div>
                                <audio class="audioDomEn" ref="englishPronu" :src="voice.src" crossOrigin="anonymous">
                                    <source class="audioDomEn"  type="audio/mpeg">
                                    <embed class="audioDomEn" height="0" width="0" src="">
                                        您的浏览器不支持 audio 元素, 建议使用谷歌浏览器等高级浏览器。
                                </audio>
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
                    <div v-else style="text-align:center">
                        暂无数据
                    </div>
                </div>
                <div class="btnBox">
                    <div v-show="step=='2'">
                        <a-button type="primary" @click="handleKnow('1')">认识</a-button>
                        <a-button type="primary" @click="handleKnow('0')">不认识</a-button>
                    </div>
                    <div v-show="step=='3'">
                         <a-button type="danger" @click="handleGoNext()">下一题</a-button>
                    </div>
                </div>
                <div class="btnErr">
                    <a-input class="input" placeholder="请输入需要报错内容" v-model='inputVal' />
                    <a-button type="primary" class="btn" @click="handSubmitError">报错</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import {
  URL_VOICE
} from '@/assets/config/index.js'
export default {
    layout: 'index',
    data(){
        return {
            spinning: true,
            query:this.$route.query,
             leftgetMyUnit:[],//单元的开合JSON.parse(this.$route.query.res)
             currentIndex:0,//左侧tab的下标
             pronunciation:1,//the前面是ip   后面就是1和0  1代表美式发音0代表英式发音  
             enVoiceSrc:{},//获取到的翻译返回值
             urlVoice: 'http://121.40.138.216/',
             wordNameArr:[],//度过单词的集合
             currentTitleIndex:0,//显示title的下标
             getWordChafen:{},//离散数组得到的词
             spellWord:'',//拼接成的单词
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
             },
             step:'1', //1表示第一步 2 表示正确 3表示下一题
             hours:0,//小时
             minitus:0,//分钟
             seconds:0,//秒
             interval: null, // 定时器
             inputVal:'',//输入框报错的值
        }
    },
    mounted() {
        this.initData('1');
        this.currentIndex = 0;
        window.addEventListener('beforeunload', e => this.beforeunloadFn(e));
    },
    methods:{
        initData(flag) {
            this.spinning = true
            this.$API.POST('/course/getMyUnit',{
                id:this.query.id,
            }).then((res) => {
                this.spinning = false
                if(res&&res.data) {
                    this.leftgetMyUnit =  res.data;
                    if(flag==='1') {
                        this.handleInitUnit(this.leftgetMyUnit[this.currentIndex],0)
                    }
                }
                console.log(res.data)
            }).catch((err) => {
                this.spinning = false
                console.log(err, 'err')
            })
            this.spinning = true
            this.$API.POST('/learn/getLearningTime',{
                id:this.query.id,
            }).then((res) => {
                this.spinning = false
                console.log("开始获取时间");
                this.studyTime = res.data;
                 this.getDifferenceTime()
                console.log(res.data)
            }).catch((err) => {
                this.spinning = false
                console.log(err, 'err')
            })
            this.timeFormat();
        },
        timeFormat() {
            clearInterval(this.interval)
            this.interval = null;
            this.hours = 0;
            this.minitus = 0;
            this.seconds = 0;
        },
        getDifferenceTime() {
            this.interval = setInterval(() => {
                this.studyTime ++;
                this.showTime(this.studyTime);
            }, 1000)
        },
        showTime(val){
            if(val<60){
                    this.hours = 0;
                    this.minitus = 0;
                    this.seconds =val;
            }else{
                var min_total = Math.floor(val / 60); // 分钟
                var sec = Math.floor(val % 60); // 余秒
                if(min_total<60){
                    this.hours = 0;
                    this.minitus = min_total;
                    this.seconds = sec;
                }else{
                    var hour_total = Math.floor(min_total / 60); // 小时数
                    var min = Math.floor(min_total % 60); // 余分钟
                    this.hours = hour_total;
                    this.minitus = min;
                    this.seconds =sec;
                }
            }

        },
        handleInitUnit(unit,index) {
            // this.wordNameArr
            let _that = this;
            _that.currentIndex = index;
            let localUnit = unit;
            if(localUnit.isStart=='1') {//
                this.getLearningWord(localUnit)
            }else if(localUnit.isStart=='2') {
                _that.$confirm({
                    title: '提示',
                    content: '是否要进行章节学后测试',
                    okText: '是',
                    cancelText: '否',
                    onOk() {
                        _that.$router.push({
                            path:'/test/courseTest/' + localUnit.type,
                            query:{
                                courseId:localUnit.courseId,
                                unitId:localUnit.unitId,
                                testType:1,
                            }
                        })
                        console.log('章节测试');
                    },
                    onCancel() {
                        _that.currentIndex ++;
                        if(_that.currentIndex == _that.leftgetMyUnit.length) {
                            _that.currentIndex  = 0;
                        }else{
                            _that.handleInitUnit(_that.leftgetMyUnit[_that.currentIndex],_that.currentIndex)
                        }
                        
                    }
                });

            }else{
                _that.$confirm({
                    title: '提示',
                    content: '是否要进行章节学前测试',
                    okText: '是',
                    cancelText: '否',
                    onOk() {
                        _that.$router.push({
                            path:'/test/courseTest/' + localUnit.type,
                            query:{
                                courseId:localUnit.courseId,
                                unitId:localUnit.unitId,
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
            this.spinning = true
            this.$API.POST('/course/uptCourseUnitIsStarted',{
                id:localUnit.id,
                isStart:localUnit.isStart,
            }).then((res) => {
                this.spinning = false
                console.log(res)
                this.resetWordCache(localUnit)
                this.initData('2')
            })
            .catch((err) => {
                this.spinning = false
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            })
        },
        resetWordCache(localUnit) {
            this.spinning = true
            let _localUnit = localUnit;
            this.$API.POST('/learn/resetWordCache',{
                id:_localUnit.id,
            }).then((res) => {
                this.spinning = false
                console.log(res)
                if(res.code=='0') {
                    this.getLearningWord(_localUnit)
                }
            })
            .catch((err) => {
                this.spinning = false
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            })
        },
        getLearningWord(localUnit) {
            this.spinning = true
            let _that  = this;
            _that.$API.POST('/learn/getLearningWord',{
                id:localUnit.id,
            }).then((res) => {
                this.spinning = false
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
                                    unitId:localUnit.unitId,
                                    testType:1,
                                }
                            })
                            console.log('章节后测试');
                        },
                        onCancel() {
                            _that.currentIndex ++;
                            if(_that.currentIndex == _that.leftgetMyUnit.length) {
                                _that.currentIndex  = 0;
                            }else{
                                _that.handleInitUnit(_that.leftgetMyUnit[_that.currentIndex],_that.currentIndex)
                            }
                            
                        }
                    })
                }else{
                    _that.enVoiceSrc = {}
                }
            }).catch((err) => {
                this.spinning = false
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
            _that.voice={
                src:URL_VOICE + data.wordName + (_that.check?1:0) + '.mp3',
            };
            _that.step='1'
        },
        getWordChafenFun(data) {//获取wordname的选择数组
            this.spinning = true
            this.$API.POST('/learn/getWordChafen',{
                wordName:data.wordName
            }).then((res) => { 
                this.spinning = false
                if(res.code=='0') {
                    const getdata  = res.data
                    this.first = getdata.first.map((item)=>{
                        const container = {};
                        container.name = item;
                        container.isSelected = '0'
                        return container;
                    })
                    this.second = getdata.second.map((item)=>{
                        const container = {};
                        container.name = item;
                        container.isSelected = '0'
                        return container;
                    })
                    this.right = res.data.right;
                }
            })
            .catch((err) => {
                this.spinning = false
                this.getWordChafen = {};
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            }) 
        },
        handleKnow(isKnow) {
            this.spinning = true
            this.spellWord = ''
            this.$API.POST('/learn/doLearn',{
                courseId:this.enVoiceSrc.courseId,
                unitId:this.enVoiceSrc.unitId,
                wordId:this.enVoiceSrc.id,
                isKnow:isKnow,
                type:this.query.type,
            }).then((res) => { 
                this.spinning = false
                if(res.code=='0') {
                    this.step='3';
                    this.upMyUnit(this.leftgetMyUnit[this.currentIndex]);
                    // this.getLearningWord(this.leftgetMyUnit[this.currentIndex]) 
                }
                console.log(res)
            })
            .catch((err) => {
                this.spinning = false
                this.$message.warning('获取数据失败');
                console.log(err, 'err')
            }) 
        },
        upMyUnit(leftgetMyUnit){
            console.log(leftgetMyUnit)
            this.spinning = true
             this.$API.POST('/course/uptMyUnit',{
                id:leftgetMyUnit.id,
            }).then((res) => {
                this.spinning = false;
                this.leftgetMyUnit[this.currentIndex].learnCount = res.data.learnCount;
                this.leftgetMyUnit[this.currentIndex].unknowCount = res.data.unknowCount;
                console.log(res.data)
            }).catch((err) => {
                this.spinning = false
                console.log(err, 'err')
            })
        },
        handleGoNext() {
            this.getLearningWord(this.leftgetMyUnit[this.currentIndex]) 
        },
        beforeunloadFn(e) {
            this.spinning = true
            this.$API.POST('/learn/uptLearningTime',{
                id:this.query.id,
                learnTime:this.studyTime
            }).then((res) => {
                this.spinning = false
                console.log(res.data)
            }).catch((err) => {
                this.spinning = false
                console.log(err, 'err')
            })
        },
        handleSpell(name,index,row){
            //isSelected 0代表没选择 1 代表ok 2代表err
            let flag = true;
           // console.log(name,index,row)//row 是一行 二行 name就是值 index就是下标
            if(row=='1') {
                if(this.second[index].isSelected=='1') {
                    this.second[index].isSelected = '0'
                }
                this.first[index].isSelected = '1';
            }else{
                if(this.first[index].isSelected=='1') {
                    this.first[index].isSelected = '0'
                }
                this.second[index].isSelected = '1';
            }
            this.spellWord = '';
            this.right.forEach((element,indexIner) => {
                if(this.first[indexIner].isSelected=='1') {
                    this.spellWord +=this.first[indexIner].name;
                }
                if(this.second[indexIner].isSelected=='1') {
                    this.spellWord +=this.second[indexIner].name;
                }
            });
           
            this.right.forEach((item,indexIner)=>{
               if(this.first[indexIner].isSelected=='0'&&this.second[indexIner].isSelected=='0') {
                   flag=false
               }
            })
            if(flag) {
                if(this.spellWord.length>this.right.length) {
                    this.spellWord = this.$store.state.name; 
                }
                this.$store.commit('handlehangeSpellName',this.spellWord)
                let str = ''
                this.right.forEach((item)=>{
                    str+=item;
                })
                if(this.spellWord == str) {
                    this.step = '2';
                    let  backFlag = _.find(this.wordNameArr, (word)=>{
                        return word.wordName==this.enVoiceSrc.wordName;
                    });
                    if(backFlag==undefined) {
                        this.wordNameArr.unshift(this.enVoiceSrc)
                    }
                }else{
                     
                    let confirmName = '';
                    
                    this.right.forEach((ele,index)=>{
                        if(this.spellWord[index]!=ele) {
                            confirmName += `<span style="color: red">${this.spellWord[index] }</span>`;
                            if(this.first[index].isSelected=='1') {
                                // this.first[index].isSelected=='0'
                                this.second[index].isSelected='2'
                            }else{
                               // this.second[index].isSelected='0'
                                this.first[index].isSelected='2'
                            }
                        }else{
                            confirmName += this.spellWord[index];
                        }
                    })
                    this.spellWord = confirmName;
                }
                this.$refs.englishPronu.play();
            }else if(!flag) {
                this.$store.commit('handlehangeSpellName',this.spellWord)
            }
            console.log(this.spellWord)
           
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
        },
        handSubmitError() {
            this.spinning = true
             this.$API.POST('/census/addErr',{
                errDesc:this.inputVal,
                wordId:this.enVoiceSrc.unitId,
                wordName:this.enVoiceSrc.wordName,
            }).then((res) => {
                this.spinning = false;
                this.$message.success('提交报错成功,谢谢您的配合!');
                this.inputVal = '';
                console.log(res.data)
            }).catch((err) => {
                this.spinning = false
                console.log(err, 'err')
            })
            console.log(this.inputVal)
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
        this.spinning = true
        this.interval = null;
        this.$API.POST('/learn/uptLearningTime',{
            id:this.query.id,
            learnTime:this.studyTime
        }).then((res) => {
            this.spinning = false
        }).catch((err) => {
            this.spinning = false
            console.log(err, 'err')
        })
        window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
    }
    

}
</script>

<style lang="stylus" scoped>
.btnErr{
    position absolute
    bottom 40px
    width 300px
    .input {
        float left
        width 200px
        margin-right 10px
        margin-left 10px
    }
    .btn{
        float left
    }

}
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
        height 100%
        overflow auto
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
                .boxShosContentInnerSelect{
                    height 225px
                    position relative
                    .spellBox{
                        margin: 0 auto;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        .spellSelectName{
                            text-align center
                            margin-bottom 10px
                            height 50px
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
                                }
                                .errLight{
                                    border 2px solid red
                                }
                            }
                        }
                    }
                }
                
                .content{
                    margin-top 20px
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