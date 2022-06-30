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
                    component:()=>import('../components/product/Category')
                },
                {
                    path:'product/brand',
                    component:()=>import('../components/product/Brand')
                },
                {
                    path:'/admin/user',
                    component:()=>import('../components/admin/User')
                }
            ]
        }
    ]
})