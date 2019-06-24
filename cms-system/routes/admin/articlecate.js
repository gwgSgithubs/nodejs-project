const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const url = require('url');
const ObjectID = require('mongodb').ObjectID;
router.get('/', async (ctx)=>{
  let result = await DB.find('articlecate', {});
  let resArr = tools.resList(result);
  await ctx.render('admin/articlecate/index', {
    list: resArr
  });
});
router.get('/add', async (ctx)=>{
  let result = await DB.find('articlecate', {'pid': '0'});
  await ctx.render('admin/articlecate/add', {
    catelist: result
  });
});
router.get('/edit', async (ctx)=>{
  let _id = url.parse(ctx.url, true).query.id;
  let result = await DB.find('articlecate', {'_id': DB.getObjectId(_id)});
  let resPid = await DB.find('articlecate', {'pid': '0'});
  await ctx.render('admin/articlecate/edit', {
    list: result[0],
    catelist: resPid
  });
});
router.post('/doEdit', async (ctx)=>{
  let result = ctx.request.body;
  let title = result.title;
  let _id = result.id;
  let pid = result.pid;
  let keywords = result.keywords;
  let status = result.status;
  let description = result.description;
  let updataRes = await DB.update('articlecate', {'_id': DB.getObjectId(_id)}, {title, pid, keywords, status, description})
  if(updataRes){
    ctx.redirect('/admin/articlecate');
  }
});
router.post('/doAdd', async (ctx)=>{
  let postData = ctx.request.body;
  postData['add_time'] = new Date();
  let title = postData.title;
  if(!title){
    ctx.render('admin/error',{
      message: '分类名称不能为空',
      redirect: ctx.state.__HOST__+'/admin/articlecate/add'
    })
  } else {
    let result = await DB.insert('articlecate', postData);
    console.log(result.result.n);
    ctx.redirect('/admin/articlecate');
  }
})


module.exports = router.routes();
