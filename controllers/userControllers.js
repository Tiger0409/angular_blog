var validdata = require("../public/javascripts/validdata.js");

module.exports = function(db) {
	var users = db.collection('users');
	var admin = {
		_id: 11111,
		username: "admin",
		password: "d033e22ae348aeb5660fc2140aec35850c4da997",
		nikiname: 'admin',
		email: "admin@qq.com",
		isAdmin: true
	};
	users.find({}).toArray().then(function(userArr) {
		if (userArr.length === 0) {
			users.insert(admin);
		}
	});
	var userController = {
		signupCheck: function(user) {
			 return checkUser(user).then(function() {
				if (user.repassword) delete user.repassword;
				users.insert(user);
				return new Promise(function(resolve, reject) {
					resolve(user);
					});
				}).catch(function(error) {
				return new Promise(function(resolve, reject) {
					reject(error);
				});
			});
		},
		signinCheck: function(user) {
			return new Promise(function(resolve, reject) {
				users.findOne({username:user.username}).then(function(foundUser) {
				if (foundUser) {
					if (foundUser.password == user.password) {
						resolve(foundUser);
					}
					else reject("password");
				} else {
					reject("username");
				}
			});
			});
		},
		checkDataUnique: function(value) {
			return new Promise(function(resolve, reject) {
				users.findOne(value).then(function(foundvalue) {
					if (foundvalue) {
						reject("no");
					} else {
						resolve("ok");
					}
				});
			});
		},
		getUserByName: function(value) {
			return new Promise(function(resolve, reject) {
				users.findOne({username:value}).then(function(foundUser) {
					resolve(foundUser);
				}).catch(function() {
					reject("该用户不存在");
				});
			});
		}
	};
	var checkUser = function(user) {
		return new Promise(function(resolve, reject) {
			var flag = false;
			if (validdata.username(user.username) == "ok" && validdata.nikiname(user.nikiname) == "ok" && 
					validdata.email(user.email) == "ok" && user.password.length === 40 
						&& user.password != 'da39a3ee5e6b4b0d3255bfef95601890afd80709' && user.password === user.repassword) {
				flag = true;
			} else {
				reject("CheckUser:invalid");
			}
			if (flag) {
				users.findOne({ $or: [
					{ username: user.username },
					{ nikiname: user.nikiname },
					{ email: user.email }
					]}).then(function(foundUser) {
						foundUser ? reject('CheckUser:some attributes has been taken by others') : resolve();
					});
				}
			});
	};
	return userController;
};
