<template>

        <div class="mui-numbox" data-numbox-min="1" data-numbox-max="maxNum">
            <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
            <!-- 绑定改变事件. 监听数据改变 -->
            <input id="test" class="mui-input-numbox" type="number" :value="initCount" @change="countChanged" ref="numBox">
            <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
        </div>

</template>

<script>
    import mui from '../../lib/mui/js/mui.min.js'
    export default {
        name: "goodsInfo_number",
        //初始化数字选择框. 需要导入mui.js
        mounted(){
            mui('.mui-numbox').numbox();//初始化选择框的值

        },
        methods:{
            //绑定改变事件. 监听数据改变, 然后传递给父组件
            countChanged(){
                //给当前元素绑定ref属性, 可通过 this.$refs.属性值 拿到当前dom对象
                console.log(this.$refs.numBox.value);

                //调用store中mutations的修改数量的方法--->传商品id和数量值
                this.$store.commit('updateGoods',{id:this.goodsId , count:this.$refs.numBox.value})
            }
        },
        props:['initCount','goodsId']
    }
</script>

<style scoped>
    .mui-numbox{
        height: 27px;
    }
</style>