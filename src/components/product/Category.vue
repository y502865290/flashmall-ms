<template>
  <span>
    <el-button type="primary"
               v-if="authority.createCategoryAuthority"
               @click="toCreateCategoryLevel1()">添加类别</el-button>
    <el-input v-model="query"
              style="width:200px;margin-left:15px"
              @input="filter()"
              placeholder="搜索类型">
      <template #prefix>
        <el-icon class="el-input__icon">
          <search />
        </el-icon>
      </template>
    </el-input>
  </span>

  <el-divider></el-divider>
  <el-tree-v2 :data="data"
              :props="props"
              :height="208"
              ref="treeRef"
              :filter-method="myFilterMethod">
    <template #default="{node}">
      <span>
        <span :class="{
                'firstSpan' :node.data.detail.level == 1,
                'secondSpan' :node.data.detail.level == 2,
                'thirdSpan' :node.data.detail.level == 3}">
          {{node.label}}</span>
        <span>
          <el-link v-if="node.data.detail.level != 3 && authority.createCategoryAuthority"
                   style="margin-left:15px"
                   type="primary"
                   @click="createSonCategory(node)">
            <el-icon>
              <CirclePlus />
            </el-icon>
            新增子类别
          </el-link>
          <el-link style="margin-left:15px"
                   v-if="authority.updateCategoryAuthority"
                   type="warning"
                   @click="createCategoryUpdate(node)">
            <el-icon>
              <EditPen />
            </el-icon>
            修改
          </el-link>
          <el-link style="margin-left:15px"
                   v-if="authority.deleteCategoryAuthority"
                   type="danger"
                   @click="toDelete(node)">
            <el-icon>
              <Close />
            </el-icon>
            删除
          </el-link>
        </span>
      </span>
    </template>
  </el-tree-v2>

  <!--新建一级类别的弹出对话框-->
  <el-dialog title="新建一级类别"
             v-model="dialogVisible"
             width="500px">
    <el-form :model="pmsCategory"
             label-position="left"
             :rules="createRule"
             ref="createLevel1Form">
      <el-form-item label="类别名称"
                    label-width="100px"
                    prop="name">
        <el-input v-model="pmsCategory.name"
                  style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="计量单位"
                    label-width="100px"
                    prop="productUnit">
        <el-input v-model="pmsCategory.productUnit"
                  style="width:300px"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="toCancleCategoryLevel1">取消</el-button>
      <el-button type="primary"
                 @click="toConfirmCreateCategoryLevel1()">新建</el-button>
    </template>

    <!--新建子类别的对话框-->
  </el-dialog>

  <el-dialog title="新建子类别"
             v-model="dialogVisibleCreateSon"
             width="500px">
    <el-form :model="pmsCategorySon"
             label-position="left"
             :rules="createRule"
             ref="createSonForm">
      <el-form-item label="类别名称"
                    label-width="100px"
                    prop="name">
        <el-input v-model="pmsCategorySon.name"
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="父级类别名称"
                    label-width="100px">
        <el-input v-model="pmsCategorySon.parentName"
                  readonly
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="类别等级"
                    label-width="100px">
        <el-input v-model="pmsCategorySon.levelName"
                  readonly
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="计量单位"
                    label-width="100px"
                    prop="productUnit">
        <el-input v-model="pmsCategorySon.productUnit"
                  style="width:300px"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="toCancleCategorySon()">取消</el-button>
      <el-button type="primary"
                 @click="toConfirmCreateCategorySon()">新建</el-button>
    </template>
  </el-dialog>

  <!--修改类别信息的对话框-->
  <el-dialog title="修改类别信息"
             v-model="dialogVisibleUpdate"
             width="500px">
    <el-form :model="pmsCategoryUpdate"
             label-position="left"
             :rules="createRuleUpdate"
             ref="createSonForm">
      <el-form-item label="类别名称"
                    label-width="100px"
                    prop="name">
        <el-input v-model="pmsCategoryUpdate.name"
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="父级类别名称"
                    label-width="100px">
        <el-select v-model="pmsCategoryUpdate.parentId"
                   v-bind="pmsCategoryUpdate.canChangePosition"
                   class="m-2"
                   placeholder="Select"
                   size="large"
                   @click="tips(pmsCategoryUpdate.canChangePosition)">
          <el-option v-for="item in parentList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
                     @click="tips(pmsCategoryUpdate.canChangePosition)" />
        </el-select>
      </el-form-item>

      <el-form-item label="类别等级"
                    label-width="100px">
        <el-select v-model="pmsCategoryUpdate.level"
                   class="m-2"
                   placeholder="Select"
                   size="large"
                   @change="setCategoryList()"
                   v-bind="pmsCategoryUpdate.canChangePosition">
          <el-option v-for="item in levelList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
                     @click="tips(pmsCategoryUpdate.canChangePosition)" />
        </el-select>
      </el-form-item>

      <el-form-item label="计量单位"
                    label-width="100px"
                    prop="productUnit">
        <el-input v-model="pmsCategoryUpdate.productUnit"
                  style="width:300px"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="toCancleCategoryUpdate()">取消</el-button>
      <el-button type="primary"
                 @click="toUpdateCategory()">修改</el-button>
    </template>
  </el-dialog>

</template>

<script>

import { ref } from 'vue'

export default {
  setup () {
    const treeRef = ref(null)
    return {
      treeRef
    }
  },
  data () {
    return {
      authority: {
        totalAuthority: false,
        createCategoryAuthority: false,
        updateCategoryAuthority: false,
        deleteCategoryAuthority: false
      },
      query: '',
      createRule: {
        name: [
          { required: true, message: "类别名称不能为空", trigger: ['change', 'blur'] }
        ],
        productUnit: [
          { required: true, message: "计量单位不能为空", trigger: ['change', 'blur'] }
        ]
      },
      data: [

      ],
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      dialogVisible: false,
      dialogVisibleCreateSon: false,
      dialogVisibleUpdate: false,
      pmsCategory: {
        name: '',
        parentId: -1,
        level: 1,
        showStatus: 1,
        productUnit: '',
        icon: ''
      },
      pmsCategorySon: {
        name: '',
        showStatus: 1,
        productUnit: '',
        icon: ''
      },
      pmsCategoryUpdate: {
        name: '',
        showStatus: 1,
        productUnit: '',
        icon: '',
        parentId: '',
        level: 2
      },
      levelList: [
        { value: 1, label: "一级" },
        { value: 2, label: "二级" },
        { value: 3, label: "三级" },
      ],
      parentList: [

      ],
      firstCategoryList: [],
      secondCategoryList: []
    }
  },
  created () {
    this.getData()
    this.initAuthority()
  },
  methods: {
    initAuthority () {
      this.authority.total = this.$store.state.authority[this.$power.map.get('商品管理-类别管理').property]
      this.authority.createCategoryAuthority = this.$store.state.authority[this.$power.map.get('商品管理-类别管理-添加').property]
      this.authority.deleteCategoryAuthority = this.$store.state.authority[this.$power.map.get('商品管理-类别管理-删除').property]
      this.authority.updateCategoryAuthority = this.$store.state.authority[this.$power.map.get('商品管理-类别管理-修改').property]
      Object.freeze(this.authority)
      this.$power.totalCheckAuthority(this.authority)
    },
    getData () {
      this.$http.get(this.$url.PmsCategoryControllerBaseUrl + '/getAllCategory')
        .then((res) => {
          if (res.data.code == 2000) {
            this.data = res.data.data.data
            this.getCategoryParentList()
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            })
          }
        })
        .catch(() => {
          this.$message({
            message: "拉取商品类别数据失败，请联系管理员",
            type: "error"
          })
        })
    },
    getCategoryParentList () {
      this.secondCategoryList = []
      this.firstCategoryList = []
      for (let dataItem of this.data) {
        for (let dataChilditem of dataItem.children) {
          let secondCategoryListItem = { value: dataChilditem.id, label: dataChilditem.name }
          this.secondCategoryList.push(secondCategoryListItem)
        }
        let firstCategoryListItem = { value: dataItem.id, label: dataItem.name }
        this.firstCategoryList.push(firstCategoryListItem)
      }
    },
    toCreateCategoryLevel1 () {
      this.dialogVisible = true;
    },
    toConfirmCreateCategoryLevel1 () {
      this.$http.put(this.$url.PmsCategoryControllerBaseUrl + '/addCategoryLevel1', this.pmsCategory)
        .then((result) => {
          if (result.data.code == 2000) {
            this.getData()
            this.$message({
              message: result.data.message,
              type: "success"
            })
            this.toCancleCategoryLevel1()
          } else {
            this.$message({
              message: result.data.message,
              type: "error"
            })
          }
        }).catch(() => {
          this.$message({
            message: "未知错误异常，请联系管理员",
            type: "error"
          })
        });

    },
    toCancleCategoryLevel1 () {
      if (this.$refs['createLevel1Form']) {
        this.$refs['createLevel1Form'].resetFields()
      }
      this.dialogVisible = false;
    },
    toConfirmCreateCategorySon () {
      this.$http.put(this.$url.PmsCategoryControllerBaseUrl + '/addCategoryLevel1', this.pmsCategorySon)
        .then((result) => {
          if (result.data.code == 2000) {
            this.getData()
            this.$message({
              message: result.data.message,
              type: "success"
            })
            this.dialogVisibleCreateSon = false;
          } else {
            this.$message({
              message: result.data.message,
              type: "error"
            })
          }
        }).catch(() => {
          this.$message({
            message: "未知错误异常，请联系管理员",
            type: "error"
          })
        });

    },
    toCancleCategorySon () {
      if (this.$refs["createSonForm"]) {
        this.$refs["createSonForm"].resetFields()
      }
      this.dialogVisibleCreateSon = false;
    },
    createSonCategory (node) {
      let detail = node.data.detail
      this.pmsCategorySon.levelName = detail.level == 1 ? '二级' : '三级'
      this.pmsCategorySon.parentName = detail.name
      this.pmsCategorySon.parentId = detail.id
      this.pmsCategorySon.level = detail.level + 1
      this.dialogVisibleCreateSon = true;
    },
    setCategoryList () {
      if (this.pmsCategoryUpdate.level == 3) {
        this.parentList = this.secondCategoryList
      } else if (this.pmsCategoryUpdate.level == 2) {
        this.parentList = this.firstCategoryList
      } else if (this.pmsCategoryUpdate.level == 1) {
        this.parentList = [{ value: -1, label: "一级类别，无父类别" }]
      }
      this.pmsCategoryUpdate.parentId = this.parentList[0].value
    },
    createCategoryUpdate (node) {
      let detail = node.data.detail
      if (!node.isLeaf) {
        this.pmsCategoryUpdate.canChangePosition = { disabled: 'disabled' };
      } else {
        this.pmsCategoryUpdate.canChangePosition = {};
      }
      this.pmsCategoryUpdate.id = detail.id
      this.pmsCategoryUpdate.name = detail.name
      this.pmsCategoryUpdate.level = detail.level
      this.pmsCategoryUpdate.productUnit = detail.productUnit
      this.pmsCategoryUpdate.parentId = detail.parentId
      this.pmsCategoryUpdate.showStatus = detail.showStatus
      this.pmsCategoryUpdate.sort = detail.sort
      this.pmsCategoryUpdate.icon = detail.icon
      this.pmsCategoryUpdate.productCount = detail.productCount
      this.setCategoryList()
      this.dialogVisibleUpdate = true;
    },
    toCancleCategoryUpdate () {
      this.pmsCategoryUpdate = {}
      this.dialogVisibleUpdate = false
    },
    toUpdateCategory () {
      this.$http.post(this.$url.PmsCategoryControllerBaseUrl + '/updateCategory', this.pmsCategoryUpdate)
        .then((res) => {
          if (res.data.code == 2000) {
            this.$message({
              message: res.data.message,
              type: "success"
            })
            this.getData()
            this.toCancleCategoryUpdate()
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            })
          }
        })
        .catch(() => {
          this.$message({
            message: "位置原因异常，请联系管理员",
            type: "error"
          })
        })

    },
    tips (canChange) {
      if (canChange.disabled) {
        this.$message({
          type: "warning",
          message: "当前类别有子类别，无法修改当前类别的位置"
        })
      }
    },
    toDelete (node) {
      if (!node.isLeaf) {
        this.$confirm(
          '该商品类型下还有子类型，如果你要删除该商品类型，那么他的子类型也会一同删除，请问你删除该类型吗',
          '提醒',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'error',
          }
        ).then(() => {
          this.$http.delete(this.$url.PmsCategoryControllerBaseUrl + '/deleteCategory', {
            params: { id: node.data.id }
          }).then((res) => {
            if (res.data.code == 2000) {
              this.$message({
                message: res.data.message,
                type: "success"
              })
              this.getData()
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              })
            }
          }).catch(() => {
            this.$message({
              message: "未知原因错误，请联系管理员",
              type: "error"
            })
          })
        })
      } else {
        this.$confirm(
          '你确定删除该类别吗',
          '提醒',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          this.$http.delete(this.$url.PmsCategoryControllerBaseUrl + '/deleteCategory', {
            params: { id: node.data.id }
          }).then((res) => {
            if (res.data.code == 2000) {
              this.$message({
                message: res.data.message,
                type: "success"
              })
              this.getData()
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              })
            }
          }).catch(() => {
            this.$message({
              message: "未知原因错误，请联系管理员",
              type: "error"
            })
          })
        })
      }
    },
    myFilterMethod (query, node) {
      if (!query) return true
      return node.name.indexOf(query) != -1
    },
    filter () {
      this.treeRef.filter(this.query)
    }

  }
}
</script>

<style scoped>
.firstSpan {
  display: -moz-inline-box;
  display: inline-block;
  width: 166px;
}

.secondSpan {
  display: -moz-inline-box;
  display: inline-block;
  width: 150px;
}

.thirdSpan {
  display: -moz-inline-box;
  display: inline-block;
  width: 234px;
}
</style>