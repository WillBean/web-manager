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
        imgList : []
    };
    models.Project.findAll({
        order: order,
        limit: count,
        offset: 0
    }).then(function (data) {
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
            }).then(function (data) {
                res_data.project = data;
                callback(null)
            })
        },function (callback) {
            models.Image.findAll({
                where: {
                    projectId : id
                }
            }).then(function (data) {
                res_data.imgList = data;
                callback(null)
            })
        },function (callback) {
            models.ProjectInfo.findAll({
                where: {
                    projectId : id
                }
            }).then(function (data) {
                res_data.infoList = data;
                callback(null)
            })
        }],function (err) {
            if(err){
                console.error(err)
            }else{
                util.renderTemplate(res,'../views/web/case/case.html',res_data)
            }
        })

    }
}