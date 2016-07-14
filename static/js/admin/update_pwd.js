/**
 * Created by Will Bean on 2016/6/1.
 */
(function(){
    $(function(){
        $('.add-submit').click(function(){
            var old_pwd = $('#old_pwd').val().trim(),
                pwd = $('#pwd').val().trim(),
                pwd2 = $('#pwd2').val().trim();

            if( pwd != pwd2){
                return ;
            }
            var data = {
                pwd : $.md5(pwd),
                old_pwd : old_pwd
            };
            $.ajax({
                type: 'get',
                url: '/admin_update_pwd',
                data: data,
                success: function(res){
                    console.log(res);
                    if( res.res_code === 0){
                        alert("修改成功");
                    }
                }
            })
        })
    })
})();