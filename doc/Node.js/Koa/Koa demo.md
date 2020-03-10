
```js
const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const views = require('koa-views')
const http = require('http')
const server = require('./server')

// fomr post ctx.request.body
const bodyparser = require('koa-bodyparser')

const app = new Koa()
let router = new Router()

router
  .get('/', async (ctx) => {
    await ctx.render('index', {
      title: 'Hello Koa2'
    })
  })
  .get('/todo', (ctx) => {
    let cities = [{city: 'sh', areaCode: '021'}]
    ctx.cookies.set('cities', JSON.stringify(cities))
    ctx.body = 'set cookie'
  })
  .get('/test', (ctx, next) => {
    let cities = ctx.cookies.get('cities')
    if(cities) {
      ctx.body = cities
    } else {
      ctx.body = 'nothing'
    }
  })
  .get('/json', async (ctx, next) => {
    let url = 'http://paperrestfz.aibeike.com/paperrest/rest/paper/getPaperDetailsInforMation.json?paperId=8a990d955b8055b8015c7c5097aa1adb&appKey=e4ce92a7eeb994c88e631741350e0191'
    let json  = await server.getContent(url)
    ctx.body = json || 123
  })

// 注意这里引用中间件的顺序 路由放在最后
app
  .use(static(path.join(__dirname, './static')))
  .use(views(path.join(__dirname, './page'), {
    extension: 'ejs'
  }))
  .use(bodyparser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000, () => {
  console.log(`server is starting at port 3000`)
})
```
