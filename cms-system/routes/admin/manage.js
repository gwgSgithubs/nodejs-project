const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const url = require('url');
const ObjectID = require('mongodb').ObjectID;
router.get('/', async (ctx)=>{
  // ctx.body = '用户管理'
  let result = await DB.find('admin', {});
  console.log(result);
  await ctx.render('admin/manage/list',{
    list: result
  });
});
router.get('/add', async (ctx)=>{
  // ctx.body = '增加用户'
  await ctx.render('admin/manage/add')
});

router.post('/doAdd', async (ctx)=>{
  // ctx.body = '增加用户'
  // await ctx.render('admin/manage/add')
  // 1.获取表单数据
  // 2.验证表单是否合法
  // 3.在数据库查询当前要增加的管理员是否存在
  // 4.增加管理员
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let rpassword = ctx.request.body.rpassword;
  if(!/^\w{4,20}/.test(username)){
    ctx.render('admin/error',{
      message: '用户名错误',
      redirect: ctx.state.__HOST__+'/admin/manage/add'
    })
  } else if(password != rpassword || password.length < 6){
    ctx.render('admin/error',{
      message: '密码错误',
      redirect: ctx.state.__HOST__+'/admin/manage/add'
    })
  } else {
    let findRes = await DB.find('admin', {'username': username});
    if(findRes.length > 0){
      ctx.render('admin/error',{
        message: '用户名已存在',
        redirect: ctx.state.__HOST__+'/admin/manage/add'
      })
    } else {
      let updata = await DB.insert('admin', {
        'username': username,
        'password': tools.md5(password),
        'status': 1
      });
      ctx.redirect('/admin/manage/list')
    }
  }
});
router.get('/list', async (ctx)=>{
  let result = await DB.find('admin', {});
  await ctx.render('admin/manage/list',{
    list: result
  });
});
router.get('/edit', async (ctx)=>{
  let _id = url.parse(ctx.url, true).query._id;
  // console.log(_id);
  // var id = Number(_id);
  // console.log(DB.getObjectId(_id));
  let findData = await DB.find('admin', {"_id": DB.getObjectId(_id)});
  console.log(findData);
  await ctx.render('admin/manage/edit',{
    list: findData[0]
  });
});
router.post('/doEdit', async (ctx)=>{
  // ctx.body = '删除用户'
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let rpassword = ctx.request.body.rpassword;
  let id = ctx.request.body.id;
  // console.log(id);
  if(password != ''){
    if(password != rpassword || password.length < 6){
      await ctx.render('admin/error',{
        message: '密码错误',
        redirect: ctx.state.__HOST__+'/admin/manage/edit?_id='+id
      })
    } else {
      let updata = await DB.update('admin', {
        '_id': DB.getObjectId(id)
      }, {
        'password': tools.md5(password)
      });
    }
  }
  ctx.redirect('/admin/manage/list')
});
// router.get('/delete', async (ctx)=>{
//   let _id = url.parse(ctx.url, true).query._id;
//   let deleteData = await DB.delete('admin', {'_id': DB.getObjectId(_id)});
//   // let deleteData = await DB.delete('admin', {'_id': _id});
//   // console.log(deleteData);
//   // console.log(deleteData.result.ok);
//   if(deleteData.result.ok == '1'){
//     await ctx.redirect('/admin/manage/list')
//   } else {
//     await ctx.render('admin/error',{
//       message: '用户删除失败',
//       redirect: ctx.state.__HOST__+'/admin/manage/list'
//     })
//   }
// });

module.exports = router.routes();
