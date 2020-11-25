var baseURL = "http://ajax.frontend.itheima.net"
// jq在发起ajax请求时 都会先执行$.ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url
})