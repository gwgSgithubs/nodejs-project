const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const ObjectID = Mongo.ObjectID;
const Config = require('./config.js');
class DB {
  static getInstance(){
    if(!DB.instance){
      DB.instance = new DB();
    }
    return DB.instance;
  }
  constructor() {
    this.dbClient = '';
    this.connect()
  }
  connect(){    // 连接数据库
    return new Promise((resolve, reject)=>{
      if(!this.dbClient){
        MongoClient.connect(Config.url, (err, client)=>{
          if(err){
            console.log(err);
            reject(err);
          } else {
            let db = client.db(Config.dbName);
            this.dbClient = db;
            resolve(this.dbClient);
          }
        })
      } else {
        resolve(this.dbClient);
      }
    })
  }
  find(collecter, json1, json2, json3){
    // DB.find('coll', {})
    // DB.find('coll', {}, {fields: attr})
    // DB.find('coll', {}, {fields: attr}|{}, {'page': 2, 'pageSize': 20});
    let attr, page, pageSize, slipNum, sortJson;
    if(arguments.length == 2){
      attr = {};
      slipNum = 0;
      pageSize = 0;
    } else if(arguments.length == 3){
      attr = json2;
      slipNum = 0;
      pageSize = 0;
    } else if(arguments.length == 4){
      attr = json2;
      page = json3.page || 1
      pageSize = json3.pageSize || 20;
      slipNum = (page-1) * pageSize;
      if(json3.sortJson){
        sortJson = json3.sortJson;
      } else {
        sortJson = {}
      }
    }
    return new Promise((resolve, reject)=>{
      this.connect().then((db)=>{
        // let res = db.collection(collecter).find(json);
        let res = db.collection(collecter).find(json1,{fields:attr}).skip(slipNum).limit(pageSize).sort(sortJson);
        res.toArray((err, result)=>{
          if(err){
              reject(err);
          } else {
            resolve(result);
          }
        })
      })
    })
  }
  insert(collecter, json){
    return new Promise((resolve, reject)=>{
      this.connect().then((db)=>{
        db.collection(collecter).insertOne(json, (err, res)=>{
          if(err){
            reject(err);
          } else {
            resolve(res)
          }
        })
      })
    })
  }
  update(collecter,wherejson,updatejson){
    return new Promise((resolve, reject)=>{
      this.connect().then((db)=>{
        db.collection(collecter).updateOne(wherejson, {$set: updatejson}, (err, res)=>{
          if(err){
            reject(err);
          } else {
            resolve(res);
          }
        })
      })
    })
  }
  delete(collecter, json){
    return new Promise((resolve, reject)=>{
      this.connect().then((db)=>{
        db.collection(collecter).deleteOne(json, (err, res)=>{
          if(err){
            reject(err);
          } else {
            resolve(res);
          }
        })
      })
    })
  }
  getObjectId(id){
    return new ObjectID(id);
  }
  count(collecter, json){
    return new Promise((resolve, reject)=>{
      this.connect().then((db)=>{
        let result = db.collection(collecter).find(json).count();
        result.then((count)=>{
          resolve(count)
        })
      })
    })
  }
}

// let db = DB.getInstance();
// setTimeout(()=>{
//   console.time('start');
//   db.find('user', {}).then((data)=>{
//     // console.log(data);
//     console.timeEnd('start');
//   });
// }, 100);
// setTimeout(()=>{
//   console.time('start2');
//   db.find('user', {}).then((data)=>{
//     // console.log(data);
//     console.timeEnd('start2');
//   });
// }, 3000);
// let db1 = DB.getInstance();
// setTimeout(()=>{
//   console.time('start3');
//   db1.find('user', {}).then((data)=>{
//     // console.log(data);
//     console.timeEnd('start3');
//   });
// }, 5000);
// setTimeout(()=>{
//   console.time('start4');
//   db1.find('user', {}).then((data)=>{
//     // console.log(data);
//     console.timeEnd('start4');
//   });
// }, 8000);
module.exports = DB.getInstance();
