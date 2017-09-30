var express = require('express');
var router = express.Router();


module.exports = function(db) {
	var postController = require("../controllers/postControllers.js")(db);
	
	router.get('/getAllPost', function (req, res, next) {
		postController.getAllPost().then(function(resJson) {
			res.json({status: true, posts: resJson});
		}).catch(function(err) {
			res.json({status: false});
		});
	});
	
	router.post('/getPostById', function(req, res, next) {
		postController.getPostById(req.body).then(function(resJson) {
			res.json({status: true, post: resJson});
		}).catch(function(err) {
			res.Json({status: false});
		});
	});

	router.get('/getPostByauthor', function(req, res, next) {
		if (typeof req.cookies.username !== 'undefined') {
			postController.getPostByAuthor(req.cookies.username).then(function(resJson) {
				res.json({status: true, post: resJson});
			}).catch(function(err) {
				res.json({status: false});
			});
		} else {
			res.json({status: false});	
		}
	});

	router.post('/getPostByKeyWord', function(req, res, next) {
		postController.getPostByKeyWord(req.body).then(function(resJson) {
			res.json({status: true, posts: resJson});
		}).catch(function(err) {
			res.json({status: false});
		});
	});

	router.post('/getPostByKeyWordAndAuthor', function(req, res, next) {
		if (typeof req.cookies.username !== 'undefined') {
			postController.getPostByKeyWordAndAuthor({keyWord: req.body.keyWord, authorUsername: req.cookies.username}).then(function(resJson) {
				res.json({status: true, posts: resJson});
			}).catch(function(err) {
				res.json({status: false});
			});
		} else {
			res.json({status: false});
		}
	});

	router.post('/getPostContent', function(req, res, next) {
		postController.getPostContent(req.body).then(function(resJson) {
			res.json({status: true, post: resJson});
		}).catch(function(err) {
			res.json({status: false});
		});
	});
	router.post('/deletePost', function(req, res, next) {
		postController.deletePost(req.body).then(function() {
			res.json({status: true});
		}).catch(function(err) {
			res.json({status: false});
		});
	});

	router.post('/addPost', function(req, res, next) {
		postController.addnewPost(req.body).then(function() {
			res.json({status: true});
		}).catch(function(err) {
			res.json({status: false});
		});
	});

	router.post('/hidePost', function(req, res, next) {
		if (req.cookies.username === 'admin') {
			postController.hidePost(req.body).then(function() {
				res.json({status: true});
			}).catch(function() {
				res.json({status: false});
			});
		} else {
			res.json({status: false});
		}
	});

	router.post('/showPost', function(req, res, next) {
		if (req.cookies.username === 'admin') {
			postController.showPost(req.body).then(function() {
				res.json({status: true});
			}).catch(function() {
				res.json({status: false});
			});
		} else {
			res.json({status: false});
		}
	});
	return router;
};