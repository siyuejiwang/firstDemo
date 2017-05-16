app.controller('BlogsimCtrl', ['$rootScope','$scope', '$http','$state', function($rootScope,$scope, $http,$state) {
  var vm =this;
  var simplemde = new SimpleMDE({ 
    element: $("#simde")[0],
    //autoDownloadFontAwesome: false 是否下载fw字体
    //autofocus: false 是否自动获得焦点
    //autosave: {enabled: true,delay:10000,uniqueId:唯一ID} 是否自动保存
    //
    autosave: true,

  });
  vm.saveBLog = function(){
     var text = null;
     // var html = ue.getAllHtml();
     var html = marked(simplemde.value());
     var url=$rootScope.settings.apipath+"postblog";
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