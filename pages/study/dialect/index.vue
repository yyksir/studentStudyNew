<template>
    <div class="box">
        <div class="boxLeft">
11
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
            query:this.$route.parames
        }
    },
    mounted() {
        console.log(this.$route.query.parames )
    },
    methods:{

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
    }
    .boxright{
        background: #f0f4f5;
        flex: 1;
        overflow: scroll;
    } 
}



</style>