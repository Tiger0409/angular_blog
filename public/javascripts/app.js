var app = angular.module('Blog', ['ngRoute', 'myService', 'myController', 'myDirective', 'ngCookies']);



//route->get different page
app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'postCtrl',
			templateUrl: '/template/listPost.html'
		})
		.when('/signup', {
			controller: 'registCtrl',
			templateUrl: '/template/signup.html'
		})
		.when('/signin', {
			controller: 'signinCtrl',
			templateUrl: '/template/signin.html'
		})
		.when('/myblog', {
			controller: 'myblogCtrl',
			templateUrl: '/template/myblog.html'
		})
		.when('/nosignin', {
			controller: 'noSigninCtrl',
			templateUrl: '/template/noSignin.html'
		})
		.when('/writePost', {
			controller: 'writeBlogCtrl',
			templateUrl: '/template/writePost.html'
		})
		.when('/detailPost', {
			controller: 'detailCtrl',
			templateUrl: '/template/postDetail.html'
		})
		.otherwise({
			redirectTo: '/'
		});
});


