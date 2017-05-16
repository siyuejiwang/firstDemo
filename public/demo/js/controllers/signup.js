'use strict';

// signup controller
app.controller('SignupFormController', ['$rootScope','$scope', '$http', '$state', function($rootScope,$scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
      // Try to create
      $http.post($rootScope.settings.apipath+'signup', {name: $scope.user.name, email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
        if ( response.data.code==200 ) {
          $state.go('access.signin');
        }else{
          $scope.authError = response.data.message;
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
 ;