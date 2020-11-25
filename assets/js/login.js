$(function () {
    // 给两个链接注册点击事件
    $("#link_reg").on("click", function () {
        $(".login_box").hide()
        $(".reg_box").show()
    })
    $("#link_login").on("click", function () {
        $(".login_box").show()
        $(".reg_box").hide()
    })
    // 自定义验证规则
    var form = layui.form
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须6到16位，且不能有输入空格"
        ],
        // 自定义确认密码校验规则
        repwd: function (value) {
            // 通过属性选择器拿到密码的值
            var pwd = $(".reg_box [name=password]").val()
            // 判等
            if (pwd !== value) {
                return "两次输入的密码不一致"
            }
        }
    })
    // 注册按钮的ajax提交
    $("#form_reg").on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // 发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $(".reg_box [name=username]").val(),
                password: $(".reg_box [name=password]").val(),
            },
            success: function (res) {
                // 判断请求状态码
                if (res.status !== 0) {
                    // 调用layui的内置弹出方法
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg("恭喜您！注册成功", { icon: 6 });
                // 清空注册页内容
                $("#form_reg")[0].reset()
                // 手动跳转到登录
                $("#link_login").click()
            }
        })
    })

    // 登录的ajax提交
    $("#form_login").submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // 发起请求
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                // 判断状态码
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                layer.msg("恭喜您！登录成功", { icon: 6 })
                // 登录成功后跳转页面到主页 保存token值
                localStorage.setItem("token", res.token)
                location.href = "/index.html"
            }
        })
    })
})