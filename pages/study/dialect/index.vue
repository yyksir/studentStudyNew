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
                <div>111</div>
            </div>
            <canvas id='canvas' width="800" height="400"></canvas>
            <audio id="audioDomEn" ref="audioDomEn" controls="controls" >
              <source id="audio"  type="audio/mpeg">
              您的浏览器不支持 audio 元素, 建议使用谷歌浏览器等高级浏览器。
            </audio>
            <div>
                <a-button type="primary">正确</a-button>
                <a-button type="danger">复读</a-button>
            </div>
            <button @click="handleBtnVoiceEnClick">11111111111111111111111111111111</button>
            <!-- //<audio id="audio" controls autoplay loop></audio> -->
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
             enVoiceSrc:'',
             urlVoice: 'http://121.40.138.216/',
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
            let _that  = this;
            _that.$API.POST('/learn/getLearningWord',{
                id:localUnit.id,
            }).then((res) => {

                console.log(res)
                // const resdata = res.data
               // window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

                    let audioDomEn = this.$refs.audioDomEn;
                        audioDomEn.crossOrigin = "anonymous";
                        audioDomEn.src = _that.urlVoice + res.data.wordName + 0 + '.mp3'; 
                        audioDomEn.play();
                    var ctx = new (window.AudioContext || window.webkitAudioContext)();;
                    var analyser = ctx.createAnalyser();
                    var audioSrc =  ctx.createMediaElementSource(audioDomEn);
                    audioSrc.connect(analyser);
                    analyser.connect(ctx.destination);
                    analyser.fftSize = 512;
                    var canvas = document.getElementById('canvas');
                    var ctx = canvas.getContext('2d');
                    var cwidth = canvas.width;
                    var cheight = canvas.height - 2;
                    var meterWidth = 5; //方块的宽度
                    var gap = 2; //方块的间距
                    var capHeight = 2;
                    var meterNum = cwidth / (meterWidth + gap);
                    var gradient = ctx.createLinearGradient(0, 0, 0, cheight);
                    gradient.addColorStop(1, '#00ff00');
                    gradient.addColorStop(0.8, '#ffff00');
                    gradient.addColorStop(0, '#ff0000');
                    ctx.fillStyle = gradient;//填充

                    function render() {
                        var array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        var step = Math.round(array.length / meterNum);
                        ctx.clearRect(0, 0, cwidth, cheight);
                        for (var i = 0; i < meterNum; i++) {
                            var value = array[i * step];
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