/**
 * Created by Will Bean on 2016/5/31.
 */
var admin = require('./admin');

exports.startRoutes = function(app){
    this.app = app;
    app.get('/',admin.AdminIndex);
    app.get('/login',admin.AdminLogin);
    app.get('/logout',admin.AdminLogout);
    app.get('/admin',admin.AdminManage);
    app.get('/get_admin_list',admin.AdminList);
    app.get('/admin_add',admin.AdminAdd);
    app.get('/admin_update_pwd',admin.AdminUpdatePwd);
    app.get('/admin_delete',admin.AdminDelete);
    app.post('/fileUpload_uploadImg',admin.fileUploadUploadImg);
    app.get('/file_manager_json',admin.FileManagerJson);
    app.get('/get_project_list',admin.ProjectList);
    app.get('/get_project_info',admin.ProjectGetInfo);
    app.get('/project_add',admin.ProjectAdd);
    app.get('/project_delete',admin.ProjectDelete);
    app.get('/project_update',admin.ProjectUpdate);
};