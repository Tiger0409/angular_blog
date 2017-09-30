var myDirective = angular.module('myDirective', ['myService', 'myController']);

myDirective.directive('paging', function () {
	return {
		restrict: 'E',
		templateUrl: '/template/paging.html',
		replace: true,
		scope: {},
		controller: function($scope, Post) {
			$scope.currentPage = 1;
			$scope.itemsOfPrePage = 7;
			$scope.pageNums = 0;
			$scope.pageNumsLimit = 9;
			$scope.loadPaging =  function() {
				var num = Post.getPostNumbers() / $scope.itemsOfPrePage;
				var num1 = Post.getPostNumbers() % $scope.itemsOfPrePage;
				if (num1 !== 0) num += 1;
				$scope.pageNums = parseInt(num);
				var _nums = [];
				if ($scope.pageNums > $scope.pageNumsLimit) {
					for (var i = 0; i < $scope.pageNumsLimit; i++) {
						if (i !== $scope.pageNumsLimit - 2 && i !== $scope.pageNumsLimit - 1)
							_nums[i] = i + 1;
						else if (i === $scope.pageNumsLimit - 1)
							_nums[i] = $scope.pageNums;
						else _nums[i] = 99999;
					}
				} else {
					for (var j = 0; j < $scope.pageNums; j++) 
						_nums[j] = j + 1;
				}
				$scope.nums = _nums;
			};

			$scope.getClickPageItems = function(item) {
				if (item === 99999 || item === 99998) return;
				$scope.currentPage = item;
				Post.getPostByClickPage(item).then(function(resJson) {
					$scope.reset();
					$scope.$emit('paging-to-postCtr', resJson);
				}).catch(function(err) {
					console.log(err);
				});
			};
			$scope.getItemsByPrePage = function() {
				if (($scope.currentPage - 1) < 1) 
					return;
				else {
					$scope.currentPage--;
					$scope.getClickPageItems($scope.currentPage);
				}
			};

			$scope.getItemsByNextPage = function() {
				if (($scope.currentPage + 1) > $scope.pageNums)
					return;
				else {
					$scope.currentPage++;
					$scope.getClickPageItems($scope.currentPage);
				}
			};
			$scope.reset = function() {
				if ($scope.pageNums <= $scope.pageNumsLimit) return;
				var _nums = [];
				if ($scope.currentPage <= parseInt($scope.pageNumsLimit / 2)) {
					for (var j = 0; j < $scope.pageNumsLimit; j++) {
						if (j === $scope.pageNumsLimit - 1) {
							_nums[j] = $scope.pageNums;
						} else if (j === $scope.pageNumsLimit - 2) {
							_nums[j] = 99999;
						} else {
							_nums[j] = j + 1;
						}
					}
				} else if ($scope.currentPage >= $scope.pageNums - parseInt($scope.pageNumsLimit / 2) - 1) {
					for (var k = 0; k < $scope.pageNumsLimit; k++) {
						if (k === $scope.pageNumsLimit - 1) {
							_nums[k] = $scope.pageNums;
						} else if (k === 1) {
							_nums[k] = 99999;
						} else if (k === 0) {
							_nums[k] = 1;
						} else {
							_nums[k] = $scope.pageNums + k - $scope.pageNumsLimit;
						}
					}				
				} else {
					_nums = [];
					for (var i = 0; i < $scope.pageNumsLimit; i++) {
						if (i === 0) {
							_nums[i] = 1;
							_nums[i + 1] = 99999;
						} else if (i === $scope.pageNumsLimit - 1) {
							_nums[i] = $scope.pageNums;
							_nums[i - 1] = 99998;

						} else {
							if (i !== 1 && i !== $scope.pageNumsLimit - 2)
								_nums[i] = $scope.currentPage + i - 4;
						}
					}
				}
				$scope.nums = _nums;
			};
			$scope.$on("postCtrl to pagingDir", function(d, data) {
				$scope.loadPaging();
			});
			$scope.$on("parentCtrl-to-postCtrl", function(d, data) {
				$scope.currentPage = 1;
			});
			$scope.$on("parentCtrl-to-myblogCtrl", function(d, data) {
				$scope.currentPage = 1;
			});
		}
	};
});