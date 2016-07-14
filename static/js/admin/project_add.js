/**
 * Created by Will Bean on 2016/6/12.
 */
(function () {
    $(function () {
        var images = [];
        var count = 0;
        $('#imgUpload').fileupload({
            url: '/fileUpload_uploadImg',
            //loadImageFileTypes : /^image\/(gif|jpeg|png)$/,
            /*
            issue:重复添加图片之后，上传将执行多次，导致项目创建多次

             */
            add: function (e, data) {
                console.log(data);
                data.originalFiles.forEach(function(data,index){
                    addImages(index,data);
                });
                $('.add-submit').click(function () {
                    $('.add-submit').attr('disabled',true);
                    data.submit();

                })
            },
            done: function (e, data) {
                console.log(data)
                count++;
                if(data.result.error){
                    alert(data.result.error);
                    return;
                }
                images.push({
                    name : data.result.name,
                    url : data.result.url,
                    size : data.result.size
                });
                console.log(count,data.originalFiles.length)

                if(count == data.originalFiles.length){
                    //addImages()
                    newAProject();
                }
            }
        })

        //var editor;
        //KindEditor.ready(function(K) {
        //    editor = K.create('textarea', {
        //        uploadJson: '/uploadImg',
        //        allowFileManager: true,
        //        fileManagerJson: '/file_manager_json',
        //        items: []
        //    });
        //});
        function newAProject(d) {

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
                imgList : images
            };
            if (flag) {
                $('.add-submit').attr('disabled', true);
                $.ajax({
                    type: 'get', url: '/project_add', data: data,
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

        $('.add-submit').click(function () {

        });

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

        function addImages(index,data){
            var tbody = $('#image-list tbody');
            var size = (data.size/1024).toFixed(2);
            //var str = '<tr>';
            //str += '<td><span class="preview"></span></td>';
            //str += '<td><p>'+ 'data.name' +'</p></td>';
            //str += '<td><p>'+ size +"KB" +'</p></td>';
            //str += '<td><a href="javascript:void(0)" id="can_btn_"'+ index +'>Cancel</a></td>';
            //tbody.append(str);

            var tr = document.createElement('tr');
            var preview = document.createElement('span');
            var td1 = document.createElement('td');
            td1.appendChild(preview);
            tr.appendChild(td1);
            preview.setAttribute('class','preview');

            var p1 = document.createElement('p');
            var p2 = document.createElement('p');
            p1.innerHTML = data.name;
            p2.innerHTML = size +"KB";
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            td2.appendChild(p1);
            td3.appendChild(p2);
            tr.appendChild(td2);
            tr.appendChild(td3);
            var a = document.createElement('a');
            a.setAttribute('href','javascript:void(0)');
            a.setAttribute('id','can_btn_'+index);
            a.innerHTML = 'Cancel';
            var td4 = document.createElement('td');
            td4.appendChild(a);
            tr.appendChild(td4);
            document.querySelector('#image-list tbody').appendChild(tr);

            var canvas = document.createElement('canvas');
            canvas.setAttribute('width','80px');
            canvas.setAttribute('height','50px');
            var ctx = canvas.getContext('2d');
            var img = new Image(data);console.log(img);
            ctx.drawImage(data,0,0);
            img.onload = function(){
                ctx.drawImage(img,0,0);
                preview.appendChild(canvas)
            }

        }

        function setImagePreviews(fileList) {
            var docObj = document.getElementById("doc");
            var dd = document.getElementById("dd");
            dd.innerHTML = "";
            var fileList ;
            for (var i = 0; i < fileList.length; i++) {
                dd.innerHTML += "<div style='float:left' > <img id='img" + i + "'  /> </div>";
                var imgObjPreview = document.getElementById("img"+i);
                if (docObj.files && docObj.files[i]) {
                    //火狐下，直接设img属性
                    imgObjPreview.style.display = 'block';
                    imgObjPreview.style.width = '150px';
                    imgObjPreview.style.height = '180px';
                    //imgObjPreview.src = docObj.files[0].getAsDataURL();
                    //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
                    imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]);
                } else {
                    //IE下，使用滤镜
                    docObj.select();
                    var imgSrc = document.selection.createRange().text;
                    alert(imgSrc)
                    var localImagId = document.getElementById("img" + i);
                    //必须设置初始大小
                    localImagId.style.width = "150px";
                    localImagId.style.height = "180px";
                    //图片异常的捕捉，防止用户修改后缀来伪造图片
                    try {
                        localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                        localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                    } catch (e) {
                        alert("您上传的图片格式不正确，请重新选择!");
                        return false;
                    }
                    imgObjPreview.style.display = 'none';
                    document.selection.empty();
                }
            }
            return true;
        }

    })
})();