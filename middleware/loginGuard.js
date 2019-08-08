const guard = (req, res, next) => {
    //判断用户访问的是否是登陆页面
    //判断用户的登陆状态
    //如果登陆放行，否则重定向
    if (req.url != '/login' && !req.session.username) {
        res.redirect('/admin/login');
    } else {
        if(req.session.role == 'nomal'){
            return res.redirect('/home/')
        }
        next();
    }
}

module.exports = guard;