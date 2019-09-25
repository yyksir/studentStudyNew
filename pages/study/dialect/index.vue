<template>
    <div class="box">
        <div class="boxLeft">
            <div class="upBtn">
                <a-icon type="down" />
            </div>
            <div class="itemBox">
                <div class="item">
                    <h3 class="itemTitle">
                        ti
                    </h3>
                    <div class="itemConte">
                        con
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
        }
    },
    mounted() {
        this.initData();
    },
    methods:{
        initData() {
            this.$API.POST('/course/getMyUnit',{
                id:this.query.id,
            }).then((res) => {
                console.log(res.data)
            }).catch((err) => {
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
        }
    }
    .boxright{
        background: #f0f4f5;
        flex: 1;
        overflow: scroll;
    } 
}



</style>