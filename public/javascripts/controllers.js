var myController = angular.module('myController', ['textAngular', 'myService', 'myDirective', 'ngCookies']);

//Parent Ctrl
myController.controller("parentCtrl", ['$scope', function($scope) {
	$scope.$on("homesearch-to-parentCtrl", function(d, data) {
		$scope.$broadcast("parentCtrl-to-postCtrl", 'true');
	});

	$scope.$on("myblogsearch-to-parentCtrl", function(d, data) {
		$scope.$broadcast("parentCtrl-to-myblogCtrl", 'true');
	});
}]);

//HomeCtrl
myController.controller("homepageCtrl",['$scope', '$location', 'User', 'Post', function($scope, $location, User, Post) {
	$scope.checkIfsignin = function() {
		$scope.website = User.getSignin() ? "myblog" : "nosignin";
	};
	$scope._checkIfsignin = function() {
		$scope._website = User.getSignin() ? "writePost" : "nosignin";
	};
	$scope.loadHtmlcheck = function() {
		User.checkIfsignin().then(function(resJson) {
			User.setUser(resJson);
			User.setSignin(true);
		}).catch(function() {
			User.setSignin(false);
		});
	};
	$scope.canShow= function() {
		return User.getSignin();
	};
	$scope.logOut = function() {
		User.logOut().then(function() {
			User.setUser({});
			User.setSignin(false);
			$location.path('/');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.loadHtmlcheck();

}]);

//signupCtrl
myController.controller("registCtrl",['$scope', '$http', '$location', 'DataCheck', 'User', function($scope, $http, $location, DataCheck, User) {
	$scope.user = {
		username: '',
		password: '',
		repassword: '',
		nikiname: '',
		email: '',
		isAdmin: false
	};
	$scope.error = {
		username: '',
		password: '',
		repassword: '',
		nikiname: '',
		email: ''
	};
	$scope.show = {
		username: '',
		password: '',
		repassword: '',
		nikiname: '',
		email: ''
	};
	$scope.close = function() {
		$location.path('/');
	};
	$scope.clear = function() {
		$scope.user.username = $scope.user.password = $scope.user.repassword = $scope.user.nikiname = $scope.user.email = '';
		$scope.error.username = $scope.error.password = $scope.error.repassword = $scope.error.nikiname = $scope.error.email = '';
		$scope.show.username = $scope.show.password = $scope.show.repassword = $scope.show.nikiname = $scope.show.email = '';
	};
	$scope.formatInfo = function($event) {
		var info = DataCheck.registInfo;
		var name = $event.target.name;
		$scope.show[name] = 'show';
		$scope.error[name] = info[name];
	};
	$scope.checkInput = function($event) {
		var name = $event.target.name;
		var res = DataCheck.regist[name]($scope.user[name]);
		if ("ok" !== res || name === 'password' || name === 'repassword') {
			$scope.error[name] = res;
		} else {
			var str = '{"' + name + '":"' + $scope.user[name] + '"}';
			var _json = JSON.parse(str);
			User.checkDuplicate(_json).then(function(message) {
				$scope.error[name] = message;
			}).catch(function(err) {
				console.log(err);
			});
		}
		$scope.show[name] = 'show';
	};
	$scope.postFrom = function() {
		var flag = true;
		for (var key in DataCheck.regist) {
			if ($scope.error[key] !== 'ok') flag = false;
		}
		if (flag) {
			$scope.user.password = hex_sha1($scope.user.password);
			$scope.user.repassword = $scope.user.password;
			$scope.user.isAdmin = false;
			User.postUser($scope.user).then(function(resJson) {
				User.setUser(resJson);
				$location.path('/');
			}).catch(function(err) {
				console.log(err);
			});
		} else {
			for (var key in $scope.show) {
				if ($scope.show[key] === '') {
					$scope.show[key] = 'show';
					$scope.error[key] = '不能为空';
				}
			}
		}
	};
}]);


//signin Ctrl
myController.controller("signinCtrl", ['$scope', '$http', '$location', 'User', 'DataCheck', function($scope, $http, $location, User, DataCheck) {
	$scope.show = {
		username: '',
		password: ''
	};
	$scope.error = {
		username: '',
		password: ''
	};
	$scope.initInfo = function() {
		$scope.error.username = $scope.error.password = '';
		$scope.show.username = $scope.show.password = '';
	};
	$scope.checkData = function() {
	var flag = true;
	if (!$scope.username || $scope.username === '') {
		$scope.error.username = DataCheck.signinInfo['empty'];
		$scope.show.username = 'show';
		flag = false;
	}
	if (!$scope.password || $scope.password === '') {
		$scope.error.password = DataCheck.signinInfo['empty'];
		$scope.show.password = 'show';
		flag = false;
	}
	if (flag) {
		var user = {username: $scope.username, password: hex_sha1($scope.password)};
		User.signinPost(user).then(function(resJson) {
			User.setUser(resJson);
			$location.path('/');
		}).catch(function(message) {
			$scope.error[message] = DataCheck.signinInfo[message];
			$scope.show[message] = 'show';
		});
	}
	};
	$scope.close = function() {
		$location.path('/');
	};
}]);


//Post Ctrl
myController.controller("postCtrl", ['$scope', '$location', '$cookies', '$cookieStore', 'Post', function($scope, $location, $cookies, $cookieStore, Post) {
	$scope.loadPost = function() {
		Post.loadPost().then(function(resJson) {
			$scope.posts = resJson;
			$scope.amount = Post.getPostNumbers();
			$scope.$broadcast('postCtrl to pagingDir', 'true');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.getTargetpost = function(item) {
		Post.getPostById(item).then(function() {
			$location.path('/detailPost');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.$on("parentCtrl-to-postCtrl", function(d, data) {
		$scope.isSearch = true;
		$scope.loadPost();
	});
	$scope.$on("paging-to-postCtr", function(d, data) {
		$scope.posts = data;
	});
	$scope.amount = 1;
	$scope.isSearch = false;
	$cookieStore.put('ifEdit', false);
	$scope.loadPost();
}]);
//NoSignIn Ctrl
myController.controller("noSigninCtrl", ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.close = function() {
		$location.path('/');
	};
}]);

//MyBlog Ctrl
myController.controller("myblogCtrl", ['$scope', '$location', '$cookies', '$cookieStore', 'Post', function($scope, $location, $cookies, $cookieStore,Post) {
	$scope.loadPost = function() {
		Post.loadPostByauthor().then(function(resJson) {
			$scope.posts = resJson;
			$scope.amount = Post.getPostNumbers();
			$scope.$broadcast('postCtrl to pagingDir', 'true');
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.getTargetpost = function(item) {
		Post.getPostById(item).then(function() {
			$location.path('/detailPost');
		});
	};
	$scope.$on("parentCtrl-to-myblogCtrl", function(d, data) {
		$scope.isSearch = true;
		$scope.loadPost();
	});
	$scope.$on("paging-to-postCtr", function(d, data) {
		$scope.posts = data;
	});
	$scope.amount = 1;
	$cookieStore.put('ifEdit', false);
	$scope.loadPost();
}]);

//WriteBlog Ctrl
myController.controller("writeBlogCtrl", ['$scope', 'Post', '$location', '$cookies', '$cookieStore', 'User', function($scope, Post, $location, $cookies, $cookieStore,User) {
	var id;
	$scope.addPost = function() {
		var dataJson;
		if ($scope.postTitle === '' && $scope.htmlVariable === '') $scope.AlertInfo = '标题和内容不能空';
		else if ($scope.postTitle === '' && $scope.htmlVariable !== '') $scope.AlertInfo = '标题不能空';
		else if ($scope.postTitle !== '' && $scope.htmlVariable === '') $scope.AlertInfo = '内容不能空';
		else {
			console.log($scope.htmlVariable);
			if (!id)
				dataJson = {title: $scope.postTitle, content: $scope.htmlVariable, date: new Date(), author: User.getUser().nikiname, authorUsername: User.getUser().username, isHide: false};
			else
				dataJson = {_id: id, title: $scope.postTitle, content: $scope.htmlVariable, date: new Date(), author: User.getUser().nikiname, authorUsername: User.getUser().username, isHide: false};
			id = "";
			Post.submitPost(dataJson).then(function() {
				$cookieStore.put('ifEdit', false);
				$location.path('/myblog');
			});
		}
	};
	$scope.clear = function() {
		$scope.AlertInfo = '';
	};
	$scope.AlertInfo = '';
	var ifEdit = $cookieStore.get('ifEdit');
	if (ifEdit && ifEdit === true) {
		$scope.postTitle = $cookieStore.get('currentPost').title;
		Post.getPostBy_Id().then(function(resJson) {
			$scope.htmlVariable = resJson;
		});
		id = $cookieStore.get('currentPost')._id;
	} else {
		id = $scope.postTitle = $scope.htmlVariable = "";

	}
}]);
//Detail Ctr
myController.controller("detailCtrl", ['$scope', '$location', '$sce', '$cookies', '$cookieStore', '$http', 'Post', 'User', 'Comment', function($scope, $location, $sce, $cookies, $cookieStore, $http, Post, User, Comment) {
	$scope.comments = [];
	$scope.content = '';
	$scope.AlertInfo = '';
	$scope.post = {
		_id: '',
		title: '',
		content: '',
		date: '',
		author: '',
		authorUsername: '',
		isHide: ''
	};
	$cookieStore.put('ifEdit', false);
	$scope.loadDetail = function() {
		$scope.post = $cookieStore.get('currentPost');
		Post.getPostBy_Id().then(function(resJson) {
			$scope.post.content = $sce.trustAsHtml(resJson);
		});
		$http.get('/comments/cancelAll').then(function() {
			$scope.loadComment();
		});
	};
	$scope.loadComment = function() {
		Comment.loadComment().then(function(resJson) {
			$scope.comments = resJson;
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.backHome = function() {
		$location.path('/');
	};
	$scope.cancel = function(dataJson) {
		Comment.cancel(dataJson).then(function() {
			$scope.loadComment();
		});
	};
	$scope.editPost = function() {
		$cookieStore.put('ifEdit', true);
		$location.path('/writePost');
	};
	$scope.deletePost = function() {
		Post.deletePost().then(function() {
			$location.path('/');
		}).catch(function() {
			console.log('deletePost fail');
		});
	};
	$scope.deleteComment = function(item) {
		Comment.deleteComment(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.editCommentstatus = function(item) {
		Comment.editCommentstatus(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.editComment = function(item) {
		if (item.content !== '') {
			Comment.editComment(item).then(function() {
				$scope.loadComment();
			}).catch(function(err) {
				console.log(err);
			});
		}
	};
	$scope.submitComment = function(content) {
		if ($scope.content !== '') {
			$scope.comment1 = {
				content: $scope.content,
				time: new Date(),
				author: User.getUser().nikiname,
				authorUsername: User.getUser().username,
				id: $cookieStore.get('currentPost')._id,
				isEdit: false,
				isHide: false
			};
			$scope.content = '';
			Comment.addComment($scope.comment1).then(function() {
				$scope.loadComment();
			}).catch(function(err) {
				console.log(err);
			});
		} else {
			$scope.AlertInfo = '内容不能为空';
		}
	};
	$scope.operatorshowByauthor = function(dataJson) {
		if (dataJson.isHide)
			return false;
		return dataJson.authorUsername === User.getUser().username;
	};
	$scope.hidePost = function(item) {
		Post.hidePost(item).then(function() {
			$scope.loadDetail();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.showPost = function(item) {
		Post.showPost(item).then(function() {
			$scope.loadDetail();
		}).catch(function(err) {
			console.log(err);
		});		
	};
	$scope.hideComment = function(item) {
		Comment.hideComment(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});
	};
	$scope.showComment = function(item) {
		Comment.showComment(item).then(function() {
			$scope.loadComment();
		}).catch(function(err) {
			console.log(err);
		});	
	};
	$scope.clear = function() {
		$scope.AlertInfo = '';
	};
	$scope.showByadmin = function() {
		return User.getUser().isAdmin;
	};
	$scope.checkIfhide = function() {		
		return $cookieStore.get('currentPost').isHide;
	};
	$scope._checkIfhide = function(value) {
		return value;
	};
	$scope.showByauthor = function() {
		if ($scope.checkIfhide())
			return false;
		return User.getUser().nikiname == $scope.post.author;
	};
	$scope.showBycomments = function() {
		return Comment.getComments().length === 0 ? true : false;
	};
	$scope.showBysignin = function() {
		return User.getSignin();
	};

	$scope.loadDetail();
}]);

myController.controller("searchCtrl", ['$scope', '$location', '$cookies', '$cookieStore', 'Post', 'User', function($scope, $location, $cookies, $cookieStore, Post, User) {
	$scope.keyWord = "";
	$scope.search = function() {
		var mode = $location.path();
		if (mode === '/') {
			Post.getPostByKeyWord($scope.keyWord).then(function(resJson) {
				$scope.$emit("homesearch-to-parentCtrl", 'true');
			});
		}

		if (mode === '/myblog') {
			Post.getPostByKeyWordAndAuthor($scope.keyWord).then(function(resJson) {
				console.log(resJson);
				$scope.$emit("myblogsearch-to-parentCtrl", 'true');
			});
		}
		$scope.keyWord = "";
	};
}]);