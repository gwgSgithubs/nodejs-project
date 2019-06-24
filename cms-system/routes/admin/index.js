const router = require('koa-router')();
const DB = require('../../model/db.js');
router.get('/', async(ctx)=>{
  ctx.render('admin/manage/index');
})

router.get('/changeSort', async(ctx)=>{
  var db=ctx.query.db; /*数据库*/
  var id=ctx.query.id; /*更新的 id*/
  var val = ctx.query.sort; /* 值 */
  console.log(ctx.query);
  if(val){
    var json = {
      sort: val
    }
  } else {
    var json = {
      sort: 0
    }
  }
  let updataResult = await DB.update(db, {'_id': DB.getObjectId(id)}, json);
  if(updataResult){
    ctx.body = {'message': '更新成功', 'success': true}
  } else {
    ctx.body = {'message': '更新失败', 'success': false}
  }
})
router.get('/changeStatus', async(ctx)=>{
  // await ctx.render('admin/manage/add')
  var db=ctx.query.db; /*数据库*/
  var attr=ctx.query.attr; /*属性*/
  var id=ctx.query.id; /*更新的 id*/
  var data= await DB.find(db,{"_id":DB.getObjectId(id)});
  // console.log(data[0][attr]);
  if(data.length>0){
    if(data[0][attr]==1){
      var json = { /*es6 属性名表达式*/
      [attr]: 0
      };
    }else{
      var json = {
      [attr]: 1
      };
    }
    let updateResult=await DB.update(db,{"_id":DB.getObjectId(id)},json);
    // console.log(updateResult);
    if(updateResult){
      ctx.body={"message":'更新成功',"success":true};
    }else{
      ctx.body={"message":"更新失败","success":false}
    }
  }else{
    ctx.body={"message":'更新失败,参数错误',"success":false};
  }
})
router.get('/reomve', async(ctx)=>{
  console.log(ctx.query.db);
  try {
    let db=ctx.query.db; /*数据库*/
    let id=ctx.query.id; /*更新的 id*/
    let result= await DB.delete(db,{"_id":DB.getObjectId(id)});
    ctx.redirect(ctx.state.G.prevPage);
  } catch(err){
    ctx.redirect(ctx.state.G.prevPage);
  }
})

module.exports = router.routes();
