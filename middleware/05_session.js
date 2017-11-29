const session = require('koa-session');
const CONFIG = {
	key:       'koa:sess',
	maxAge:    86400000,
	overwrite: true,
	httpOnly:  true,
	signed:    true,
	rolling:   true,
	
};
exports.init = app => app.use(session(CONFIG, app));
