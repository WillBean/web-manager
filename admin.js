/**
 * Created by Will Bean on 2016/5/31.
 */
var models = require('./models');
var util = require('./util');
var global = require('./global');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var async = require('async');


exports.AdminIndex = function (req, res) {//渲染登录界面
    util.renderTemplate(res, 'index.html');
};

exports.AdminLogin = function (req, res) {//管理员登录
    var name = req.query.name,
        pwd = req.query.pwd;

    if (!name || name == '') {
        util.resFail(res, global.LOGIN_ERROR, '用户名不能为空');
        return;
    }
    if (!pwd || pwd == '') {
        util.resFail(res, global.LOGIN_ERROR, '密码不能为空');
        return;
    }

    models.Admin.find({
        where: {
            name: name,
            pwd: pwd
        }
    }).then(function (data) {
        if (data) {
            req.session.sess_admin = {
                id: data.id,
                name: name,
                pwd: pwd,
                rights: data.rights,
                add_time: data.createdAt
            };
            util.resSuccess(res, '成功登录', null);
        } else {
            util.resFail(res, global.LOGIN_ERROR, '用户名或密码错误');
        }
    }).catch(function (e) {
        util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
        throw e
    })
};

exports.AdminManage = function (req, res) {//渲染admin.html
    if (!req.session.sess_admin) {
        res.redirect('/');
        return;
    }
    var res_data = {
        //系统版本号之类
        name: req.session.sess_admin.name
    };
    util.renderTemplate(res, 'admin.html', res_data);
};

exports.AdminLogout = function (req, res) {//退出登录
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    req.session.sess_admin = null;
    util.resSuccess(res, "成功退出登录");
};

exports.AdminUpdatePwd = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    var pwd = req.query.pwd,//密码确认在前端进行
        old_pwd = req.query.old_pwd;
    if (!pwd || pwd == '') {
        util.resFail(res, global.PWD_UPDATE_ERROR, "密码不能为空");
        return;
    }
    if (!old_pwd || old_pwd == '') {
        util.resFail(res, global.PWD_UPDATE_ERROR, "原密码不能为空");
        return;
    }
    models.Admin.count({
        where: {
            name: req.session.sess_admin.name,
            pwd: req.session.sess_admin.pwd
        }
    }).then(function (num) {
        if (num > 0) {
            models.Admin.update(
                {pwd: pwd},
                {
                    where: {
                        name: req.session.sess_admin.name
                    }
                }
            ).then(function () {
                util.resSuccess(res, "更改密码成功");
            })
        } else {
            util.resFail(res, global.PWD_UPDATE_ERROR, "原密码错误");
        }
    }).catch(function (e) {
        util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
        throw e
    })
};

exports.AdminUpdateRight = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    if (req.session.sess_admin.rights != global.HIGHEST_RIGHT)
        return; //只有最高权限的账号才可以添加
    var rights = req.query.rights,
        name = req.query.name;
    models.Admin.update(
        {
            where: {
                name: name
            }
        },
        {rights: rights}
    ).then(function () {
        util.resSuccess(res, "更改权限成功");
    }).catch(function (e) {
        util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
        throw e
    })
};

exports.AdminAdd = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    var name = req.query.name,
        pwd = req.query.pwd,
        rights = req.query.rights;
    if (!name || name == '') {
        util.resFail(res, global.LOGIN_ERROR, "用户名不能为空")
    }
    if (!pwd || pwd == '') {
        util.resFail(res, global.LOGIN_ERROR, "密码不能为空")
    }
    if (!rights) {
        util.resFail(res, global.LOGIN_ERROR, "权限不能为空")
    }

    models.Admin.count({
        where: {
            name: name
        }
    }).then(function (num) {
        if (num > 0) {
            util.resFail(res, global.ADD_ADMIN_ERROR, "该账号已存在")
        } else {
            var data = {
                name: name,
                pwd: pwd,
                rights: rights
            };
            models.Admin.create(data).then(function () {
                util.resSuccess(res, "添加管理员成功");
            })
        }
    }).catch(function (e) {
        util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
        throw e
    })
};

exports.AdminDelete = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    var id = req.query.id;
    models.Admin.find({
        where: {
            id: id
        }
    }).then(function (data) {
        if (data) {
            if (req.session.sess_admin.rights != global.HIGHEST_RIGHT) {
                util.resFail(res, global.NO_RIGHT_ERROR, "无权限操作");
            }
            if (req.session.sess_admin.id == data.id) {
                util.resFail(res, global.NO_RIGHT_ERROR, "不能删除当前用户");
            } else {
                models.Admin.destroy({
                    where: {
                        id: id
                    }
                }).then(function () {//-----------------
                    util.resSuccess(res, "删除成功");
                })
            }
        }
    }).catch(function (e) {
        util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
        throw e
    })
};

exports.AdminList = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    models.Admin.findAll({
        order: "id desc"
    }).then(function (data) {
        var create_time = [],
            update_time = [];
        for (var i in data) {
            var dt = new Date(data[i].createdAt);
            create_time.push(dt.format("yyyy-MM-dd hh:mm:ss"));
            dt = new Date(data[i].updatedAt);
            update_time.push(dt.format("yyyy-MM-dd hh:mm:ss"));
        }

        var res_data = {
            list: data,
            c_time: create_time,
            u_time: update_time
        };

        util.resSuccess(res, "请求成功", res_data);
    }).catch(function (e) {
        util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
        throw e
    })
};

exports.kindeditorUploadImg = function (req, res) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + '/./static/uploads';
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }
        var image = files.imgFile;
        var path = image.path;
        console.log(path)
        path = path.replace(/\\/g, '/');
        var url = path.substr(path.lastIndexOf('uploads'), path.length);
        var info = {
            "error": 0,
            "url": url
        };
        if (image.type.indexOf('image') < 0) {
            info.error = 1;
            info.message = "TYPE ERROR"
        }
        res.send(info);
    });
};

exports.fileUploadUploadImg = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    var resImgages = [];
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + '/./static/uploads';
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }
        console.log(files);
        for (var img in files) {
            var image = files[img];
            console.log(image)

            var path = image.path;
            path = path.replace(/\\/g, '/');
            var url = path.substr(path.lastIndexOf('uploads'), path.length);

            var info = {
                "error": 0,
                "url": url,
                "name": image.name,
                "size": (image.size / 1024).toFixed(2) + "KB"
            };
            if (image.type.indexOf('image') < 0) {
                info.error = 1;
                info.message = "TYPE ERROR";
                util.resFail(res, global.NOTLOGIN_ERROR, "类型错误", info);
                return;
            }
            resImgages.push(info);
        }


        res.send(resImgages);
    });
};

exports.FileManagerJson = function (req, res) {
    var root_path = './static/uploads/',//__dirname + '/static/uploads',//根目录路径 +
        root_url = './static/uploads/';//__dirname + '/static/uploads';//根目录URL
    var ext_arr = ['gif', 'jpg', 'jpeg', 'png', 'bmp'];//图片扩展名
    var dir_name = req.query.dir ? '' : req.query.dir.trim();//目录名
    if (!['', 'image', 'flash', 'media', 'file'].contains(dir_name)) {
        res.end('Invalid Directory name.')
    }
    //排序形式，name or size or type
    var order = req.query.order ? req.query.order.toLowerCase() : 'name';
    fs.exists(root_path, function (exists) {
        if (exists) {//根据path参数，设置各路径和URL
            if (dir_name !== '') {
                root_path += dir_name + "/";
                root_url += dir_name + "/";
            }
            var current_path, current_url, current_dir_path, moveup_dir_path;
            var qpath = req.query.path;
            if (!qpath || qpath == '') {
                current_path = path.resolve(root_path) + '/';//绝对路径
                current_url = root_url;
                current_dir_path = '';
                moveup_dir_path = '';
            } else {
                current_path = path.resolve(root_path) + '/' + qpath;
                current_url = root_url + qpath;
                current_dir_path = qpath;
                moveup_dir_path = current_dir_path.replace(/(.*?)[^\/]+\/$/, '$1');
            }

            //不允许使用..移动到上一级目录
            if (current_path.match(/\.\./)) {
                //echo 'Access is not allowed.';
                //exit;
            }
            //最后一个字符不是/
            if (!current_path.match(/\/$/)) {
                //echo 'Parameter is not valid.';
                //exit;
            }
            //目录不存在或不是目录
            //if (!file_exists(current_path) || !is_dir(current_path)) {
            //echo 'Directory does not exist.';
            //exit;
            //}
            //遍历目录取得文件信息
            var file_list = [];
            var count = 0;
            fs.readdir(current_path, function (err, files) {
                if (err) {
                    console.error(err);
                    return;
                }
                files.forEach(function (file, i) {
                    var filePath = path.normalize(current_path + file);
                    fs.stat(filePath, function (err, stat) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            if (stat.isDirectory()) {
                                file_list[i] = {};
                                file_list[i]['is_dir'] = true; //是否文件夹
                                file_list[i]['has_file'] = (stat.dev > 2); //文件夹是否包含文件
                                file_list[i]['filesize'] = 0; //文件大小
                                file_list[i]['is_photo'] = false; //是否图片
                                file_list[i]['filetype'] = ''; //文件类别，用扩展名判断
                            } else {
                                file_list[i] = {};
                                var $file_ext = file.substr(file.lastIndexOf('.') + 1, file.length).toLowerCase();
                                file_list[i]['is_dir'] = false;
                                file_list[i]['has_file'] = false;
                                file_list[i]['filesize'] = stat.size;
                                file_list[i]['dir_path'] = '';

                                file_list[i]['is_photo'] = ext_arr.contains($file_ext);
                                file_list[i]['filetype'] = $file_ext;
                            }
                        }
                        file_list[i]['filename'] = file; //文件名，包含扩展名
                        file_list[i]['datetime'] = (new Date(stat.mtime)).format('yyyy-MM-dd hh:mm:ss'); //文件最后修改时间
                        //console.log(file_list[i]);

                        if (files.length == ++count) {
                            count = 0;
                            file_list.sort(cmp_func);
                            //console.log(file_list);
                            var result = {};
                            //相对于根目录的上一级目录
                            result['moveup_dir_path'] = moveup_dir_path;
                            //相对于根目录的当前目录
                            result['current_dir_path'] = current_dir_path;
                            //当前目录的URL
                            result['current_url'] = current_url;
                            //文件数
                            result['total_count'] = file_list.length;
                            //文件列表数组
                            result['file_list'] = file_list;

                            res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                            res.json(result);
                            res.end();
                        }
                    })
                });

            });

        } else {
            console.log(root_path + ' not exists.')
        }
    });
    function cmp_func($a, $b) {
        if ($a['is_dir'] && !$b['is_dir']) {
            return -1;
        } else if (!$a['is_dir'] && $b['is_dir']) {
            return 1;
        } else {
            if (order == 'size') {
                if ($a['filesize'] > $b['filesize']) {
                    return 1;
                } else if ($a['filesize'] < $b['filesize']) {
                    return -1;
                } else {
                    return 0;
                }
            } else if (order == 'type') {
                return $a['filetype'].localeCompare($b['filetype']);
            } else {
                return $a['filename'].localeCompare($b['filename']);
            }
        }
    }
};

exports.ProjectAdd = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    var query = req.query;
    if (!query.cnName || query.cnName == '') {
        util.resFail(res, global.LOGIN_ERROR, "项目名不能为空");
    }

    models.Project.create({
        cnName: query.cnName,
        engName: query.engName,
        title: query.title,
        introduction: query.introduction,
        description: query.description
    }).then(function (data) {

        async.parallel([
            function (callback) {
                var count = 0;
                if (query.infoList && query.infoList.length > 0) {
                    query.infoList.forEach(function (info) {
                        models.ProjectInfo.create({
                            title: info.title,
                            content: info.content,
                            projectId: data.id,
                            index: info.index
                        }).then(function () {
                            if (++count == query.infoList.length) {
                                callback(null);
                            }
                        })
                    })
                } else {
                    callback(null);
                }
            },
            function (callback) {
                if (query.imgList && query.imgList.length > 0) {
                    var count = 0;
                    query.imgList.forEach(function (img) {
                        models.Image.create({
                            name: img.name,
                            url: img.url,
                            projectId: data.id,
                            size: img.size
                        }).then(function () {
                            if (++count == query.imgList.length) {
                                callback(null);
                            }
                        })
                    })
                } else {
                    callback(null);
                }
            }
        ], function (err) {
            if (err) {
                util.resFail(res, global.NOTLOGIN_ERROR, "新建项目出错：" + err);
            } else {
                util.resSuccess(res, "新建项目成功", data.id);
            }
        })


    })
};

exports.ProjectDelete = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    var id = req.query.id;

    models.Project.destroy({
        where: {
            id: id
        }
    }).then(function () {
        util.resSuccess(res, "删除项目成功");
    }).catch(function (err) {
        util.resFail(res, global.NOTLOGIN_ERROR, "删除项目出错：" + err);
    })
};

exports.ProjectUpdate = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    var query = req.query;
    if (!query.cnName || query.cnName == '') {
        util.resFail(res, global.LOGIN_ERROR, "项目名不能为空");
        return;
    }
    async.parallel([
        function (callback) {
            models.Project.update({
                cnName: query.cnName,
                engName: query.engName,
                title: query.title,
                introduction: query.introduction,
                description: query.description
            }, {
                where: {id: query.id}
            }).then(function () {
                callback(null);
            })
        }, function (callback) {
            if (query.infoList && query.infoList.length > 0) {
                var count = 0;
                query.infoList.forEach(function (info) {
                    if (info.id) {
                        models.ProjectInfo.update({
                            title: info.title,
                            content: info.content,
                            index: info.index
                        }, {
                            where: {id: info.id}
                        }).then(function () {
                            if (++count == query.infoList.length) {
                                callback(null);
                            }
                        })
                    } else {
                        models.ProjectInfo.create({
                            title: info.title,
                            content: info.content,
                            index: info.index,
                            projectId: query.id
                        }).then(function () {
                            if (++count == query.infoList.length) {
                                callback(null);
                            }
                        })
                    }

                });
            } else {
                callback(null);
            }
        }, function (callback) {
            if (query.delList && query.delList.length > 0) {
                var count = 0;
                query.delList.forEach(function (id) {
                    models.ProjectInfo.destroy({where: {id: id}}).then(function () {
                        if (++count == query.delList.length) {
                            callback(null);
                        }
                    })
                })
            } else {
                callback(null);
            }
        }, function (callback) {
            console.log(query)
            if (query.delImgList && query.delImgList.length > 0) {
                var count = 0;
                query.delImgList.forEach(function (id) {
                    models.Image.destroy({where: {id: id}}).then(function () {
                        if (++count == query.delImgList.length) {
                            callback(null);
                        }
                    })
                })
            } else {
                callback(null);
            }
        }, function (callback) {
            if (query.addImgList && query.addImgList.length > 0) {
                var count = 0;
                query.addImgList.forEach(function (img) {
                    models.Image.create({
                        name: img.name,
                        url: img.url,
                        projectId: query.id,
                        size: img.size
                    }).then(function () {
                        if (++count == query.addImgList.length) {
                            callback(null);
                        }
                    })
                })
            } else {
                callback(null);
            }
        }
    ], function (err) {
        if (err) {
            util.resFail(res, global.LOGIN_ERROR, "项目更新出错");
        } else {
            util.resSuccess(res, "更新成功");
        }
    });

};

exports.ProjectList = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }

    models.Project.findAll({
        order: "id desc"
    }).then(function (data) {
        var create_time = [],
            update_time = [];
        for (var i in data) {
            var dt = new Date(data[i].createdAt);
            create_time.push(dt.format("yyyy-MM-dd hh:mm:ss"));
            dt = new Date(data[i].updatedAt);
            update_time.push(dt.format("yyyy-MM-dd hh:mm:ss"));
        }

        var res_data = {
            list: data,
            c_time: create_time,
            u_time: update_time
        };

        util.resSuccess(res, "请求成功", res_data);
    })
};

exports.ProjectGetInfo = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    var id = req.query.id;
    var rdata = {};
    async.parallel([function (callback) {
        models.Project.find({where: {id: id}}).then(function (pData) {
            Object.assign(rdata, pData.dataValues);
            models.ProjectInfo.findAll({
                where: {projectId: id}
            }).then(function (data) {
                rdata.InfoList = data;
                callback(null);
            })
        });
    }, function (callback) {
        models.Image.findAll({where: {projectId: id}}).then(function (data) {
            rdata.imagesList = data;
            callback(null);
        })
    }], function (err) {
        if (err) {
            util.resFail(res, global.LOGIN_ERROR, "项目信息获取出错");
        } else {
            util.resSuccess(res, "请求成功", rdata);
        }
    })
};

exports.NewsInstance = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    if (req.method == 'POST') {//create or update
        var body = req.body;
        if (body.id) {//update
            async.parallel([function (callback) {
                models.News.update({
                    where: {
                        id: body.id
                    }
                }, {
                    title: body.title,
                    description: body.description
                }).then(function () {
                    callback(null)
                })
            }, function (callback) {
                models.Article.update({
                    where: {newsId: body.id}
                }, {
                    content: body.content
                }).then(function () {
                    callback(null);
                })
            }], function (err) {
                if (err) {
                    console.error(err);
                } else {
                    util.resSuccess(res, "新聞更新成功");
                }
            })
        } else { //create
            models.News.create({
                title: body.title,
                description: body.description
            }).then(function (data) {
                models.Article.create({
                    content: body.content,
                    newsId: data.id
                }).then(function () {
                    util.resSuccess(res, "新聞創建成功");
                })
            }).catch(function (err) {
                util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + err);
                throw err
            })
        }
    } else if (req.method == 'GET') {
        var query = req.query;
        if (query.id) { //獲取指定新聞
            var res_data = {};
            async.parallel([function (callback) {
                models.News.find({where: {id: query.id}}).then(function (data) {
                    res_data.news = data;
                    callback(null)
                })
            }, function (callback) {
                models.Article.find({where: {newsId: query.id}}).then(function (data) {
                    res_data.article = data;
                    callback(null)
                })
            }], function (err) {
                if (err) {
                    console.error(err)
                } else {
                    util.resSuccess(res, "新聞獲取成功", res_data);
                }
            })
        } else { //獲取新聞列表
            models.News.findAll({
                order: "id desc"
            }).then(function (data) {
                var create_time = [],
                    update_time = [];
                for (var i in data) {
                    var dt = new Date(data[i].createdAt);
                    create_time.push(dt.format("yyyy-MM-dd hh:mm:ss"));
                    dt = new Date(data[i].updatedAt);
                    update_time.push(dt.format("yyyy-MM-dd hh:mm:ss"));
                }

                var res_data = {
                    list: data,
                    c_time: create_time,
                    u_time: update_time
                };
                util.resSuccess(res, "新聞列表獲取成功", res_data);
            })
        }
    } else if (req.method == 'DELETE') {//新聞刪除
        models.News.destroy({where: {id: req.query.id}}).then(function () {
            util.resSuccess(res, "新聞刪除成功");
        })
    }
};

exports.ServiceInstance = function (req, res) {//Service 對象唯一，不可刪除，不可增加
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    var body = req.body;
    console.log(body);
    if (req.method == "POST") {//更新
        var data = {
            description: body.description
        };
        if (body.image) {
            data.name = body.image.name;
            data.url = body.image.url;
            data.size = body.image.size
        }
        models.Service.update(data, {
            where: {id: 1}
        }).then(function () {
            util.resSuccess(res, "服務更新成功");
        }).catch(function (e) {
            util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
            throw e
        })

    } else if (req.method == 'GET') {
        var res_data = {};
        models.Service.find({where: {id: 1}}).then(function (data) {
            //res_data.service = data;
            util.resSuccess(res, "服務獲取成功", data);
        }).catch(function (e) {
            util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
            throw e
        })
    }
};

exports.ServiceItemsInstance = function (req, res) {
    if (!req.session.sess_admin) {
        util.resFail(res, global.NOTLOGIN_ERROR, "尚未登录");
        return;
    }
    if (req.method == "POST") {
        var body = req.body;
        if (body.id) {//更新
            async.parallel([function (callback) {
                models.ServiceItems.update({
                    where: {id: body.id}
                }, {
                    title: body.title,
                    engName: body.engName,
                    content: body.content
                }).then(function () {
                    callback(null)
                })
            }, function (callback) {
                var img = body.image;
                if (img) {
                    models.ServiceImages.update({where: {serviceId: body.id}}, {
                        name: img.name,
                        url: img.url,
                        size: img.size
                    }).then(function () {
                        callback(null);
                    })
                } else {
                    callback(null);
                }
            }], function (err) {
                if (err) {
                    util.resFail(res, global.LOGIN_ERROR, "服務項目創建出错:" + err);
                } else {
                    util.resSuccess(res, "服務項目創建成功");
                }
            })
        } else {//創建
            models.ServiceItems.create({
                title: body.title,
                engName: body.engName,
                content: body.content
            }).then(function (data) {
                var img = body.image;
                models.ServiceImages.create({
                    serviceId: data.id,
                    name: img.name,
                    url: img.url,
                    size: img.size
                }).then(function () {
                    util.resSuccess(res, "服務項目創建成功");
                })
            }).catch(function (e) {
                util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + e);
                throw e
            })
        }
    } else if (req.method == "GET") {
        var query = req.query;
        if (query.id) {//獲取指定服務項目
            var res_data = {};
            async.parallel([function (callback) {
                models.ServiceItems.find({where: {id: query.id}}).then(function (data) {
                    res_data.service = data;
                    callback(null)
                })
            }, function (callback) {
                models.ServiceImages.find({where: {serviceId: query.id}}).then(function (data) {
                    res_data.image = data;
                    callback(null)
                })
            }], function (err) {
                if (err) {
                    util.resFail(res, global.NOTLOGIN_ERROR, "請求出錯：" + err);
                    console.error(err)
                } else {
                    util.resSuccess(res, "服務項目獲取成功", res_data);
                }
            })
        } else {//獲取服務項目列表
            models.ServiceItems.findAll({
                order: 'id desc'
            }).then(function (data) {
                var create_time = [],
                    update_time = [];
                for (var i in data) {
                    var dt = new Date(data[i].createdAt);
                    create_time.push(dt.format("yyyy-MM-dd hh:mm:ss"));
                    dt = new Date(data[i].updatedAt);
                    update_time.push(dt.format("yyyy-MM-dd hh:mm:ss"));
                }

                var res_data = {
                    list: data,
                    c_time: create_time,
                    u_time: update_time
                };
                util.resSuccess(res, "服務項目列表獲取成功", res_data);
            })
        }
    } else if (req.method == "DELETE") {//服務項目刪除
        models.ServiceItems.destroy({where: {id: query.id}}).then(function () {
            util.resSuccess(res, "服務項目刪除成功");
        })
    }
};
//登录操作记录？

