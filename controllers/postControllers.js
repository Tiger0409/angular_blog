var ObjectID = require('mongodb').ObjectID;

module.exports = function(db) {
	var post = db.collection('post');
	var commentCtrl = require('./commentControllers.js')(db);
	post.find({}).toArray().then(function(postArr) {
		if (postArr.length === 0) {
			post.save({
				_id: ObjectID(2222),
				title: '示例文章',
				content: '示例内容',
				date: '2017-01-18 23:59',
				author: 'admin',
				authorUsername: 'admin',
				isHide: false
			});
		}
	});


	var postController = {
		addnewPost: function (newPost) {
			if (newPost._id) newPost._id = ObjectID(newPost._id);
			return post.save(newPost).then(function() {
				return Promise.resolve('success');
			}).catch(function() {
				return Promise.reject('fail');
			});
		},
		getAllPost: function() {
			return new Promise(function(resolve, reject) {
				post.find({}, {'content': 0}).sort({"date": -1}).toArray().then(function(PostArr) {
					resolve(PostArr);
				}).catch(function(err) {
					reject(err);
				});
			});
		},
		getPostById: function(dataJson) {
			return new Promise(function(resolve, reject) {
				post.findOne({_id: ObjectID(dataJson._id)}, {'content': 0}).then(function(foundPost) {
					resolve(foundPost);
				}).catch(function() {
					reject("no exist");
				});
			});
		},
		getPostByAuthor: function(dataJson) {
			return new Promise(function(resolve, reject) {
				post.find({'authorUsername': dataJson}, {'content': 0}).sort({"date": -1}).toArray().then(function(PostArr) {
					resolve(PostArr);
				}).catch(function(err) {
					rejecte(err);
				});
			});
		},
		deletePost: function (dataJson) {
			return new Promise(function(resolve, reject) {
				post.findOne({_id: ObjectID(dataJson._id)}).then(function(foundPost) {
					post.remove(foundPost);
					commentCtrl.deleteCommentByPost(dataJson._id);
					resolve();
				}).catch(function(err) {
					reject(err);
				});
			});
		},
		getPostByKeyWord: function(dataJson) {
			return new Promise(function(resolve, reject) {
				post.find({"title": {$regex: dataJson.keyWord, $options: "i"}}).sort({"date": -1}).toArray().then(function(PostArr) {
					resolve(PostArr);
				}).catch(function(err) {
					reject("Not Found");
				});
			});
		},
		getPostContent: function(dataJson) {
			return new Promise(function(resolve, reject) {
				post.findOne({_id: ObjectID(dataJson._id)}, {'content': 1}).then(function(foundPost) {
					resolve(foundPost);
				}).catch(function() {
					reject("no exist");
				});
			});
		},
		getPostByKeyWordAndAuthor: function(dataJson) {
			return new Promise(function(resolve, reject) {
				post.find({"authorUsername": dataJson.authorUsername, "title": {$regex: dataJson.keyWord, $options: "i"}}).sort({"date": -1}).toArray().then(function(PostArr) {
					resolve(PostArr);
				}).catch(function(err) {
					reject("Not Found");
				});
			});
		},
		showPost: function(dataJson) {
			return new Promise(function(resolve, reject) {
				post.findOne({_id: ObjectID(dataJson._id)}).then(function(foundPost) {
					post.update({"_id" : ObjectID(dataJson._id)}, {$set: {"isHide" : false}});
					resolve();
				}).catch(function() {
					reject();
				});
			});			
		},
		hidePost: function(dataJson) {
			return new Promise(function(resolve, reject) {
				post.findOne({_id: ObjectID(dataJson._id)}).then(function(foundPost) {
					post.update({"_id" : ObjectID(dataJson._id)}, {$set: {"isHide" : true}});
					resolve();
				}).catch(function() {
					reject();
				});
			});
		}
	};


	return postController;
};