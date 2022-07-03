import { ElMessage } from "element-plus"
import Router from '../router/index'
import vuex from '../store/index'
export default{
    map:{},
    init(){
        this.map = new Map()
        this.map.set("用户管理",{property:"sysUser",note:""})
        this.map.set("用户管理-管理员管理",{property:"sysUserAdmain",note:""})
        this.map.set("用户管理-管理员管理-添加",{property:"sysUserAdmainAdd",note:""})
        this.map.set("用户管理-管理员管理-删除",{property:"sysUserAdmainDelete",note:""})
        this.map.set("用户管理-管理员管理-修改",{property:"sysUserAdmainUpdate",note:""})
        this.map.set("用户管理-管理员管理-转换状态",{property:"sysUserAdmainChangeStatus",note:""})
        this.map.set("用户管理-管理员管理-重置密码",{property:"sysUserAdmainPasswordReset",note:""})
        this.map.set("用户管理-管理员管理-更改用户类型",{property:"sysUserAdmainChangeRole",note:""})

        this.map.set("用户管理-权限管理",{property:"sysUserAuthority",note:""})
        this.map.set("用户管理-权限管理-所有权限",{property:"sysUserAuthorityAll",note:"一旦赋予该权限代表，该角色拥有权限管理的所有权限，前提是要拥有该权限的父权限"})
        this.map.set("用户管理-权限管理-角色添加",{property:"sysUserAuthorityRoleAdd",note:""})
        this.map.set("用户管理-权限管理-角色删除",{property:"sysUserAuthorityRoleDelete",note:""})
        this.map.set("用户管理-权限管理-权限类型管理",{property:"sysUserAuthorityMenuManage",note:"该权限是权限类型的添加、修改、删除的父权限，如果要给予一个用户添加、修改、删除的权限，那么该父权限也必须给予"})
        this.map.set("用户管理-权限管理-权限类型添加",{property:"sysUserAuthorityMenuAdd",note:""})
        this.map.set("用户管理-权限管理-权限类型修改",{property:"sysUserAuthorityMenuUpdate",note:""})
        this.map.set("用户管理-权限管理-权限类型删除",{property:"sysUserAuthorityMenuDelete",note:""})
        this.map.set("用户管理-权限管理-权限赋予",{property:"sysUserAuthorityGive",note:"允许该角色在权限管理修改除了该账号的角色外的其他角色的权限"})

        this.map.set("商品管理",{property:"product",note:""})
        this.map.set("商品管理-类别管理",{property:"productCategory",note:""})
        this.map.set("商品管理-类别管理-添加",{property:"productCategoryAdd",note:""})
        this.map.set("商品管理-类别管理-删除",{property:"productCategoryDelete",note:""})
        this.map.set("商品管理-类别管理-修改",{property:"productCategoryUpdate",note:""})

        this.map.set("商品管理-品牌管理",{property:"productBrand",note:""})
        this.map.set("商品管理-品牌管理-添加",{property:"productBrandAdd",note:""})
        this.map.set("商品管理-品牌管理-修改",{property:"productBrandUpdate",note:""})
        this.map.set("商品管理-品牌管理-删除",{property:"productBrandDelete",note:""})

        
    },
    totalCheckAuthority(authority){
        if(authority.total == undefined || authority.total == false ){
            ElMessage({
                message:"您无权访问该页面，已经将您注销登录",
                type:"error"
            })
            this.logout()
        }
    },
    logout(){
        sessionStorage.removeItem("token")
        vuex.commit("logout")
        Router.push('/')
    }
}