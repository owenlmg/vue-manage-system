<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search_key" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="getData">查询</el-button>
                <el-button type="primary" icon="add" class="handle-del mr10" @click="add">新增</el-button>
                <a ref="target" href="" target="_blank"></a>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="name_" label="名称">
                </el-table-column>
                <el-table-column prop="desc_" label="描述" >
                </el-table-column>
                <el-table-column prop="icon" label="Icon" >
                    <template v-if="scope.row.icon" slot-scope="scope">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img :src="scope.row.icon" @click="openPic(scope.row.icon)" style="max-width:600px;max-height:600px;"/>
                            <img slot="reference" @click="openPic(scope.row.icon)" :src="scope.row.icon" :alt="scope.row.icon" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="cur_page"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="60px">
                <el-form-item label="名称">
                    <el-input v-model="form.name_"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.desc_"></el-input>
                </el-form-item>
                <el-form-item label="Logo">
                    <el-upload
                            name="icon"
                            class="avatar-uploader"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :action="autoUploadPath"
                        >
                    <img v-if="form.pic" :src="form.pic" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ElSelectDropdown from "element-ui/packages/select/src/select-dropdown";
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'basetable',
        components: {ElSelectDropdown},
        data() {
            return {
                defaultSrc: '',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                autoUploadPath: this.path + '/file/upload',

                url: this.path + '/type/list',
                tableData: [],
                cur_page: 1,
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name_: '',
                    desc_: '',
                    icon: '',
                    pic: ''
                },
                search_key: '',
                idx: -1
            }
        },
        components: {
            VueCropper
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            handleSizeChange(val) {
                this.cur_page = 1;
                this.pageSize = val;
                this.getData();
            },
            getData() {
                this.$axios.post(this.url, {
                    page: this.cur_page,
                    pageSize: this.pageSize,
                    search_key: this.search_key
                }).then((res) => {
                    this.tableData = res.data.rows;
                    this.total = res.data.total;
                })
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name_: item.name_,
                    desc_: item.desc_,
                    icon: item.icon,
                    id: item.id,
                    pic: item.icon
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            add() {
                this.form = {
                    name_: '',
                    desc_: '',
                    icon: '',
                    pic: ''
                }
                this.editVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                let that = this;
                // this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$axios.post(this.path + '/type/update', this.form)
                    .then(function (response) {
                        if(response.data && response.data.code && response.data.code == 1) {
                            that.$message.success(`保存成功`);
                            that.getData();
                        } else if(response.data.msg){
                            that.$message.error(response.data.msg);
                        } else {
                            that.$message.error(`保存失败`);
                        }

                    })
                    .catch(function (error) {
                        that.$message.error(`保存失败`);
                    });

            },
            // 确定删除
            deleteRow(){
                const item = this.tableData[this.idx];
                let that = this;
                this.$axios.post(this.path + '/type/delete', {'id':item.id})
                    .then(function (response) {
                        that.$message.success(`删除成功`);
                        that.getData();
                    })
                    .catch(function (error) {
                        that.$message.error(`删除失败`);
                    });
                this.delVisible = false;
            },
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            handleAvatarSuccess(res, file) {
                this.form.pic = URL.createObjectURL(file.raw);
                this.form.icon = res[0];
            },
            openPic(pic) {
                let target = this.$refs.target;
                target.setAttribute('href', this.path + pic)
                target.click()
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 158px;
        height: 158px;
        display: block;
    }
</style>
