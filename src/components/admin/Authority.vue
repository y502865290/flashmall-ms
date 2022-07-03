<template>
  <el-button type="primary"
             @click="flashAll()">
    <el-icon>
      <RefreshRight />
    </el-icon>刷新页面
  </el-button>
  <el-button type="primary"
             v-if="authority.roleAdd || authority.all"
             @click="addType()">添加用户类型</el-button>
  <el-divider></el-divider>
  <el-tabs type="border-card"
           v-model="nowPane"
           @tab-remove="toDelete">

    <el-tab-pane label="权限管理"
                 v-if="authority.menuTotalManage || authority.all"
                 name="-1">
      <span>
        <el-input style="width:200px;margin-left: 15px;margin-right: 15px;"
                  v-model="query2"
                  placeholder="检索关键词"
                  @input="doFilter2()"></el-input>
        <el-button type="primary"
                   v-if="authority.menuAdd || authority.all"
                   @click="createMenu(index)">新增一级权限</el-button>
        <el-button type="primary"
                   @click="checkPropertyTable()">查看权限和属性对应表</el-button>

      </span>
      <el-divider></el-divider>
      <el-tree-v2 ref="menuTreeRef"
                  :data="sourceMenu"
                  :props="props"
                  :filter-method="myFilterMethod"
                  :height="370">
        <template #default="{node}">
          <span>
            <span :class="{
                  'firstSpan' :node.data.detail.level == 1,
                  'secondSpan' :node.data.detail.level == 2,
                  'thirdSpan' :node.data.detail.level == 3}">
              {{node.label}}
            </span>
            <span>
              <el-link v-if="node.data.detail.level != 3 && (this.authority.menuAdd || this.authority.all )"
                       style="margin-left:15px"
                       type="primary"
                       @click="createSonMenu(node)">
                <el-icon>
                  <CirclePlus />
                </el-icon>
                新增子权限
              </el-link>
              <el-link style="margin-left:15px"
                       v-if="this.authority.menuUpdate || this.authority.all"
                       type="warning"
                       @click="toCreateUpdateMenu(node)">
                <el-icon>
                  <EditPen />
                </el-icon>
                修改
              </el-link>
              <el-link style="margin-left:15px"
                       v-if="this.authority.menuDelete || this.authority.all"
                       type="danger"
                       @click="deleteMenu(node)">
                <el-icon>
                  <Close />
                </el-icon>
                删除
              </el-link>
            </span>
          </span>
        </template>
      </el-tree-v2>
    </el-tab-pane>

    <el-tab-pane v-for="(item,index) in roles"
                 :key="item.id"
                 :closable="item.canDelete"
                 :label="item.name"
                 :name="item.id">
      <span>
        <el-input style="width:200px;margin-left: 15px;margin-right: 15px;"
                  v-model="query[index]"
                  placeholder="检索关键词"
                  @input="doFilter(index)"></el-input>
        <el-button type="primary"
                   v-if="item.name != '超级管理员'"
                   @click="back(index)">恢复初始选择</el-button>
        <el-button type="warning"
                   v-if="item.name != '超级管理员' && (this.authority.roleMenuUpdate || this.authority.all) && (item.id != this.$store.state.user.role)"
                   @click="saveChange(index)">保存修改</el-button>

        <el-button type="primary"
                   v-if="item.name == '超级管理员'"
                   @click="getAllAuthority()">获取所有权限</el-button>

        <el-button type="primary"
                   v-if="item.name == '超级管理员'"
                   @click="deleteALLAuthority()">清除所有其他角色权限</el-button>

      </span>

      <el-divider></el-divider>
      <el-tree-v2 ref="treeRef"
                  :data="sourceMenu"
                  :props="props"
                  show-checkbox
                  check-strictly
                  :filter-method="myFilterMethod"
                  :default-checked-keys="defaultSelectMap.get(item.name)"
                  :height="370">

      </el-tree-v2>
    </el-tab-pane>
  </el-tabs>

  <el-dialog title="新建用户类型"
             v-model="dialogVisibleCreateRole"
             width="500px">
    <el-form :model="role"
             label-position="left"
             :rules="createRule"
             ref="createRoleFormRef">
      <el-form-item label="用户类型名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="toCancleRole()">取消</el-button>
      <el-button type="primary"
                 @click="toConfirmCreateRole()">新建</el-button>
    </template>
  </el-dialog>

  <!--新建一级类别的弹出对话框-->
  <el-dialog title="新建一级权限"
             v-model="dialogVisibleCreateMenu"
             width="500px">
    <el-form :model="menuLevel1"
             label-position="left"
             :rules="createRule"
             ref="createMenuFormRef">
      <el-form-item label="权限名称"
                    label-width="100px"
                    prop="name">
        <el-input v-model="menuLevel1.name"
                  style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="权限URL"
                    label-width="100px"
                    prop="url">
        <el-input v-model="menuLevel1.url"
                  style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="权限属性"
                    label-width="100px"
                    prop="property">
        <el-input v-model="menuLevel1.property"
                  style="width:300px"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="toCancleCreateMenu()">取消</el-button>
      <el-button type="primary"
                 @click="toConfirmCreateMenu()">新建</el-button>
    </template>

  </el-dialog>

  <!--新建子权限对话框-->
  <el-dialog title="新建子权限"
             v-model="dialogVisibleCreateMenuSon"
             width="500px">
    <el-form :model="menuSon"
             label-position="left"
             :rules="createRule"
             ref="createSonFormRef">
      <el-form-item label="权限名称"
                    label-width="100px"
                    prop="name">
        <el-input v-model="menuSon.name"
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="父级权限名称"
                    label-width="100px">
        <el-input v-model="menuSon.parentName"
                  readonly
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="权限等级"
                    label-width="100px">
        <el-input v-model="menuSon.levelName"
                  readonly
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="权限URL"
                    label-width="100px"
                    prop="url">
        <el-input v-model="menuSon.url"
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="权限属性"
                    label-width="100px"
                    prop="property">
        <el-input v-model="menuSon.property"
                  style="width:300px"></el-input>
      </el-form-item>

    </el-form>

    <template #footer>
      <el-button @click="toCancleCreateMenuSon()">取消</el-button>
      <el-button type="primary"
                 @click="toConfirmCreateMenuSon()">新建</el-button>
    </template>
  </el-dialog>

  <!--更新权限信息对话框-->
  <el-dialog title="更新权限信息"
             v-model="dialogVisibleUpdate"
             width="500px">
    <el-form :model="updateMenu"
             label-position="left"
             :rules="createRule"
             ref="updateMenuFormRef">
      <el-form-item label="权限名称"
                    label-width="100px"
                    prop="name">
        <el-input v-model="updateMenu.name"
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="父级权限名称"
                    label-width="100px">
        <el-input v-model="updateMenu.parentName"
                  readonly
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="权限等级"
                    label-width="100px">
        <el-input v-model="updateMenu.levelName"
                  readonly
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="权限URL"
                    label-width="100px"
                    prop="url">
        <el-input v-model="updateMenu.url"
                  style="width:300px"></el-input>
      </el-form-item>

      <el-form-item label="权限属性"
                    label-width="100px"
                    prop="property">
        <el-input v-model="updateMenu.property"
                  style="width:300px"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="toCancleMenuUpdate()">取消</el-button>
      <el-button type="primary"
                 @click="toUpdateMenu()">修改</el-button>
    </template>
  </el-dialog>

  <el-drawer v-model="authorityProperty"
             title="权限和属性对应信息"
             direction="rtl"
             size="50%">
    <el-input placeholder="通过权限全名称检索"
              v-model="authorityNameInput"
              @input="doFilterAuthorityName()"
              style="width:300px;margin-bottom: 15px;"></el-input>
    <el-table :data="authorityList"
              border
              height="590px"
              :row-class-name="tableRowClassName">
      <el-table-column property="name"
                       header-align="center"
                       label="权限全名称">
        <template #default="scope">
          <el-popover placement="top-start"
                      :width="200"
                      trigger="hover">
            <template #reference>
              {{scope.row.name}}
            </template>
            {{scope.row.note}}
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column property="property"
                       header-align="center"
                       label="权限属性" />
    </el-table>
  </el-drawer>

  <el-dialog v-model="dialogVisibleCheck"
             title="身份确认"
             width="30%">

    <span>请问您是否确认清除其他角色权限？</span>
    <br />
    <span>如果确认请再次输入您的密码</span>
    <el-input v-model="password"
              style="margin-top:15px"
              type="password"></el-input>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelDeleteAllAuthority()">取消</el-button>
        <el-button type="primary"
                   @click="toDeleteAllAuthority()">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const treeRef = ref(null)
    const menuTreeRef = ref(null)
    const createMenuFormRef = ref(null)
    const createSonFormRef = ref(null)
    const updateMenuFormRef = ref(null)
    return { treeRef, menuTreeRef, createMenuFormRef, createSonFormRef, updateMenuFormRef }
  },
  data () {
    return {
      authority: {
        all: true,
        total: false,
        roleAdd: false,
        roleDelete: false,
        menuTotalManage: false,
        menuAdd: false,
        menuUpdate: false,
        menuDelete: false,
        roleMenuUpdate: false
      },
      dialogVisibleCreateRole: false,
      dialogVisibleCreateMenu: false,
      dialogVisibleCreateMenuSon: false,
      dialogVisibleCheck: false,
      dialogVisibleUpdate: false,
      authorityProperty: false,
      authorityNameInput: '',
      authorityListAll: [],
      authorityList: [],
      role: {},
      roles: [],
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      treeRefMap: {},
      defaultSelectMap: {},
      sourceMenu: [],
      nowPane: '-1',
      query: [],
      query2: '',
      menuLevel1: {},
      menuSon: {},
      updateMenu: {},
      password: '',
      createRule: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: ["blur", "change"] }
        ],
        url: [
        ],
        property: [
          { required: true, message: "权限对应属性不能为空", trigger: ["blur", "change"] }
        ]
      }
    }
  },
  created () {
    this.initAuthority()
    this.getData()
  },
  methods: {
    initAuthority () {
      if (this.$store.state.user.role == undefined) {
        this.authority.total = false
      }
      this.authority.total = this.$store.state.authority[this.$power.map.get('用户管理-权限管理').property]
      this.authority.all = this.$store.state.authority[this.$power.map.get('用户管理-权限管理-所有权限').property]
      this.authority.roleAdd = this.$store.state.authority[this.$power.map.get('用户管理-权限管理-角色添加').property]
      this.authority.roleDelete = this.$store.state.authority[this.$power.map.get('用户管理-权限管理-角色删除').property]
      this.authority.menuTotalManage = this.$store.state.authority[this.$power.map.get('用户管理-权限管理-权限类型管理').property]
      this.authority.menuAdd = this.$store.state.authority[this.$power.map.get('用户管理-权限管理-权限类型添加').property]
      this.authority.menuUpdate = this.$store.state.authority[this.$power.map.get('用户管理-权限管理-权限类型修改').property]
      this.authority.menuDelete = this.$store.state.authority[this.$power.map.get('用户管理-权限管理-权限类型删除').property]
      this.authority.roleMenuUpdate = this.$store.state.authority[this.$power.map.get('用户管理-权限管理-权限赋予').property]
      Object.freeze(this.authority)
    },
    toDelete (pad) {
      if (pad == 1) {
        this.$message({
          message: "超级管理员类型不能删除",
          type: "error"
        })
        return false
      }
      this.$http.delete(this.$url.SysRoleControllerBaseUrl + '/deleteRoleInfo', {
        params: {
          roleId: pad
        }
      }).then((res) => {

        if (res.data.code == 2000) {
          this.doDelete(pad)
          this.$message({
            message: res.data.message,
            type: "success"
          })
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          })
        }
      })
    },
    doDelete (pad) {
      for (let index in this.roles) {
        if (this.roles[index].id === pad) {
          let roleName = this.roles[index].name
          this.defaultSelectMap.delete(roleName)
          this.roles.splice(index, 1)
          break;
        }
      }
    },
    getData () {
      this.getMenuWithLevel()
      this.getAllRole()
    },
    getMenuWithLevel () {
      this.$http.get(this.$url.SysMenuControllerBaseUrl + '/getAllMenuWithLevel')
        .then((res) => {
          if (res.data.code == 2000) {
            this.sourceMenu = res.data.data.data
          } else {
            this.$message({
              message: "拉取权限菜单信息失败，请联系管理员",
              type: 'error'
            })
          }
        })
    },
    getAllRole () {
      this.$http.get(this.$url.SysRoleControllerBaseUrl + '/getAllRole')
        .then((res) => {
          if (res.data.code == 2000) {
            this.initData(res.data.data)
          } else {
            this.$message({
              message: "拉取信息失败，请联系管理员",
              type: 'error'
            })
          }
        })
    },
    initData (data) {
      this.roles = []
      this.defaultSelectMap = new Map()
      for (let item of data) {
        if (this.$store.state.user.role != 1 && item.sysRole.name === "超级管理员") {
          continue
        }
        //角色删除权限控制在此体现
        if (this.authority.roleDelete || this.authority.all) {
          item.sysRole.canDelete = item.sysRole.name === "超级管理员" || item.sysRole.name === "默认用户" ? false : true
        } else {
          item.sysRole.canDelete = false
        }
        this.roles.push(item.sysRole)
        this.defaultSelectMap.set(item.sysRole.name, item.authority)
      }
    },
    saveChange (index) {
      let role = this.roles[index]
      if (role.name === "超级管理员") {
        this.$message({
          message: "超级管理员的权限不允许修改",
          type: "warning"
        })
        return false
      }
      let roleId = role.id
      let menuIdList = this.treeRef[index].getCheckedKeys()
      let roleList = []
      for (let id of menuIdList) {
        roleList.push({ roleId: roleId, menuId: id })
      }
      this.$http.put(this.$url.SysRoleMenuControllerBaseUrl + '/updateRoleMenu', roleList)
        .then((res) => {
          if (res.data.code === 2000) {
            this.defaultSelectMap.set(role.name, menuIdList)
            this.$message({
              message: res.data.message,
              type: "success"
            })
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            })
          }
        })
    },
    toCancleRole () {
      this.role = {}
      this.dialogVisibleCreateRole = false
    },
    toConfirmCreateRole () {
      this.$http.put(this.$url.SysRoleControllerBaseUrl + '/addRole', this.role)
        .then((res) => {
          if (res.data.code == 2000) {
            this.addPane(res.data.data)
            this.$message({
              message: res.data.message,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      this.toCancleRole()
    },
    addPane (roleData) {
      roleData.canDelete = true
      this.roles.push(roleData)
      this.defaultSelectMap.set(roleData.name, [])
    },
    addType () {
      this.dialogVisibleCreateRole = true;
    },
    myFilterMethod (query, node) {
      if (!query) return true
      return node.name.indexOf(query) != -1
    },
    doFilter (index) {
      this.treeRef[index].filter(this.query[index])
    },
    doFilter2 () {
      this.menuTreeRef.filter(this.query2)
    },
    createMenu () {
      this.dialogVisibleCreateMenu = true
    },
    toCancleCreateMenu () {
      this.createMenuFormRef.resetFields()
      this.dialogVisibleCreateMenu = false
    },
    toConfirmCreateMenu () {
      this.menuLevel1.level = 1
      this.menuLevel1.parentId = -1
      this.$http.put(this.$url.SysMenuControllerBaseUrl + '/addSysMenu', this.menuLevel1)
        .then((res) => {
          if (res.data.code == 2000) {
            this.$message({
              message: res.data.message,
              type: "success"
            })
            this.getMenuWithLevel(true, this.menuLevel1.name)
            this.toCancleCreateMenu()
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            })
          }
        })

    },
    createSonMenu (node) {
      this.menuSon = {}
      this.menuSon.level = node.data.detail.level + 1
      this.menuSon.parentId = node.data.id
      this.menuSon.parentName = node.label
      this.menuSon.levelName = this.menuSon.level == 2 ? "二级" : "三级"
      this.dialogVisibleCreateMenuSon = true
    },
    toCancleCreateMenuSon () {
      this.menuSon = {}
      this.createSonFormRef.resetFields()
      this.dialogVisibleCreateMenuSon = false
    },
    toConfirmCreateMenuSon () {
      this.$http.put(this.$url.SysMenuControllerBaseUrl + '/addSysMenu', this.menuSon)
        .then((res) => {
          if (res.data.code == 2000) {
            this.$message({
              message: res.data.message,
              type: "success"
            })
            this.getMenuWithLevel()
            this.toCancleCreateMenuSon()
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            })
          }
        })
    },
    toCreateUpdateMenu (node) {
      this.updateMenu = {}
      this.updateMenu.id = node.data.detail.id
      this.updateMenu.level = node.data.detail.level
      this.updateMenu.url = node.data.detail.url
      this.updateMenu.icon = node.data.detail.icon
      this.updateMenu.name = node.data.detail.name
      this.updateMenu.parentId = node.data.detail.parentId
      this.updateMenu.property = node.data.detail.property
      this.updateMenu.parentName = this.updateMenu.level == 1 ? '---------' : node.parent.label == undefined
      this.updateMenu.levelName = this.updateMenu.level == 1 ? '一级' : this.updateMenu.level == 2 ? '二级' : '三级'
      this.dialogVisibleUpdate = true
    },
    toCancleMenuUpdate () {
      this.updateMenu = {}
      this.dialogVisibleUpdate = false
      this.updateMenuFormRef.resetFields()
    },
    toUpdateMenu () {
      this.$http.post(this.$url.SysMenuControllerBaseUrl + '/updateSysMenu', this.updateMenu)
        .then((res) => {
          if (res.data.code == 2000) {
            this.$message({
              message: res.data.message,
              type: "success"
            })
            this.getMenuWithLevel()
            this.toCancleMenuUpdate()
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            })
          }
        })
    },
    deleteMenu (node) {
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
          console.log(node)
          this.$http.delete(this.$url.SysMenuControllerBaseUrl + '/deleteSysMenu', {
            params: {
              id: node.data.id,
              level: node.data.detail.level
            }
          }).then((res) => {
            if (res.data.code == 2000) {
              this.$message({
                message: res.data.message,
                type: "success"
              })
              this.getMenuWithLevel()
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
          this.$http.delete(this.$url.SysMenuControllerBaseUrl + '/deleteSysMenu', {
            params: { id: node.data.id, level: node.data.detail.level }
          }).then((res) => {
            if (res.data.code == 2000) {
              this.$message({
                message: res.data.message,
                type: "success"
              })
              this.getMenuWithLevel()
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
    getAllAuthority () {
      this.$http.get(this.$url.SysRoleMenuControllerBaseUrl + '/getAllAuthority')
        .then((res) => {
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
        })
    },
    test () {
      this.treeRef[0].setChecked(51, true)
    },
    back (index) {
      this.treeRef[index].setCheckedKeys(this.defaultSelectMap.get(this.roles[index].name))
    },
    checkPropertyTable () {
      this.authorityListAll = []
      this.authorityProperty = true
      for (let key of this.$power.map.keys()) {
        let item = { name: key, property: this.$power.map.get(key).property, note: this.$power.map.get(key).note }
        if (item.note === '') {
          item.note = key
        }
        this.authorityListAll.push(item)
        this.authorityList = this.authorityListAll
        this.doFilterAuthorityName()
      }
    },
    deleteALLAuthority () {
      this.dialogVisibleCheck = true;
    },
    toDeleteAllAuthority () {
      this.$http.post(this.$url.SysRoleMenuControllerBaseUrl + '/deleteAllOtherRoleAuthority',
        { username: this.$store.state.user.username, password: this.password })
        .then((res) => {
          if (res.data.code === 2000) {
            this.$message({
              message: res.data.message,
              type: "success"
            })
            this.cancelDeleteAllAuthority()
            this.updatePadUI()
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            })
          }
        })
    },
    cancelDeleteAllAuthority () {
      this.password = ''
      this.dialogVisibleCheck = false
    },
    updatePadUI () {
      let len = this.roles.length
      for (let i = 1; i < len; i++) {
        this.treeRef[i].setCheckedKeys([])
      }
    },
    doFilterAuthorityName () {
      this.authorityList = []
      for (let item of this.authorityListAll) {
        if (item.name.indexOf(this.authorityNameInput) != -1) {
          this.authorityList.push(item)
        }
      }
    },
    flashAll () {
      this.$forceUpdate()
    }


  }

}

</script>

<style scoped>
</style>