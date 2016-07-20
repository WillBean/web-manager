/**
 * Created by Will Bean on 2016/6/1.
 */
(function(){
    function renderAdminList(data,cTime,uTime){
        var tbody = $('.listing>tbody');
        tbody.empty();

        var list_str = '<tr>';
        list_str += '<th class="first" width="20%">登录名</th>';
        list_str += '<th class="first" width="20%">权限等级</th>';
        list_str += '<th width="20%">加入时间</th>';
        list_str += '<th width="20%">更新时间</th>';
        list_str += '<th class="last" width="20%">操作</th>';
        list_str += '</tr>';
        tbody.append(list_str);

        for(var i in data){
            var item = data[i];

            list_str = '<tr>';
            list_str += '<td class="first style1">' + item.name + '</td>';
            list_str += '<td class="first style1">' + item.rights + '</td>';
            list_str += '<td>' + cTime[i] + '</td>';
            list_str += '<td>' + uTime[i] + '</td>';
            //if(item.id)
            list_str += '<td class="last"><a href="#" class="btn_del" id="btn_del_' + item.id + '">删除</a></td>';
            list_str += '</tr>';
            tbody.append(list_str);
        }

        $('.btn_del').click(function () {
            if(confirm("确定删除吗？")){
                $.get("/admin/admin_delete?id="+$(this).attr('id').substr(8),function(res){
                    if(res.res_code === 0){
                        alert("成功删除");
                        $.getJSON("/admin/get_admin_list?random"+Math.random(),function(data){
                            renderAdminList(data.data.list,data.data.c_time,data.data.u_time);
                        });
                    }
                });
            }
        })
    }
    $(function(){
        $.getJSON("/admin/get_admin_list?random"+Math.random(),function(data){
            renderAdminList(data.data.list,data.data.c_time,data.data.u_time);
        });

        $('#add_btn').click(function(){
            window.parent.loadIframe('../../templates/admin_add.html');
        });


    });
})();
