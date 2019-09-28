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
            <div>
                <canvas id='canvas' width="800" height="400"></canvas>
            </div>
            <div>
                <audio id="audioDomEn" ref="audioDomEn" controls="controls" >
                    <source id="audio"  type="audio/mpeg">
                    您的浏览器不支持 audio 元素, 建议使用谷歌浏览器等高级浏览器。
                </audio>
            </div>
            <div class="btnBox">
                <div v-show="step=='1'" >
                    <a-button type="primary" @click="handleGotoStepTwo">答案</a-button>
                    <a-button type="danger" @click="handleBtnVoiceEnClick" >重读</a-button>
                </div>
                <div v-show="step=='2'" >
                    <a-button type="primary" @click="handleKnow('1')">认识</a-button>
                    <a-button type="primary" @click="handleKnow('0')">不认识</a-button>
                    <a-button type="danger" @click="handleBtnVoiceEnClick" >重读</a-button>
                </div>
                
            </div>
            <div class="content" v-show="step=='2'">
                <p >
                    {{enVoiceSrc.exampleSentence1}}
                </p>

            </div>
          
        </div>

        
    </div>
</template>

<script>
export default {
    layout: 'index',
    data() {
        return {
             query:JSON.parse(this.$route.query.res),
            //  {
            //     courseId: 1,
            //     createTime: null,
            //     id: 90,
            //     isStart: 1,
            //     learnCount: 0,
            //     type: 3,
            //     unitId: 1,
            //     unitName: "小学单词体验课1",
            //     unknowCount: 0,
            //     userId: 501,

            //  }
             leftgetMyUnit:[],//单元的开合JSON.parse(this.$route.query.res)
             currentIndex:0,//左侧tab的下标
             pronunciation:1,//the前面是ip   后面就是1和0  1代表美式发音0代表英式发音  
             enVoiceSrc:{},//获取到的翻译返回值
             urlVoice: 'http://121.40.138.216/',
             step:'1',
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
                        this.handleInitUnit(this.leftgetMyUnit[this.currentIndex],0)
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
                this.getLearningWord(_localUnit)
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
                _that.enVoiceSrc = res.data
                console.log(res)
                // const resdata = res.data
                //window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

                    let audioDomEn = this.$refs.audioDomEn;
                        audioDomEn.crossOrigin = "anonymous";
                        audioDomEn.src = _that.urlVoice + res.data.wordName + 0 + '.mp3'; 
                        audioDomEn.play()
                //     let MEDIA_ELEMENT_NODES = new WeakMap();
                //     if (ctx == undefined) { 
                //         ctx = new AudioContext(); 
                //     } 
                //    // var ctx = ctx||new AudioContext();
                //     if (MEDIA_ELEMENT_NODES.has(audioDomEn)) { 
                //          audioSrc = MEDIA_ELEMENT_NODES.get(audioDomEn); 
                //     } else { 
                //         let audioSrc = ctx.createMediaElementSource(audioDomEn); 
                //         MEDIA_ELEMENT_NODES.set(audioDomEn, ctx); 
                //     } 
                //     let analyser = ctx.createAnalyser();
                //    // let audioSrc = audioSrc|| ctx.createMediaElementSource(audioDomEn);

                //     audioSrc.connect(analyser);
                //     analyser.connect(ctx.destination);

                //     analyser.fftSize = 512;


                //     let canvas = document.getElementById('canvas');
                //     let ctx = canvas.getContext('2d');
                    // let cwidth = canvas.width;
                    // let cheight = canvas.height - 2;
                    // let meterWidth = 10; //方块的宽度
                    // let gap = 10; //方块的间距
                    // let capHeight = 10;
                    // let meterNum = cwidth / (meterWidth + gap);
                    // let gradient = ctx.createLinearGradient(0, 0, 0, cheight);
                    //  gradient.addColorStop(1, '#00ff00');
                    //  gradient.addColorStop(0.8, '#ffff00');
                    //  gradient.addColorStop(0, '#ff0000');
                    //  ctx.fillStyle = gradient;//填充

                    let AudioContext = window.AudioContext || window.webkitAudioContext;
                    let audioContext = new AudioContext();
                    let analyser = audioContext.createAnalyser();
                    analyser.fftSize = 256;
                    analyser = audioContext.createAnalyser();

                    // let audio = document.getElementById('audio');
                    let audioSrc = audioContext.createMediaElementSource(audioDomEn);
                    audioSrc.connect(analyser);
                    analyser.connect(audioContext.destination);
                    let canvas = document.getElementById('canvas');

                    let ctx = canvas.getContext('2d');
                    let cwidth = canvas.width;
                    let cheight = canvas.height - 2;
                    let meterWidth = 10; //方块的宽度
                    let gap = 10; //方块的间距
                    let capHeight = 10;
                    let meterNum = cwidth / (meterWidth + gap);
                    let gradient = ctx.createLinearGradient(0, 0, 0, cheight);
                     gradient.addColorStop(1, '#00ff00');
                     gradient.addColorStop(0.8, '#ffff00');
                     gradient.addColorStop(0, '#ff0000');
                     ctx.fillStyle = gradient;//填充

                    // let ctx = canvas.getContext("2d");
                    // ctx.lineWidth = 2;
                    // let grd = ctx.createLinearGradient(0, 0, 600, 0);
                    // grd.addColorStop(0, "#00d0ff");
                    // grd.addColorStop(1, "#eee");

                    // let grd2 = ctx.createLinearGradient(0, 0, 600, 0);
                    // grd2.addColorStop(0, "#fff");
                    // grd2.addColorStop(1, "#e720ee");
                    // let het=0;


                    function render() {
                        let array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        let step = Math.round(array.length / meterNum);
                        ctx.clearRect(0, 0, cwidth, cheight);
                        for (let i = 0; i < meterNum; i++) {
                            let value = array[i * step];
                            ctx.fillRect(i * (meterWidth+gap) , cheight - value + capHeight, meterWidth, cheight||capHeight); 
                        }
                        requestAnimationFrame(render);
                    }
                    render();
            })
            .catch((err) => {
                // _that.$message.warning('获取数据失败');
                console.log(err, 'err')
            })
        },
        handleBtnVoiceEnClick() {
            let audioDomEn = this.$refs.audioDomEn;
             audioDomEn.play()
        },
        handleGotoStepTwo() {
            this.step  ='2'
        },
        handleKnow(isKnow) {
            this.step = '1'
            this.$API.POST('/learn/doLearn',{
                courseId:this.enVoiceSrc.courseId,
                unitId:this.enVoiceSrc.unitId,
                wordId:this.enVoiceSrc.id,
                isKnow:isKnow,
                type:this.query.type,
            }).then((res) => {
                this.getLearningWord(this.leftgetMyUnit[this.currentIndex])
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
        .btnBox{
            text-align center
        }
    } 
}



</style>