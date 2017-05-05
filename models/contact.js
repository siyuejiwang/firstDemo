var mongodb = require("./db");
var BSON = require('mongodb').BSONPure;
function Contact(item){
    this.item = item;
};

module.exports = Contact;

Contact.prototype.save = function save(callback){
    //存入Mongodb的文档
    var item = this.item;
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取Contacts集合
        db.collection('Contacts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为user属性添加索引
            // collection.ensureIndex('user',function(err){
                //写入Contact文档
                if(!item._id){
                    collection.insert(item,{safe:true},function(err,contact){
                        mongodb.close();
                        callback(err,contact);
                    });
                }else{
                    // item._id = BSON.ObjectID.createFromHexString(item._id);
                    collection.save(item,{safe:true},function(err,contact){
                        mongodb.close();
                        callback(err);
                    });
                }
                
            // });

        });

    });
};

Contact.get = function get(callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取Contacts集合
        db.collection('Contacts',function(err,collection){
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
                
                //封装Contacts为Contact对象
                var data = {
                   contacts: docs,
                   groups: []
                },arr=[];
                docs.forEach(function(doc,index){
                    if(arr.indexOf(doc.group)==-1){
                        arr.push(doc.group);
                        data.groups.push({name: doc.group});
                    }
                });
                callback(null,data);
                // collection.aggregate([{$group : {name : "$group"}}],function(err,result){
                //     data.groups = result;
                //     callback(null,data);
                // })
            });
        });
    });
};

Contact.deletes = function deletes(item,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取Contacts集合
        db.collection('Contacts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            if(item._id){
                
                var obj_id = BSON.ObjectID.createFromHexString(item._id);
                collection.remove({'_id':obj_id},function(err){
                    mongodb.close();
                    if(err){
                        callback(err);
                    }else{
                        callback(null);
                    }
                })
            }else{
                collection.remove({'group':item.name},function(err){
                    mongodb.close();
                    if(err){
                        callback(err);
                    }else{
                        callback(null);
                    }
                }) 
            }
        });
    });
};