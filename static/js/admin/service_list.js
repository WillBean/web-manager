/**
 * Created by Will Bean on 2016/6/12.
 */
(function(){
    $.getJSON("/admin/service_instance",function (res) {
        $('#description').val(res.data.description);
    });
    
    function renderAdminList(data,cTime,uTime){
        var tbody = $('.listing>tbody');
        tbody.empty();
        
        $('#submit_btn').click(function () {
            $(this).attr('disabled',true);
            $.ajax({
                url: "/admin/service_instance",
                type: "POST",
                data: {
                    description :  $('#description').val()
                },
                success :function (res) {
                    console.log(res);
                    if(res.res_code == 0){
                        alert('修改成功');
                    }
                    $('#submit_btn').removeAttr('disabled');
                }
            })
        });

        var list_str = '<tr>';
        list_str += '<th class="first" width="20%">服务标题</th>';
        list_str += '<th width="20%">加入时间</th>';
        list_str += '<th width="20%">更新时间</th>';
        list_str += '<th class="last" width="40%">操作</th>';
        list_str += '</tr>';
        tbody.append(list_str);

        for(var i in data){
            var item = data[i];

            list_str = '<tr>';
            list_str += '<td class="first style1">' + item.title + '</td>';
            list_str += '<td>' + cTime[i] + '</td>';
            list_str += '<td>' + uTime[i] + '</td>';
            list_str += '<td class="last"><a href="#" class="btn_edi" id="btn_edi_' + item.id + '">编辑</a><a href="#" class="btn_del" id="btn_del_' + item.id + '">删除</a></td>';
            list_str += '</tr>';
            tbody.append(list_str);
        }

        $('.btn_del').click(function () {
            if(confirm("确定删除吗？")){
                $.ajax({
                    url: "/admin/service_items_instance?id="+$(this).attr('id').substr(8),
                    type : 'DELETE',
                    success : function (res) {
                        console.log(res);
                        if(res.res_code === 0){
                            alert("成功删除");
                            $.getJSON("/admin/service_items_instance?random="+Math.random(),function(data){
                                renderAdminList(data.data.list,data.data.c_time,data.data.u_time);
                            });
                        }
                    }
                });
            }
        });

        $('.btn_edi').click(function(){
            window.parent.loadIframe('../../templates/service_edit.html?id='+$(this).attr('id').substr(8));
        })
    }
    $(function(){
        $.getJSON("/admin/service_items_instance?random="+Math.random(),function(data){
            renderAdminList(data.data.list,data.data.c_time,data.data.u_time);
        });

        $('#add_btn').click(function(){
            window.parent.loadIframe('../../templates/service_add.html');
        });

    });
})();
