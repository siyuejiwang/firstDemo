var multer  = require('nodemailer');
var mailTransport = multer.createTransport({
    host : 'smtp.sina.com',
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth : {
        user : '你的邮箱地址',
        pass : '你的邮箱密码'
    },
});
module.exports = mailTransport;