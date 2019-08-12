<template>
    <div class="shopcar-container">
        <!--商品列表区域-->
        <div class="mui-card goods-list" v-for="(item,i ) in goodsList" :key="item.id">
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <!-- 绑定状态  把改变后的状态传过去 -->
                    <mt-switch v-model="$store.getters.getGoodsSelected[item.id]"
                    @change="selected(item.id, $store.getters.getGoodsSelected[item.id])"></mt-switch>
                    <img :src="item.thumb_path" alt="">
                    <div class="info">
                        <h1>{{  item.title }}</h1>
                        <p>
                            <span class="price">¥{{ item.sell_price }}</span>
                            <!--像子组件传值 数量和id-->
                            <shop-num
                                    :initCount="$store.getters.getGoodsCount[item.id]"
                                    :goodsId="item.id">
                            </shop-num>
                            <!--<a href="#">删除{{ $store.getters.getGoodsCount[item.id] }}</a>-->
                            <a href="#" @click.prevent="remove(item.id,i)">删除</a>
                            <!--要删掉页面上的数据和store状态管理的数据-->

                        </p>
                        <!--
                        问题: 如何从store中的car获取商品的数量
                        //1.创建一个空对象, 遍历商品的数据, 商品的id作为属性名, 数量作为属性值
                        //2.得到的对象  { 88:2 , 89 : 4 , 90 : 1 }
                        //3.去getters顶一个获取数量对象的方法
                        //4. 调用  {{ $store.getters.getGoodsCount[item.id] }}
                        -->

                    </div>
                </div>
            </div>
        </div>

        <!--商品结算区域-->
        <div class="mui-card">
            <div class="mui-card-content">
                <div class="mui-card-content-inner jiesuan">
                    <div class="left">
                        <p>总计（不含运费）</p>
                        <p>已勾选商品 <span class="red">
                            {{$store.getters.getGoodsTotal.count }}</span> 件，
                            总价 <span class="red">
                                ￥{{$store.getters.getGoodsTotal.amount }}
                            </span>
                        </p>
                    </div>
                    <mt-button type="danger">去结算</mt-button>
                </div>
            </div>
        </div>

        <!--测试-->
        <!--<p>{{  $store.getters.getGoodsSelected }}</p>-->
    </div>
</template>

<script>
    //1.导入number组件
    import shopNum from '../subcomponents/shopcar_number.vue'
    export default {
        name: "shopcar",
        components:{
            shopNum,
        },
        data(){
            return {

                goodsList:[]//购物车所有商品的数据
            }
        },
        created(){
            this.getGoodsList()
        },
        methods:{
            // 2.获取购物车商品列表
            getGoodsList() {
                // 3. 获取到 store 中所有的商品的Id，然后拼接出一个 用逗号分隔的 字符串
                let idArr = [];
                this.$store.state.car.forEach(item => idArr.push(item.id));
                // 如果 购物车中没有商品，则直接返回，不需要请求数据接口，否则会报错
                if (idArr.length <= 0) return;
                // 获取购物车商品列表
                this.$http
                    .get("api/goods/getshopcarlist/" + idArr.join(","))
                    .then(result => {
                        if (result.body.status === 0) {
                            this.goodsList = result.body.message;
                        }
                    });
            },
            //3.点击删除商品数据 分别从store和goodsList里删除
            remove(id, index){
                this.goodsList.splice(index, 1);
                //调用store中删除数据的方法
                this.$store.commit('removeGoodsList',id)
            },
            //4.每当点击开关, 把最新的状态同步到store中--->传id和状态
            selected(id, status){
                //console.log(id, status)
                //调用store里面的数据状态方法
                this.$store.commit('updateGoodsSelected',{id : id , selected: status});
            }
        },
    }
</script>

<style scoped lang="scss">
    .shopcar-container {
        background-color: #eee;
        overflow: hidden;
        .goods-list {
            .mui-card-content-inner {
                display: flex;
                /*纵向居中*/
                align-items: center;
            }
            img {
                width: 60px;
            }
            h1 {
                font-size: 13px;
            }
            .info {
                /*display: flex;
                flex-direction: column;
                justify-content: space-between;*/
                .price {
                    color: red;
                    font-weight: bold;
                }
            }
        }
        .jiesuan {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .red {
                color: red;
                font-weight: bold;
                font-size: 16px;
            }
        }
    }

</style>