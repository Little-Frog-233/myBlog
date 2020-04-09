// 从cookie中获取csrf_token值
function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

// 用例:
// $.ajax({
// 	...
// 	headers: {"X-CSRFToken": getCookie("csrf_token")},
// 	...
// })