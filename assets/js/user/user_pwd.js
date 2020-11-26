$(function () {
    // 自定义表单校验规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            // 判断
            if (value == $("[name=oldPwd]").val()) {
                return "新旧密码不能相同"
            }
        },
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次输入的密码不一致"
            }
        }
    })
    // 表单提交
    $(".layui-form").on("submit", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                // 判断状态码
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 修改成功
                layui.layer.msg("修改密码成功!")
                // 重置表单
                $(".layui-form")[0].reset();
            }
        })
    })
})