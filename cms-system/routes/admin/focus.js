const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const url = require('url');
const ObjectID = require('mongodb').ObjectID;
// const multer = require('koa-multer');   // 引入图片上传的目录

// 配置
// let storage = multer.diskStorage({
//   //文件保存路径
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads') //注意路径必须存在  配置图片上传目录
//   },                            //修改文件名称
//   filename: function (req, file, cb) {  // 图片上传完成重命名
//     var fileFormat = (file.originalname).split(".");  // 获取后缀名 分割数组
//     cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
//   }
// })
// //加载配置
// let upload = multer({ storage: storage });

router.get('/', async (ctx)=>{
  let page = url.parse(ctx.url, true).query.page;
  let pageSize = 3;
  let findData = await DB.find('focus', {}, {}, {page, pageSize, sortJson: {
    'add_time': -1
  }});
  // console.log(findData);
  let count = await DB.count('focus', {});
  await ctx.render('admin/focus/list', {
    list: findData,
    totalPages: Math.ceil(count/pageSize),
    page: page || 1
  })
});
router.get('/add', async(ctx)=>{
  await ctx.render('admin/focus/add');
});
router.post('/doAdd', tools.upload().single('pic'), async(ctx)=>{
  let body = ctx.req.body;
  let title = body.title;
  let url = body.url;
  let sort = body.sort;
  let status = body.status;
  let add_time = new Date();
  let getPic = ctx.req.file?ctx.req.file.filename:'';
  let pic = ctx.state.__HOST__ + '/uploads/' + getPic;
  let json = { title, url, sort, add_time, pic, status};
  let resultAdd = await DB.insert('focus', json);
  if(resultAdd.result.n == 1){
    ctx.redirect('/admin/focus');
  } else {
    ctx.redirect('/admin/error', {
      message: '添加失败',
      redirect: ctx.state.__HOST__+'/admin/focus/add'
    });
  }
});
router.get('/edit', async(ctx)=>{
  let _id = url.parse(ctx.url, true).query.id;
  let prevPage = ctx.state.G.prevPage;
  let resultEdit = await DB.find('focus', {'_id': DB.getObjectId(_id)});
  // console.log(resultEdit);
  await ctx.render('admin/focus/edit', {
    list: resultEdit[0],
    prevPage: ctx.request.headers['referer']
  });
})
router.post('/doEdit', tools.upload().single('pic'), async(ctx)=>{
  let body = ctx.req.body;
  let id = body.id;
  let prevPage = body.prevPage;
  let title = body.title;
  let url = body.url;
  let sort = body.sort;
  let status = body.status;
  let getPic = ctx.req.file?ctx.req.file.filename:'';
  let pic, json;
  if(getPic){
    pic = ctx.state.__HOST__ + '/uploads/' + getPic;
    json = { title, url, sort, pic, status};
  } else {
    json = { title, url, sort, status};
  }
  let resultEdit = await DB.update('focus', {'_id': DB.getObjectId(id)}, json);
  if(prevPage){
    ctx.redirect(prevPage);
  } else {
    ctx.redirect(ctx.state.__HOST__ + '/admin/focus');
  }
})


module.exports = router.routes();
