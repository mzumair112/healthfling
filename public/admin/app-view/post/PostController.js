app.controller('PostController', ['$rootScope','$scope','$location' ,'HttpService', '$window', function( $rootScope,$scope,$location,HttpService,$window ){
    var vm = this;
   vm.dashboard = function () {
      $location.path('/');
    };
     vm.login = function () {
      $location.path('/login');
    };

    vm.create = function () {
      $location.path('/create');
    };
    vm.users = function () {
        $rootScope.loading = true;
        vm.dataLoading = true;
        $location.path('/users');
    };

    vm.testing = "Asdasdasdasda";
 }]);
