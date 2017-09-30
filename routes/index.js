var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */

module.exports = function(db) {
	router.get('/', function(req, res, next) {
		res.sendFile('index.html', { root: path.join(__dirname, '../views') });
	});
	router.get('/favicon.ico', function(req, res, next) {
		res.end();
	});
	return router;
};