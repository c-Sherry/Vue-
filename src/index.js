//入口文件

import Vue from 'vue'
import app from './App.vue'
//1.导入路由的包
import VueRouter from 'vue-router'
//2.安装路由模块
Vue.use(VueRouter);
//3.导入自己的router.js的路由模块
import router from './router.js'


//4.导入vue-resource模块
import VueResource from 'vue-resource'
Vue.use(VueResource);

//5.全局配置请求的根路径
Vue.http.options.root = 'http://www.liulongbin.top:3005';
// 7.全局设置 post 时候表单数据格式组织形式   application/x-www-form-urlencoded
Vue.http.options.emulateJSON = true;

//6.定义全局过滤器
//安装moment.js库  cnpm i moment -S
//导入时间插件
import moment from 'moment'
//  ① 需要格式化的时间, ②时间的格式
Vue.filter('dateFormat', function (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") {
    return moment(dataStr).format(pattern)
})


//导入mui样式
import './lib/mui/css/mui.min.css'
import './lib/mui/css/icons-extra.css'

//按需导入mint-ui组件
/*import { Header } from 'mint-ui';
Vue.component(Header.name, Header);

import { Swipe, SwipeItem , Button} from 'mint-ui';
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Button.name, Button);
//导入懒加载
import { Lazyload } from 'mint-ui';
Vue.use(Lazyload);*/
//因为懒加载原因不能按需导入
import MintUI from 'mint-ui'
Vue.use(MintUI);
import 'mint-ui/lib/style.css'



// 安装 图片预览插件
import VuePreview from 'vue-preview'
Vue.use(VuePreview);
import './app.scss'

//①导入vuex
import Vuex from 'vuex'
//②.安装
Vue.use(Vuex);
// ③. new Vuex.Store() 实例，得到一个 数据仓储对象

//每次加载页面. 先从本地存储获取数据
let car = JSON.parse(localStorage.getItem('car') || '[]');

const store = new Vuex.Store({
    state:{// 调用  this.$store.state.***
        //用数组储存购物车的所有的商品的数据
        //每一条商品数据都是对象, 储存为这种样子
        // { id:商品的id,count:购买的数量, price:商品单价. selected:商品的状态}
        //car:[]

        car:car // 优化: 设置本地获取得数据
    },
    mutations:{// 调用  this.$store.commit('方法的名称', '按需传递唯一的参数')
        //点击加入购物车, 把信息保存到store中的car上
        addToCar(state, goodsList){
            //分析  1.若之前有对应的商品, 那只需要更新数据
            //      2. 若没有对应的, 直接把商品push到car中

            //设置节流阀, 若找到了, 走some循环, 并让flag为true
            let flag = false;

            state.car.some( item => { // 通过some去找
                if(item.id === goodsList.id){
                    //如果car里的id 等于传过来的商品数据的id , 更新数量
                    item.count += parseInt(goodsList.count);
                    flag = true;
                    return true;
                }
            });
            //若没有找到 ,则push到car里
            if(!flag){
                state.car.push(goodsList);
            };// 设置完之后去goodsInfo调用

            //当更新car在之后把car数组存到localStorage里
            localStorage.setItem('car',JSON.stringify(state.car))

        },

        //修改购物车中数量的值
        updateGoods(state, goodsList){
            state.car.some( item => {
                if(item.id === goodsList.id){
                    item.count = parseInt( goodsList.count);
                    return true;
                }

            });
            //把修改数量后的商品保存到本地存储中
            localStorage.setItem('car',JSON.stringify(state.car))
        },

        //点击删除商品---.根据id删
        removeGoodsList(state, id){
            state.car.some( (item , i) => {
                if(item.id == id){
                    state.car.splice(i ,1);
                    return true;
                }
            })
            //把删除完毕后的商品数据保存到本地存储中
            localStorage.setItem('car',JSON.stringify(state.car))

        },

        //更新商品的状态
        updateGoodsSelected(state, info){
            state.car.some( item => {
                if(item.id == info.id){
                    item.selected = info.selected;
                    return true;
                }
            })
            //把状态更新后的商品保存到本地存储中
            localStorage.setItem('car',JSON.stringify(state.car))
        }

    },
    getters:{//  调用  this.$store.getters.***  相当于计算属性和过滤器
        //设置微标的个数
        getAllCount(state){
            let c = 0;
            //遍历car里面所有的count数量
            state.car.forEach( item => {
                c += item.count;
            });
            return c;
        },
        //获取商品数量的方法
        getGoodsCount(state){
            let num = {};
            state.car.forEach( item => {
                num[item.id] = item.count;
            });
            return num;

        },

        //设置商品数据的状态
        getGoodsSelected(state){
            let sel = {};
            state.car.forEach( item => {
                sel[item.id] = item.selected;
            });
            return sel;
        },

        //计算总价
        getGoodsTotal(state){
            let num = {
                count:0,//勾选的数量
                amount:0//勾选的总价
            };
            state.car.forEach( item => {
                //如果商品为选中的状态
                if(item.selected){
                    num.count += item.count;//计算总数量
                    num.amount += item.price * item.count;//计算总价
                }
            })
            return num;
        }

    }
});
//④.将vuex挂载到vm实例上




let vm = new Vue({
    el:'#app',
    render: c => c(app),
    //4.挂载路由对象到自己的vm实例上
    router,
    //③.将vuex挂载到vm实例上
    store
});
//解决路由跳转后scrollTop的问题
/*
router.afterEach(function (to) {
    window.scrollTo(0, 0)
})*/
