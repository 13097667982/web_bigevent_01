$(function () {
    // 初始化文章列表
    initArtCateList()
    var form = layui.form
    // 封装函数
    function initArtCateList() {
        // 发请求
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                var htmlStr = template("tpl_List", res)
                $("tbody").html(htmlStr)
            }
        })
    }
    var indexAdd = null
    // 添加功能
    $("#btnAddCate").on("click", function () {
        // layui内置弹出层
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })

    var layer = layui.layer
    // 添加文章   事件代理 点击时页面没有这个元素
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("添加文章失败")
                }
                // 成功   初始化
                initArtCateList()
                layer.msg("恭喜您！添加文章成功")
                // 关闭弹框   调用layui内置关闭弹出层
                layer.close(indexAdd)
            }
        })
    })


    var indexEdit = null
    // 修改
    $("tbody").on("click", ".btn-edit", function () {
        // layui内置弹出层
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        // 获取到自定义属性id值
        var id = $(this).attr("data-id")
        // console.log(id);
        // 获取到id后 发送get请求 渲染页面
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功 渲染
                form.val("form-edit", res.data)
            }
        })
    })

    // 修改文章分类   事件代理 点击时页面没有这个元素
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("修改文章失败")
                }
                // 成功   初始化
                initArtCateList()
                layer.msg("恭喜您！修改文章成功")
                // 关闭弹框   调用layui内置关闭弹出层
                layer.close(indexEdit)
            }
        })
    })

    // 删除
    $("tbody").on("click", ".btn-delete", function () {
        var Id = $(this).attr("data-id")
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            // 发起请求
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg("文章删除成功！")
                    layer.close(index);
                }
            })

        });


    })
})