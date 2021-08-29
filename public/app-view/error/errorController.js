app.controller('ErrorController', ['$rootScope','$scope', '$location', 'HttpService', '$http', function( $rootScope,$scope,$location,HttpService,$http ){
    var vm = this;

    $rootScope.pageTitle = "Healthy Fling";

    $scope.countries = $rootScope.countryList;
    $scope.states = $rootScope.stateList;
    $scope.regions = $rootScope.regionList;
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

   $scope.updateList = function(data){
        $rootScope.regionList = $rootScope.masterList[data];

        $scope.regions = $rootScope.regionList
        $scope.regions.unshift("Region");
   };

    // vm.state = $rootScope.search.state;
    // vm.region = $rootScope.search.region;
    // vm.category = $rootScope.search.category;

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


    vm.search = function () {
        $rootScope.search.country = "United States";
        $rootScope.search.state = this.state;
        $rootScope.search.region = this.region;
        $rootScope.search.category = this.category;

        $location.path('/search');
    };



        vm.post = function () {
            vm.dataLoading = true;

            $location.path('/post');
        };

        vm.search = function () {
            vm.dataLoading = true;

            $location.path('/search');
        };

    //  $scope.initController = function () {

    //     $http.get("/data.json")
    //     .success(function (data) {
    //         $rootScope.masterList = data;
    //     })

    //     // vm.state = $rootScope.search.state;
    //     // vm.region = $rootScope.search.region;
    //     // vm.category = $rootScope.search.category;
    //     var path = $location.path();
    //     var arr = path.split("/");
    //     var id = arr[arr.length-1];
    //     $scope.id = id;
    //     $rootScope.loading = true;
    //     $scope.mainImage = "http://placehold.it/710X420";
    //     HttpService.GetAPost(id)
    //     .then(function(response){
    //
    //         if (response.status == '200') {
    //             $rootScope.currentPost.data = response.data;

    //             $rootScope.regionList = $rootScope.masterList[response.data.state];
    //             $scope.regions = $rootScope.regionList;
    //
    //             vm.state = response.data.state;
    //             vm.region = response.data.region;
    //             vm.category = response.data.category;
    //             $scope.id = $rootScope.currentPost.data["_id"];
    //             $scope.title = $rootScope.currentPost.data.title;
    //             $rootScope.pageTitle = $scope.title;
    //             $scope.message = $rootScope.currentPost.data.body;
    //             $scope.age = $rootScope.currentPost.data.age;
    //             $scope.location = $rootScope.currentPost.data.location;
    //             $scope.region = $rootScope.currentPost.data.region;
    //             $scope.sender1 = $rootScope.currentPost.data.email;
    //             $scope.state = $rootScope.currentPost.data.state;
    //             $scope.category = $rootScope.currentPost.data.category;
    //             $scope.created = $rootScope.currentPost.data.created;
    //             $scope.files = $rootScope.currentPost.data.files;
    //             $rootScope.loading = false;
    //             if($scope.files.length > 0){
    //                 $scope.mainImage = $scope.files[0].url;
    //             }
    //         }else{
    //             $rootScope.loading = false;
    //             vm.dataLoading = false;
    //             $location.path('/');
    //         };

    //     });
    // };

    // $scope.notify = function () {
    //     if (!$scope.captcha){
    //         alert("Please accept the terms and condition.");
    //     }else if(!$scope.email){
    //         alert("Email address is missing");
    //     }else{
    //         $rootScope.loading = true;
    //         var data = {
    //             "htmlmessage": "<p>"+$scope.replymessage +"</p><p>"+ $location.absUrl().replace("reply","detail")+"</p><p><a href='mailto:"+$scope.email+"?subject="+"Re: "+$scope.title+"'>Reply to this message</a> </p> Regards, <br/>Healthyfling Team",
    //             "subject": "Re: "+( $scope.title || $scope.message),
    //             "sender1": $scope.sender1
    //         };
    //
    //         HttpService.SendMail(data)
    //         .then(function(response){
    //
    //             if (response.success == '200' || response.success == '250') {
    //
    //                 $rootScope.loading = false;
    //                 alert("Email has been sent to the poster!");
    //             }else{
    //                 // FlashService.Error(response.data.resultDescription);
    //                 vm.dataLoading = false;
    //                 $rootScope.loading = false;
    //                 alert("Email has been sent to the poster!");
    //                 $location.path('/');
    //             };

    //         });
    //     }

    // };

}]);
