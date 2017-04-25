var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: 'qq',
    host: 'smtp.qq.com',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '1170867221@qq.com',
        //这里密码不是qq密码，是你设置的smtp密码  gktqekcxtptkggfe
        pass: 'gktqekcxtptkggfe'
    }
});

module.exports = transporter;

// var mailOptions = {
//     from: '768065158@qq.com', // 发件地址
//     to: '528779822@qq.com', // 收件列表
//     subject: 'Hello sir', // 标题
//     //text和html两者只支持一种
//     text: 'Hello world ?', // 标题
//     html: '<b>Hello world ?</b>' // html 内容
// };

// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         return console.log(error);
//     }
//     console.log('Message sent: ' + info.response);

// });
