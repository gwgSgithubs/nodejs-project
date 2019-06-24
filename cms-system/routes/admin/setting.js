const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const url = require('url');

router.get('/', async(ctx)=>{
  // ctx.body = '系统设置'
  let findData = await DB.find('setting', {});
  await ctx.render('admin/setting/index', {
    list: findData[0]
  });
})
router.post('/doEdit', tools.upload().single('site_logo'), async(ctx)=>{
  let body = ctx.req.body;
  console.log(body);
  let site_title = body.site_title;
  let site_keywords = body.site_keywords;
  let site_description = body.site_description;
  let site_icp = body.site_icp;
  let site_qq = body.site_qq;
  let site_tel = body.site_tel;
  let site_address = body.site_address;
  let site_status = body.site_status;
  let site_logo = ctx.req.file?ctx.req.file.filename:'';
  let json;
  // console.log(pic);
  if(site_logo){
    site_logo = ctx.state.__HOST__ + '/uploads/' + site_logo;
    json = {
      site_title, site_keywords, site_tel, site_description, site_icp, site_qq, site_address, site_status, site_logo,
    }
  } else {
    json = {
      site_title, site_keywords, site_tel, site_description, site_icp, site_qq, site_address, site_status
    }
  }
  let addData = await DB.update('setting', {}, json);
  if(addData.result.n == 1){
    ctx.redirect('/admin/setting');
  }
  // ctx.body = 'doEdit';
})



module.exports = router.routes();
