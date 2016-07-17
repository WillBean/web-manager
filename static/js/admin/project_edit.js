/**
 * Created by Will Bean on 2016/6/13.
 */
(function() {
    function getSearchObj() {
        var obj = {};
        var search = window.location.search.substr(1);
        if (search.length > 0) {
            var arr = search.split('&');
            for (var i = 0; i < arr.length; i++) {
                var a = arr[i].split('=');
                obj[a[0]] = a[1];
            }
        }
        return obj;
    }

    function addInfoInputArea(){
        var ul = $('.info-container ul');
        var li = "<li>";
        li += "<input type='text' class='info info_title' placeholder='小标题'>";
        li += "<input type='text' class='info info_content' placeholder='内容'>";
        li += "<input type='text' class='info info_index' placeholder='顺序'>";
        li += "<a href='javascript:void(0)' class='remove_btn'>-</a>";
        li += "</li>";
        ul.append(li);

        $('.remove_btn').click(function(){
            $(this).parent().remove();
        })
    }

    function fillInputText(data,id){
        $('#cnName').val(data.cnName);
        $('#engName').val(data.engName);
        $('#title').val(data.title);
        $('#introduction').val(data.introduction);
        $('#description').val(data.description);

        var ul =  $('.info-container ul'),
            infoList = data.InfoList,
            imageList = data.imagesList;
        for(var i = 0; i < infoList.length; i++ ){
            var li = "<li>";
            li += "<input type='text' class='info info_title' value='"+ infoList[i].title +"'>";
            li += "<input type='text' class='info info_content' value='"+ infoList[i].content +"'>";
            li += "<input type='text' class='info info_index' value='"+ infoList[i].index +"'>";
            li += "<a href='javascript:void(0)' class='del_btn' id='del_btn_"+ infoList[i].id +"'>-</a>";
            li += "</li>";
            ul.append(li);
        }

        var table = $('#image-list tbody');
        for(var i = 0; i < imageList.length; i++){
            var src = 'http://' + location.host +'/'+ imageList[i].url;
            var tr = "<tr>";
            tr += '<td><span class="preview"><img src='+ src +' style="width: 150px;height: auto"></span></td>';
            tr += '<td><p>'+ imageList[i].name +'</p></td>';
            tr += '<td><p>'+ imageList[i].size +'</p></td>';
            tr += '<td><a href="javascript:void(0)" class="delete_btn" id="img_btn_ '+ imageList[i].id +' ">Delete</td>';
            tr += '</tr>';
            table.append(tr);
        }

        var delIdList = [];
        $('.add_info').click(function(){
            var lists = $('.info-container ul').find('li');
            if(lists.length > 0 ){
                var infoInput = $('.info');
                var flag = true;
                for(var i = 0; i < infoInput.length; i++){
                    if( infoInput.eq(0).val().trim() == ''){
                        flag = false;
                        infoInput.eq(0).focus();
                        break;
                    }
                }
                if(flag){
                    addInfoInputArea();
                }
            }else {
                addInfoInputArea();
            }
        });

        $('.del_btn').click(function(){
            if(confirm("确定删除吗？")){
                var DId = $(this).attr('id').substr(8);
                $(this).parent().remove();
                delIdList.push(DId);
            }
        });

        var delImgList = [];
        $('.delete_btn').click(function(){
            delImgList.push($(this).attr('id').substr(8));
            console.log(delImgList)
            $(this).parent().parent().remove();
        });

        var addImgList = [];
        $('#imgUpload').on('change', function () {
            var files = $(this).prop('files');
            var len = files.length;
            for( var i = 0 ; i < len; i++){
                addImgList.push(files[i]);
                addImages(files[i])
            }
            imgDelete();
        });

        $('.submit_btn').click(function(){
            $(this).attr('disabled',true);
            var cnName = $('.admin-input #cnName').val().trim(),
                engName = $('#engName').val().trim(),
                title = $('#title').val().trim(),
                introduction = $('#introduction').val().trim(),
                description = $('#description').val().trim();

            if (!cnName || cnName == '') {
                $('.admin-input #cnName').addClass('highlight').focus();
                $(this).removeAttr('disabled');
                return;
            }else{
                $('.admin-input #cnName').removeClass('highlight');
            }
            var infoList = [];
            var lists = $('.info-container ul').find('li');
            var flag = true;
            for(var i = 0; i < lists.length; i++){
                var list = lists.eq(i);
                var index = list.find('.info_index');
                var reg = new RegExp("^[0-9]*$");
                if(!reg.test(index.val())){
                    index.focus();
                    flag = false;
                    break
                }
                infoList[i] = {
                    id : list.find('.del_btn').attr('id').substr(8),
                    title : list.find('.info_title').val().trim(),
                    content : list.find('.info_content').val().trim(),
                    index : list.find('.info_index').val().trim()
                };
            }
            if(!flag){
                return;
            }

            var data = {
                cnName : cnName,
                engName : engName,
                introduction : introduction,
                description : description,
                title : title,
                infoList : infoList.length ? infoList : "",
                delList : delIdList.length ? delIdList : "",
                delImgList : delImgList.length ? delImgList : ""
            };
            console.log(data.delImgList)
            if(flag){
                //upload first
                $(this).attr('disabled',true);

                if( addImgList.length ){
                    var fd = new FormData();
                    for( var i = 0; i < addImgList.length; i++){
                        fd.append('images'+i,addImgList[i]);
                    }

                    $.ajax({
                        type: 'post', url: '/fileUpload_uploadImg', data: fd, processData:false,
                        contentType: false,
                        success: function (res) {
                            console.log(res);
                            if (res.length === addImgList.length) {//update
                                data.addImgList = res;
                                update();
                            }
                        }
                    });
                }else {
                    update();
                }
            }

            function update(){
                console.log(data);
                $.ajax({type: 'get', url: '/project_update?id='+id, data: data,
                    success: function(res){
                        console.log(res);
                        if( res.res_code === 0){
                            alert("更新成功");
                        }
                        $('.submit_btn').removeAttr('disabled');
                    }
                })
            }
        });

        function imgDelete(){
            $('.delete_btn2').click(function(){
                var tr = $(this).parent().parent();
                addImgList.splice(tr.index(), 1);
                tr.remove();
            })
        }
    }

    function addImages(data) {
        var tbody = $('#image-list tbody');
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
        a.setAttribute('class', 'delete_btn2');
        a.innerHTML = 'Cancel';
        var td4 = document.createElement('td');
        td4.appendChild(a);
        tr.appendChild(td4);
        document.querySelector('#image-list tbody').appendChild(tr);

        var img = new Image;
        img.src = window.URL.createObjectURL(data);
        img.style.width = '150px';
        img.style.height = 'auto';
        img.onload = function(){
            preview.appendChild(img)
        }

    }


    $(function () {
        var id = getSearchObj().id;

        $.getJSON('/get_project_info?id='+id+"&random="+Math.random(),function(data){
            fillInputText(data.data,id);
        });

    });
})();
