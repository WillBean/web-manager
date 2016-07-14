/**
 * Created by Will Bean on 2016/5/31.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var routes = require('./routes');
var global = require('./global');

var app = new express();
app.engine('html',ejs.renderFile);

app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.use(express.static(__dirname+'/static'));
app.use('/static', express.static(__dirname+'/static'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extend : false}));
app.use(bodyParser.json());

app.use(session({
    keys : ["wbweb"]
}));

routes.startRoutes(app);

app.on('close',function(err){
    if (!err){
        console.log("实例已关闭~");
    }
});

var server = app.listen(global.PORT,function(){
    console.log("实例正在运行~");
});