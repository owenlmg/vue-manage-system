<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search_key" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="getData">查询</el-button>
                <a ref="target" href="" target="_blank"></a>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="name_" label="昵称">
                </el-table-column>
                <el-table-column prop="link" label="联系方式" >
                </el-table-column>
                <el-table-column prop="content" label="留言内容" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="time_" label="留言时间" >
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

                url: this.path + '/message/list',
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
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
                const item = this.tableData[this.idx];
                let that = this;
                this.$axios.post(this.path + '/message/delete', {'id':item.id})
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
