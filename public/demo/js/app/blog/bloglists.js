app.controller('BlogListsCtrl', ['$scope', '$http','$state',function($scope, $http,$state) {
  var vm = this;
  vm.bloglists = [];
  var url="http://127.0.0.1:3000/postblog";
  $http.get(url)
  .then(function(response) {
    if ( response.data.code==200 ) {
      vm.bloglists = response.data.lists;
    }else{
      $scope.authError = response.data.message;
    }
  }, function(x) {
    $scope.authError = 'Server Error';
  });
  vm.newBLog = function(){
    $state.go('apps.blog');
  };
}]);