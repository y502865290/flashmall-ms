import {createRouter,createWebHistory} from "vue-router";
export default createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            component:()=>import('../components/common/Login'),
            meta:{
                title:"flashmall后台登录系统"
            }
        },
        {
            path:'/register',
            component:()=>import('../components/common/Register'),
            meta:{
                title:"flashmall后台注册系统"
            }
        },
        {
            path:'/main',
            component:()=>import('../components/common/Main'),
            meta:{
                title:"flashmall后台管理系统"
            },
            children:[
                {
                    path:'product/category',
                    meta:{
                        title:'商品类别管理'
                    },
                    component:()=>import('../components/product/Category')
                },
                {
                    path:'product/brand',
                    component:()=>import('../components/product/Brand')
                },
                {
                    path:'/admin/user',
                    name:'admin_user',
                    meta:{
                        title:'用户管理'
                    },
                    component:()=>import('../components/admin/User')
                },
                {
                    path:'admin/authority',
                    name:'authority',
                    meta:{
                        title:'权限管理'
                    },
                    component:()=>import('../components/admin/Authority')
                },
                {
                    path:'welcome',
                    meta:{
                        title:'欢迎使用'
                    },
                    component:()=>import('../components/common/Welcome')
                }
            ]
        }
    ]
})
