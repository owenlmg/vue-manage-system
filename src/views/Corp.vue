<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-select v-model="search_type" placeholder="类型">
                    <el-option key="" label="请选择" value=""></el-option>
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="search_key" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="getData">查询</el-button>
                <el-button type="primary" icon="add" class="handle-del mr10" @click="add">新增</el-button>
                <a ref="target" href="" target="_blank"></a>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="type_" label="商家类型" :formatter="formatterType">
                </el-table-column>
                <el-table-column prop="name_" label="商家名称">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="sd" label="商家简述">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="logo" label="LOGO">
                    <template v-if="scope.row.logo" slot-scope="scope">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <img :src="scope.row.logo" @click="openPic(scope.row.logo)" style="max-width:600px;max-height:600px;"/>
                            <img slot="reference" @click="openPic(scope.row.logo)" :src="scope.row.logo" :alt="scope.row.name_" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column  show-overflow-tooltip prop="desc_" label="商家介绍" >
                    <!--<template slot-scope="scope">-->
                        <!--<p v-html="scope.row.desc_"></p>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column prop="pictures" label="商家图片" >
                    <template v-if="scope.row.pictures" slot-scope="scope">
                        <template  v-for="item in scope.row.pictures">
                            <el-popover
                                    placement="right"
                                    title=""
                                    trigger="hover">
                                <img :src="item" @click="openPic(item)" style="max-width:600px;max-height:600px;"/>
                                <img  slot="reference" @click="openPic(item)" :src="item" :alt="item" style="max-height: 50px;max-width: 130px">
                            </el-popover>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" >
                </el-table-column>
                <el-table-column prop="phone" label="座机号码" >
                </el-table-column>
                <el-table-column prop="address" label="商家地址" >
                </el-table-column>
                <el-table-column prop="remark" label="备注" >
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="70%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="商家类型">
                    <el-select v-model="form.type_" placeholder="请选择">
                        <el-option
                                v-for="item in addOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商家名称">
                    <el-col :span="10">
                        <el-form-item prop="name_">
                            <el-input v-model="form.name_"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="line second-column" :span="4">商家地址</el-col>
                    <el-col :span="10">
                        <el-form-item prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机号码">

                    <el-col :span="10">
                        <el-form-item prop="mobile">
                            <el-input v-model="form.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="line second-column" :span="4">座机号码</el-col>
                    <el-col :span="10">
                        <el-form-item prop="phone">
                            <el-input v-model="form.phone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="商家简述">
                    <el-input type="textarea" v-model="form.sd"></el-input>
                </el-form-item>
                <el-form-item label="LOGO">
                    <el-upload
                            name="logo"
                            class="avatar-uploader"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :action="autoUploadPath"
                    >
                        <img v-if="form.pic" :src="form.pic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商家介绍">

                    <quill-editor v-model="form.desc_"
                                  ref="myQuillEditor"
                                  :options="editorOption">
                    </quill-editor>
                    <el-upload
                            class="quill-upload"
                            :show-upload-list="false"
                            :on-success="handleSuccess"
                            :format="['jpg','jpeg','png','gif']"
                            :max-size="2048"
                            multiple
                            :action="autoUploadPath"
                    >
                    </el-upload>
                </el-form-item>
                <el-form-item label="商家图片">
                    <el-upload
                            name="icon"
                            list-type="picture-card"
                            :on-success="handlePicSuccess"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :action="autoUploadPath"
                            :file-list="fileList"
                        >
                        <!--<img v-for="item in form.pictures" :src="item" class="avatar">-->
                        <i class="el-icon-plus"></i>
                    <!--<img v-if="form.pic" :src="form.pic" class="avatar">-->
                    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
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
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor  } from 'vue-quill-editor';
    // 工具栏配置
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['link', 'image', 'video'],
        ['clean']                                         // remove formatting button
    ]
    export default {
        name: 'basetable',
        components: {ElSelectDropdown, quillEditor},
        data() {
            return {
                defaultSrc: '',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                autoUploadPath: this.path + '/file/upload',

                url: this.path + '/corp/list',
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
                    type_: '',
                    name_: '',
                    desc_: '',
                    pics: '',
                    pictures: [],
                    pic: '',
                    phone: '',
                    mobile: '',
                    address: '',
                    remark: '',
                    sd: '',
                    logo: ''
                },
                search_key: '',
                idx: -1,
                editorOption: {
                    placeholder: '请编辑商家介绍',
                    modules: {
                        toolbar: {
                            container: toolbarOptions,  // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        document.querySelector('.quill-upload input').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                },
                dialogImageUrl: '',
                dialogVisible: false,
                options: [],
                addOptions: [],
                search_type: '',
                fileList: []
            }
        },
        created() {
            this.getType();
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
            getType() {
                let that = this;
                this.$axios.get(this.path + '/type/list').then((res) => {
                    if(res.data && res.data.rows) {
                        res.data.rows.forEach(function(row) {
                            that.options.push({'value': row.id, 'label': row.name_});
                            that.addOptions.push({'value': row.id, 'label': row.name_});
                        });
                    }

                })
            },
            getData() {
                this.$axios.post(this.url, {
                    page: this.cur_page,
                    pageSize: this.pageSize,
                    search_key: this.search_key,
                    search_column: this.search_type ? JSON.stringify({"type_" : this.search_type}) : ''
                }).then((res) => {
                    if(res && res.data && res.data.rows) {
                        for (let i = 0; i < res.data.rows.length; i++) {
                            let pics = res.data.rows[i].pics;
                            if (pics && pics.length > 0) {
                                let pictures = pics.split(',');
                                res.data.rows[i].pictures = pictures;
                            }
                        }
                    }
                    this.tableData = res.data.rows;
                    this.total = res.data.total;
                })
            },
            formatterType(row, column, value, index) {
                if(value && this.options.length > 0) {
                    for(let i=0;i<this.options.length;i++) {
                        if(this.options[i].value == value) {
                            return this.options[i].label;
                        }
                    }
                }
                return '';
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    logo: item.logo,
                    pic: item.logo,
                    type_: item.type_,
                    name_: item.name_,
                    desc_: item.desc_,
                    pics: item.pics,
                    pictures: item.pictures,
                    phone: item.phone,
                    mobile: item.mobile,
                    address: item.address,
                    remark: item.remark,
                    sd: item.sd
                }
                this.fileList = [];
                if(item.pictures && item.pictures.length > 0) {

                    for(let i =0;i<item.pictures.length;i++) {
                        let file = {};
                        file['name'] = item.pictures[i];
                        file['url'] = item.pictures[i];
                        this.fileList.push(file);
                    }
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            add() {
                this.form = {
                    type_: '',
                    name_: '',
                    desc_: '',
                    pics: '',
                    pictures: [],
                    pic: '',
                    logo: '',
                    phone: '',
                    mobile: '',
                    address: '',
                    remark: '',
                    sd: ''
                }
                this.fileList = [];
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
                let pics = [];
                if(this.fileList && this.fileList.length > 0) {
                    for(let i =0;i<this.fileList.length;i++) {
                        let fi = this.fileList[i];
                        if(fi.response && fi.response.length > 0) {
                            pics.push(fi.response[0]);
                        } else if(fi.url) {
                            pics.push(fi.url)
                        }
                    }
                }
                this.form.pics = pics.join(',');
                this.$axios.post(this.path + '/corp/update', this.form)
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
                this.$axios.post(this.path + '/corp/delete', {'id':item.id})
                    .then(function (response) {
                        that.$message.success(`删除成功`);
                        that.getData();
                    })
                    .catch(function (error) {
                        that.$message.error(`删除失败`);
                    });
                this.delVisible = false;
            },
            handleAvatarSuccess(res, file) {
                this.form.pic = URL.createObjectURL(file.raw);
                this.form.logo = res[0];
            },
            handlePicSuccess(res, file) {
                let f = {};
                f['name'] = res[0];
                f['url'] = res[0];
                this.fileList.push(file);
            },
            openPic(pic) {
                let target = this.$refs.target;
                target.setAttribute('href', this.path + pic)
                target.click()
            },
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleSuccess (res) {
                // 获取富文本组件实例
                let quill = this.$refs.myQuillEditor.quill
                // 如果token验证成功，则上传成功
                if (res) {
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片，res为服务器返回的图片链接地址
                    quill.insertEmbed(length, 'image', res[0])
                    // 调整光标到最后
                    quill.setSelection(length + 1)
                } else {
                    // 提示信息，需引入Message
                    Message.error('图片插入失败')
                }
            },
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
    .second-column {
        text-align: right;
        padding-right: 12px;
    }
    .quill-upload {
        display: none;
    }
</style>
