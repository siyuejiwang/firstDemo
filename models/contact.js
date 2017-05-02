var mongodb = require("./db");

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
                collection.insert(item,{safe:true},function(err,contact){
                    mongodb.close();
                    callback(err,contact);
                });
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
                   contacts: [] 
                };
                docs.forEach(function(doc,index){
                    // var Contact = new Contact(doc.username,doc.Contact,doc.time);
                    data.contacts.push(doc.title);
                });
                collection.aggregate([{$group : {name : "$group"}}],function(err,result){
                    data.groups = result;
                    callback(null,data);
                })
            });
        });
    });
};

