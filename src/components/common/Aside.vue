<template>
  <el-aside width="200px"
            style="height:100%">
    <el-menu default-active="1"
             class="sidebar-el-menu"
             background-color="#242f42"
             text-color="#fff"
             active-text-color="#ffd04b">
      <el-sub-menu index="1"
                   v-if="authority.userManage">
        <template #title>
          <el-icon>
            <User />
          </el-icon>
          用户管理
        </template>
        <el-menu-item index="1-1"
                      @click="goUser()"
                      v-if="authority.admainManage">
          <el-icon>
            <document />
          </el-icon>
          管理员管理
        </el-menu-item>
        <el-menu-item index="1-2"
                      v-if="authority.authorityManage"
                      @click="toAuthority()">
          <el-icon>
            <document />
          </el-icon>
          权限管理
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="2"
                   v-if="authority.productManage">
        <template #title>
          <el-icon>
            <User />
          </el-icon>
          商品管理
        </template>
        <el-menu-item index="2-1"
                      v-if="authority.catoryManage"
                      @click="toProductCatelog()">
          商品类别管理
        </el-menu-item>
      </el-sub-menu>

    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "Aside",
  data () {
    return {
      authority: {
        userManage: false,
        admainManage: false,
        authorityManage: false,
        productManage: false,
        catoryManage: false
      }
    }
  },
  created () {
    this.initAuthority()
  },
  methods: {
    initAuthority () {
      this.authority.userManage = this.$store.state.authority[this.$power.map.get("用户管理").property]
      this.authority.admainManage = this.$store.state.authority[this.$power.map.get("用户管理-管理员管理").property]
      this.authority.authorityManage = this.$store.state.authority[this.$power.map.get("用户管理-权限管理").property]
      this.authority.productManage = this.$store.state.authority[this.$power.map.get("商品管理").property]
      this.authority.catoryManage = this.$store.state.authority[this.$power.map.get("商品管理-类别管理").property]
      Object.freeze(this.authority)
    },
    toProductCatelog () {
      this.$router.push({ path: '/main/product/category' })
    },
    goUser () {
      this.$router.push({ path: '/admin/user' })
    },
    toAuthority () {
      this.$router.push({ path: '/main/admin/authority' })
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


