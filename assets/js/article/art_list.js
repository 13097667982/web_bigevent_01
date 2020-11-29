$(function () {
    // 时间补零
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }
    // 时间过滤器函数
    template.defaults.imports.dataFormat = function (dtStr) {
        // 时间对象
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth())
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        // 格式化时间
        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
    }

    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的状态，可选值有:已发布、草稿
    }

    // 初始化文章列表
    initTable()
    function initTable() {
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                var str = template("tpl-table", res)
                $("tbody").html(str)

                // 调用分页
                renderPage(res.total)
            }
        })
    }

    // 初始化分类 
    var form = layui.form
    initCate()
    // 封装函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                // 渲染
                form.render()
            }
        })
    }

    // 筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        // 获取值
        var cate_id = $("[name=cate_id]").val()
        var state = $("[name=state]").val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    // 分页
    var laypage = layui.laypage
    function renderPage(total) {
        // alert(total)
        laypage.render({
            elem: 'pageBox', //放分页的容器
            count: total,  // 数据总数
            limit: q.pagesize, // 每页显示几条
            curr: q.pagenum, // 起始页,第几页
            // 分页模块显示，显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],  // 每页显示多少条数据的选择器
            // 触发jump:分页初始化的时候，页码改变的时候
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                // 判断不是第一次初始化分页
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }
            }
        });
    }

    // 删除功能    事件委托给父元素table
    $("table").on("click", ".btn-delete", function () {
        var id = $(this).attr("data-id");
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg("恭喜您！文章删除成功!")
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})