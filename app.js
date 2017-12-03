const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const fs = require('fs');
const path = require('path');
const config = require('config');
const mongoose = require('./lib/mongoose');
const messageSchema = require('./models/message');

app.keys = [config.secret];

fs.readdirSync(path.join(__dirname, 'middleware')).sort()
  .forEach(middleware => require('./middleware/' + middleware).init(app));

const Message = mongoose.model('Message', messageSchema);

let users = [];

router.get('/subscribe', async (ctx, next) => {
	
  ctx.set('Cache-Control', 'no-cache, must-revalidate');
  const promise = new Promise((resolve, reject) => {
    users.push(resolve);
		
    ctx.res.on('close', function () {
      users.splice(users.indexOf(resolve), 1);
      const error = new Error('Connection closed');
      error.code = 'ECONNRESET';
      reject(error);
    });
  });
  
  let message;
	
  try {
    message = await promise;
    } catch (err) {
    if (err.code === 'ECONNRESET') return;
    throw err;
  }
	
  console.log('DONE', message);
  ctx.body = message;
});

async function saveToDb(ctx,next) {
	await Message.create({email: ctx.request.body.email, message: ctx.request.body.message})
		.then(() => console.log('saved'));
		
	await next();
}

router.post('/publish', saveToDb, async (ctx, next) => {
	
  const message = ctx.request.body.message;
	
  if (!message) {
    ctx.throw(400);
  }
  users.forEach(function (resolve) {
  resolve(String(message));
  });
	
  users = [];
	
  ctx.body = 'ok';
	
});

async function loadMessageById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.messageById)) {
    ctx.throw(400);
  }
  ctx.messageById = await Message.findById(ctx.params.messageById);
  if (!ctx.messageById) {
    ctx.throw(400);
  }
  await next();
}

async function loadPaginationMessages(ctx, next) {
  const number = ctx.params.number * 10;
  await Message.paginate({}, {offset: number, limit: 10})
    .then((result) => ctx.paginationMessages = result);
    await next();
}

router
  .get('/messages/single/:messageById', loadMessageById, function (ctx) {
  ctx.body = ctx.messageById.toObject();
  })
  .get('/messages/list/:number', loadPaginationMessages, function (ctx) {
  ctx.body = ctx.paginationMessages;
  });

app.use(router.routes());
app.listen(3000);
