<template>
    <div class="cmt-container">
        <h3>发表评论</h3>
        <hr>
        <textarea placeholder="请输入要BB的内容（做多吐槽120字）" maxlength="120" v-model="msg"></textarea>

        <!--按需导入按钮组件模块 -->
        <mt-button type="primary" size="large" @click="postComment">发表评论</mt-button>

        <div class="cmt-list">
            <div class="cmt-item" v-for="(item, i) in comments" :key="item.id">
                <div class="cmt-title">
                    第{{ i+1 }}楼&nbsp;&nbsp;用户：{{ item.user_name }}&nbsp;&nbsp;发表时间：{{ item.add_time | dateFormat()}}
                </div>
                <div class="cmt-body">
                    {{ item.content === 'undefined' ? '系统默认好评': item.content }}
                </div>
            </div>

        </div>

        <!--按钮时镂空的样式 : plain -->
        <mt-button type="danger" size="large" plain @click="getMore">加载更多</mt-button>
    </div>
</template>

<script>
    import { Toast } from "mint-ui";
    export default {
        data() {
            return {
                pageIndex: 1, // 默认展示第一页数据
                comments: [], // 所有的评论数据
                //绑定评论内容
                msg:''
            };
        },
        created() {
            this.getComments();
        },
        props: ["id"],
        methods: {
            getComments() {
                console.log(this.id+'====='+this.$route.params.id)
                // 获取评论
                this.$http
                //   this.id  需要父组件传参过来
                    .get("api/getcomments/" + this.id + "?pageindex=" + this.pageIndex)
                    .then(result => {
                        if (result.body.status === 0) {
                            // this.comments = result.body.message;
                            // 每当获取新评论数据的时候，不要把老数据清空覆盖，而是应该以老数据，拼接上新数据
                            this.comments = this.comments.concat(result.body.message);
                            console.log(this.comments)
                        } else {
                            Toast("获取评论失败！");
                        }
                    });
            },
            getMore() {
                // 加载更多
                this.pageIndex++;
                this.getComments();
            },
            //点击发表评论
            postComment(){
                // 校验是否为空内容
                if (this.msg.trim().length === 0) {
                    return Toast("评论内容不能为空！");
                }
                // 参数1： 请求的URL地址
                // 参数2： 提交给服务器的数据对象 { content: this.msg }
                // 参数3： 定义提交时候，表单中数据的格式  { emulateJSON:true }
                //每次用post发表都要写. 可以来个全局定义 index.js
                this.$http.post('api/postcomment/'+this.id, {
                    content:this.msg.trim()
                }).then( result => {

                    if (result.body.status === 0) {
                        // 1. 拼接出一个评论对象
                        var cmt = {
                            user_name: "匿名用户",
                            add_time: Date.now(),
                            content: this.msg.trim()
                        };
                        this.comments.unshift(cmt);
                        this.msg = "";
                    }
                })
            },
        }

    };
</script>

<style lang="scss" scoped>
    .cmt-container {
        h3 {
            font-size: 18px;
        }
        textarea {
            font-size: 14px;
            height: 85px;
            margin: 0;
        }

        .cmt-list {
            margin: 5px 0;
            .cmt-item {
                font-size: 13px;
                .cmt-title {
                    line-height: 30px;
                    background-color: #ccc;
                }
                .cmt-body {
                    line-height: 35px;
                    text-indent: 2em;
                }
            }
        }
    }
</style>
