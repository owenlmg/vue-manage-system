<template>
    <div>
    <el-row :gutter="24">
        <el-col :span="4">
            <div class="img-wrapper">
                <img :src="item.icon" alt="">
            </div>
        </el-col>

        <el-col :span="16">
            <el-row :gutter="6">
                <el-col><div class="grid-content bg-purple">{{item.name_}}</div></el-col>
            </el-row>
            <el-row :gutter="16">
                <el-col><div class="grid-content bg-purple">{{item.sd}}</div></el-col>
            </el-row>
            <el-row :gutter="4">
                <el-col><div class="grid-content bg-purple">{{item.type_}}</div></el-col>
            </el-row>
        </el-col>
        <el-col :span="4">
            <el-row :gutter="12">
                <el-col :span="24"><div class="grid-content bg-purple"><a class="iconfont el-icon-phone" :href="'tel:'+item.mobile||(item.phone ? item.phone : '')"></a></div></el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="24"><div class="grid-content bg-purple"><a class="iconfont el-icon-location" :href="item.address" v-if="item.address"></a></div></el-col>
            </el-row>


        </el-col>
    </el-row>
    </div>
    <!--<el-container class="main">
        <el-container class="logo-content" >
            <el-aside class="logo"  width="20%">
                <div class="img-wrapper">
                    <img :src="item.icon" alt="">
                </div>
            </el-aside>
            <el-container class="content">
                <el-header class="name" height="20%">{{item.name_}}</el-header>
                <el-main class="sd">{{item.sd}}</el-main>
                <el-footer class="type" height="20%">{{item.type_}}</el-footer>
            </el-container>
        </el-container>
        <el-aside class="logo" width="20%">
            <div class="img-wrapper">
                <img :src="item.icon" alt="">
            </div>
        </el-aside>
    </el-container>-->

	<!--<div class="gd-item">
		<div class="content">
			<router-link  class="gd-content"
			:to="{path:'/gos/detail',query:{id:item.id,status:item.STATUS,appCode:item.appCode}}">
				<div>
					<span>{{item.name_}}</span>
				</div>
				<div v-if="item.name_">
					<p>{{item.name_}}</p>
				</div>
				<div v-if="item.type_">
					<span>{{item.type_}}</span>
				</div>
				<div v-if="item.address">
					<span>地址：</span>
					<p>{{item.address}}</p>
				</div>
			</router-link>
		</div>
		<div class="gd-handdle">
			<a class="iconfont el-icon-phone" :href="'tel:'+item.mobile||(item.phone ? item.phone : '')"></a>
			<a class="iconfont el-icon-location" :href="item.address" v-if="item.address"></a>
		</div>

	</div>-->
</template>

<script>
	export default {
		data(){
			return {
				href:""
			}
		},
		props:['item'],
		computed:{
		},
		mounted(){
			this.geocoder();
		},
		methods: {
			geocoder(){
				let item=this.item;
				let addr="";
				let title=item.customer?item.customer.name:item.appName;
				let tel=item.phone||item.customerPhone;
				if(item.addrBook){
					addr=item.addrBook.name;
				}
				if(item.address){
					addr+=item.address;
				}
				if(addr){
					addr=addr.split(".").join("").replace("中国","");
				}
				let data={
					address:addr,
					key:"XPDBZ-CDJ6G-PYCQA-IM72W-DP7G2-SEBKY",
					output:"jsonp"
				}
				this.$axios({
					url:"https://apis.map.qq.com/ws/geocoder/v1/",
					data:data,
					dataType:'jsonp',
					success:(res)=>{
						if(res && res.status==0){
							let location=res.result.location;
							let lat=location.lat;
							let lng=location.lng;
							this.href="http://apis.map.qq.com/uri/v1/geocoder?marker=coord:"+lat+","+lng+";addr:"+addr+";title:"+title+";tel:"+tel;
						};
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	@import url("../../assets/less/mixin.less");
	.iconAddress{
		color:@font-color;
	}
	.gd-item{
		border-bottom:3px solid @bg-color;
		background-color:@white;

		&:last-child{
			border-bottom:0;
		}
	}
	.gd-title{
		padding:12px 15px 0;
		overflow:hidden;
		h3 ,div{
			padding:0;
		};
		.customer{
			float: left;
			width:calc(100% - 60px);
			color:@main-color;
			font-size:1.5rem;
			.text-ellipsis;
			.h1{
				font-weight: 600;
			}
			.h2{
				font-size:1.4rem;
			}
			p.h2{
				color:@font-color;
				font-weight: 300;
				padding:2px 0;
			}
		}
		.gd-state{
			float: right;
			color:#05CAA8;
			.iconfont{
				margin-right:3px;
			}
			&.unhanddled{
				color:#FF9A14;
			}
			&.handdled{
				color:#0E7EF2;
			}
			&.completed{
				color:#05CAA8;
			}
		}
	}
	.create-time{
		color:@font-color;
		font-size:1.3rem;
		padding-left:15px;
		padding-bottom:5px;
	}
	.gd-content{
		display:block;
		padding-top:5px;
		padding-bottom:5px;
		.border-1px(top);
		.border-1px(bottom);
		div{
			overflow: hidden;
			line-height:18px;
			padding:1px 15px;
			font-size:1.3rem;
			span{
				float:left;
				min-width:80px;
				color:#666;
			}
			p{
				padding:0;
				overflow: hidden;
				color:@main-color;
			}
		}
	}
	.gd-handdle{
		.flex-wrapper(nowrap);
		line-height:40px;
		padding-right:15px;
		a.iconfont{
			flex:0 0 auto;
			color:@color;
			font-size:2.2rem;
			text-align: center;
			padding-left:15px;
			padding-right:15px;
		}
		.empty{
			flex:1 1 auto;
		}
		.btns{
			flex:0 0 auto;
			text-align:right;
			margin-left:15px;
			&:last-child a{
				background-color: @color;
				color:@white;
				border-radius: 5px;
				padding:4px 10px;
			}
		}
		button,a{
			line-height:30px;
			color:@color;
		}
	}
    .main {
        padding: 2px;
    }
    .logo-content {
        maring: 0;
        background-color: #00d1b2;

        .name {
            background-color: #5daf34;
        }
        .sd {
            background-color: #007bff;
        }
        .type {
            background-color: #8c939d;
        }
    }
    .logo {
        background-color: #6c757d;
    }

    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
</style>
