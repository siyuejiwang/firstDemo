app.controller('BlogCtrl', ['$rootScope','$scope', '$http','$state','$stateParams', function($rootScope,$scope, $http,$state,$stateParams) {
  var vm =this;
  var ue = UE.getEditor('myEditor');
  $scope.$on('$destroy', function() {
      ue.destroy();
  });
  vm.saveBLog = function(){
     var text = ue.getPlainTxt();
     // var html = ue.getAllHtml();
     var html = ue.getContent();
     var url=$rootScope.settings.apipath+"postblog";
     var data=null;
     if(!$stateParams.id){
        vm.data = {
          title: $scope.title, text: text,html:html
        }
     }else{
        vm.data.text = text;
        vm.data.html = html;
        vm.data.title = $scope.title;
     }
     $http.post(url, vm.data)
     .then(function(response) {
       if ( response.data.code==200 ) {
         $state.go('apps.bloglists');
       }else{
         $scope.authError = response.data.message;
       }
     }, function(x) {
       $scope.authError = 'Server Error';
     });
  };
  var Fn = function(){
    var loadData = function(){
       if($stateParams.id){
          $http.post($rootScope.settings.apipath+"getblogText", {id:$stateParams.id })
          .then(function(response) {
            if ( response.data.code==200 ) {
              vm.data = response.data.data;
              $scope.title = response.data.data.title;
              ue.ready(function() {
                  //异步回调
                  ue.execCommand('insertHtml', response.data.data.html);
              });
            }else{
              $scope.authError = response.data.message;
            }
          }, function(x) {
            $scope.authError = 'Server Error';
          });
       }
    };
    loadData();
  }();

}]);