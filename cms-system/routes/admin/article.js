const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const multer = require('koa-multer');   // 引入图片上传的目录
// const file= require('file');
const url = require('url');
const ObjectID = require('mongodb').ObjectID;
// 配置
let storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/uploads') //注意路径必须存在  配置图片上传目录
  },                            //修改文件名称
  filename: function (req, file, cb) {  // 图片上传完成重命名
    var fileFormat = (file.originalname).split(".");  // 获取后缀名 分割数组
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
let upload = multer({ storage: storage });



router.get('/', async (ctx)=>{
  let page = url.parse(ctx.url, true).query.page;
  // console.log(page);
  let pageSize = 7;
  let result = await DB.find('article', {}, {}, {page, pageSize, sortJson: {
    'add_time': -1
  }});
  let count = await DB.count('article', {});
  // console.log(count);
  // console.log(count.length);
  ctx.render('admin/article/index', {
    list: result,
    totalPages: Math.ceil(count/pageSize),
    page: page || 1
  })
});
router.get('/edit', async (ctx) => {
  let id = ctx.query.id;
  // 分类
  let catelist = await DB.find('articlecate', {});
  // 获取当前分类
  let list = await DB.find('article', {'_id': DB.getObjectId(id)});
  // console.log(list);
  ctx.render('admin/article/edit', {
    catelist: tools.resList(catelist),
    list: list[0],
    prevPage: ctx.request.headers['referer']
  });
})
router.post('/doEdit', upload.single('img_url'), async (ctx) => {
  // console.log(ctx.req.file.filename);
  let body = ctx.req.body;
  let _id = body._id;
  let prevPage = body.prevPage;
  let catename = body.catename.trim();
  let pid = body.pid;
  let title = body.title.trim();
  let author = body.author.trim();
  let keywords = body.keywords;
  let description = body.description;
  let status = body.status;
  let is_best = body.is_best || 0;
  let is_hot = body.is_hot || 0;
  let is_new = body.is_new || 0;
  let content = body.content || '';

  let imgUrl = ctx.req.file?ctx.req.file.filename:'';
  let json;
  if(imgUrl){
    let img_url = ctx.state.__HOST__ + '/uploads/' + imgUrl;
    json = {
      pid, title, catename, author, keywords, description, status, is_best, is_hot, is_new, img_url, content
    }
  } else {
    json = {
      pid, title, catename, author, keywords, description, status, is_best, is_hot, is_new, content
    }
  }
  console.log(json);
  DB.update('article', {'_id': DB.getObjectId(_id)}, json);
  if(prevPage){
    ctx.redirect(prevPage);
  } else {
    ctx.redirect(ctx.state.__HOST__ + '/admin/article');
  }
})
router.get('/add', async (ctx) => {
  let catelist = await DB.find('articlecate', {});
  ctx.render('admin/article/add', {
    catelist: tools.resList(catelist)
  });
})
// router.get('/ueditor', async (ctx) => {
//   ctx.render('admin/article/ueditor');
// })
router.post('/doAdd', upload.single('img_url'), async (ctx) => {
  // console.log(ctx.req.file.filename);
  let imgUrl = ctx.req.file?ctx.req.file.filename:'';
  let body = ctx.req.body;
  let catename = body.catename.trim();
  let pid = body.pid;
  let title = body.title.trim();
  let author = body.author.trim();
  let keywords = body.keywords;
  let description = body.description;
  let status = body.status;
  let is_best = body.is_best || 0;
  let is_hot = body.is_hot || 0;
  let is_new = body.is_new || 0;
  let add_time = new Date();
  let content = body.content || '';
  let img_url = ctx.state.__HOST__ + '/uploads/' + imgUrl;
  DB.insert('article', {
    pid, title, catename, author, keywords, description, status, is_best, is_hot, is_new, img_url, content, add_time
  });
  ctx.redirect(ctx.state.__HOST__ + '/admin/article');
})

module.exports = router.routes();
