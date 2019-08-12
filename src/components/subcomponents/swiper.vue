<template>
    <div>
        <!--轮播图区域-->
        <mt-swipe :auto="4000">
            <!--将来,谁使用轮播图组件, 谁就传递bannerList, 所以bannerList应该是父组件向子组件传值来设置-->
            <!-- 就需要通过props接受-->
            <mt-swipe-item v-for="item in bannerList" :key="item.id">
                <!--绑定样式 : 通过父传子, 传递布尔值-->
                <img :src="item.img" alt="" :class="{'full':isFull}">
            </mt-swipe-item>

        </mt-swipe>
    </div>
</template>

<script>
    export default {
        name: "swiper",
        props: ['bannerList', 'isFull']
    }
</script>

<style scoped lang="scss">
    .full {
        width: 100%;
    }

    .mint-swipe {
        height: 200px;

        .mint-swipe-item {
            text-align: center;

            img {
                /*width: 100%;*/
                height: 100%;
            }
        }
    }
</style>