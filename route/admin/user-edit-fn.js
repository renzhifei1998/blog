

const { User, validateUser } = require('../../model/user');

const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {

    try {
        await validateUser(req.body)
    } catch (e) {
        // e.message
        //return res.redirect(`/admin/user-edit?message=${e.message}`)
        //JSON.stringify()将对象数据转换为字符串
        return next(JSON.stringify({ path: '/admin/user-edit', message: e.message }))
    }

    //根据邮箱地址查询邮箱是否存在
    // res.send(req.body)
    let user = await User.findOne({ email: req.body.email });

    if (user) {
        //return res.redirect(`/admin/user-edit?message=该邮箱已经注册`)
        return next(JSON.stringify({path:'/admin/user-edit',message:'邮箱已经注册'}))
    }

    //加密 生成随机字符串
    const salt = await bcrypt.genSalt(10);
    //加密
    const password = await bcrypt.hash(req.body.password, salt);
    //替换密码
    req.body.password = password;
    //添加到数据库
    await User.create(req.body);
    //将页面重定向到列表页面
    res.redirect('/admin/user');
}