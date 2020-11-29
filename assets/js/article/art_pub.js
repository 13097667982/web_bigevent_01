$(function () {
    // 初始化分类
    var form = layui.form
    var layer = layui.layer
    initCate()
    // 初始化富文本编辑器
    initEditor()

    // feng装初始化分类函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值 渲染
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)

                // 内置渲染方法
                form.render()
            }
        })
    }



    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击按钮 选择图片
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click()
    })

    // 设置图片
    $("#coverFile").on("change", function (e) {
        var file = e.target.files[0]
        // 非空校验
        if (file === undefined) {
            return
        }
        // 保存图片路径
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 设置状态
    var state = "已发布"

    $("#btnSave2").on("click", function () {
        state = "草稿"
    })

    // 添加文章
    $("#form-pub").on("submit", function (e) {
        e.preventDefault()
        // 创建一个FormData实例对象 快速获取表单值
        var fd = new FormData(this)
        // 放入状态
        fd.append("state", state)

        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob)
                publishArticle(fd)
            })


    })

    // 封装函数
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("发表文章失败")
                }
                // 成功
                layer.msg("发表文章成功！")
                // 跳转
                // location.href = "/article/art_list.html"
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click()
                }, 1500)
            }
        })
    }
})