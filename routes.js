/**
 * Created by Will Bean on 2016/5/31.
 */
var admin = require('./admin');
var util = require('./util');
var custom = require('./custom');

exports.startRoutes = function(app){
    this.app = app;
    //网站入口
    app.get('/',custom.RenderIndex); 
    app.get('/case:id',custom.RenderCasePage);

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
    app.post('/admin/kindeditor_uploadImg',admin.kindeditorUploadImg);
    app.get('/admin/file_manager_json',admin.FileManagerJson);
    app.get('/admin/get_project_list',admin.ProjectList);
    app.get('/admin/get_project_info',admin.ProjectGetInfo);
    app.get('/admin/project_add',admin.ProjectAdd);
    app.get('/admin/project_delete',admin.ProjectDelete);
    app.get('/admin/project_update',admin.ProjectUpdate);
    app.get('/admin/news_instance',admin.NewsInstance);
    app.post('/admin/news_instance',admin.NewsInstance);
    app.delete('/admin/news_instance',admin.NewsInstance);
    app.post('/admin/service_instance',admin.ServiceInstance);
    app.get('/admin/service_instance',admin.ServiceInstance);
    app.post('/admin/service_items_instance',admin.ServiceItemsInstance);
    app.get('/admin/service_items_instance',admin.ServiceItemsInstance);
    app.delete('/admin/service_items_instance',admin.ServiceItemsInstance);
    
//    用户接口
//     app.get('/user/getProjectWithParams',admin.GetProjectWithParams);
};