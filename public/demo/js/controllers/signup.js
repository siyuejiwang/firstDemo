'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
      // Try to create
      $http.post('http://127.0.0.1:3000/signup', {name: $scope.user.name, email: $scope.user.email, password: $scope.user.password})
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