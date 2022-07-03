<template>
<h1>用户管理</h1>
  <el-button type="default"
             v-if="authority.userAdd"
             @click="add">添加用户</el-button>
  <el-divider></el-divider>
  <el-table :data="pageInfo.list"
            stripe
            style="width:100%">
    <el-table-column prop="id"
                     label="用户id"></el-table-column>
    <el-table-column prop="username"
                     label="用户名"></el-table-column>
    <el-table-column prop="phone"
                     label="联系方式"></el-table-column>
    <el-table-column prop="roleName"
                     label="用户权限"></el-table-column>
    <el-table-column prop="status"
                     label="用户状态">
      <template #default="scope">
        <el-tag class="ml-2"
                v-if="scope.row.status == 1"
                effect="dark"
                type="primary">正常</el-tag>
        <el-tag class="ml-2"
                effect="dark"
                v-if="scope.row.status == 0"
                type="error">关停</el-tag>
      </template>

    </el-table-column>
    <el-table-column label="操作"
                     width="350px">
      <template #default="scope">
        <el-button size="small"
                   type="primary"
                   v-if="authority.userUpdate"
                   @click="edit(scope)">编辑</el-button>

        <el-button size="small"
                   type="warning"
                   v-if="authority.userPasswordReset"
                   @click="resetPassword(scope)">重置密码</el-button>
        <el-button size="small"
                   type="info"
                   v-if="authority.UserStatusChange"
                   @click="changeStatus(scope)">转换状态</el-button>
        <el-button size="small"
                   type="danger"
                   @click="del(scope)"
                   v-if="scope.row.roleName != '超级管理员' && authority.userDelete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination class="pageInfo"
                 layout="prev,pager,next,total,jumper,sizes"
                 :total="pageInfo.total"
                 v-model:current-page="pageInfo.pageNum"
                 v-model:page-size="pageInfo.pageSize"
                 :page-sizes="[3,5,10,20]"
                 background
                 @current-change="handleCurrentChange"
                 @size-change="handleSizeChange">
  </el-pagination>

  <el-dialog v-model="changePasswordDisableDialog"
             title="修改密码"
             center
             width="600px">
    <el-form :model="user"
             :rules="rules"
             ref="editUser">
      <h4>当前用户用户名：{{user.username}}</h4>
      <el-form-item prop="password">
        <el-input type="password"
                  placeholder="请输入密码"
                  v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item prop="passwordChecked">
        <el-input type="password"
                  placeholder="请确认密码"
                  v-model="user.passwordChecked"></el-input>
      </el-form-item>
      <el-form-item prop="checkCode">
        <img :src="imgURL"><a href="#"
           @click="getCode">看不清</a>
        <el-input type="text"
                  placeholder="请输入验证码"
                  v-model="user.checkCode"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelSave">取消</el-button>
      <el-button type="primary"
                 @click="saveData">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="disableDialog"
             title="编辑用户"
             center
             width="600px">
    <el-form :model="user"
             :rules="rules"
             ref="editUser"
             label-width="80px">
      <el-form-item label="用户名"
                    prop="username">
        <el-input v-model="user.username"
                  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="联系方式"
                    prop="phone">
        <el-input v-model="user.phone"
                  placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="user.role"
                   :disabled="!authority.changeUserRole"
                   placeholder="选择用户的类型">
          <el-option v-for="item in roles"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id" />
        </el-select>
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="cancelSave">取消</el-button>
      <el-button type="primary"
                 @click="saveData">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="addDisableDialog"
             title="添加用户"
             center
             width="450px">
    <el-form :model="user"
             :rules="rules"
             ref="addUser">
      <el-form-item prop="username">
        <el-input type="text"
                  placeholder="请输入用户名"
                  v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  placeholder="请输入密码"
                  v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item prop="passwordChecked">
        <el-input type="password"
                  placeholder="请确认密码"
                  v-model="user.passwordChecked"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input type="text"
                  placeholder="请输入联系方式"
                  v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item prop="checkCode">
        <img :src="imgURL"><a href="#"
           @click="getCode">看不清</a>
        <el-input type="text"
                  placeholder="请输入验证码"
                  v-model="user.checkCode"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelSave">取消</el-button>
      <el-button type="primary"
                 @click="saveData">添加</el-button>
    </template>
  </el-dialog>


</template>

<script>
export default {
  data () {
    let checkCodeValidate = (rule, value, callback) => {
      let url = this.$url.SysUserControllerBaseUrl + "/checkCode";
      this.$http.post(url, value).then(res => {
        if (!res.data.data) {
          callback(new Error("验证码输入错误"));
        } else {
          callback();
        }
      });
    };
    let checkUserNameValidate = (rule, value, callback) => {
      let url =  this.$url.SysUserControllerBaseUrl + "/checkUserName";
      this.$http.post(url, value).then(res => {
        if (res.data.data) {
          callback(new Error("用户名已存在"));
        } else {
          callback();
        }
      });
    };
    let checkPassValidate = (rule, value, callback) => {
      let pass = this.user.password;
      let passCheck = this.user.passwordChecked;
      if (pass != passCheck) {
        callback(new Error("两次密码不同"));
      } else {
        callback();
      }
    };
    return {
      authority: {
        changeUserRole: false,
        userAdd: false,
        total: false,
        userUpdate: false,
        userDelete: false,
        userPasswordReset: false,
        UserStatusChange: false
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
      },
      user: {},
      roles: [],
      disableDialog: false,
      addDisableDialog: false,
      changePasswordDisableDialog: false,
      mes: '',
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '用户名长度必须在2-10个字符之间', trigger: ['blur', 'change'] },
          { validator: checkUserNameValidate, trigger: 'blur' }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '密码长度必须在2-10个字符之间', trigger: ['blur', 'change'] },
        ],
        passwordChecked: [
          { required: true, message: "请确认密码", trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '密码长度必须在2-10个字符之间', trigger: ['blur', 'change'] },
          { validator: checkPassValidate, trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: "请输入联系方式", trigger: ['blur', 'change'] },
          { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: "请输入正确的联系方式格式" },
        ],
        checkCode: [
          { required: true, message: '请输入验证码', trigger: ['blur', 'change'] },
          { pattern: /^\w{4}$/, message: "验证码长度必须为4位" },
          { validator: checkCodeValidate, trigger: 'blur' }
        ]
      },
      imgURL: this.$url.SysUserControllerBaseUrl + '/getCode'

    }
  },
  created () {
    this.showData()
    this.initAuthority()
  },
  mounted () {

  },
  methods: {
    initAuthority () {
      this.authority.total = this.$store.state.authority[this.$power.map.get('用户管理-管理员管理').property]
      this.authority.userAdd = this.$store.state.authority[this.$power.map.get('用户管理-管理员管理-添加').property]
      this.authority.userDelete = this.$store.state.authority[this.$power.map.get('用户管理-管理员管理-删除').property]
      this.authority.userUpdate = this.$store.state.authority[this.$power.map.get('用户管理-管理员管理-修改').property]
      this.authority.userPasswordReset = this.$store.state.authority[this.$power.map.get('用户管理-管理员管理-重置密码').property]
      this.authority.UserStatusChange = this.$store.state.authority[this.$power.map.get('用户管理-管理员管理-转换状态').property]
      this.authority.changeUserRole = this.$store.state.authority[this.$power.map.get('用户管理-管理员管理-更改用户类型').property]
      Object.freeze(this.authority)
      this.$power.totalCheckAuthority(this.authority)
    },
    perfectPageInfoList () {
      let map = new Map()
      for (let role of this.roles) {
        map.set(role.id, role.name)
      }
      for (let user of this.pageInfo.list) {
        user.roleName = map.get(user.role)
      }

    },
    showData () {
      let params = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      let url = this.$url.SysUserControllerBaseUrl + "/getPaged";
      this.$http.get(url, { params: params }).then(res => {
        this.pageInfo = res.data.data;
        this.getRoles()
      })
    },
    handleCurrentChange () {
      this.showData();
    },
    handleSizeChange () {
      this.showData();
    },
    resetPassword (scope) {
      this.$confirm('是否重置该用户密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$confirm('此操作属于风险操作，请再次确认是否重置该用户密码', '危险', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.$url.SysUserControllerBaseUrl + `/resetPassword`;
          this.$http.post(url, scope.row.username).then(res => {
            if (res.data.data) {
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
    changePassword (scope) {
      this.changePasswordDisableDialog = true;
      this.index = scope.$index;
      this.user = {};
      this.user.username = scope.row.username;
    },
    del (scope) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url =  this.$url.SysUserControllerBaseUrl + `/${scope.row.id}`;
        this.$http.delete(url).then(res => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          this.depts.splice(scope.$index, 1);
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    edit (scope) {
      this.disableDialog = true;
      this.index = scope.$index;
      this.user = {};
      this.user = { ...scope.row };
    },
    getRoles () {
      this.$http.get(this.$url.SysRoleControllerBaseUrl + '/getAllRoleWithoutAuthority')
        .then((res) => {
          if (res.data.code === 2000) {
            this.roles = res.data.data
            this.perfectPageInfoList()
          }
        })
    },
    saveData () {
      if (this.disableDialog) {
        this.$confirm("数据即将保存，是否确认？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.$url.SysUserControllerBaseUrl + "/edit";
          this.$http.put(url, this.user).then(res => {
            if (res.data.code) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.disableDialog = false;
              this.user = {};
              this.showData();
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              });
            }
          })
        })
      }
      if (this.addDisableDialog) {
        this.$confirm("数据即将保存并添加，是否确认？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url =  this.$url.SysUserControllerBaseUrl +"/register";
          this.$http.put(url, this.user).then(res => {
            if (res.data.data) {
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
      if (this.changePasswordDisableDialog) {
        this.$confirm("密码即将修改并确认，是否确认？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = "sys_user/changePassword";
          this.$http.put(url, this.user).then(res => {
            if (res.data.data) {
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
    cancelSave () {
      if (this.disableDialog) {
        this.mes = "已取消保存"
      }
      if (this.addDisableDialog) {
        this.mes = "已取消添加"
      }
      if (this.changePasswordDisableDialog) {
        this.mes = "已取消修改"
      }
      this.$confirm("数据尚未保存，是否取消？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.disableDialog) {
          this.disableDialog = false;
        }
        if (this.addDisableDialog) {
          this.addDisableDialog = false;
        }
        if (this.changePasswordDisableDialog) {
          this.changePasswordDisableDialog = false;
        }
        this.user = {}
        this.$message({
          type: 'info',
          message: this.mes
        });
      })
    },
    add () {
      this.addDisableDialog = true;
      this.user = {};
    },
    changeStatus (scope) {
      this.$http.get(this.$url.SysUserControllerBaseUrl + '/changeUserStatus', {
        params: {
          username: scope.row.username,
          status: scope.row.status
        }
      }).then(res => {
        if (res.data.code === 2000) {
          this.$message({
            message: res.data.message,
            type: "success"
          })
          this.showData()
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          })
        }
      })
    }
  }
}
</script>

<style scope>
el-pagination{
  text-align:center;
  margin-top:20px;
} 
</style>