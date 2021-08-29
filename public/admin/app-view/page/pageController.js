app.controller('PageController', ['$rootScope','$scope','$location' ,'HttpService', '$window', function( $rootScope,$scope,$location,HttpService, $window ){
    var vm = this;

    $rootScope.pageTitle = "Healthy Fling";

    $scope.states = $rootScope.stateList;
    $scope.regions = $rootScope.regionList;
    if ($scope.regions && $scope.regions.indexOf("Region") == -1){
        $scope.regions.unshift("Region");
    }

    $scope.categories = $rootScope.categoryList;

    $scope.changeListInCtrl = function(data){
        $rootScope.regionList = $rootScope.masterList[data];

        $scope.regions = $rootScope.regionList
        $scope.regions.unshift("Region");
   };

    $rootScope.loading = true;

    $rootScope.adPosts = {};

    vm.currentPage = 0;
    vm.pageSize = 10;

    vm.state = $rootScope.search.state;
    vm.region = $rootScope.search.region;
    vm.category = $rootScope.search.category;

     vm.post = function () {
        $location.path('/post');
    };

    vm.dashboard = function () {
      $location.path('/');
    };

    vm.logout = function () {
        $location.path('/login');
    };

    vm.search = function () {
        $rootScope.search.status = "";
        $rootScope.search.state = vm.state;
        $rootScope.search.region = vm.region;
        $rootScope.search.category = vm.category;

        this.reloadSearch();
        $location.path('/search');
    };

    vm.flagged_search = function () {
        $rootScope.search.state = vm.state;
        $rootScope.search.region = vm.region;
        $rootScope.search.category = vm.category;
        $rootScope.search.status = "flagged";

        this.reloadSearch();
        $location.path('/search');
    };
    vm.users = function () {
        $rootScope.loading = true;
        vm.dataLoading = true;
        $location.path('/users');
    };
    vm.pages = function () {
        $rootScope.loading = true;
        vm.dataLoading = true;
        $location.path('/pages');
    };

    vm.pagePosts = function () {
        $rootScope.loading = true;
        vm.dataLoading = true;
        $location.path('/pagePosts');
    };

      vm.reloadSearch = function(){
        $rootScope.loading = true;
        HttpService.GetPosts()
        .then(function(response){

            if (response.status == '200') {
                $rootScope.adPosts.data = [];

                for(var i = 0;i<response.data.length;i++){
                    $rootScope.adPosts.data.push(response.data[i]);
                }

                // $rootScope.refreshAds();
                $rootScope.loading = false;
            }else{
                vm.dataLoading = false;
                $location.path('/');
                $rootScope.loading = false;
            };

        });
    }

    $scope.initController = function () {

        $rootScope.loading = true;
        HttpService.GetPages()
        .then(function(response){

            if (response.status == '200') {
                $rootScope.visitedSearchPage = true;
                // $rootScope.allCharts.pie.labels = [];
                // $rootScope.allCharts.pie.data = [];
                // for(var i = 0;i<response.data.data.length;i++){
                //     $rootScope.allCharts.pie.labels.push(response.data.data[i][0]);
                //     $rootScope.allCharts.pie.data.push(parseInt(response.data.data[i][1]));
                // }
                // $rootScope.refreshPie();
                $rootScope.adPosts.data = [];

                for(var i = 0;i<response.data.length;i++){
                    $rootScope.adPosts.data.push(response.data[i]);
                    // $rootScope.allCharts.pie.labels.push(response.data.data[i][0]);
                    // $rootScope.allCharts.pie.data.push(parseInt(response.data.data[i][1]));
                }

                // $rootScope.refreshAds();
                $rootScope.loading = false;
            }else{
                // FlashService.Error(response.data.resultDescription);
                vm.dataLoading = false;
                $location.path('/');
                $rootScope.loading = false;
            };

        });

    }

    $scope.readPage = function (page) {
      $window.open('https://www.healthyfling.com/#/page/' + page._id + '?edit=true', '_blank');
    }

    $scope.editPage = function (page) {
      $window.open('https://www.healthyfling.com/#/post?page=' + page._id + '&editPage=true', '_blank');
    }

}]);

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        if (input) {
            return input.slice(start);
        }else{
            return 0;
        }

    }
});

app.filter('roundup', function() {
  return function(input) {
    return Math.ceil(input);
  };
});


app.controller("AdsController",['$scope','$rootScope','$location','HttpService', function ($scope,$rootScope,$location,HttpService) {

  var vm = {};
  vm.state = $rootScope.search.state;
  vm.region = $rootScope.search.region;
  vm.category = $rootScope.search.category;

  $rootScope.loading = true;

  $rootScope.currentPost = {};

   $rootScope.viewDetail = function(data){

        $rootScope.currentPost.data = data;
        $location.path("/detail/"+data['_id']);
   }

  $rootScope.refreshAds = function(){

    HttpService.GetPosts()
    .then(function(response){

        if (response.status == '200') {
            $rootScope.adPosts.data = [];

            if($rootScope.search.region != "Region" && $rootScope.search.region != ""){
                $rootScope.pageTitle = $rootScope.search.region;
            }else{
                $rootScope.pageTitle = "All Regions";
            }

            for(var i = 0;i<response.data.length;i++){
                $rootScope.adPosts.data.push(response.data[i]);
            }

            $rootScope.loading = false;
        }else{
            $rootScope.loading = false;
            vm.dataLoading = false;
            $location.path('/');
        };

    });

    // if($rootScope.adPosts.data){
        $scope.data = $rootScope.adPosts.data.reverse();
    // }

  }

}]);
