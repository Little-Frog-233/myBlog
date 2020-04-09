layui.use('layedit', function () {
        var csrftoken = $("meta[name=csrf-token]").attr("content");
        var layedit = layui.layedit;
        layedit.set({
            uploadImage: {
                url: '/api/restful/picture/' //接口url
                ,headers: {"X-CSRFToken":csrftoken}
                , type: '' //默认post
            }
        });
        var index = layedit.build('demo'); //建立编辑器
        layui.use('form', function () {
            var form = layui.form;
            //监听提交
            form.on('submit(formDemo)', function (data) {
                data = data.field;
                data.content = layedit.getContent(index);
                textAddNotice(data);
                return false;
            });
        });
    });

function textAddNotice(data){
    layer.open({
        skin: 'demo-class'
        , title: '提示'
        , content: '确定要提交吗？'
        , btn: ['确定', '再考虑考虑']
        , yes: function (index, layero) {
            console.log(data);
            layer.closeAll();
            layer.msg(JSON.stringify(data));
        } //按钮【按钮一】的回调
    });
}