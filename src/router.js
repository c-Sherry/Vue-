//1.导入路由模块
import VueRouter from 'vue-router'

//导入对应的路由组件
import Home from './components/tabbar/home.vue'
import Member from './components/tabbar/member.vue'
import Shopcar from './components/tabbar/shopcar.vue'
import Search from './components/tabbar/search.vue'
import NewsList from './components/news/newsList.vue'
import newsInfo from './components/news/newsInfo.vue'
import PhotoList from './components/photos/photoList.vue'
import PhotoInfo from './components/photos/photoInfo.vue'
import GoodsList from './components/goods/goodsList.vue'
import GoodsInfo from './components/goods/goodsInfo.vue'
import GoodsDesc from './components/goods/goodsDesc.vue'
import GoodsComment from './components/goods/goodsComment.vue'

//3.创建路由对象
let router = new VueRouter({
    //设置路由切换高亮
    linkActiveClass:'mui-active',
    //配置路由规则
    routes:[
        {path:'/',redirect:'/home'},
        {path:'/home', component: Home},
        {path:'/member', component: Member},
        {path:'/shopcar', component: Shopcar},
        {path:'/search', component: Search},
        {path:'/home/newsList', component: NewsList},
        {path:'/home/newsInfo/:id', component: newsInfo},
        {path:'/home/photoList',component:PhotoList},
        {path:'/home/photoInfo/:id',component:PhotoInfo},
        {path:'/home/goodsList',component:GoodsList},
        {path:'/home/goodsInfo/:id',component:GoodsInfo,name:'goodsInfo'},
        {path:'/home/goodsDesc/:id',component:GoodsDesc,name:'goodsDesc'},
        {path:'/home/goodsComment/:id',component:GoodsComment,name:'goodsComment'}
    ],
    //解决vue单页路由跳转后scrollTop的问题
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
});

////抽离的时候 把路由对象暴露出去
export default router
