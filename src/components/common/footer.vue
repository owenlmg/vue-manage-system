<style  rel="stylesheet/less" lang="less" scoped>
	@import url("../../assets/less/mixin.less");
	footer{
	    	.border-1px(top);
			height:48px;
			overflow: hidden;
			z-index:999;
			background-color:@white;
	    	ul{
	       	 list-style: none;
	        	font-size:0;
	        	padding:0;
	        	.flex-wrapper();
	    	}
	    	li{
	    		flex:1 1 auto;
				padding-top:6px;
	        	&.active a{
	        		color:@color;
	        	}
	    	}
	    	a{
				display:block;
	        	text-decoration: none;
	        	color:@font-color;
				text-align:center;
				position:relative;
	    	}
			img{
				height:1.8rem;
			}
	    	.label{
	        	display:block;
	        	text-align:center;
	          	font-size:1rem;
	    	}
			.count{
				position:absolute;
				border-radius:20px;
				background-color: @danger;
				color:white;
				top:-2px;
				left:calc(50%);
				font-size:10px;
				padding:3px 5px 1px;
				box-shadow: 0 0 1px 1px #fff;
			}
	}
</style>
<template>
	<footer>
		<ul>
			<li v-for="(val, key, index) in navs" :class="key==page?'active':''">
				<router-link :to="val.path">

					<!-- <i class="iconfont" :class="'icon-'+key"></i> -->
					<!--<img :src="'static/images/footer/'+(key==page?(key+'-active'):key)+'.png'">-->
					<span class="label">{{val.label}}</span>
					<span class="count" v-if="key=='work' && workCount>0">{{workCount<=99?workCount:"99+"}}</span>
					<span class="count" v-if="key=='message' && msgCount>0">{{msgCount<=99?msgCount:"99+"}}</span>
				</router-link>
			</li>
		</ul>
	</footer>
</template>
<script>
export default {
	data(){
		return {
			workCount:0,
			msgCount:0,
		}
	},
	props:{
		page:{
			type:String,
			default:"home"
		},
		navs:{
			type:Object,
			default:function(){
				return {
					home:{
						label:"首页",
						path:"/front/index"
					},
					work:{
                        label:"会员单位",
						path:"/front/index"
					},
					personal:{
						label:"精彩活动",
						path:"/front/index"
					},
                    personal:{
                        label:"会员中心",
                        path:"/front/index"
                    }
				}
			},
		}
	},
	mounted(){
		this.init();
	},
	methods:{
		init(){
			this.initWork();
		},
		initWork(){
			// this.$ajax({
			// 	url:this.path+"/oa/process/getTaskMenus",
			// 	data:{
			// 		status:0
			// 	},
			// 	success:(res)=>{
			// 		if(res && res.code==1){
			// 			let count=0;
			// 			for(let i=0;i<res.msg.length;i++){
			// 				let list=res.msg[i];
			// 				count+=list.count;
			// 			}
			// 			this.workCount=count;
			// 		}
			// 	}
			// })
		},
	}
}
</script>
