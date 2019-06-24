

const router = require('koa-router')();
const DB = require('../model/db.js');
const url = require('url');

router.use(async(ctx, next)=>{
  let pathname=url.parse(ctx.request.url).pathname;
  // let splitUrl=pathname.split('/');
  // console.log(splitUrl);
  let nav = await DB.find('nav', {}, {}, {
    sortJson: {'sort': 1}
  });
  let setting = await DB.find('setting', {});
  // console.log(setting[0]);
  let link = await DB.find('link', {});
  // console.log(link);
  ctx.state.G = {
    url: pathname,
    nav: nav,
    setting: setting[0],
    link: link
  }
  await next();
})

router.get('/', async (ctx)=>{
  let focus = await DB.find('focus', {$or: [{'status': '1'}, {'status': 1}]});
  ctx.render('default/index', {
    focus
  });
});

router.get('/service', async(ctx)=>{
  // ctx.body = '服务'
  let serviceList = await DB.find('article', {'pid': '5ab34b61c1348e1148e9b8c2'});
  // console.log(serviceList);
  ctx.render('default/service', {serviceList})
})
// router.get('/service/content/:id', async(ctx)=>{
//   // console.log(ctx.params);
//   let id = ctx.params.id;
//   let content = await DB.find('article', {'_id': DB.getObjectId(id)});
//   // console.log(content);
//   ctx.render('default/content', {
//     list: content[0]
//   })
// })
router.get('/case', async(ctx)=>{
  // ctx.body = '案例'
  let id = url.parse(ctx.url, true).query.id;
  let page = url.parse(ctx.url, true).query.page;
  // console.log(id);
  let pageSize = 3;
  let caseList = await DB.find('articlecate', {'pid': '5ab3209bdf373acae5da097e'});
  let caseListArr = [];
  let articleResult, articleCount;
  if(id){
    articleCount = await DB.count('article', {'pid': id});
    articleResult = await DB.find('article', {'pid': id}, {}, {page, pageSize});
  } else {
    for(let i = 0; i < caseList.length; i++){
      caseListArr.push(caseList[i]._id.toString());
    }
    articleCount = await DB.count('article', {'pid': {$in: caseListArr}});
    articleResult = await DB.find('article', {'pid': {$in: caseListArr}}, {}, {page, pageSize});
  }
  // console.log(articleResult/pageSize);
  // console.log(articleCount);
  ctx.render('default/case', {
    list: caseList,
    listDetail: articleResult,
    pid: id,
    page: page||1,
    totalPages: Math.ceil(articleCount/pageSize)
  })
})
// router.get('/case/content/:id', async(ctx)=>{
//   let id = ctx.params.id;
//   let content = await DB.find('article', {'_id': DB.getObjectId(id)});
//   ctx.render('default/content', {
//     list: content[0]
//   })
// })
router.get('/news', async(ctx)=>{
  // ctx.body = '新闻'
  let id = url.parse(ctx.url, true).query.id;
  let page = url.parse(ctx.url, true).query.page;
  let pageSize = 2;
  // console.log(id);
  let list = await DB.find('articlecate', {'pid': '5afa56bb416f21368039b05d'});
  let listArr, content, count;
  if(!id){
    listArr = [];
    for(let i = 0; i < list.length; i++){
      listArr.push(list[i]._id.toString());
    }
    count = await DB.count('article', {'pid': {$in: listArr}});
    content = await DB.find('article', {'pid': {$in: listArr}}, {}, {page, pageSize});
  } else {
    count = await DB.count('article', {'pid': id});
    content = await DB.find('article', {'pid': id}, {}, {page, pageSize});
  }
  // console.log(content);
  // console.log(list);
  ctx.render('default/news',{
    list: list,
    content: content,
    page: page||1,
    totalPages: Math.ceil(count/pageSize),
    pid: id
  })
})
router.get('/content/:id', async(ctx)=>{
  let id = ctx.params.id;
  let detail;
  let content = await DB.find('article', {'_id': DB.getObjectId(id)});
  console.log('article: ' + content[0].pid);
  let parent = await DB.find('articlecate', {'_id': DB.getObjectId(content[0].pid)});
  console.log('articlecate: ' + parent[0].pid);
  // console.log(parents);
  if(parent[0].pid == '0'){
    detail = parent;
  } else {
    let parentG = await DB.find('articlecate', {'pid': parent[0].pid});
    detail = await DB.find('articlecate', {'_id': DB.getObjectId(parentG[0].pid)});
  }
  let nav = await DB.find('nav', {'title': detail[0].title});
  // console.log(nav);
  // console.log(nav[0].url);
  // console.log(parent);
  // console.log(content);
  ctx.state.G.url = nav[0].url;
  ctx.render('default/content', {
    list: content[0]
  })
})
router.get('/about', async(ctx)=>{
  // ctx.body = '关于我们'
  ctx.render('default/about')
})
router.get('/connect', async(ctx)=>{
  // ctx.body = '联系我们'
  ctx.render('default/connect');
})

module.exports = router.routes();
