/**
 * Created by Will Bean on 2016/6/12.
 */
(function(){
    function renderAdminList(data,cTime,uTime){
        var tbody = $('.listing>tbody');
        tbody.empty();

        var list_str = '<tr>';
        list_str += '<th class="first" width="20%">项目名</th>';
        list_str += '<th width="20%">加入时间</th>';
        list_str += '<th width="20%">更新时间</th>';
        list_str += '<th class="last" width="40%">操作</th>';
        list_str += '</tr>';
        tbody.append(list_str);

        for(var i in data){
            var item = data[i];

            list_str = '<tr>';
            list_str += '<td class="first style1">' + item.cnName + '</td>';
            list_str += '<td>' + cTime[i] + '</td>';
            list_str += '<td>' + uTime[i] + '</td>';
            list_str += '<td class="last"><a href="#" class="btn_edi" id="btn_edi_' + item.id + '">编辑</a><a href="#" class="btn_del" id="btn_del_' + item.id + '">删除</a></td>';
            list_str += '</tr>';
            tbody.append(list_str);
        }

        $('.btn_del').click(function () {
            if(confirm("确定删除吗？")){
                $.get("/project_delete?id="+$(this).attr('id').substr(8),function(res){
                    console.log(res);
                    if(res.res_code === 0){
                        alert("成功删除");
                        $.getJSON("/get_project_list?random="+Math.random(),function(data){
                            renderAdminList(data.data.list,data.data.c_time,data.data.u_time);
                        });
                    }
                });
            }
        });

        $('.btn_edi').click(function(){
            window.parent.loadIframe('../../templates/project_edit.html?id='+$(this).attr('id').substr(8));
        })
    }
    $(function(){
        $.getJSON("/get_project_list?random="+Math.random(),function(data){
            renderAdminList(data.data.list,data.data.c_time,data.data.u_time);
        });

        $('#add_btn').click(function(){
            window.parent.loadIframe('../../templates/project_add.html');
        });

    });
})();
