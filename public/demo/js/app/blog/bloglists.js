app.controller('BlogListsCtrl', ['$rootScope','$scope', '$http','$state',function($rootScope,$scope, $http,$state) {
  var vm = this;
  vm.bloglists = [];
  vm.paginations = [];
  vm.currentPage = 1;
  var init = function(){
    var url=Apipath+"postblog";
    $http({
      method: 'GET',
      url: url,
      params: {'page': vm.currentPage}
    })
    .then(function(response) {
      vm.paginations = [];
      if ( response.data.code==200 ) {
        vm.bloglists = response.data.lists;
        vm.totalPage = vm.bloglists[0] && vm.bloglists[0].num;
        if(vm.totalPage<vm.currentPage) vm.currentPage = vm.totalPage;
        if(vm.totalPage<5){
            for(var i=1;i<vm.totalPage+1;i++){
                vm.paginations.push({text:i,active:false});
            }
            vm.paginations[vm.currentPage-1].active = true;
        }else{
            var t = vm.currentPage%5 ? Math.floor(vm.currentPage/5)*5+1: vm.currentPage-4;
            for(var k=t; k<t+5;k++){
               if(vm.currentPage == k)
                vm.paginations.push({text:k,active:true});
               else  vm.paginations.push({text:k,active:false});
            }
            // vm.paginations = [
            //     {text:1,active:true},
            //     {text:2,active:false},
            //     {text:3,active:false},
            //     {text:4,active:false},
            //     {text:5,active:false}
            // ];
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
    vm.currentPage = x;
    init();
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
      $http.post(Apipath+"deleteblog",{id:id})
      .then(function(response) {
         if(response.data.code==200){
            vm.currentPage = 1;
            init();
         }
         
      }, function(x) {
        $scope.authError = 'Server Error';
      });
  };
}]);