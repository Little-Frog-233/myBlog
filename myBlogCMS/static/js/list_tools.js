//列表的通用方法
// 必须加载layui和jquery

function loadPage(page_cut_id, tbody_id, get_list_function, get_html_content_function) {
    // openLoading();
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage
            , layer = layui.layer;
        data = get_list_function();
        console.log(data);
        // closeLoading();
        //调用分页
        laypage.render({
            elem: page_cut_id
            , count: data.length
            , limit: 8
            , jump: function (obj) {
                //模拟渲染
                document.getElementById(tbody_id).innerHTML = addList(data, get_html_content_function, obj);
            }
        });

    });
}

function addList(data, get_html_content, obj) {
    //测试数据
    var arr = []
        , thisData = data.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
    layui.each(thisData, function (index, item) {
        var html = get_html_content(index, item);
        arr.push(html);
    });
    return arr.join('');
}

var isFilter = false;

function openFilter() {
    if (isFilter) {
        // $('#task_type').val('');
        // selectJob();
        document.getElementById('after_filter').style.display = "none";
        isFilter = !isFilter;
        // loadPageTask();
    } else {
        document.getElementById('after_filter').style.display = "";
        isFilter = !isFilter
    }
}