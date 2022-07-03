<template>
  <span style="text-align:center;font-size: 35px;">
    <h1>Welcome come </h1>
    <h1 class="userName">{{this.$store.state.user.username}}</h1>
  </span>

</template>

<script>
export default {
  data () {
    return {
    }
  },
}
</script>

<style scoped>
.userName {
  color: rgb(6, 38, 247);
  font-size: 35px;
}
</style>
 
