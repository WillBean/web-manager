/**
 * Created by Will Bean on 2016/6/12.
 */
(function () {
    $(function () {
        KindEditor.ready(function(K) {
            window.editor = K.create('#content',{
                uploadJson : '/admin/kindeditor_uploadImg',
                fileManagerJson : '/admin/file_manager_json',
                allowFileManager : true,
                width:"1000px",
                height:"400px",
                filterMode : false
            });
        });

        $('.add-submit').click(function () {
            //var data = $('#imgUpload').prop('file');
            var title = $('.admin-input #title').val().trim();
            if (!title || title == '') {
                $('.admin-input #title').addClass('highlight');
                return;
            }else{
                $('.admin-input #title').removeClass('highlight');
            }
            editor.sync();
            var content = $('#content').val().trim(),
                description = $('#description').val().trim();
            $('.add-submit').attr('disabled', true);
            var data = {
                title : title,
                content : content,
                description: description
            };console.log(data);
            $.ajax({
                type: 'post', url: '/admin/news_instance', data: data,
                // contentType:"application/x-www-form-urlencoded",
                success: function (res) {
                    console.log(res);
                    if (res.res_code == 0) {
                        alert('新建成功')
                    }
                    $('.add-submit').removeAttr('disabled');
                }
            })

        });

    })
})();