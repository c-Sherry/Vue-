<template>
    <div>
        <div class="mui-numbox" data-numbox-min="1" data-numbox-max="maxNum">
            <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
                                         <!-- 绑定改变事件. 监听数据改变 -->
            <input id="test" class="mui-input-numbox" type="number" value="1" @change="countChanged" ref="numBox">
            <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
        </div>
    </div>
</template>

<script>
    import mui from '../../lib/mui/js/mui.min.js'
    export default {
        name: "goodsInfo_number",
        //初始化数字选择框. 需要导入mui.js
        mounted(){
            mui('.mui-numbox').numbox();
            console.log(this.maxNum);//undefined
            //分析问题: 由于max是异步请求过来的. 不知道什么时候能真正的拿到max值. 需要监听 watch
        },
        methods:{
            //绑定改变事件. 监听数据改变, 然后传递给父组件
            countChanged(){
                //给当前元素绑定ref属性, 可通过 this.$refs.属性值 拿到当前dom对象
                console.log(this.$refs.numBox.value);
                this.$emit('getCount',parseInt(this.$refs.numBox.value));//凡是涉及到数字加减. 需要转化一下
            }
        },
        props:['maxNum'],
        watch:{
            //监听数字的改变. 去mui文档看,
            // 只要值传过来了. 就监听maxNum的值改变, 我就立马设置最大值
            'maxNum':function (newVal, oldVal) {
                mui('.mui-numbox').numbox().setOption('max',newVal)
            }
        }
    }
</script>

<style scoped>

</style>