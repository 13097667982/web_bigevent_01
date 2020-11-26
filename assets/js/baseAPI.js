var baseURL = "http://ajax.frontend.itheima.net"
// jq在发起ajax请求时 都会先执行$.ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url

    // 对需要权限的接口配置请求头信息
    // 必须以my开头才行
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    // 拦截所有响应，判断身份认证信息
    options.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message == "身份认证失败!") {
            // 1.清空本地token
            localStorage.removeItem("token");
            // 2.页面跳转
            location.href = "/login.html";
        }
    }
})

