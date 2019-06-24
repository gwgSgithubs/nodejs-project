const Koa = require('koa');
const router = require('koa-router')();
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const sd = require('silly-datetime');
const jsonp = require('koa-jsonp');
const cors = require('koa2-cors');
const app = new Koa();

// 配置后台允许跨域
app.use(cors());
// 配置 jsonp 中间
app.use(jsonp());

app.use(bodyParser());
// 配置 session 中间件
app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess',
    maxAge: 8640000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,
    renew: false
};
app.use(session(CONFIG, app));

// 配置中间件
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat: dateFormat = function(value) {
        return sd.format(new Date(value), 'YYYY-MM-DD HH:mm');
    } /*扩展模板里面的方法*/
});

app.use(static(__dirname + '/public'));

// 引入 api \ admin \ index
const api = require('./routes/api.js');
const admin = require('./routes/admin.js');
const index = require('./routes/index.js');
// 配置 子 路由
router.use('/api', api);
router.use('/admin', admin);
router.use(index);

app.use(router.routes()).use(router.allowedMethods());
app.listen(8082, () => {
    console.log('at port 8081')
});