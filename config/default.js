module.exports = {
	secret:   'mysecret',
	port:     '3000',
	mongoose: {
		uri: process.env.MONGO_URI || 'mongodb://localhost/app',
	}
};
