app.controller('BlogListsCtrl', ['$scope', '$http','$state',function($scope, $http,$state) {
  var vm = this;
  vm.bloglists = [];
  vm.paginations = [];
  var init = function(){
    var url="http://127.0.0.1:3000/postblog";
    $http.get(url)
    .then(function(response) {
      if ( response.data.code==200 ) {
        vm.bloglists = response.data.lists;
        //vm.totalPage = response.data.totalPage;
        vm.totalPage = 13;
        if(vm.totalPage<5){
            for(var i=1;i<vm.totalPage+1;i++){
                vm.paginations.push({text:i,active:false});
            }
            vm.paginations[0].active = true;
        }else{
            vm.paginations = [
                {text:1,active:true},
                {text:2,active:false},
                {text:3,active:false},
                {text:4,active:false},
                {text:5,active:false}
            ];
        }
        uParse('.blog-post', {
            rootPath: '../ueditor/'
        })
      }else{
        $scope.authError = response.data.message;
      }
    }, function(x) {
      $scope.authError = 'Server Error';
    });
  };
  init();
  vm.loadPage = function(x){
    vm.paginations.forEach(function(item,index){
        item.active = false;
        if(item.text == x){
            item.active = true;
        }
    });
    console.log(x)
  };
  vm.changeLists = function(flag){
    if(flag){
      var t= $(".pagex a").text();
        if($(".pagex a").text()==vm.totalPage){
          return
        }
        if(vm.paginations[vm.paginations.length-1].active){
            var I=vm.paginations[vm.paginations.length-1].text;
            vm.paginations = [];
            for(var i=1;i<6;i++){
              if((I+i)<=vm.totalPage){
               vm.paginations.push({text:I+i,active:false});
              }
            }
            vm.paginations[0].active = true;
            vm.loadPage(vm.paginations[0].text);
        }else{
            var E=null;
            vm.paginations.forEach(function(item,index){
                if(item.active){
                    E=index+1;
                    item.active = false;
                }
            });
            vm.paginations[E].active = true;
            vm.loadPage(vm.paginations[E].text);
        }
    }else{
        if($(".pagex a").text()==1){
          return
        }
        if(vm.paginations[0].active){
            var I=vm.paginations[0].text;
            vm.paginations = [];
            for(var i=5;i>0;i--){
               vm.paginations.push({text:I-i,active:false});
            }
            vm.paginations[vm.paginations.length-1].active = true;
            vm.loadPage(vm.paginations[vm.paginations.length-1].text);
        }else{
            var E=null;
            vm.paginations.forEach(function(item,index){
                if(item.active){
                    E=index-1;
                    item.active = false;
                }
            });
            vm.paginations[E].active = true;
            vm.loadPage(vm.paginations[E].text);
        }
    }
      
  };
  vm.newBLog = function(){
    $state.go('apps.blogsim');
  };
  vm.newBLog2 = function(){
    $state.go('apps.blog');
  };
  vm.delete = function(id){
      $http.post("http://127.0.0.1:3000/deleteblog",{id:id})
      .then(function(response) {
         if(response.data.code==200){
            init();
         }
         
      }, function(x) {
        $scope.authError = 'Server Error';
      });
  };
}]);