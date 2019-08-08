const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
//验证模块
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        //保证邮箱插入数据库时不重复
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    state: {
        // 0 启用
        // 1 禁用
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userSchema);

async function createUser() {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash('123456', salt);
    const user = await User.create({
        username: 'rzf',
        email: 'rzf@qq.com',
        password: pass,
        role: 'admin',
        state: 0
    })

}
// createUser();

//验证用户信息
const validateUser = user => {
    //定义对象的验证规则
    const schema = {
        username: Joi.string().min(2).max(12).required().error(new Error('用户名不符合规则')),
        email: Joi.string().email().required().error(new Error('邮箱格式不符合规则')),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('密码格式不符合规则')),
        role: Joi.string().valid('normal', 'admin').required().error(new Error('角色不符合规则')),
        state: Joi.number().valid(0, 1).required().error(new Error('状态值非法'))

    };

    //验证
    return Joi.validate(user, schema);
}

module.exports = {
    User,
    validateUser
}