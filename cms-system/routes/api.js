

const router = require('koa-router')();
const DB = require('../model/db.js');
const url = require('url');
router.get('/', async (ctx)=>{
  ctx.body = 'api 接口'
});
router.get('/cateList', async(ctx)=>{
  // ctx.body = 'api分类接口'
  let article = await DB.find('article', {});
  ctx.body = article;
})
router.get('/newsList', async(ctx)=>{
  let params = url.parse(ctx.url, true).query;
  let page = params.page || 1;
  // let pageSize = params.pageSize || 5;
  let pageSize = 5;
  console.log(page, pageSize);
  // ctx.body = params;
  // let result = await DB.find('articlecate', {}, {}, {page:page, pageSize:pageSize});
  // var page=ctx.query.page || 1;
  //
  // var pageSize=5
  //
  var result = await DB.find('article',{},{},{
      page,
      pageSize
  })
  // console.log(result);
  ctx.body = result;
})
// 增加购物车
router.post('/addCart', async(ctx)=>{
 console.log(ctx.request.body);
 ctx.body = {
   'success': true,
   'message': '增加数据成功'
 }
})
// 接受客户端提交的数据, 修改数据
router.put('/editPeopleInfo', async(ctx)=>{
 console.log(ctx.request.body);
 ctx.body = {
   'success': true,
   'message': '修改数据成功'
 }
})
// 接受客户端提交的数据, 删除数据
router.delete('/deleteCart', async(ctx)=>{
 console.log(ctx.query);
 ctx.body = {
   'success': true,
   'message': '删除数据成功'
 }
})

module.exports = router.routes();
