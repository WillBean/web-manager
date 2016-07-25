/**
 * Created by Will Bean on 2016/6/12.
 */
(function(){
    $.getJSON("/admin/service_instance",function (res) {
        console.log(res)
        $('#description').val(res.data.description);

        if( res.data.url ){
            var table = $('#image-list tbody');
            var tr = "<tr>";
            var src = 'http://' + location.host +'/'+ res.data.url;
            tr += '<td><span class="preview"><img src='+ src +' style="width: 150px;height: auto"></span></td>';
            tr += '<td><p>'+ res.data.name +'</p></td>';
            tr += '<td><p>'+ res.data.size +'</p></td>';
            tr += '<td><a href="javascript:void(0)" class="delete_btn" id="img_btn_ '+ res.data.id +' ">Delete</td>';
            tr += '</tr>';
            table.append(tr);
        }

    });
    
    function renderAdminList(data,cTime,uTime){
        var tbody = $('.listing>tbody');
        tbody.empty();
        
        $('#submit_btn').click(function () {
            $(this).attr('disabled',true);
            var imgUpload = $('#imgUpload');
            if (imgUpload.prop('files') && imgUpload.prop('files').length) {
                var fd = new FormData();
                fd.append('images', imgUpload.prop('files')[0]);
                $('.add-submit').attr('disabled', true);
                $.ajax({
                    type: 'post', url: '/admin/fileUpload_uploadImg', data: fd, processData: false,
                    contentType: false,
                    success: function (res) {
                        console.log(res);
                        create(res);
                    }
                })
            } else {
                create();
            }

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

    $('#imgUpload').on('change', function () {
        var files = $(this).prop('files');
        addImages(files[0]);
    });

    function create(resImages){
        var data ={
            description :  $('#description').val()
        };
        if( resImages[0] ){
            data.image = resImages[0]
        }
        $.ajax({
            url: "/admin/service_instance",
            type: "POST",
            data: data,
            success :function (res) {
                console.log(res);
                if(res.res_code == 0){
                    alert('修改成功');
                }
                $('#submit_btn').removeAttr('disabled');
            }
        })
    }
    function addImages(data) {
        var tbody = $('#image-list tbody');
        tbody.html('');
        var size = (data.size / 1024).toFixed(2);

        var tr = document.createElement('tr');
        var preview = document.createElement('span');
        var td1 = document.createElement('td');
        td1.appendChild(preview);
        tr.appendChild(td1);
        preview.setAttribute('class', 'preview');

        var p1 = document.createElement('p');
        var p2 = document.createElement('p');
        p1.innerHTML = data.name;
        p2.innerHTML = size + "KB";
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        td2.appendChild(p1);
        td3.appendChild(p2);
        tr.appendChild(td2);
        tr.appendChild(td3);
        var a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('class', 'delete_btn');
        a.innerHTML = 'Cancel';
        var td4 = document.createElement('td');
        td4.appendChild(a);
        tr.appendChild(td4);
        document.querySelector('#image-list tbody').appendChild(tr);

        var img = new Image;
        img.src = window.URL.createObjectURL(data);
        img.style.width = '150px';
        img.style.height = 'auto';
        img.onload = function () {
            preview.appendChild(img)
        }

    }
})();
