app.controller('MailCtrl', ['$scope', function($scope) {
  $scope.folds = [
    {name: 'Inbox', filter:''},
    {name: 'Starred', filter:'starred'},
    {name: 'Sent', filter:'sent'},
    {name: 'Important', filter:'important'},
    {name: 'Draft', filter:'draft'},
    {name: 'Trash', filter:'trash'}
  ];

  $scope.labels = [
    {name: 'Angular', filter:'angular', color:'#23b7e5'},
    {name: 'Bootstrap', filter:'bootstrap', color:'#7266ba'},
    {name: 'Client', filter:'client', color:'#fad733'},
    {name: 'Work', filter:'work', color:'#27c24c'}
  ];

  $scope.addLabel = function(){
    $scope.labels.push(
      {
        name: $scope.newLabel.name,
        filter: angular.lowercase($scope.newLabel.name),
        color: '#ccc'
      }
    );
    $scope.newLabel.name = '';
  }

  $scope.labelClass = function(label) {
    return {
      'b-l-info': angular.lowercase(label) === 'angular',
      'b-l-primary': angular.lowercase(label) === 'bootstrap',
      'b-l-warning': angular.lowercase(label) === 'client',
      'b-l-success': angular.lowercase(label) === 'work'      
    };
  };

}]);

app.controller('MailListCtrl', ['$scope', 'mails', '$stateParams', function($scope, mails, $stateParams) {
  $scope.fold = $stateParams.fold;
  mails.all().then(function(mails){
    $scope.mails = mails;
  });
}]);

app.controller('MailDetailCtrl', ['$scope', 'mails', '$stateParams', function($scope, mails, $stateParams) {
  mails.get($stateParams.mailId).then(function(mail){
    $scope.mail = mail;
  })
}]);

app.controller('MailNewCtrl', ['$scope','$http','toaster',function($scope,$http,toaster) {
  $scope.mail = {
    to: '',
    subject: '',
    content: ''
  }
  $scope.tolist = [
    {name: 'mengfanyue', email:'siyuejiwang@163.com'},
    {name: 'Luoris Kiso', email:'luoris.kiso@hotmail.com'},
    {name: 'Lucy Yokes', email:'lucy.yokes@gmail.com'}
  ];
  $scope.send = function(){
      $scope.loading = true;
      var url="http://127.0.0.1:3000/sendemail";
      $http.post(url, {to: $scope.mail.to, subject: $scope.mail.subject, content: $("#content").text()})
      .then(function(response) {
          toaster.pop('success', '发送状态', response.data.message);
          $scope.loading = false;
      }, function(x) {
        $scope.authError = 'Server Error';
        $scope.loading = false;
      });
  };
}]);

angular.module('app').directive('labelColor', function(){
  return function(scope, $el, attrs){
    $el.css({'color': attrs.color});
  }
});