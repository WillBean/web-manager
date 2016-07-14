/**
 * Created by Will Bean on 2016/6/1.
 */
exports.PORT = 8081;//端口

exports.REQUEST_SUCCESS = 0;//请求成功
exports.LOGIN_ERROR = 1;//登录出错
exports.NOTLOGIN_ERROR = 2;//未登录
exports.PWD_UPDATE_ERROR = 3;//密码更新出错
exports.ADD_ADMIN_ERROR = 4;//密码更新出错
exports.NO_RIGHT_ERROR = 5;//无权限

//权限等级
exports.HIGHEST_RIGHT = 5;//最高权限
exports.HIGH_RIGHT = 4;
exports.MIDDLE_RIGHT = 3;
exports.LOW_RIGHT = 2;
exports.LOWEST_RIGHT = 1;