$(function () {
    getUserInfo()
})
function getUserInfo() {
    // 发送ajax请求
    $.ajax({
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem("token") || ''
        },
        success: function (res) {
            console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功 渲染用户头像
            renderAvatar(res.data)
        }
    })
}

// 封装用户头像渲染函数
function renderAvatar(user) {
    // 1.渲染用户名 有昵称有限渲染昵称
    name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 2.渲染用户头像
    if (user.user_pic !== null) {
        // 有头像 渲染
        $(".layui-nav-img").show().attr('src', user.user_pic);
        $(".text-avatar").hide()
    } else {
        // 没有头像
        $(".layui-nav-img").hide()
        var text = name[0].toUpperCase();
        $(".text-avatar").show().html(text)
    }
    // 点击按钮 实现退出功能
    $("#btnLogout").on("click", function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            // do something
            // 1.清空本地存储token
            localStorage.removeItem('token')
            // 2.重新跳转到登录页面
            location.href = '/login.html'

            // 关闭confirm询问框
            layer.close(index)
        })
    })
}
