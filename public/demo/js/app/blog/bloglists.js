app.controller('BlogListsCtrl', ['$scope', '$http', function($scope, $http) {
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
  // vm.bloglists = [
  //   {
  //       title: "双方的撒旦发生的方式的",
  //       htmlText: "适当放松的防守对方是否单身狗的方法的规定发给对方给对方答复电饭锅电饭锅电饭锅",
  //       src: 'img/c0.jpg'
  //   }
  // ];
  vm.saveBLog = function(){
    location.href="#/apps/blog";
  };
}]);