<template>
  <el-aside width="200px" style="height:100%">
    <el-menu
        default-active="1"
        class="sidebar-el-menu"
        @open="handleOpen"
        @close="handleClose"
        background-color="#242f42"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><User /></el-icon>
            用户管理
          </template>
          <el-menu-item index="1-1" @click="goUser">
            <el-icon><document /></el-icon>
            管理员管理
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><User /></el-icon>
            商品管理
          </template>
          <el-menu-item index="2-1" @click="toProductCatelog()">
            商品类别管理
          </el-menu-item>
        </el-sub-menu>

    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "Aside",
  data(){
    return{

    }
  },
  created() {
    
  },
  methods:{
    toProductCatelog(){
      this.$router.push({path:'/main/product/category'})
    },
    goUser(){
      this.$router.push({path:'/admin/user'})
    }
  }
}
</script>

<style scoped>

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}

</style>


