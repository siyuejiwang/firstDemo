app.controller('BlogCtrl', ['$scope', '$http','$state', function($scope, $http,$state) {
  var vm =this;
  var ue = UE.getEditor('myEditor');
  vm.saveBLog = function(){
     var text = ue.getPlainTxt();
     // var html = ue.getAllHtml();
     var html = ue.getContent();
     var url="http://127.0.0.1:3000/postblog";
     $http.post(url, {title: $scope.title, text: text,html:html})
     .then(function(response) {
       if ( response.data.code==200 ) {
         $state.go('apps.bloglists');
       }else{
         $scope.authError = response.data.message;
       }
     }, function(x) {
       $scope.authError = 'Server Error';
     });
  }

}]);