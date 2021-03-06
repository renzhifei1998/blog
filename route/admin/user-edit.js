const { User } = require('../../model/user')
module.exports = async (req, res) => {

    //标识 标识当前访问的是用户管理页面
    req.app.locals.currentLink = 'user';

    const { message, id } = req.query;
    //如果当前传递了id为修改操作，否则为添加操作
    if (id) {
        let user = await User.findOne({ _id: id });
        //渲染用户编辑页面(修改)
        res.render('admin/user-edit', {
            message: message,
            user: user,
            link: '/admin/user-modify?id=' + id,
            button: '修改'
        });

    } else {
        res.render('admin/user-edit', {
            message: message,
            link: '/admin/user-edit',
            button: '添加'
        });
    }

}