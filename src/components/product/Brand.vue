<template>
  <h1>品牌管理</h1>
  <el-button type="default"
             v-if="authority.brandAdd"
             @click="add">添加品牌</el-button>
  <el-table :data="pageInfo.list"
            stripe
            style="width:100%"
            border
            :header-cell-style="{textAlign:'center'}"
            :cell-style="{textAlign:'center'}">
    <el-table-column prop="id"
                     label="品牌id"></el-table-column>
    <el-table-column prop="name"
                     label="品牌名"></el-table-column>
    <el-table-column prop="logo"
                     label="品牌标志"></el-table-column>
    <el-table-column prop="description"
                     label="品牌介绍"
                     :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="firstLetter"
                     label="品牌首字母"></el-table-column>
    <el-table-column label="操作"
                     width="350px">
      <template #default="scope">
        <el-button size="small"
                   type="primary"
                   v-if="authority.brandUpdate"
                   @click="edit(scope)">编辑</el-button>
        <el-button size="small"
                   type="danger"
                   v-if="authority.brandDelete"
                   @click="del(scope)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination class="el-pagination"
                 layout="prev,pager,next,total,jumper,sizes"
                 :total="pageInfo.total"
                 v-model:current-page="pageInfo.pageNum"
                 v-model:page-size="pageInfo.pageSize"
                 :page-sizes="[3,5,10,20]"
                 background
                 @current-change="handleCurrentChange"
                 @size-change="handleSizeChange">
  </el-pagination>

  <el-dialog v-model="disableDialog"
             title="编辑品牌"
             center
             width="600px">
    <el-form :model="brand"
             :rules="rules"
             ref="editBrand"
             label-width="100px">
      <el-form-item label="品牌名"
                    prop="name">
        <el-input placeholder="请输入品牌名"
                  v-model="brand.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO"
                    prop="logo">
        <el-input placeholder="请上传品牌LOGO"
                  v-model="brand.logo"></el-input>
      </el-form-item>
      <el-form-item label="品牌描述"
                    prop="description">
        <el-input autosize
                  type="textarea"
                  placeholder="请添加品牌描述"
                  v-model="brand.description"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelSave">取消</el-button>
      <el-button type="primary"
                 @click="saveData('editBrand')">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="addDisableDialog"
             title="添加品牌"
             center
             width="600px">
    <el-form :model="brand"
             :rules="rules"
             ref="addBrand"
             label-width="100px">
      <el-form-item label="品牌名"
                    prop="name">
        <el-input type="text"
                  placeholder="请输入品牌名"
                  v-model="brand.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO"
                    prop="logo">
        <el-input type="text"
                  placeholder="请上传品牌LOGO"
                  v-model="brand.logo"></el-input>
      </el-form-item>
      <el-form-item label="品牌描述"
                    prop="description">
        <el-input autosize
                  type="textarea"
                  placeholder="请添加品牌描述"
                  v-model="brand.description"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelSave">取消</el-button>
      <el-button type="primary"
                 @click="saveData('addBrand')">添加</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data () {
    let checkBrandNameValidate = (rule, value, callback) => {
      let url = this.$url.PmsBrandControllerBaseUrl + "/checkBrandName";
      this.$http.post(url, value).then(res => {
        if (res.data.data) {
          callback(new Error("品牌名已存在"));
        } else {
          callback();
        }
      });
    };
    return {
      authority: {
        total: false,
        brandAdd: false,
        brandUpdate: false,
        brandDelete: false
      },
      addDisableDialog: false,
      disableDialog: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
      },
      brand: {

      },
      rules: {
        name: [
          { required: true, message: "请输入品牌名", trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '品牌名长度必须在1-10个字符之间', trigger: ['blur', 'change'] },
          { validator: checkBrandNameValidate, trigger: 'blur' }
        ],
        logo: [
          { required: true, message: "请上传品牌LOGO", trigger: ['blur', 'change'] }
        ],
        description: [
          { required: true, message: "请输入品牌描述", trigger: ['blur', 'change'] },
          { min: 1, max: 100, message: '品牌描述不能超过100个字符', trigger: ['blur', 'change'] },
        ],
      },
    }
  },
  methods: {
    initAuthority () {
      this.authority.total = this.$store.state.authority[this.$power.map.get("商品管理-品牌管理").property]
      this.authority.brandAdd = this.$store.state.authority[this.$power.map.get("商品管理-品牌管理-添加").property]
      this.authority.brandUpdate = this.$store.state.authority[this.$power.map.get("商品管理-品牌管理-修改").property]
      this.authority.brandDelete = this.$store.state.authority[this.$power.map.get("商品管理-品牌管理-删除").property]
      Object.freeze(this.authority)
      this.$power.totalCheckAuthority(this.authority)
    },
    showData () {
      let params = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      let url = this.$url.PmsBrandControllerBaseUrl + "/getPaged";
      this.$http.get(url, { params: params }).then(res => {
        this.pageInfo = res.data.data;
        console.log(this.pageInfo);
      })
    },
    handleCurrentChange () {
      this.showData();
    },
    handleSizeChange () {
      this.showData();
    },
    del (scope) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = this.$url.PmsBrandControllerBaseUrl + `/${scope.row.id}`;
        this.$http.delete(url).then(res => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          this.showData();
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
      this.brand = {};
      this.brand = { ...scope.row };
    },
    saveData (ref_name) {
      this.$refs[ref_name].validate((valid) => {
        if (valid) {
          if (this.disableDialog) {
            this.$confirm("数据即将保存，是否确认？", "提示", {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let url = this.$url.PmsBrandControllerBaseUrl + "/update";
              this.$http.post(url, this.brand).then(res => {
                if (res.data.data) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  });
                  this.disableDialog = false;
                  this.brand = {};
                  this.showData();
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
              let url = this.$url.PmsBrandControllerBaseUrl + "/insert";
              this.$http.post(url, this.brand).then(res => {
                if (res.data.data) {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.addDisableDialog = false;
                  this.brand = {};
                  this.pageInfo.pageNum = 1;
                  this.showData();
                }
              })
            })
          }
        }
      })
    },
    cancelSave () {
      if (this.disableDialog) {
        this.mes = "已取消保存"
      }
      if (this.addDisableDialog) {
        this.mes = "已取消添加"
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
      this.brand = {};
    }
  },
  created () {
    this.showData();
    this.initAuthority()
  }
}
</script>

<style scope>
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>