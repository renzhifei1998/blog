//引用expess框架
const express = require('express');
//引入处理路径模块
const path = require('path');
//引入模块处理post请求参数
const bodyPaser = require('body-parser');
//引入express-session模块
const session = require('express-session');
//导入art-temolate模板引擎
const template = require('art-template')
//导入dataFormat模块
const dateFormat = require('dateformat');
//导入morgan这个第三方模块
const morgan = require('morgan')
//导入config模块
const config = require('config')
//创建网站服务器
const app = express();
//连接数据库
require('./model/connect');
//处理post请求参数
app.use(bodyPaser.urlencoded({ extended: true }))
//配置session
app.use(session({
    secret: 'secret key',
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))

//告诉express框架模板所在位置
app.set('views', path.join(__dirname, 'views'));
//告诉express框架模板的默认后缀是什么
app.set('view engine', 'art');
//当渲染后缀为art的模板时，所使用的模板引擎是什么
app.engine('art', require('express-art-template'));
//向模板内导入dateFormate变量
template.defaults.imports.dateFormat = dateFormat;

//开放静态资源文件
app.use(express.static(path.join(__dirname, 'public')))

console.log(config.get('title'))

//获取系统环境变量 返回值是对象
if (process.env.NODE_ENV == 'development') {
    console.log('开发环境')
    app.use(morgan('dev'))
} else {
    console.log('生产环境')
}

//引入路由模块
const admin = require('./route/admin');
const home = require('./route/home');

//拦截请求 判断用户登陆状态
app.use('/admin', require('./middleware/loginGuard'));

//为路由匹配请求路径
app.use('/home', home);
app.use('/admin', admin);

app.use((err, req, res, next) => {
    // 将字符串对象转换为对象类型
    // JSON.parse() 
    const result = JSON.parse(err);
    // {path: '/admin/user-edit', message: '密码比对失败,不能进行用户信息的修改', id: id}
    let params = [];
    for (let attr in result) {
        if (attr != 'path') {
            params.push(attr + '=' + result[attr]);
        }
    }
    res.redirect(`${result.path}?${params.join('&')}`);
})

//监听端口
app.listen(80);
console.log('网站服务器启动成功，请访问localhost')