/**
 * Created by Will Bean on 2016/7/19.
 */
$(function(){
    $.ajax({
        type : 'GET',
        url : '/user/getProjectWithParams',
        data : {
            count : 4,
            order : 'id desc'
        },
        success: function(res){
            console.log(res);
        }
    })
});