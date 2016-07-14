/**
 * Created by Will Bean on 2016/5/31.
 */
var global = require('./global');
Date.prototype.format = function(format) {

    var o = {
        "M+" : this.getMonth() + 1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

Array.prototype.contains = function(item){
    return RegExp("\\b"+item+"\\b").test(this);
};

exports.renderTemplate = function(response, templates, res_data){
    if(!res_data)
        res_data = null;
    var response_data = {

    };
    if(res_data !=null){
        response_data.res_data = res_data;
    }
    response.render(templates, response_data);
};

const resFunc = function(res, res_code, desc, data){
    var res_data = {
        res_code : res_code,
        desc : desc
    };
    if(data){
        res_data.data = data
    }
    res.json(res_data);
    res.end();
};

exports.resSuccess = function(res, desc, data){
    if(!data)
        data = null;
    resFunc(res, global.REQUEST_SUCCESS, desc, data);
};

exports.resFail = function(res, res_code, desc, data){
    if(!data)
        data = null;
    resFunc(res, res_code, desc, data);
};