import {createRouter,createWebHistory} from "vue-router";
export default createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            component:()=>import('../components/common/Login')
        },
        {
            path:'/main',
            component:()=>import('../components/common/main')
        }
    ]
})