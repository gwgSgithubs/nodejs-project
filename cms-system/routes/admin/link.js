const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const url = require('url');

router.get('/', async(ctx)=>{
   let page = url.parse(ctx.url, true).query.page;
   let pageSize = 3
   let count = await DB.count('link', {});
   let result = await DB.find('link', {}, {}, {
     pageSize, page, sortJson: {'add_time': -1}
   });
   // console.log(result);
   ctx.render('admin/link/list', {
     list: result,
     totalPages: Math.ceil(count/pageSize),
     page: page||1,
     count: count
   })
})
router.get('/count', async(ctx)=>{
  let count = await DB.count('link', {});
  ctx.body = count; 
})
router.get('/edit', async(ctx)=>{
  let id = url.parse(ctx.url, true).query.id;
  let findData = await DB.find('link', {'_id': DB.getObjectId(id)});
  console.log(findData);
  ctx.render('admin/link/edit',{
    list: findData[0],
    prevPage: ctx.request.headers['referer']
  })
})
router.post('/doEdit', tools.upload().single('pic'), async(ctx)=>{
  let body = ctx.req.body;
  let id = body.id;
  let prevPage = body.prevPage;
  let title = body.title;
  let url = body.url;
  let sort = body.sort;
  let status = body.status;
  let pic = ctx.req.file?ctx.req.file.filename:'';
  let json;
  if(pic){
    pic = ctx.state.__HOST__ + '/uploads/' + pic;
    json = { title, url, sort, status, pic}
  }else {
    json = { title, url, sort, status }
  }
  let editData = await DB.update('link', {'_id': DB.getObjectId(id)}, json );
  // console.log(editData);
  ctx.redirect(prevPage);
})
router.get('/add', async(ctx)=>{
  await ctx.render('admin/link/add');
})
router.post('/doAdd', tools.upload().single('pic'), async(ctx)=>{
  let body = ctx.req.body;
  // console.log(body);
  // console.log(ctx.req.file);
  let title = body.title;
  let url = body.url;
  let sort = body.sort;
  let status = body.status;
  let add_time = new Date();
  let pic = ctx.req.file?ctx.req.file.filename: '';
  if(pic){
    pic = ctx.state.__HOST__+ '/uploads/' + pic
  }
  let json = { title, url, sort, status, add_time, pic };
  let addData = await DB.insert('link', json);
  // console.log(addData.result.n);
  if(addData.result.n == 1){
    ctx.redirect('/admin/link')
  }
})
module.exports = router.routes();
