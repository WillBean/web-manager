/**
 * Created by JODO070816 on 2016/7/21.
 */
var models = require('./models');
var util = require('./util');
var global = require('./global');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var async = require('async');

//用户操作
exports.RenderIndex = function (req, res) {
    var count = parseInt(req.query.count) || 4;
    var order = req.query.order || 'id desc';
    var res_data = {
        imgList : [],
        projectList : []
    };
    models.Project.findAll({
        order: order,
        limit: count,
        offset: 0
    }).then(function (data) {
        if( !data.length ){
            util.renderTemplate(res, '../views/web/index.html', res_data);
        }
        res_data.projectList = data;
        var c = 0;
        data.forEach(function (pro) {
            models.Image.find({
                where: {
                    projectId: pro.id
                }
            }).then(function(img){
                res_data.imgList.push(img);
                if( ++c == data.length){
                    util.renderTemplate(res, '../views/web/index.html', res_data);
                }
            })
        })
    }).catch(function (e) {
        util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
        throw e
    })
};

exports.RenderCasePage = function (req, res) {
    var id = req.params.id;
    // id存在跳转相应页面    不存在则跳转项目列表页
    var res_data = {
        imgList : [],
        infoList : []
    };
    if( id ){
        async.parallel([function (callback) {
            models.Project.find({
                where:{
                    id : id
                }
            }).then(function (data) {console.log(data)
                res_data.project = data;
                callback(null)
            })
        },function (callback) {
            models.Image.findAll({
                where: {
                    projectId : id
                }
            }).then(function (data) {console.log(data,2)
                res_data.imgList = data;
                callback(null)
            })
        },function (callback) {
            models.ProjectInfo.findAll({
                where: {
                    projectId : id
                }
            }).then(function (data) {console.log(data,3)
                res_data.infoList = data;
                callback(null)
            })
        }],function (err) {
            if(err){
                util.resFail(res, global.NOTLOGIN_ERROR, "请求失败："+err);
                console.error(err)
            }else{
                util.renderTemplate(res,'../views/web/case.html',res_data)
            }
        })

    }else{//项目列表 一张图
        var res_data = {
            imgList : []
        };
        models.Project.findAll({}).then(function (data) {
            res_data.projectList = data;
            var c = 0;
            data.forEach(function (pro) {
                models.Image.find({
                    where: {
                        projectId: pro.id
                    }
                }).then(function(img){
                    res_data.imgList.push(img);
                    if( ++c == data.length){
                        util.renderTemplate(res, '../views/web/projects.html', res_data);
                    }
                })
            })
        }).catch(function (e) {
            util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
            throw e
        })
    }
};

exports.RenderAbout = function(req, res){
    util.renderTemplate(res, '../views/web/about.html');
};

exports.RenderNews = function(req, res){
    var res_data = {
        dateList : []
    };
    models.News.findAll().then(function(data){
        res_data.newsList = data;
        for (var i in data) {
            var dt = new Date(data[i].createdAt);
            res_data.dateList.push(dt.format("yyyy-MM-dd"));
        }
        util.renderTemplate(res, '../views/web/news.html', res_data);
    });
};

exports.RenderNewsItem = function(req, res){
    var id = req.params.id;
    if( id ){
        var res_data = {};
        async.parallel([function(callback){
            models.News.find({where:{id:id}}).then(function(data){
                res_data.news = data;
                var dt = new Date(data.createdAt);
                res_data.date = dt.format("yyyy-MM-dd");
                callback(null);
            });
        },function(callback){
            models.Article.find({where:{id:id}}).then(function(data){
                res_data.article = data;
                callback(null);
            })
        }],function(err){
            if(err){
                util.resFail(res, global.NOTLOGIN_ERROR, "请求失败："+err);
                console.error(err)
            }else {
                console.log(res_data);
                util.renderTemplate(res, '../views/web/newsItem.html', res_data);
            }
        })
    }
};

exports.RenderService = function(req, res){
    var res_data = {};
    async.parallel([function(callback){
        models.Service.find({where:{id:1}}).then(function(data){
            res_data.service = data;
            callback(null);
        })
    },function(callback){
        models.ServiceItems.findAll().then(function(data){
            res_data.serviceList = data;
            var sImages = [];
            var count = 0;
            data.forEach(function(item){
                models.ServiceImages.find({where:{serviceId:item.id}}).then(function(img){
                    console.log(img);
                    sImages.push(img);
                    if(++count == data.length){
                        res_data.serviceImages = sImages;
                        callback(null)
                    }
                })
            });
            callback(null)
        })
    }],function(err){
        if(err){
            util.resFail(res, global.NOTLOGIN_ERROR, "请求失败："+err);
            console.error(err)
        }else {
            //console.log(res_data);
            util.renderTemplate(res, '../views/web/services.html', res_data);
        }
    })
}