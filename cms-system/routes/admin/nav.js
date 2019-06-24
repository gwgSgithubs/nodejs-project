const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const url = require('url');


router.get('/', async(ctx)=>{
  let page = url.parse(ctx.url, true).query.page;
  let pageSize = 3;
  let count = await DB.count('nav', {});
  let findData = await DB.find('nav', {}, {}, {
    page,
    pageSize,
    sortJson: {
      'add_time': -1
    }
  })
  await ctx.render('admin/nav/list', {
    list: findData,
    page: page || 1,
    totalPages: Math.ceil(count/pageSize),
  })
});
router.get('/edit', async(ctx)=>{
  let id = url.parse(ctx.url, true).query.id;
  let findData = await DB.find('nav', {'_id': DB.getObjectId(id)});
  await ctx.render('admin/nav/edit', {
    list: findData[0],
    prevPage: ctx.request.headers['referer']
  });
})
router.post('/doEdit', async(ctx)=>{
  let body = ctx.request.body;
  console.log(body);
  let title = body.title;
  let id = body.id;
  let prevPage = body.prevPage;
  let url = body.url;
  let sort = body.sort;
  let status = body.status;
  // let add_time = new Date();
  let updateData = await DB.update('nav', {'_id': DB.getObjectId(id)}, {
    title, url, sort, status
  });
  if(updateData){
    ctx.redirect(prevPage);
  }
})
router.get('/add', async(ctx)=>{
  await ctx.render('admin/nav/add');
})
router.post('/doAdd', async(ctx)=>{
  let body = ctx.request.body;
  console.log(body);
  let title = body.title;
  let url = body.url;
  let sort = body.sort;
  let status = body.status;
  let add_time = new Date()
  let json = { title, url, sort, status, add_time }
  let addData = await DB.insert('nav', json);
  if(addData.result.n == 1){
    ctx.redirect('/admin/nav');
  }
  // ctx.body = 'tianjia';

})
module.exports = router.routes();
