app.controller('ContactCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
  var Fn = function(){
    var loadData = function(){
      var url="http://127.0.0.1:3000/ptcontact";
      $http.get(url)
      .then(function(response) {
        if ( response.data.code==200 ) {
          $scope.groups = response.data.data.groups || [];
          $scope.items = response.data.data.contacts || [];
          console.log('保存成功');
        }else{
          $scope.authError = response.data.message;
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
    loadData();
  }();
  // $scope.items = [];


  $scope.filter = '';
  // $scope.groups = [
  //   // {name: 'Coworkers'}, 
  //   // {name: 'Family'}, 
  //   // {name: 'Friends'}, 
  //   // {name: 'Partners'}, 
  //   // {name: 'Group'}
  // ];

  $scope.createGroup = function(){
    var group = {name: 'New Group'};
    group.name = $scope.checkItem(group, $scope.groups, 'name');
    $scope.groups.push(group);

    angular.forEach($scope.groups, function(item) {
      item.selected = false;
    });
    $scope.group = group;
    $scope.group.selected = true;
    $scope.filter = group.name;
  };

  $scope.checkItem = function(obj, arr, key){
    var i=0;
    angular.forEach(arr, function(item) {
      if(item[key].indexOf( obj[key] ) == 0){
        var j = item[key].replace(obj[key], '').trim();
        if(j){
          i = Math.max(i, parseInt(j)+1);
        }else{
          i = 1;
        }
      }
    });
    return obj[key] + (i ? ' '+i : '');
  };

  $scope.deleteGroup = function(item){
    $scope.groups.splice($scope.groups.indexOf(item), 1);
  };

  $scope.selectGroup = function(item){    
    angular.forEach($scope.groups, function(item) {
      item.selected = false;
    });
    $scope.group = item;
    $scope.group.selected = true;
    $scope.filter = item.name;
  };

  $scope.selectItem = function(item){    
    angular.forEach($scope.items, function(item) {
      item.selected = false;
      item.editing = false;
    });
    $scope.item = item;
    $scope.item.selected = true;
  };

  $scope.deleteItem = function(item){
    $scope.items.splice($scope.items.indexOf(item), 1);
    $scope.item = $filter('orderBy')($scope.items, 'first')[0];
    if($scope.item) $scope.item.selected = true;
  };

  $scope.createItem = function(){
    var item = {
      group: $scope.filter,
      avatar:'img/a0.jpg'
    };
    $scope.items.push(item);
    $scope.selectItem(item);
    $scope.item.editing = true;
  };

  $scope.editItem = function(item){
    if(item && item.selected){
      item.staticName = item.name;
      item.editing = true;
    }
  };

  $scope.doneEditing = function(item){
    item.editing = false;
    if(item.group){
      var url="http://127.0.0.1:3000/ptcontact";
      $http.post(url, {contact: item})
      .then(function(response) {
        if ( response.data.code==200 ) {
          console.log('保存成功');
        }else{
          $scope.authError = response.data.message;
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    }else{
      $scope.filter = item.name;
      $scope.items.forEach(function(ite,index){
        if(ite.group == item.staticName){
          ite.group = item.name;
        }
      });

    }
  };

  

}]);