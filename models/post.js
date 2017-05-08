var mongodb = require("./db");
var BSON = require('mongodb').BSONPure;
var trimHtml = require('trim-html');
function Post(obj){
	this.title = obj.title;
	this.text = obj.text;
    this.html = obj.html;
    this.user = obj.user;
    if(obj._id){
    	this._id = obj._id;
    }
};

module.exports = Post;

Post.prototype.save = function save(callback){
	//存入Mongodb的文档
	var data = {
		title:this.title,
		text:this.text,
		html:this.html,
		user:this.user,
        time:new Date()
	};
	var iiid = this._id && BSON.ObjectID.createFromHexString(this._id);
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
				if(iiid){
					console.log('xx');
					data._id = iiid;
					collection.update({'_id':iiid},{$set:data},{safe:true},function(err,post){
						mongodb.close();
						callback(err,post);
					});
				}else{
					collection.insert(data,{safe:true},function(err,post){
						mongodb.close();
						callback(err,post);
					});
				}
				
			// });

		});

	});
};

Post.get = function get(username,page,callback){
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
			collection.find({user:username}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,docs){
				
				if(err){
					mongodb.close();
					callback(err,null);
				}else{
					collection.find({user:username}).count(function(err,num){
						mongodb.close();
						var posts = [];
						docs.forEach(function(doc,index){
							// var post = new Post(doc.username,doc.post,doc.time);
							doc.zy = trimHtml(doc.html);
							doc.num = (num%10==0)?num/10:Math.ceil(num/10);
							posts.push(doc);
						});
						callback(null,posts);
					})
				}
				//封装posts为Post对象
				
			});
		});
	});
};
//
Post.getData = function getData(id,callback){
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
			var m_id = BSON.ObjectID.createFromHexString(id);
			collection.findOne({'_id':m_id},function(err,obj){
				mongodb.close();
				if(err){
					callback(err);
				}else{
					callback(null,obj);
				}
			});
		});
	});
};
Post.deletes = function deletes(id,callback){
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
			var obj_id = BSON.ObjectID.createFromHexString(id);
			collection.remove({'_id': obj_id},function(err){
				mongodb.close();
				if(err){
					callback(err);
				}else{
					callback();
				}
			})
		});
	});
};

