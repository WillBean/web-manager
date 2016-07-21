/**
 * Created by Will Bean on 2016/5/31.
 */
var Sequelize = require('sequelize');

var sequelize = new Sequelize(
    'db',
    'root',
    'root',
    {
        'dialect' : 'mysql',
        'host' : 'localhost',
        'port' : '3306',
        dialectOptions: {
            charset: 'utf8'
        }
    }
);

exports.Admin = sequelize.define(
    "Admin",
    {
        name: {
            'type' : Sequelize.STRING,
            'allowNull': false,
            'unique': true
        },
        pwd: {
            'type' : Sequelize.STRING,
            'allowNull': false
        },
        rights: {
            'type' : Sequelize.INTEGER,
            'allowNull': false
        }
    },
    {
        tableName: 'wb_admin',
        timestamps: true,
        createAt: 'add_time',
        updateAt: 'update_time',
        deleteAt:false
    }
);

exports.Project = sequelize.define(
    'Project',
    {
        cnName : {
            'type' : Sequelize.STRING,
            'allowNull': false
        },
        engName : {
            'type' : Sequelize.STRING
        },
        title : {
            'type' : Sequelize.STRING
        },
        introduction :{
            'type' : Sequelize.STRING
        },
        description:{
            'type' : Sequelize.STRING
        }
    },
    {
        tableName: 'wb_project',
        timestamps: true,
        deleteAt:false
    }
);

exports.ProjectInfo = sequelize.define(
    "ProjectInfo",{
    title : Sequelize.STRING,
    content : Sequelize.STRING,
    projectId : Sequelize.INTEGER,
    index : Sequelize.INTEGER
    },
    {
        tableName: 'wb_projectInfo',
        timestamps: true,
        deleteAt:false
    }
);

exports.Image = sequelize.define(
    "Image",
    {
        projectId : {
            type: Sequelize.INTEGER,
            'allowNull': false
        },
        url:{
            'type' : Sequelize.STRING,
            'allowNull': false
        },
        name:{
            type: Sequelize.STRING,
            'allowNull': false
        },
        size:{
            type: Sequelize.STRING,
            'allowNull': false
        }
    },
    {
        tableName: 'wb_image',
        timestamps: true,
        deleteAt:false
    }
);

this.Project.hasMany(this.ProjectInfo,{
    foreignKey : 'projectId'
});
this.Project.hasMany(this.Image,{
    foreignKey : 'projectId'
});
this.ProjectInfo.belongsTo(this.Project,{
    foreignKey : 'projectId'
});
this.Image.belongsTo(this.Project,{
    foreignKey : 'projectId'
});

//sequelize.sync().then(function(){
//    console.log('success');
//});

// var _this = this;
// sequelize.sync({force: true}).then(function(){
//    console.log('success');
//
//    _this.Admin.create({
//        name : 'admin',
//        pwd : '21232f297a57a5a743894a0e4a801fc3',
//        rights : 5
//    }).then(function () {
//        console.log('create success')
//    })
// });
