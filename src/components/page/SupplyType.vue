<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>供货商类别</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" class="handle-del mr10" @click="add">新增</el-button>
                <el-button type="primary" icon="refresh" class="handle-del mr10" @click="refresh">刷新</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="name" label="名称">
                </el-table-column>
                <el-table-column prop="desc" label="描述" >
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="60px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.desc"></el-input>
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
    export default {
        name: 'basetable',
        components: {ElSelectDropdown},
        data() {
            return {
                url: this.path + '/supply/type',
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
                    name: '',
                    desc: ''
                },
                idx: -1
            }
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
                    pageSize: this.pageSize
                }).then((res) => {
                    console.log(res.data.data);
                    this.tableData = res.data.data;
                    this.total = res.data.total;
                })
            },
            search() {
                this.is_search = true;
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
                    name: item.name,
                    desc: item.desc,
                    id: item.id
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            add() {
                this.form = {
                    name: '',
                    desc: ''
                }
                this.editVisible = true;
            },
            refresh() {
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                let that = this;
                // this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$axios.post(this.path + '/supply/type/save', this.form)
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
                this.$axios.post(this.path + '/supply/type/delete', {'id':item.id})
                    .then(function (response) {
                        that.$message.success(`删除成功`);
                        that.getData();
                    })
                    .catch(function (error) {
                        that.$message.error(`删除失败`);
                    });
                this.delVisible = false;
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
</style>
