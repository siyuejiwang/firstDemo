var express = require('express');
var path = require('path');//处理文件路径的小工具,nodejs自带的吧
var favicon = require('serve-favicon');
var logger = require('morgan');//日志模块，之前叫logger
var cookieParser = require('cookie-parser');//设置访问cookie的中间件
var bodyParser = require('body-parser');
var methodOverride = require('method-override');//这里暂时未用到，提供对 x-http-method-override 请求头的支持，允许浏览器“假装”使用除 GET 和 POST
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);//把session存在mongodb中
var settings = require("./settings");
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var ueditor = require("ueditor");
// view engine setup
app.set('views', path.join(__dirname, 'views'));//path.join的用途在于正确使用系统的路径分隔符
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(settings.cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {

  // ueditor 客户发起上传图片请求

  if(req.query.action === 'uploadimage'){

    // 这里你可以获得上传图片的信息
    var foo = req.ueditor;
    console.log(foo.filename); // exp.png
    console.log(foo.encoding); // 7bit
    console.log(foo.mimetype); // image/png

    // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
    var img_url = 'uploadimg';
    res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage'){
    var dir_url = 'uploadimg'; // 要展示给客户端的文件夹路径
    res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {

    res.setHeader('Content-Type', 'application/json');
    // 这里填写 ueditor.config.json 这个文件的路径
    res.redirect('/ueditor/ueditor.config.json')
}}));
app.use(session({//session配置项,有key,store,cookie,//该实例必须是一个EventEmitter，有destory,set,get等方法，connect-mongo是实现这些方法的实例
    secret:settings.cookieSecret,
    store:new MongoStore({
        url:'mongodb://localhost:27017'
    }),
    resave:true,
    saveUninitialized:true
}));

//获取状态
app.use(function(req,res,next){
    console.log("app.usr local");
    // res.locals.user = req.session.user;
    // res.locals.post = req.session.post;
    var error = req.flash('error');//引入了connect-flash中间件，直接用req.flash,不然要用req.session.flash
    res.locals.error = error.length?error:null;

    var success = req.flash('success');
    res.locals.success = success.length?success:null;

    next();
});


app.use('/', routes);
app.use('/users', users);


/*--------------start register route ----------------*/
//app.get("/",routes.index);
//app.get("/u/:user",routes.user);
//app.post("/post",routes.post);
//app.get("/reg",routes.reg);
//app.post("/reg",routes.doReg);
//app.get("/login",routes.login);
//app.post("/login",routes.doLogin);
//app.get("/logout",routes.logout);
//app.use(routes);
/*--------------end register route ----------------*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.use(bodyParser.json());

// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'

module.exports = app;
//http://cnodejs.org/topic/52dcc0a578990b04112e2f09   node.js版本依赖详解