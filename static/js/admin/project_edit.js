/**
 * Created by Will Bean on 2016/6/13.
 */
(function() {
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

    function addInfoInputArea(){
        var ul = $('.info-container ul');
        var li = "<li>";
        li += "<input type='text' class='info info_title' placeholder='小标题'>";
        li += "<input type='text' class='info info_content' placeholder='内容'>";
        li += "<input type='text' class='info info_index' placeholder='顺序'>";
        li += "</li>";
        ul.append(li);
    }

    function fillInputText(data,id){
        $('#cnName').val(data.cnName);
        $('#engName').val(data.engName);
        $('#title').val(data.title);
        $('#introduction').val(data.introduction);
        $('#description').val(data.description);

        var ul =  $('.info-container ul'),
            infoList = data.InfoList;
        for(var i = 0; i < infoList.length; i++ ){
            var li = "<li>";
            li += "<input type='text' class='info info_title' value='"+ infoList[i].title +"'>";
            li += "<input type='text' class='info info_content' value='"+ infoList[i].content +"'>";
            li += "<input type='text' class='info info_index' value='"+ infoList[i].index +"'>";
            li += "<a href='javascript:void(0)' class='del_btn' id='del_btn_"+ infoList[i].id +"'>-</a>";
            li += "</li>";
            ul.append(li);
        }

        var delIdList = [];
        $('.add_info').click(function(){
            var lists = $('.info-container ul').find('li');
            if(lists.length > 0 ){
                var infoInput = $('.info');
                var flag = true;
                for(var i = 0; i < infoInput.length; i++){
                    if( infoInput.eq(0).val().trim() == ''){
                        flag = false;
                        infoInput.eq(0).focus();
                        break;
                    }
                }
                if(flag){
                    addInfoInputArea();
                }
            }else {
                addInfoInputArea();
            }
        });

        $('.del_btn').click(function(){
            if(confirm("确定删除吗？")){
                var DId = $(this).attr('id').substr(8);
                $(this).parent().remove();
                delIdList.push(DId);
            }
        });

        $('.submit_btn').click(function(){
            var cnName = $('.admin-input #cnName').val().trim(),
                engName = $('#engName').val().trim(),
                title = $('#title').val().trim(),
                introduction = $('#introduction').val().trim(),
                description = $('#description').val().trim();

            if(!cnName || cnName == ''){
                return ;
            }
            var infoList = [];
            var lists = $('.info-container ul').find('li');
            var flag = true;
            for(var i = 0; i < lists.length; i++){
                var list = lists.eq(i);
                var index = list.find('.info_index');
                var reg = new RegExp("^[0-9]*$");
                if(!reg.test(index.val())){
                    index.focus();
                    flag = false;
                    break
                }
                infoList[i] = {
                    id : list.find('.del_btn').attr('id').substr(8),
                    title : list.find('.info_title').val().trim(),
                    content : list.find('.info_content').val().trim(),
                    index : list.find('.info_index').val().trim()
                };
            }
            if(!flag){
                return;
            }

            var data = {
                cnName : cnName,
                engName : engName,
                introduction : introduction,
                description : description,
                title : title,
                infoList : infoList.length ? infoList : "",
                delList : delIdList.length ? delIdList : ""
            };
            if(flag){
                $(this).attr('disabled',true);
                $.ajax({type: 'get', url: '/project_update?id='+id, data: data,
                    success: function(res){
                        console.log(res);
                        if( res.res_code === 0){
                            alert("添加成功");
                        }
                        $(this).attr('disabled',false);
                    }
                })
            }
        })
    }
    $(function () {
        var id = getSearchObj().id;

        $.getJSON('/get_project_info?id='+id+"&random="+Math.random(),function(data){
            fillInputText(data.data,id);
        });

    });
})();
