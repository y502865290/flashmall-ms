<template>
    <el-button type="default" @click="add">添加用户</el-button>
    <el-table :data="pageInfo.list" stripe  style="width:100%">
        <el-table-column prop="id" label="用户id"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column prop="role" label="用户权限"></el-table-column>
        <el-table-column prop="status" label="用户状态"></el-table-column>
        <el-table-column label="操作" width="350px">
            <template #default="scope">
                <el-button size="small" type="primary" @click="edit(scope)">编辑</el-button>
                <el-button size="small" type="danger" @click="del(scope)" v-if="item(scope)">删除</el-button>
                <el-button size="small" type="warning" @click="changePassword(scope)">修改密码</el-button>
                <el-button size="small" type="info" @click="resetPassword(scope)">重置密码</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination
        class="pageInfo"
        layout="prev,pager,next,total,jumper,sizes"
        :total="pageInfo.total"
        v-model:current-page="pageInfo.pageNum"
        v-model:page-size="pageInfo.pageSize"
        :page-sizes="[3,5,10,20]"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    >
    </el-pagination>

    <el-dialog v-model="changePasswordDisableDialog" title="修改密码" center width="600px">
        <el-form :model="user" :rules="rules" ref="editUser">
        <h4>当前用户用户名：{{user.username}}</h4>
        <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="passwordChecked">
            <el-input type="password" placeholder="请确认密码" v-model="user.passwordChecked"></el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
            <img :src="imgURL"><a href="#" @click="getCode">看不清</a>
            <el-input type="text" placeholder="请输入验证码" v-model="user.checkCode"></el-input>
        </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="cancelSave">取消</el-button>
            <el-button type="primary" @click="saveData">确定</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="disableDialog" title="编辑用户" center width="600px">
        <el-form :model="user" :rules="rules" ref="editUser" label-width="80px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
            <el-input v-model="user.phone" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="用户权限" >
            <el-input v-model="user.role" placeholder="用户权限"></el-input>
        </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="cancelSave">取消</el-button>
            <el-button type="primary" @click="saveData">保存</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="addDisableDialog" title="添加用户" center width="450px">
        <el-form :model="user" :rules="rules" ref="addUser">
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
            <el-input type="text" placeholder="请输入联系方式" v-model="user.phone"></el-input>
            </el-form-item>
            <el-form-item prop="checkCode">
            <img :src="imgURL"><a href="#" @click="getCode">看不清</a>
            <el-input type="text" placeholder="请输入验证码" v-model="user.checkCode"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="cancelSave">取消</el-button>
            <el-button type="primary" @click="saveData">添加</el-button>
        </template>
    </el-dialog>
    
</template>

<script>
export default {
    data(){
        let checkCodeValidate = (rule,value,callback)=>{
            let url = "http://localhost:9100/sys_user/checkCode";
            this.$http.post(url,value).then(res=>{
                if(!res.data.data){
                    callback(new Error("验证码输入错误"));
                }else{
                    callback();
                }
            });
        };
        let checkUserNameValidate = (rule,value,callback)=>{
            let url = "http://localhost:9100/sys_user/checkUserName";
            this.$http.post(url,value).then(res=>{
                if(res.data.data){
                    callback(new Error("用户名已存在"));
                }else{
                    callback();
                }
            });
        };
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
            pageInfo:{
                pageNum:1,
                pageSize:5,
            },
            user:{},
            disableDialog:false,
            addDisableDialog:false,
            changePasswordDisableDialog:false,
            mes:'',
            rules:{
                username:[
                    {required:true,message:"请输入用户名",trigger:['blur','change']},
                    {min:2,max:10,message:'用户名长度必须在2-10个字符之间',trigger:['blur','change']},
                    {validator:checkUserNameValidate,trigger:'blur'}
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
            imgURL:'http://localhost:9100/sys_user/getCode'
        }
    },
    created(){
        this.showData();
    },
    methods:{
        showData(){
            let params = {
                pageNum:this.pageInfo.pageNum,
                pageSize:this.pageInfo.pageSize
            }
            let url = "http://localhost:9100/sys_user/getPaged";
            this.$http.get(url,{params:params}).then(res=>{
                this.pageInfo = res.data.data;
                console.log(this.pageInfo);
            })
        },
        handleCurrentChange(){
            this.showData();
        },
        handleSizeChange(){
            this.showData();
        },
        item(scope){
            if(scope.row.username == "admin"){
                return false;
            }
            return true;
        },
        resetPassword(scope){
            this.$confirm('是否重置该用户密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$confirm('此操作属于风险操作，请再次确认是否重置该用户密码', '危险', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(()=>{
                    let url = `http://localhost:9100/sys_user/resetPassword`;
                    this.$http.post(url,scope.row.username).then(res=>{
                        if(res.data.data){
                            this.$message({
                            type: 'success',
                            message: '密码重置成功(默认密码为用户名)'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消'
                    });
                });
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消'
                });
            });
        },
        changePassword(scope){
            this.changePasswordDisableDialog = true;
            this.index = scope.$index;
            this.user={};
            this.user.username = scope.row.username;
        },
        del(scope){
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = `http://localhost:9100/sys_user/${scope.row.id}`;
                this.$http.delete(url).then(res=>{
                if(res.data.data){
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                }
                this.depts.splice(scope.$index,1);
                })
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                });
            });
        },
        edit(scope){
            this.disableDialog = true;
            this.index = scope.$index;
            this.user={};
            this.user = {...scope.row};
        },
        saveData(){
            if(this.disableDialog){
                this.$confirm("数据即将保存，是否确认？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let url = "http://localhost:9100/sys_user/edit";
                    this.$http.put(url,this.user).then(res=>{
                        if(res.data.data){
                            this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                        this.disableDialog = false;
                        this.user = {};
                        this.showData();
                        }
                    })
                })
            }
            if(this.addDisableDialog){
                this.$confirm("数据即将保存并添加，是否确认？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let url = "http://localhost:9100/sys_user/register";
                    this.$http.put(url,this.user).then(res=>{
                        if(res.data.data){
                            this.$message({
                            type: 'success',
                            message: '添加成功!'
                            });
                            this.addDisableDialog = false;
                            this.user = {};
                            this.pageInfo.pageNum = 1;
                            this.showData();
                        }
                    })
                })
            }
            if(this.changePasswordDisableDialog){
                this.$confirm("密码即将修改并确认，是否确认？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let url = "sys_user/changePassword";
                    this.$http.put(url,this.user).then(res=>{
                        if(res.data.data){
                            this.$message({
                            type: 'success',
                            message: '密码修改成功!'
                            });
                            this.changePasswordDisableDialog = false;
                            this.user = {};
                            this.pageInfo.pageNum = 1;
                            this.showData();
                        }
                    })
                })
            }
        },
        cancelSave(){
            if(this.disableDialog){
                this.mes = "已取消保存"
            }
            if(this.addDisableDialog){
                this.mes = "已取消添加"
            }
            if(this.changePasswordDisableDialog){
                this.mes = "已取消修改"
            }
            this.$confirm("数据尚未保存，是否取消？","提示",{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.disableDialog){
                    this.disableDialog = false;
                }
                if(this.addDisableDialog){
                    this.addDisableDialog = false;
                }
                if(this.changePasswordDisableDialog){
                    this.changePasswordDisableDialog = false;
                }
                this.user = {}
                this.$message({
                type: 'info',
                message: this.mes
                });
            })
        },
        add(){
            this.addDisableDialog = true;
            this.user={};
        }
    }
}
</script>

<style scope>
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