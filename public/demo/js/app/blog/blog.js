app.controller('BlogCtrl', ['$scope', '$http', function($scope, $http) {
  var vm =this;
  var ue = UE.getEditor('myEditor');
  vm.saveBLog = function(){
     var text = ue.getPlainTxt();
     var html = ue.getAllHtml();
     var url="http://127.0.0.1:3000/postblog";
     $http.post(url, {title: $scope.title, text: text,html:html})
     .then(function(response) {
       if ( response.data.code==200 ) {
         $rootScope.user = response.data.user;
         $state.go('app.dashboard-v1');
       }else{
         $scope.authError = response.data.message;
       }
     }, function(x) {
       $scope.authError = 'Server Error';
     });
  }

}]);