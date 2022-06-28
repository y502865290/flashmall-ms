<template>
  <el-header class="header" >
  <el-menu
    class="el-menu"
    mode="horizontal"
    background-color="#242f42"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <div class="logo">flashmall后台管理系统</div>
      <div class="user-avator">
        <img class="img" src="../../assets/img/img.jpg" />
      </div>
      <el-dropdown >
      <span class="el-dropdown-link">
        {{account}}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  </el-menu>

  </el-header>

</template>



<script>

export default {
  created() {

  },
  data() {
    return {
      account:"admin",
      imgUrl:"../../assets/img/img.jpg"
    };
  },
  methods: {

  }
}
</script>

<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  padding: 0;
}
.el-menu{
  height: 70px;
  width: 100%;
  margin:0;
}
.logo {
  margin-left: 20px;
  width: 250px;
  line-height: 70px;
}

.user-avator {
  margin-left: auto;
  margin-right: 20px;
  display: flex;
}
.img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  align-self: center;
  margin-left: auto;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  align-self: center;
  margin-right:30px ;
}

</style>