var mongodb = require("./db");

function Post(title,text,html){
	this.title = title;
	this.text = text;
    this.html = html;
};

module.exports = Post;

Post.prototype.save = function save(callback){
	//存入Mongodb的文档
	var data = {
		title:this.title,
		text:this.text,
		html:this.html,
        time:new Date()
	};

	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
        console.log('yyy');
		//读取posts集合
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//为user属性添加索引
			// collection.ensureIndex('user',function(err){
				//写入post文档
				collection.insert(data,{safe:true},function(err,post){
					mongodb.close();
					callback(err,post);
				});
			// });

		});

	});
};

Post.get = function get(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//读取posts集合
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//查找user属性为username的文档，如果sername是null则全部匹配
			collection.find().sort({time:-1}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					callback(err,null);
				}
				//封装posts为Post对象
				var posts = [];
				docs.forEach(function(doc,index){
					// var post = new Post(doc.username,doc.post,doc.time);
					posts.push(doc.title);
				});
				callback(null,posts);
			});
		});
	});
};

