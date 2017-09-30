var express = require('express');
var router = express.Router();

module.exports = function(db) {
	var userController = require('../controllers/userControllers.js')(db);

	router.post('/signin', function(req, res, next) {
		userController.signinCheck(req.body).then(function(resJson) {
			res.cookie("username", req.body.username, {maxAge: 60000 * 60 * 24, httpOnly: true});
			res.json({status: true, res: resJson});
		}).catch(function(message) {
			res.json({status: false, res: message});
		});
	});
	router.post('/signup', function(req, res, next) {
		userController.signupCheck(req.body).then(function(resJson) {
			res.cookie("username", req.body.username, {maxAge: 60000 * 60 * 24, httpOnly: true});
			res.json({status: true, res: resJson});
		}).catch(function(message) {
			res.json({status: false, res: message});
		});
	});
	router.get('/logout', function(req, res, next) {
		res.clearCookie('username');
		res.end();
	});
	router.post('/checkDuplicate', function(req, res, next) {
		userController.checkDataUnique(req.body).then(function(message) {
			res.end('ok');
		}).catch(function(message) {
			res.end('已重复');
		});
	});
	router.get('/checkIfsignin', function(req, res, next) {
		if (typeof req.cookies.username != 'undefined') {
			userController.getUserByName(req.cookies.username).then(function(resJson) {
				res.json({status: true, res: resJson});
			}).catch(function() {
				res.json({status: false});
			});
		} else {
			res.json({status: false});
		}
	});
	return router;
};

