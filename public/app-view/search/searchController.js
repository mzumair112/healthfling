app.controller('SearchController', ['$rootScope','$scope','$location' ,'HttpService','$window','FlashService', '$modal', 'MetaService', function( $rootScope,$scope,$location,HttpService,$window,FlashService, $modal, MetaService ){
    var vm = this;

    $location.search({});

    $rootScope.metaservice = MetaService;
    $rootScope.metaservice.set();

    $scope.countries = $rootScope.countryList;
    $scope.states = $rootScope.stateList;
    $scope.regions = $rootScope.regionList;

    $rootScope.savedPreference = $window.localStorage.getItem("healthyfling_preference");

    if ($rootScope.savedPreference == "locked") {
        $rootScope.search.country = $window.localStorage.getItem("healthyfling_preference_country") || "Country";
        $rootScope.search.state = $window.localStorage.getItem("healthyfling_preference_state") || "State";
        $rootScope.search.region = $window.localStorage.getItem("healthyfling_preference_region") || "Region";
        $rootScope.search.category = $window.localStorage.getItem("healthyfling_preference_category") || "Category";
    }

    $scope.savedPreference = ($rootScope.savedPreference == "locked");
    vm.savedPreference = ($rootScope.savedPreference == "locked");

    if ($scope.regions && $scope.regions.indexOf("Region") == -1){
        $scope.regions.unshift("Region");
    }

    $scope.categories = $rootScope.categoryList;

    $scope.changeListInCtrl = function(data){
        if(data != "" && data != undefined && data != "State" && data != "Provinces"){
            $rootScope.regionList = $rootScope.masterList[data];

            $scope.regions = $rootScope.regionList;
            $scope.regions.unshift("Region");
            var temp = $scope.regions;
            $scope.regions = temp.filter(function(item, pos){
              return temp.indexOf(item)== pos;
            });
        }else{
            if (vm.country == "United States" || vm.country == "Canada") {
                $scope.regions = ['Region'];
            }
        }
   };

   $scope.changeStateListInCtrl = function(data){
        if(data != "" && data != undefined && data != "Country"){
            $rootScope.masterList = $rootScope.masterListAll[data];
            $rootScope.stateList = Object.keys($rootScope.masterListAll[data]);
            $scope.states = $rootScope.stateList;
            // $rootScope.regionList = $rootScope.masterListAll[data];

            if (data != "United States" && data != "Canada") {
                $rootScope.regionList = $rootScope.masterList["State"];
                $scope.regions = $rootScope.regionList;
                $scope.regions.unshift("Region");
                var temp = $scope.regions;
                $scope.regions = temp.filter(function(item, pos){
                  return temp.indexOf(item)== pos;
                });
            }else if(data == "Canada"){

                vm.state = "Provinces";
            }
        }else{
            // $scope.regions = ['Region'];
        }
   };

    $rootScope.loading = true;

    $rootScope.adPosts = {};

    // vm.currentPage = 0;
    var path = $location.search();

    vm.currentPage = path.page || 0;
    vm.pageSize = 100;

    vm.country = $rootScope.search.country || "Country";
    vm.state = $rootScope.search.state || "State";
    vm.region = $rootScope.search.region || "Region";
    vm.category = $rootScope.search.category || "Category";

     vm.post = function () {
        $location.path('/post');
    };

    vm.pages = function () {
        vm.dataLoading = true;
        $location.path('/pages');
    };

    vm.login = function () {
        $rootScope.modalInstance = $modal.open({
           templateUrl: 'app-view/login/LoginView.html'
       });
    };

    vm.logout = function () {
        vm.dataLoading = true;

        // remove token from localstorage
        $window.localStorage.removeItem("token");

        $location.path('/');
        window.location.reload();
    };


    vm.lockPreference = function () {
        $window.localStorage.setItem("healthyfling_preference","locked");
        $window.localStorage.setItem("healthyfling_preference_country",vm.country);
        $window.localStorage.setItem("healthyfling_preference_state",vm.state);
        $window.localStorage.setItem("healthyfling_preference_region",vm.region);
        $window.localStorage.setItem("healthyfling_preference_category",vm.category);
        $rootScope.savedPreference = true;
        vm.savedPreference = true;
        $scope.savedPreference = "locked";
        FlashService.Success("Search preference saved for easier browsing.");

    };

    vm.unlockPreference = function () {
        $window.localStorage.setItem("healthyfling_preference","unlocked");

        vm.country = $rootScope.search.country = "Country";
        vm.state = $rootScope.search.state = "State";
        vm.region = $rootScope.search.region = "Region";
        vm.category = $rootScope.search.category = "Category";

        $rootScope.savedPreference = false;
        vm.savedPreference = false;
        $scope.savedPreference = "unlocked";
        FlashService.Success("Search preference has been deleted.");

    };

    vm.search = function () {
        $rootScope.search.country = vm.country;
        $rootScope.search.state = vm.state;
        $rootScope.search.region = vm.region;
        $rootScope.search.category = vm.category;

        this.reloadSearch();
    };

    vm.searchAll = function(){

        $rootScope.savedPreference = $window.localStorage.getItem("healthyfling_preference");

        if ($rootScope.savedPreference == "locked") {
            $rootScope.search.country = $window.localStorage.getItem("healthyfling_preference_country") || "Country";
            $rootScope.search.state = $window.localStorage.getItem("healthyfling_preference_state") || "State";
            $rootScope.search.region = $window.localStorage.getItem("healthyfling_preference_region") || "Region";
            $rootScope.search.category = $window.localStorage.getItem("healthyfling_preference_category") || "Category";

            vm.country = $rootScope.search.country || "Country";
            vm.state = $rootScope.search.state || "State";
            vm.region = $rootScope.search.region || "Region";
            vm.category = $rootScope.search.category || "Category";
        }else{
            vm.country = "Country";
            vm.state = "State";
            vm.region = "Region";
            vm.category = "Category";
            $rootScope.search.country = vm.country;
            $rootScope.search.state = vm.state;
            $rootScope.search.region = vm.region;
            $rootScope.search.category = vm.category;
        }
        $rootScope.loading = true;

        HttpService.GetAllPosts()
        .then(function(response){

            if (response.status == '200') {
                $rootScope.adPosts.data = [];

                for(var i = 0;i<response.data.length;i++){
                    $rootScope.adPosts.data.push(response.data[i]);
                }

                $rootScope.refreshAds();
                $rootScope.loading = false;
            }else{
                vm.dataLoading = false;
                $location.path('/');
                $rootScope.loading = false;
            };

        });
    }

    vm.searchFilter = function (country,state,region,category) {
        if(country == 'Country' && state == 'State' && region == 'Region'){

        }else{
            // $rootScope.loading = true;
            $rootScope.search.country = country;
            vm.country = country;
            $rootScope.search.state = state;
            vm.state = state;
            $rootScope.search.region = region;
            vm.region = region;
            $rootScope.search.category = category;
            vm.category = category;

            this.reloadSearch();
        };
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

                $rootScope.refreshAds();
                $rootScope.loading = false;
            }else{
                vm.dataLoading = false;
                $location.path('/');
                $rootScope.loading = false;
            };

        });
    }

    vm.nextPage = function(){
        vm.currentPage=vm.currentPage+1;

        $location.search('page',vm.currentPage);
    }

    vm.prevPage = function(){
        vm.currentPage=vm.currentPage-1;

        $location.search('page',vm.currentPage);
    }

    $scope.initController = function () {

        $rootScope.loading = true;
        HttpService.GetPosts()
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

                $rootScope.refreshAds();
                $rootScope.loading = false;
            }else{
                // FlashService.Error(response.data.resultDescription);
                vm.dataLoading = false;
                $location.path('/');
                $rootScope.loading = false;
            };

        });

    }

    $scope.openModal_subscribe = function (id){
      $rootScope.subscribePostId = id;
        $rootScope.modalInstance = $modal.open({
           templateUrl: 'app-view/subscribe/SubscribeView.html'
       });
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


app.controller("AdsController",['$scope','$rootScope','$location','HttpService','$window', function ($scope,$rootScope,$location,HttpService,$window) {

  var vm = {};

  $rootScope.savedPreference = $window.localStorage.getItem("healthyfling_preference");

    if ($rootScope.savedPreference == "locked") {
        $rootScope.search.country = $window.localStorage.getItem("healthyfling_preference_country") || "Country";
        $rootScope.search.state = $window.localStorage.getItem("healthyfling_preference_state") || "State";
        $rootScope.search.region = $window.localStorage.getItem("healthyfling_preference_region") || "Region";
        $rootScope.search.category = $window.localStorage.getItem("healthyfling_preference_category") || "Category";
    }

    $scope.savedPreference = ($rootScope.savedPreference == "locked");
    vm.savedPreference = ($rootScope.savedPreference == "locked");

  vm.country = $rootScope.search.country;
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
