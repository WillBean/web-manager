/**
 * Created by Will Bean on 2016/5/31.
 */
var admin = require('./admin');
var util = require('./util');

exports.startRoutes = function(app){
    this.app = app;
    //网站入口
    app.get('/',function(req, res){
        util.renderTemplate(res, '../web/index.html');
    });

    //管理程序
    app.get('/admin',admin.AdminIndex);
    app.get('/admin/login',admin.AdminLogin);
    app.get('/admin/logout',admin.AdminLogout);
    app.get('/admin/admin',admin.AdminManage);
    app.get('/admin/get_admin_list',admin.AdminList);
    app.get('/admin/admin_add',admin.AdminAdd);
    app.get('/admin/admin_update_pwd',admin.AdminUpdatePwd);
    app.get('/admin/admin_delete',admin.AdminDelete);
    app.post('/admin/fileUpload_uploadImg',admin.fileUploadUploadImg);
    app.get('/admin/file_manager_json',admin.FileManagerJson);
    app.get('/admin/get_project_list',admin.ProjectList);
    app.get('/admin/get_project_info',admin.ProjectGetInfo);
    app.get('/admin/project_add',admin.ProjectAdd);
    app.get('/admin/project_delete',admin.ProjectDelete);
    app.get('/admin/project_update',admin.ProjectUpdate);

//    用户接口
    app.get('/user/getProjectWithParams',admin.GetProjectWithParams);
};