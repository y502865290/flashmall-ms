<template>
  <el-form class="loginForm" :model="user" :rules="rules" ref="login" @keydown.enter="login">
    <h3 class="login-title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" placeholder="请输入用户名" v-model="user.username"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" placeholder="请输入密码" v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item prop="checkCode">
      <img :src="imgURL"><a href="#" @click="getCode">看不清</a>
      <el-input type="text" placeholder="请输入验证码" v-model="user.checkCode"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
    </el-form-item>
    <el-form-item>
      <el-button style="width: 100%" @click="register">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Login",
  data(){
    let checkCodeValidate = (rule,value,callback)=>{
      let url = "http://localhost:9100/sys_user/checkCode";
      this.$http.post(url,this.user.checkCode).then(res=>{
        if(!res.data.data){
          callback(new Error("验证码输入错误！"));
        }else{
          callback();
        }
      });
    };

    return {
      user:{},
      rules:{
        username:[
          {required:true,message:"请输入用户名",trigger:['blur','change']},
          {min:2,max:10,message:'用户名长度必须在2-10个字符之间',trigger:['blur','change']}
        ],
        password:[
          {required:true,message:"请输入密码",trigger:['blur','change']},
          {min:2,max:10,message:'密码长度必须在2-10个字符之间',trigger:['blur','change']}
        ],
        checkCode:[
          {required:true,message:'请输入验证码',trigger:['blur','change']},
          {pattern:/^\w{4}$/,message:"验证码长度必须为4位"},
          {validator:checkCodeValidate,trigger:'blur'}
        ]
      },
      imgURL:'http://localhost:9100/sys_user/getCode'
    }
  },
  methods:{
    login(){
      this.$refs["login"].validate(valid=>{
        if(valid){
          //登录、
          let url = "http://localhost:9100/sys_user/login";
          this.$http.post(url,this.user).then(res=>{
            if(res.data.code == 2000){
              alert(res.data.message)
              this.$store.commit('setUser',this.user.username);
              this.$router.push({path:"/main"});
            }else{
              alert(res.data.message);
              this.reset();
              this.getCode();
            }
          })
        }
      });
    },
    register(){
      this.$router.push({path:"/register"});
    },
    reset(){
      if(!this.$refs["login"]) return;

      this.$refs["login"].resetFields();
    },
    getCode(){
      this.imgURL = this.imgURL + "?" +Math.random();
      this.user.checkCode = "";
    },
    
  },
  created(){
  }
}
</script>

<style scoped>
.loginForm{
  width:350px;
  margin:100px auto 10px;
  border:1px solid #eaeaea;
  padding:35px 35px 15px 35px;
  border-radius: 15px;
  box-shadow:0 0 25px #cac6c6;
}
.login-title{
  text-align: center;
  color:#505458;
  margin:0px auto 40px;
}
</style>
 
