var express = require('express');
var router = express.Router();


module.exports = function (db) {
	var commentControllers = require('../controllers/commentControllers.js')(db);

	
	router.post('/getComment', function(req, res, next) {
		commentControllers.getComment(req.body).then(function(resJson) {
			res.json({status: true, comments: resJson});
		}).catch(function(err) {
			res.json({status: false, err: err});
		});
	});
	router.post('/addComment', function(req, res, next) {
		commentControllers.addComment(req.body).then(function() {
			res.json({status: true});
		}).catch(function(err) {
			res.json({status: false, err: err});
		});
	});
	router.post('/deleteComment', function(req, res, next) {
		commentControllers.deleteComment(req.body).then(function() {
			res.json({status: true});
		}).catch(function(err) {
			res.json({status: false});
		});
	});
	router.post('/editCommentstatus', function(req, res, next) {
		commentControllers.editCommentstatus(req.body).then(function() {
			res.json({status: true});
		}).catch(function(err) {
			res.json({status: false});
		});
		
	});
	router.post('/editComment', function(req, res, next) {
		commentControllers.editComment(req.body).then(function() {
			res.json({status: true});
		}).catch(function(err) {
			res.json({status: false});
		});
	});
	router.post('/cancel', function(req, res, next) {
		commentControllers.cancel().then(function() {
			res.json({status: true});
		});
	});
	router.get('/cancelAll', function(req, res, next) {
		commentControllers.cancelAll().then(function() {
			res.json({status: true});
		}).catch(function(err) {
			res.json({status: false});
		});
	});
	router.post('/hideComment', function(req, res, next) {
		if (req.cookies.username === 'admin') {
			commentControllers.hideComment(req.body).then(function() {
				res.json({status: true});
			}).catch(function(err) {
				res.json({status: false});
			});			
		} else {
			res.json({status: false});
		}
	});
	router.post('/showComment', function(req, res, next) {
		if (req.cookies.username === 'admin') {
			commentControllers.showComment(req.body).then(function() {
				res.json({status: true});
			}).catch(function(err) {
				res.json({status: false});
			});
		} else {
			res.json({status: false});
		}
	});
	return router;
};