<template>
<div class="my_div">
  <el-container direction="vertical" class="my_container" >
    <Header></Header>
    <el-container class="my_container2" >
      <Aside></Aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>

</template>
<script>
import Header from './Header'
import Aside from "./Aside";
export default {
  created() {
  },
  data(){
    return{
      
    }
  },
  components: {
    Header,
    Aside
  }
};
</script>

<style scoped >

.my_container{
  height: 100%;
  width: 100%;
}

.my_div{
  height: 100vh;
  width: 100vm;
}

.my_container2{
  height: 100%;
  width: 100%
}
</style>
