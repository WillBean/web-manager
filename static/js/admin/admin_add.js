/**
 * Created by Will Bean on 2016/6/1.
 */
(function(){
    $(function(){
        $('.add-submit').click(function(){
            var name = $('.admin-input #name').val().trim(),
                pwd = $('#pwd').val().trim(),
                pwd2 = $('#pwd2').val().trim();

            if(!name || name == ''){
                return ;
            }
            if( !pwd || pwd == ''){
                return ;
            }
            if( !pwd2 || pwd2 == ''){
                return ;
            }
            if( pwd != pwd2){
                return ;
            }

            var rights= 5;//-----------------------------------------

            var data = {
                name : name,
                pwd : $.md5(pwd),
                rights : rights
            };
            $.ajax({
                type: 'get',
                url: '/admin_add',
                data: data,
                success: function(res){
                    console.log(res);
                    if( res.res_code === 0){
                        alert("添加成功");
                    }
                }
            })
        })
    })
})();