/**
 * Created by Will Bean on 2016/6/12.
 */
(function () {
    $(function () {

        $('.add-submit').click(function () {
            //var data = $('#imgUpload').prop('file');
            var title = $('.admin-input #title').val().trim();
            if (!title || title == '') {
                $('.admin-input #cnName').addClass('highlight');
                return;
            } else {
                $('.admin-input #cnName').removeClass('highlight');
            }
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
                        newAProject(res);
                    }
                })
            } else {
                newAProject();
            }

        });

        $('#imgUpload').on('change', function () {
            var files = $(this).prop('files');
            addImages(files[0]);
        });

        function newAProject(resImages) {

            var title = $('.admin-input #title').val().trim(),
                engName = $('#engName').val().trim(),
                content = $('#content').val().trim();
            var data = {
                title: title,
                engName: engName,
                content: content,
                image: resImages[0]
            };

            $('.add-submit').attr('disabled', true);
            $.ajax({
                type: 'post', url: '/admin/service_items_instance', data: data,
                success: function (res) {
                    console.log(res);
                    if (res.res_code === 0) {
                        alert("添加成功");
                    }
                    $('.add-submit').removeAttr('disabled');
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

    })
})();