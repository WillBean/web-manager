/**
 * Created by Will Bean on 2016/6/1.
 */
$(function(){
    var page = (function(){
        var fn = {
            logout: function(){
                $('#logout').click(function(){
                    if(confirm("确定要退出吗？")){
                        $.ajax({
                            type :'get',
                            url: 'logout',
                            success: function(res){
                                console.log(res);
                                if(res.res_code === 0){
                                    window.location = '/'
                                }
                            }
                        })
                    }
                })
            },
            toggleMenuItem : function(){
                $('.menu-item>h6').click(function(){
                    $(this).parent().find('ul').toggleClass('on');
                })
            },
            renderMainContent : function(){
                $('.menu-item li').click(function(){
                    var url = $(this).attr('data-url');
                    loadIframe('../../templates/'+url+'.html');
                })
            }
        };
        var init = function(){
            fn.logout();
            fn.toggleMenuItem();
            fn.renderMainContent();
        };
        init();
        return {
            fn : fn
        }
    })();
});
function loadIframe(url){
    $('#main iframe').attr('src',url);
}