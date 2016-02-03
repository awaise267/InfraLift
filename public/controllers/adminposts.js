var app = angular.module('adminposts', []);
app.controller("adminpostsController", adminpostsController);
adminpostsController.$inject = [ '$scope', '$http', '$window'];
function adminpostsController($scope, $http, $window) {
	$http({
		method : 'GET',
		url : '/unapprovedposts',
		data : {
		}
	}).success(function(response) {
		if (response.Status != "Error") {
			console.log(response.Posts);
			$scope.approvePosts = [];
			$scope.count = 0;
			angular.forEach(response.Posts,function(value, key){
				console.log(value);
				$scope.approvePosts.push(value);				
			})
			
		} else {
			console.log("error");
		}			
	}).error(function(error) {
		console.log(error);
	});
	
	
	$scope.approve = function(index){
		console.log($scope.approvePosts[index].ID);
		$http({
			method : 'POST',
			url : '/approvepost',
			data : {
				"post_id": $scope.approvePosts[index].ID
			}
		}).success(function(response) {
			if (response.Status != "Error") {
				$scope.approvePosts.splice($scope.approvePosts[index],1);
			} else {
				console.log("error");
			}			
		}).error(function(error) {
			console.log(error);
		});
	}
}