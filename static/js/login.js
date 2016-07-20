/**
 * Created by Will Bean on 2016/5/31.
 */
$(function(){
    var submitBtn = $('input[type=submit]'),
        nameInput = $('input[type=text]'),
        pwdInput = $('input[type=password]');

    submitBtn.click(function(){
        var name = nameInput.val().trim(),
            pwd = pwdInput.val().trim();
        if(!name || !pwd)
            return ;
        var data = {
            name : name,
            pwd : $.md5(pwd)
        };console.log(data.pwd)
        $.ajax({
            type :'get',
            url: '/admin/login',
            data: data,
            success: function(res){
                console.log(res);
                if(res.res_code === 0){
                    window.location = '/admin/admin'
                }
            }
        })
    })
});