<template>
    <div class="goodsinfo-container">

        <!--小球-->
        <transition
                @before-enter="beforeEnter"
                @enter="enter"
                @after-enter="afterEnter">
            <div class="ball" v-show="flag"></div>

        </transition>

        <!--商品轮播图区域-->
        <div class="mui-card">
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <!---->
                    <swiper :bannerList="banner" :isFull="false"></swiper>
                </div>
            </div>
        </div>

        <!--商品购买区域-->
        <div class="mui-card">
            <div class="mui-card-header">{{goodsinfo.title}}</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p class="price">
                        市场价: <del>{{ goodsinfo.market_price }}</del>&nbsp;&nbsp;
                        销售价: <span class="now_price">{{   goodsinfo.sell_price }}</span>
                    </p>
                    <p>购买数量: <number
                            @getCount="getSelectedCount"
                            :maxNum="goodsinfo.stock_quantity"></number>
                    </p>
                    <p>
                        <mt-button type="primary" size="small">立即购买</mt-button>
                        <mt-button type="danger" size="small" @click="addShopcar">加入购物车</mt-button>
                        <!--
                        分析: 如何实现加入购物车时候，拿到 选择的数量
                        1.按钮属于goodsinfo页面, 数字属于number页面
                        2.传值: 子传父
                        3.其本质： 父向子传递方法，子调用这个方法， 同时把 数据当作参数 传递给这个方法
                        4.子组件什么时候把值传给父组件? 当数字改变的时候  用 change事件
                        5.设置最大值: 父传子
                        -->
                    </p>
                </div>
            </div>
        </div>

        <!--商品参数区域-->
        <div class="mui-card">
            <div class="mui-card-header">商品参数</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p>商品货号:{{   goodsinfo.goods_no }}</p>
                    <p>库存情况:{{   goodsinfo.stock_quantity }}</p>
                    <p>上架时间:{{   goodsinfo.add_time | dateFormat() }}</p>
                </div>
            </div>
            <div class="mui-card-footer">
                <mt-button type="primary" size="large" plain @click="goDesc(id)">图文介绍</mt-button>
                <mt-button type="danger" size="large" plain @click="goComment(id)">商品评论</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    //4.抽离轮播图公共模块, 并导入, 然后定义, 调用
    import swiper from '../subcomponents/swiper.vue'
    //5.搭建商品购买区域, 并封装数字选择框区域, 并导入
    import number from '../subcomponents/goodsInfo_number.vue'
    export default {
        name: "goodsInfo",
        components:{
            swiper,
            number
        },
        data(){
            return {
                // 1.将路由参数对象中的 id 挂载到 data , 方便后期调用
                id:this.$route.params.id,
                //3.储存轮播图的数据
                banner:[],
                //获取到的商品信息
                goodsinfo:{},
                //设置小球的显示和隐藏
                flag:false,
                //默认商品数量为1个
                selectedCount:1
            }
        },
        created(){
          this.getBanner();
          this.getGoodsInfo();
        },
        methods:{
            //2.获取轮播图的数据. 和缩略图共用一个API
            getBanner() {
                this.$http.get("api/getthumimages/" + this.id).then(result => {
                    if (result.body.status === 0) {
                        //this.banner = result.body.message;
                        //有问题: 封装的图片属性是item.img, 所以要换属性名.要遍历的换
                        // 先循环轮播图数组的每一项，为 item 添加 img 属性，因为 轮播图 组件中，只认识 item.img， 不认识 item.src
                        result.body.message.forEach(item => {
                            item.img = item.src;
                        });
                        this.banner = result.body.message;
                        //分析: 为什么这个轮播图这么丑?
                        //1.首页中的轮播图都是使用的100%的宽度
                        //2.而商品详情中的轮播图的宽度需要自适应
                        //解决方案: 使用class绑定样式  swiper.vue   :class="{'full':isFull}"
                        }
                });
            },
            //6.获取商品信息
            getGoodsInfo() {
                // 获取商品的信息
                this.$http.get("api/goods/getinfo/" + this.id).then(result => {
                    if (result.body.status === 0) {
                        this.goodsinfo = result.body.message[0];
                    }
                });
            },
            //7.点击使用编程式导航跳转到图文介绍
            goDesc(id){
                this.$router.push({name:'goodsDesc',parmas:{id}})
            },
            //8.点击使用编程式导航跳转到评论页面
            goComment(id){
                this.$router.push({name:'goodsComment',parmas:{id}})

            },
            //9.设置小球.添加到购物车的样式
            addShopcar(){
                this.flag = !this.flag;
                //12.点击添加到购物车
                //样本:{ id:商品的id,count:购买的数量, price:商品单价. selected:商品的状态}
                let goodsList = {
                    id:this.id,
                    count:this.selectedCount,
                    price:this.goodsinfo.sell_price ,
                    selected:true};//拼接好之后将商品信息加入到store里

                //调用 store中的mutations来讲商品加入购物车
                this.$store.commit('addToCar', goodsList);
            },
            //10.设置小球的动画
            beforeEnter(el){
                el.style.transform = 'translate(0,0)'
            },
            enter(el,done){
                el.offsetWidth;
                /*
                * 分析小球优化思路:
                * 1.问题: 每个屏幕的分辨率不同
                * 2.解决思路: 动态计算这个坐标值,先得到微标和小球的横纵坐标, 求差
                *           如何获取徽标和小球的位置？？？
                * 3.解决方案:
                *    domObject.getBoundingClientRect()
                * */
                //获取小球的位置
                const ball = document.querySelector('.ball').getBoundingClientRect();
                //获取微标的位置  注意: 拿到当前页面的任何dom元素和所在组件没有任何关系
                const badge = document.querySelector('.mui-badge').getBoundingClientRect();
                //求差
                const x = badge.left - ball.left;
                const y = badge.top - ball.top;

                el.style.transform = `translate(${x}px, ${y}px)`;//反引号!
                //el.style.transform = 'translate(85px,254px)';
                el.style.transition = 'all 1s cubic-bezier(.4,-0.3,1,.68)';
                done();

            },
            afterEnter(el){
                this.flag = !this.flag
            },
            //11.设置商品的数量
            getSelectedCount(count) {
                // 当子组件把 选中的数量传递给父组件的时候，把选中的值保存到 data 上
                this.selectedCount = count;
                console.log("父组件拿到的数量值为： " + this.selectedCount);
            }


        }
    }
</script>

<style scoped lang="scss">
    .goodsinfo-container{
        background-color: #eeeeee;
        overflow: hidden;
        .now_price {
            color: red;
            font-size: 16px;
            font-weight: bold;
        }
        .mui-card-footer{
            display: block;
            button{
                margin:10px 0;
            }
        }
        .ball {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: red;
            position: absolute;
            z-index: 99;
            top: 445px;
            left: 146px;

        }
    }

</style>