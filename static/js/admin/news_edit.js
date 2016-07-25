/**
 * Created by Will Bean on 2016/7/23.
 */
(function () {
    $(function () {
        var id = getSearchObj().id;


        $.getJSON(
             '/admin/news_instance?id='+id,function(res){
                console.log(res);
                if(res.res_code == 0){
                    var data =res.data;
                    $('#title').val(data.news.title);
                    $('#description').val(data.news.description);
                    $('#content').val(data.article.content);
                }

                window.editor = KindEditor.create('#content',{
                    uploadJson : '/admin/kindeditor_uploadImg',
                    fileManagerJson : '/admin/file_manager_json',
                    allowFileManager : true,
                    width:"1000px",
                    height:"400px"
                });
            }
        );

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
                description: description,
                id: id
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