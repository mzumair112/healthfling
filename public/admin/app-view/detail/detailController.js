app.controller('DetailController', ['$rootScope','$scope','$location','HttpService','$http','$route','FlashService', function( $rootScope,$scope,$location,HttpService,$http,$route,FlashService){
    var vm = this;

    if($rootScope.visitedSearchPage){
        $rootScope.loading = true;
    }




    $scope.states = $rootScope.stateList;
    $scope.regions = $rootScope.regionList || ["REGION"];
    if ($scope.regions && $scope.regions.indexOf("Region") == -1){
        $scope.regions.unshift("Region");
    }
    $scope.categories = $rootScope.categoryList;

    $scope.changeListInCtrl = function(data){
        $rootScope.regionList = $rootScope.masterList[data];

        $scope.regions = $rootScope.regionList
        $scope.regions.unshift("Region");
   };

   $scope.changeMainImage = function(file){
        $scope.mainImage = file.secure_url;
   }

    vm.state = $rootScope.search.state;
    vm.region = $rootScope.search.region;
    vm.category = $rootScope.search.category;



    var path = $location.path();
    var arr = path.split("/");
    var id = arr[arr.length-1];
    $scope.id = id;

    vm.users = function () {
        $rootScope.loading = true;
        vm.dataLoading = true;
        $location.path('/users');
    };
    vm.logout = function () {
        $location.path('/login');
    };

    vm.login = function () {
        $location.path('/login');
    };

    vm.dashboard = function () {
      $location.path('/');
    };


    vm.search = function () {
        $rootScope.loading = true;

        $rootScope.search.status = "";
        $rootScope.search.state = this.state;
        $rootScope.search.region = this.region;
        $rootScope.search.category = this.category;
        vm.dataLoading = true;

        $location.path('/search');
    };

    vm.flagged_search = function () {
        $rootScope.loading = true;

        $rootScope.search.status = "flagged";
        $rootScope.search.state = this.state;
        $rootScope.search.region = this.region;
        $rootScope.search.category = this.category;
        vm.dataLoading = true;

        $location.path('/search');
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

    $scope.initController = function () {

        $http.get("/data.json")
        .success(function (data) {
            $rootScope.masterList = data;
        })

        vm.state = $rootScope.search.state || 'State';
        vm.region = $rootScope.search.region || 'Region';
        vm.category = $rootScope.search.category || 'Category';
      var path = $location.path();
      var arr = path.split("/");
      var id = arr[arr.length-1];
      $scope.comments = [];
      $scope.id = id;
        if($rootScope.visitedSearchPage){
            $rootScope.loading = true;
        }
        $scope.mainImage = "https://placehold.it/710X420";
      HttpService.GetAPost(id)
        .then(function(response){

            if (response.status == '200' && response.data["_id"]) {
                $rootScope.currentPost.data = response.data;
                var params = $location.search();
                if(params && params.success == 'true'){
                    FlashService.Success("Your post is now Live.");
                }
                $rootScope.regionList = $rootScope.masterList[response.data.state];
                $scope.regions = $rootScope.regionList;

                vm.state = response.data.state;
                vm.region = response.data.region;
                vm.category = response.data.category;
                $scope.title = $rootScope.currentPost.data.title;
                $rootScope.pageTitle = $scope.title;
                $scope.post_id = $rootScope.currentPost.data["_id"];
                $scope.message = $rootScope.currentPost.data.body;
                $scope.age = $rootScope.currentPost.data.age;
                $scope.region = $rootScope.currentPost.data.region;
                $scope.location = $rootScope.currentPost.data.location;
                $scope.sender1 = $rootScope.currentPost.data.email;
                $scope.state = $rootScope.currentPost.data.state;
                $scope.status = $rootScope.currentPost.data.status;
                $scope.category = $rootScope.currentPost.data.category;
                $scope.created = $rootScope.currentPost.data.created;
                $scope.files = $rootScope.currentPost.data.files;
                $scope.flagreason = $rootScope.currentPost.data.flagreason;
                $scope.anonymouscomment = $rootScope.currentPost.data.anonymouscomment || "disabled";
                $rootScope.loading = false;
                if($scope.files.length > 0){
                    $scope.mainImage = $scope.files[0].secure_url;
                }
            }else{
                $rootScope.loading = false;
                vm.dataLoading = false;
                $location.path('/admin/#/search');
            };

        });
        $scope.loadComments(id);
    };

    $scope.loadComments = function(id){
        HttpService.GetComments(id)
        .then(function(response){

            if (response.status == '200') {
                $scope.comments = response.data;
            }else{

                // $rootScope.loading = false;
                // vm.dataLoading = false;
                // $location.path('/expired');
            };

        });
    }

    $scope.deleteComment = function(id){
        $rootScope.loading = true;
        HttpService.DeleteAComment(id)
        .then(function(response){

            if (response.status == '200') {
                $scope.loadComments($scope.id);
                FlashService.Success("The comment has been successfully deleted.");
                $rootScope.loading = false;
                $window.scrollTo(0, 0);
            }else{

                $rootScope.loading = false;
                // $rootScope.loading = false;
                // vm.dataLoading = false;
                // $location.path('/expired');
            };

        });
    }

    $scope.flagComment = function(id){

        $rootScope.loading = true;
        HttpService.FlagAComment(id)
        .then(function(response){

            if (response.status == '200') {
                $scope.loadComments($scope.id);
                FlashService.Success("The comment has been successfully flagged.");
                $rootScope.loading = false;
                $window.scrollTo(0, 0);
            }else{

                $rootScope.loading = false;
                // $rootScope.loading = false;
                // vm.dataLoading = false;
                // $location.path('/expired');
            };

        });
    }

    $scope.unflagComment = function(id){

        $rootScope.loading = true;
        HttpService.UnflagAComment(id)
        .then(function(response){

            if (response.status == '200') {
                $scope.loadComments($scope.id);
                FlashService.Success("The comment has been successfully unflagged.");
                $rootScope.loading = false;
                $window.scrollTo(0, 0);
            }else{

                $rootScope.loading = false;
                // $rootScope.loading = false;
                // vm.dataLoading = false;
                // $location.path('/expired');
            };

        });
    }

    $rootScope.reloadPost = function(){
      vm.state = $rootScope.currentPost.data.body;
    }

    vm.post = function () {
        $location.path('/post');
    };

    vm.search = function () {
        $rootScope.loading = true;
      $rootScope.search.state = this.state;
        $rootScope.search.region = this.region;
        $rootScope.search.category = this.category;

        $location.path('/search');
    };

    vm.searchFilter = function (state,region,category) {
        if(state == 'State' && region == 'Region'){

        }else{
            $rootScope.loading = true;
            $rootScope.search.state = state;
            $rootScope.search.region = region;
            $rootScope.search.category = category;

            $location.path('/search');
        };
    };

    $scope.notify = function () {
        $scope.showEmail = true;


        if ($scope.showEmail && $scope.sender2 && $scope.sender2.length > 0) {
            $rootScope.loading = true;
            var data = {
             "message": "Perfect match found for both of you.",
                "subject": "We need to put in a subject",
                "sender1": $scope.sender1,
                "sender2": $scope.sender2,
                "link": $location.$$absUrl
            };
            HttpService.SendMail(data)
            .then(function(response){

                if (response.success == '200' || response.success == '250') {

                    $rootScope.loading = false;
                    alert("Email has been sent to the poster!");
                }else{
                    // FlashService.Error(response.data.resultDescription);
                    vm.dataLoading = false;
                    $rootScope.loading = false;
                    alert("Email has been sent to the poster!");
                    $location.path('/');
                };

            });
        }

    };


    // if ($rootScope.currentPost.data) {
    //
    //  vm.message = $rootScope.currentPost.data.body;
    //  vm.age = $rootScope.currentPost.data.age;
    //  vm.region = $rootScope.currentPost.data.region;

    // }else if(id){

    // }else{
    //  $location.path("/");
    // }

}]);
