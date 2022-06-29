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
            name:'register',
            component:()=>import('../components/common/Register'),
            meta:{
                title:"flashmall后台注册系统"
            }
        },
        {
            path:'/main',
            name:'main',
            component:()=>import('../components/common/Main'),
            meta:{
                title:"flashmall后台管理系统"
            },
            children:[
                {
                    path:'/admin/user',
                    name:'admin_user',
                    component:()=>import('../components/admin/User')

                }
            ]
        },
    ]
})