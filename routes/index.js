

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var nodemail = require('../models/email.js');
var Contact = require('../models/contact.js');

// router.post('/signup',checkNotLogin);
router.post("/signup",function(req,res){
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    var newUser = new User({
        name : req.body.name,
        email: req.body.email,
        password: password
    });

    //检查用户名是否已经存在
    User.get(newUser.name,function(err,user){
        console.log("fuck kiss my ass");
        if(user){
            err = 'Username already exists.';
        }
        if(err){
            req.flash('error',err);
            console.log("err");
            return res.send({code:500,message:'服务器内部错误'});
        }
        console.log("save");
        //如果不存在则新增用户
        newUser.save(function(err){
            if(err){
                req.flash('error',err);
                console.log("save err");
                console.log(err);
                return res.send({code:501,message:'写入数据库错误'});
            }
            req.session.user = newUser;
            req.flash('success','注册成功');
            return res.send({code:200,message:'注册成功'});
        });
        
    });
});

// router.post('/login',checkNotLogin);
router.post("/login",function(req,res){
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username,function(err,user){
        if(!user){
            req.flash('error','用户不存在');
            return res.send({code: 500,message:'用户名不存在'});
        }
        if(user.password!=password){
            req.flash('error','用户口令错误');
            return res.send({code: 501,message:'密码错误'});
        }
        req.session.user = user;
        req.flash('success','登入成功');
        res.send({code: 200,message:'登录成功',user: user});
    });
});

router.post("/sendemail",function(req,res){
    var mailOptions = {
        from: '1170867221@qq.com',
        to: req.body.to.join(','),
        subject: req.body.subject,
        text: req.body.content,
        html: '<b>Hello world</b>'
    };
    nodemail.sendMail(mailOptions, function(error,info){
        if(error){
            return console.log(error);
            res.send({code: 500,message:'服务器内部错误'});
        }
        res.send({code: 200,message:'Message sent: ' + info.response});
    });
});

router.post("/postblog",function(req,res){
    var NewPost = new Post({
        title: req.body.title,
        text: req.body.text,
        html: req.body.html,
    });

    NewPost.save(function(err){
        console.log('xxx');
        if(err){
            req.flash('error',err);
            console.log("save err");
            console.log(err);
            return res.send({code:501,message:'写入数据库错误'});
        }
        return res.send({code:200,message:'保存成功'});
    });
    
});

router.get("/postblog",function(req,res){
    Post.get(function(err,data){
        if(err){
            console.log(err);
            return res.send({code:501,message:'读取数据失败'});
        }
        return res.send({code:200,lists: data});
    });
    
});

router.post("/ptcontact",function(req,res){
    var contact = new Contact(req.body.contact);
    contact.save(function(err){
        console.log('xxx');
        if(err){
            req.flash('error',err);
            console.log("save err");
            console.log(err);
            return res.send({code:501,message:'写入数据库错误'});
        }
        return res.send({code:200,message:'保存成功'});
    });
    
});
router.get("/ptcontact",function(req,res){
    Contact.get(function(err,data){
        console.log('xxx');
        if(err){
            req.flash('error',err);
            console.log("save err");
            console.log(err);
            return res.send({code:501,message:'写入数据库错误'});
        }
        return res.send({code:200,data:data});
    });
    
});

router.get("/logout",checkLogin);
router.get("/logout",function(req,res){
    req.session.user = null;
    req.flash('success','登出成功');
    res.redirect('/');
});

function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error',"未登入");
        return res.redirect('/login');
    }
    next();
};

function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash("error","已登入");
        return res.redirect('/');
    }
    next();
};

module.exports = router;
