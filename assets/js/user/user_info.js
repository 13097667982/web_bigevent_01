$(function () {
    // 自定义验证规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6个字符之间！"
            }
        }
    })
    // 2.用户渲染
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                // 判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功后渲染数据
                form.val("formUserInfo", res.data)
            }
        })
    }
    // 重置数据
    $("#btnReset").on("click", function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 调用渲染函数
        initUserInfo()
    })

    // 修改用户信息
    $(".layui-form").on("submit", function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("修改用户信息失败")
                }
                // 修改成功
                layer.msg("修改用户信息成功")
                // 更新页面   调用父页面的方法
                window.parent.getUserInfo()
            }
        })
    })
})