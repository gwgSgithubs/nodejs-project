const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const svgCaptcha = require('svg-captcha');

router.get('/', async (ctx)=>{
  // ctx.body = '登录'
  await ctx.render('admin/login');
});

router.post('/doLogin', async (ctx)=>{
  // 1. 验证用户密码是否合法
  // 2.去数据库匹配
  // 保存到session
  let username = ctx.request.body.username;
  let password = Number(ctx.request.body.password);
  console.log(password);

  let code = ctx.request.body.code;
  if(ctx.session.code.toLowerCase() == code.toLowerCase()){
    let result = await DB.find('admin',{"username": username, "password": tools.md5(password)});
    // console.log(result);
    if(result.length > 0){
      ctx.session.userinfo = result[0];
      await DB.update('admin',{"_id": result[0]._id}, {"last_time": new Date()});
      ctx.redirect(ctx.state.__HOST__ + '/admin')
    } else {
      ctx.render('admin/error', {
        message: '用户名或密码错误',
        redirect: ctx.state.__HOST__ + '/admin/login'
      })
    }
  } else {
    ctx.render('admin/error', {
      message: '验证码错误',
      redirect: ctx.state.__HOST__ + '/admin/login'
    })
  }

})
router.get('/code', async (ctx)=>{
  var captcha = svgCaptcha.create({
    size: 4,
    fontSize: 50,
    width: 100,
    height: 34,
    background:"#cc9966"
  });
  // 保存验证码
  ctx.session.code = captcha.text;
  // 设置响应头
  ctx.response.type = 'image/svg+xml';
  ctx.body=captcha.data;
  console.log(captcha.text);
})

// 退出登录
router.get('/loginOut', async (ctx)=>{
  ctx.session.userinfo = null;
  ctx.redirect(ctx.state.__HOST__ + '/admin/login');
})

module.exports = router.routes();
