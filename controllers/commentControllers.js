var ObjectID = require('mongodb').ObjectID;


module.exports = function (db) {
	var comments = db.collection('comments');
	var commentController = {
		getComment: function(dataJson) {
			return comments.find(dataJson).toArray().then(function(CommentArr) {
				return Promise.resolve(CommentArr);
			}).catch(function(err) {
				return Promise.reject(err);
			});
		},
		addComment: function(dataJson) {
			return new Promise(function(resolve, reject) {
				if (dataJson.content !== '') {
					comments.insert(dataJson);
					resolve();
				} else {
					reject("请从评论框输入评论，并不能为空");
				}
			});
		},
		deleteComment: function(dataJson) {
			return new Promise(function(resolve, reject) {
				comments.findOne({_id: ObjectID(dataJson._id)}).then(function(foundComment) {
					comments.remove(foundComment);
					resolve();
				}).catch(function(error) {
					reject();
				});
			});
		},
		editCommentstatus: function(dataJson) {
			return makeisEditfalse().then(function() {
				comments.findOne({_id: ObjectID(dataJson._id)}).then(function(foundComment) {
					comments.update({"_id" : ObjectID(dataJson._id)}, {$set: {"isEdit" : true}});
					return Promise.resolve();
				}).catch(function(err) {
					return Promise.reject(err);
				});
			});
		},
		editComment: function(dataJson) {
			return new Promise(function(resolve, reject) {
				if (dataJson.content !== '') {
					comments.findOne({_id: ObjectID(dataJson._id)}).then(function() {
						comments.update({"_id" : ObjectID(dataJson._id)}, {$set: {"content": dataJson.content, "isEdit": false}});
						resolve();
					}).catch(function(err) {
						reject(err);
					});
				} else {
					reject('请从评论框输入评论，并不能为空');
				}
			});
		},
		cancel: function(dataJson) {
			return new Promise(function(resolve,  reject) {
				comments.update({isEdit: true}, {$set: {"isEdit" : false}});
				resolve();				
			});
		},
		hideComment: function(dataJson) {
			return new Promise(function(resolve, reject) {
				comments.findOne({_id: ObjectID(dataJson._id)}).then(function(foundUser) {
					comments.update({"_id" : ObjectID(dataJson._id)}, {$set: {"isHide" : true}});
					resolve();
				}).catch(function(err) {
					reject(err);
				});
			});
		},
		showComment: function(dataJson) {
			return new Promise(function(resolve, reject) {
				comments.findOne({_id: ObjectID(dataJson._id)}).then(function() {
					comments.update({"_id" : ObjectID(dataJson._id)}, {$set: {"isHide" : false}});
					resolve();
				}).catch(function(err) {
					reject(err);
				});
			});
		},
		cancelAll: function() {
			return makeisEditfalse();
		},
		deleteCommentByPost: function(dataJson) {
			comments.remove({id: dataJson});
		}
	};

	function makeisEditfalse() {
		return new Promise(function(resolve, reject) {
			comments.update({isEdit: true}, {$set: {"isEdit" : false}});
			resolve();
		});
	}
	return commentController;
};
