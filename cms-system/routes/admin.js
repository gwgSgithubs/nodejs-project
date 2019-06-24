
const router = require('koa-router')();
const login = require('./admin/login.js');
const manage = require('./admin/manage.js');
const index = require('./admin/index.js');
const articlecate = require('./admin/articlecate.js');
const article = require('./admin/article.js');
const focus = require('./admin/focus.js');
const link = require('./admin/link.js');
const nav = require('./admin/nav.js');
const setting = require('./admin/setting.js');
const url = require('url');
const ueditor = require('koa2-ueditor');
// 上传图片的路由 ueditor.config.js 配置图片的post 地址
router.all('/editorUpload', ueditor(['public', {
	"imageAllowFiles": [".png", ".jpg", ".jpeg"],
	"imagePathFormat": "/uploads/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

router.use(async (ctx, next)=>{
  ctx.state.__HOST__ = 'http://' + ctx.request.header.host;
  let requestUrl=url.parse(ctx.request.url).pathname.substring(1);
  let splitUrl=requestUrl.split('/');
  // console.log(requestUrl,splitUrl);
  ctx.state.G = {
    url: splitUrl,
    userinfo: ctx.session.userinfo,
    prevPage: ctx.request.headers['referer']  // 记录上一页
  }
  // console.log(ctx.session.userinfo);
  let pathname = url.parse(ctx.request.url).pathname;
  console.log(pathname);
  // 权限判断
  // console.log(ctx.session.userinfo);
  if(ctx.session.userinfo){
    await next();
  } else {
    if(pathname == '/admin/login' || pathname == '/admin/login/doLogin' || pathname == '/admin/login/code'){
      // await next();
      // console.log('23432')
      await next();
    } else {
      ctx.redirect('/admin/login');
    }
  }
})
// 配置子路由
router.use(index);
router.use('/setting', setting);
router.use('/nav', nav);
router.use('/link', link);
router.use('/focus', focus);
router.use('/article', article);
router.use('/articlecate', articlecate);
router.use('/manage', manage);
router.use('/login', login);

module.exports = router.routes();
