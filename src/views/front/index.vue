<template>
    <div class="wrapper">
        <header>

        </header>
        <div class="front-content">
            <div class="type-wrapper">
                <template v-for="item in dataLists">
                    <router-link :to="corpPath(item.id)">
                        <!-- <i class="iconfont" :class="'icon-'+lists.icon"></i> -->
                        <div class="img-wrapper">
                            <img :src="item.icon" alt="">
                        </div>
                        <span>{{item.name_}}</span>
                    </router-link>
                </template>
            </div>
            <header>
                <h3 class="titleLabel">精彩活动</h3>
            </header>
            <div class="activity-wrapper">
                <template v-for="item in activityList">
                    <a @click=open(item.url)>
                        <div class="img-wrapper">
                            <img :src="item.icon" alt="">
                        </div>
                        <span>{{item.name_}}</span>
                    </a>
                </template>
            </div>
            <header>
                <h3 class="titleLabel">会员单位</h3>
                <template v-for="item in corpList">
                    <v-member :item="item"></v-member>
                </template>
            </header>
        </div>
        <v-footer></v-footer>
    </div>
</template>

<script>
    export default {
        metaInfo() {
            return {
                title: this.title
            }
        },
        data() {
            return {
                title: "首页",
                dataLists: [],
                activityList: [],
                corpList: [],
            }
        },
        mounted() {
            this.Init();
        },
        components: {
            'v-footer': (resolve) => {
                require(['../../components/common/footer'], resolve);
            },
            'v-member':(resolve)=>{
                require(['../../components/common/member'],resolve);
            }
        },
        methods: {
            Init() {
                this.getType();
                this.getActivity();
                this.getCorp();
            },
            corpPath(id) {
                return this.path + '/front/corp/' + id;
            },
            activityPath(id) {
                return this.path + '/front/activity/' + id;
            },
            getType() {
                this.$axios.get(this.path + "/type/list").then((res) => {
                    if (res && res.data && res.data.total && res.data.total > 0) {
                        this.dataLists = res.data.rows;
                    }
                })
            },
            getActivity() {
                this.$axios.get(this.path + "/activity/list").then((res) => {
                    if (res && res.data && res.data.total && res.data.total > 0) {
                        this.activityList = res.data.rows;
                    }
                })
            },
            getCorp() {
                this.$axios.get(this.path + "/corp/list").then((res) => {
                    if (res && res.data && res.data.total && res.data.total > 0) {
                        this.corpList = res.data.rows;
                    }
                })
            },
            open(url) {
                window.open(url, "_self");
            }
        }
    }
</script>
<style lang="less" scoped="scoped">
    @import url("../../assets/less/mixin.less");

    .titleLabel {
        line-height: 35px;
        padding-left: 15px;
        padding-right: 15px;
        background-color: @bg-color;
        font-weight: 600;
        font-size: 1.5rem;
        text-align: left;
    }

    .front-content {
        width: auto;
        height: calc(100% - 88px);
        padding: 10px;
        overflow-y: scroll;
        box-sizing: border-box;
    }

    .split-bar {
        width: 100%;
        height: 20px;
        background-color: lightgray;
    }

    .type-wrapper {
        padding: 5px 20px 20px 20px;
        background-color: @white;
        .flex-wrapper(wrap, flex-start, center);
        a {
            flex: 0 0 auto;
            width: 25%;
            text-align: center;
            margin-top: 10px;
            .img-wrapper {
                display: inline-block;
                // background-color:@color;
                padding: 10px;
                border-radius: 50%;
                width: 64px;
                height: 64px;
                img {
                    width: 64px;
                    height: 64px;
                    border-radius: 64px;
                }
            }
            span {
                font: inherit;
                display: block;
                text-align: center;
                line-height: 30px;
                text-decoration: none;
                color: @dark;
            }
        }
    }

    .activity-wrapper {
        padding: 5px 20px 20px 20px;
        background-color: @white;
        .flex-wrapper(wrap, flex-start, center);
        a {
            flex: 0 0 auto;
            width: 80%;
            text-align: center;
            margin-top: 10px;
            .img-wrapper {
                /*display: inline-block;*/
                // background-color:@color;
                padding: 10px 10px 1px 10px;
                /*border-radius: 50%;*/
                width: 100%;
                height: 200px;
                align-content: center;
                img {
                    width: 200px;
                    height: 200px;
                }
            }
            span {
                background-color: gray;
                width: 100%;
                color: @white;
                margin-top: 0;
                font: inherit;
                display: block;
                text-align: left;
                line-height: 30px;
                text-decoration: none;
                color: @dark;
            }
        }
    }
    h3 {

    }
</style>

