<template>
    <el-form class="registerForm" :model="user" :rules="rules" ref="register" @keydown.enter="login">
    <h3 class="register-title">系统人员注册</h3>
    <el-form-item prop="username">
      <el-input type="text" placeholder="请输入用户名" v-model="user.username"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" placeholder="请输入密码" v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item prop="passwordChecked">
      <el-input type="password" placeholder="请确认密码" v-model="user.passwordChecked"></el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input type="text" placeholder="请输入电话" v-model="user.phone"></el-input>
    </el-form-item>
    <el-form-item prop="checkCode">
      <img :src="imgURL"><a href="#" @click="getCode">看不清</a>
      <el-input type="text" placeholder="请输入验证码" v-model="user.checkCode"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 100%" @click="register">注册</el-button>
    </el-form-item>
    <el-form-item>
      <el-button style="width: 100%" @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
    data(){
        let checkCodeValidate = (rule,value,callback)=>{
            let url = this.$url.SysUserControllerBaseUrl + "/checkCode";
            this.$http.post(url,this.user.checkCode).then(res=>{
                if(!res.data.data){
                    callback(new Error("验证码输入错误！"));
                }else{
                    callback();
                }
            });
        }
        let checkPassValidate = (rule,value,callback)=>{
            let pass = this.user.password;
            let passCheck = this.user.passwordChecked;
            if(pass!=passCheck){
                callback(new Error("两次密码不同"));
            }else{
                callback();
            }
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
                {min:2,max:10,message:'密码长度必须在2-10个字符之间',trigger:['blur','change']},
            ],
            passwordChecked:[
                {required:true,message:"请确认密码",trigger:['blur','change']},
                {min:2,max:10,message:'密码长度必须在2-10个字符之间',trigger:['blur','change']},
                {validator:checkPassValidate,trigger:['blur','change']}

            ],
            phone:[
                {required:true,message:"请输入联系方式",trigger:['blur','change']},
                {pattern:/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message:"请输入正确的联系方式格式"},
            ],
            checkCode:[
                {required:true,message:'请输入验证码',trigger:['blur','change']},
                {pattern:/^\w{4}$/,message:"验证码长度必须为4位"},
                {validator:checkCodeValidate,trigger:'blur'}
            ]
            },
            imgURL:this.$url.SysUserControllerBaseUrl + '/getCode'
        }
    },
    methods:{
        back(){
            this.$router.push("/");
        }
    }
}
</script>

<style scoped>
.registerForm{
  width:350px;
  margin:100px auto 10px;
  border:1px solid #eaeaea;
  padding:35px 35px 15px 35px;
  border-radius: 15px;
  box-shadow:0 0 25px #cac6c6;
}
.register-title{
  text-align: center;
  color:#505458;
  margin:0px auto 40px;
}
</style>