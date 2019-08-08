// 导入用户集合构造函数
const { User } = require('../../model/user');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    // 接收请求参数
    const { email, password } = req.body;
    // 如果用户没有输入邮件地址
    // if (email.trim().length == 0 || password.trim().length == 0) return res.status(400).send('<h4>邮件地址或者密码错误</h4>');
    if (email.trim().length == 0 || password.trim().length == 0) return res.status(400).render('admin/error', { msg: '邮件地址或者密码错误' });
    // 根据邮箱地址查询用户信息
    // 如果查询到了用户 user变量的值是对象类型 对象中存储的是用户信息
    // 如果没有查询到用户 user变量为空
    let user = await User.findOne({ email });
    // 查询到了用户
    if (user) {
        // 将客户端传递过来的密码和用户信息中的密码进行比对
        // true 比对成功
        // false 对比失败
        let isValid = await bcrypt.compare(password, user.password);
        // 如果密码比对成功
        if (isValid) {
            // 登录成功
            // 将用户名存储在请求对象中
            req.session.username = user.username;
            //将用户角色储存在session对象中
            req.session.role = user.role;
            // res.send('登录成功');
            req.app.locals.userInfo = user;
            //对用户角色判断
            if (user.role == 'admin') {
                res.redirect('/admin/user');
            } else {
                res.redirect('/home/');
            }
            // 重定向到用户列表页面
            res.redirect('/admin/user');
        } else {
            // 没有查询到用户
            res.status(400).render('admin/error', { msg: '邮箱地址或者密码错误' })
        }
    } else {
        // 没有查询到用户
        res.status(400).render('admin/error', { msg: '邮箱地址或者密码错误' })
    }

    // 获取数据
    // 解析数据=>行为
    // 执行对于方法，获取结果
    // 返回数据

    // const inputData = this.getInputData(req);
    // const actionType = this.getActionType(inputData);
    // const action = this.getAction(actionType);
    // const result = action(inputData);
    // this.sendResponse(res, result);

    // const inputUserInfo = getInputUserInfo(req);
    // const result = await loginAction(inputUserInfo);
    // returnResult(result, req, res);
}
// function getInputUserInfo(req) {
//     console.log(req.body);
//     return {
//         email: req.body.email,
//         password: req.body.password
//     }
// }

// const validateInputData = (inputUserInfo) => {
//     const email = inputUserInfo.email;
//     const password = inputUserInfo.password;
//     console.log(inputUserInfo)
//     if (!email || email.trim().length == 0 || password.trim().length == 0) {
//         return {
//             type: 'login.param.validate.error',
//             message: '邮件地址或密码错误'
//         }
//     } else {
//         return null;
//     }
// }
// const checkUserState = (inputUserInfo, user) => {
//     if (user) {
//         return null;
//     } else {
//         return {
//             type: 'login.user.check.error',
//             message: '用户不存在'
//         };
//     }
// }
// const checkPasswordState = async (inputUserInfo, user) => {
//     let isEqual = await bcrypt.compare(inputUserInfo.password, user.password);
//     if (isEqual) {
//         return null;
//     } else {
//         return {
//             type: 'login.user.check.password.error',
//             message: '密码错误'
//         };
//     }
// }
// const confirmSuccess = async (inputUserInfo, user) => {
//     return {
//         type: 'success',
//         message: 'login success',
//         username: user.username
//     };
// }
// const getUser = async (inputUserInfo) => {
//     return await User.findOne({ email: inputUserInfo.email })
// }

// async function loginAction(inputUserInfo) {
//     const paramValidateReulst = validateInputData(inputUserInfo);
//     if (paramValidateReulst) {
//         return paramValidateReulst;
//     }
//     const user = await getUser(inputUserInfo);
//     const reulst = await checkPasswordState(inputUserInfo, user) || checkUserState(inputUserInfo, user) || confirmSuccess(inputUserInfo, user)
//     return reulst;

// }

// function returnResult(result, req, res) {
//     console.log('before return ', result);
//     if (result.type === 'success') {
//         console.log('final', result);
//         req.session.user = result;
//         req.app.locals.userInfo = result;
//         res.redirect('/admin/user');
//     } else {
//         console.log(JSON.stringify(result));
//         res.status(400).render('admin/error', { msg: '邮件地址或密码错误' });
//     }
// };
