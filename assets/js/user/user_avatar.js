$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 选择文件
    $("#btnChooseImage").on("click", function () {
        $("#file").click()
    })

    // 修改裁剪图片
    $("#file").on('change', function (e) {
        // console.log(e);
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 上传头像
    $("#btnUpload").on("click", function () {
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        var layer = layui.layer
        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // 判断状态码
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 请求成功
                layer.msg("恭喜您，更换头像成功!")
                // 调用父页面的渲染头像函数
                window.parent.getUserInfo()
            }
        })
    })
})