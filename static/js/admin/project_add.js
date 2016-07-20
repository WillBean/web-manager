/**
 * Created by Will Bean on 2016/6/12.
 */
(function () {
    $(function () {
        var images = [];

        $('.add-submit').click(function () {
            //var data = $('#imgUpload').prop('file');
            var cnName = $('.admin-input #cnName').val().trim();
            if (!cnName || cnName == '') {
                $('.admin-input #cnName').addClass('highlight');
                return;
            }else{
                $('.admin-input #cnName').removeClass('highlight');
            }
            console.log(images);
            if( images.length ){
                var fd = new FormData();
                for( var i = 0; i < images.length; i++){
                    fd.append('images'+i,images[i]);
                }
                $('.add-submit').attr('disabled',true);
                $.ajax({
                    type: 'post', url: '/admin/fileUpload_uploadImg', data: fd, processData:false,
                    contentType: false,
                    success: function (res) {
                        console.log(res);
                        if (res.length === images.length) {
                            newAProject(res);
                        }
                    }
                })
            }else {
                newAProject();
            }

        });

        $('#imgUpload').on('change', function () {
            console.log($(this).prop('files'))
            var files = $(this).prop('files');
            var len = files.length;
            for( var i = 0 ; i < len; i++){
                images.push(files[i]);
                addImages(i, files[i]);
            }
            imgDelete();
        });

        function imgDelete(){
            $('.delete_btn').click(function(){
                var tr = $(this).parent().parent();
                images.splice(tr.index(), 1);
                tr.remove();
            })
        }

        function newAProject(resImages) {

            var cnName = $('.admin-input #cnName').val().trim(),
                engName = $('#engName').val().trim(),
                title = $('#title').val().trim(),
                introduction = $('#introduction').val().trim(),
                description = $('#description').val().trim();

            if (!cnName || cnName == '') {
                return;
            }
            var infoList = [];
            var lists = $('.info-container ul').find('li');
            var flag = true;
            for (var i = 0; i < lists.length; i++) {
                var list = lists.eq(i);
                var index = list.find('.info_index');
                var reg = new RegExp("^[0-9]*$");
                if (!reg.test(index.val()) && index.val() != '') {
                    index.focus();
                    flag = false;
                    break
                }//========================判空
                infoList[i] = {
                    title: list.find('.info_title').val().trim(),
                    content: list.find('.info_content').val().trim(),
                    index: list.find('.info_index').val().trim()
                };
            }
            if (!flag) {
                return;
            }

            var data = {
                cnName: cnName,
                engName: engName,
                introduction: introduction,
                description: description,
                title: title,
                infoList: infoList.length ? infoList : "",
                imgList: resImages
            };
            if (flag) {
                $('.add-submit').attr('disabled', true);
                $.ajax({
                    type: 'get', url: '/admin/project_add', data: data,
                    success: function (res) {
                        console.log(res);
                        if (res.res_code === 0) {
                            alert("添加成功");
                        }
                        $('.add-submit').removeAttr('disabled');
                    }
                })
            }
        }

        $('.add_info').click(function () {
            var lists = $('.info-container ul').find('li');
            if (lists.length > 0) {
                var infoInput = $('.info');
                var flag = true;
                for (var i = 0; i < infoInput.length; i++) {
                    if (infoInput.eq(0).val().trim() == '') {
                        flag = false;
                        infoInput.eq(0).focus();
                        break;
                    }
                }
                if (flag) {
                    addInfoInputArea();
                }
            } else {
                addInfoInputArea();
            }
        });

        function addInfoInputArea() {
            var ul = $('.info-container ul');
            var li = "<li>";
            li += "<input type='text' class='info info_title' placeholder='小标题' required>";
            li += "<input type='text' class='info info_content' placeholder='内容' required>";
            li += "<input type='text' class='info info_index' placeholder='顺序'>";
            li += "</li>";
            ul.append(li);
        }

        function addImages(index, data) {
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
            img.onload = function(){
                preview.appendChild(img)
            }

        }

    })
})();