'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$rootScope','$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      // Try to login
      var url=Apipath+"login";
      $http.post(url, {username: $scope.user.username, password: $scope.user.password})
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
    };
  }])
;