app.controller('ContactController', ['$rootScope','$scope', '$location', 'HttpService','$window','FlashService', function( $rootScope,$scope,$location,HttpService,$window,FlashService ){
    var vm = this;

    $rootScope.pageTitle = "Contact us";

    $rootScope.savedPreference = $window.localStorage.getItem("healthyfling_preference");

    if ($rootScope.savedPreference == "locked") {
        $rootScope.search.country = $window.localStorage.getItem("healthyfling_preference_country") || "Country";
        $rootScope.search.state = $window.localStorage.getItem("healthyfling_preference_state") || "State";
        $rootScope.search.region = $window.localStorage.getItem("healthyfling_preference_region") || "Region";
        $rootScope.search.category = $window.localStorage.getItem("healthyfling_preference_category") || "Category";
    }

    vm.country = $rootScope.search.country || "Country";
    vm.state = $rootScope.search.state || "State";
    vm.region = $rootScope.search.region || "Region";
    vm.category = $rootScope.search.category || "Category";

    $scope.countries = $rootScope.countryList;
    $scope.states = $rootScope.stateList;
    $scope.regions = $rootScope.regionList;
    if ($scope.regions && $scope.regions.indexOf("Region") == -1){
        $scope.regions.unshift("Region");
    }
    $scope.categories = $rootScope.categoryList;

    $scope.savedPreference = ($rootScope.savedPreference == "locked");
    vm.savedPreference = ($rootScope.savedPreference == "locked");

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


    $scope.notify = function () {
        $scope.showError = true;
        $scope.showRequiredNameError = false;
        $scope.showRequiredEmailError = false;
        $scope.showRequiredSubjectError = false;
        $scope.showRequiredMessageError = false;
        $scope.showCaptchaError = false;

        if (!$scope.name ){
            $scope.showRequiredNameError = true;
            // alert("Please Select, Region and Category.");
        }

        if (!$scope.email){
            $scope.showRequiredEmailError = true;
            // alert("Please Select, Region and Category.");
        }

        if (!$scope.subject){
            $scope.showRequiredSubjectError = true;
            // alert("Please Select, Region and Category.");
        }

        if (!$scope.message){
            $scope.showRequiredMessageError = true;
            // alert("Please Select, Region and Category.");
        }

        if (!$scope.captcha){
            $scope.showCaptchaError = true;
            // alert("Please accept the terms and condition.");
        }

        if( $scope.showCaptchaError || $scope.showRequiredNameError || $scope.showRequiredEmailError || $scope.showRequiredSubjectError || $scope.showRequiredMessageError ){

            $window.scrollTo(0, 0);
        }else{

            $rootScope.loading = true;

            var data = {
             "message": "Equiry Log: \n\n Name: "+$scope.name+"\nEnquiry: "+$scope.message+"\nEmail: "+$scope.email+"\n\n Regards, \n\n"+$scope.name,
                "subject": "Received Request: "+$scope.subject,
                "sender1": "info@healthyfling.com",
                "from": $scope.email
            };

            $scope.showError = false;
            HttpService.SendMail(data)
            .then(function(response){

                if (response.status == '200' || response.status == '250') {

                    $rootScope.loading = false;
                    // alert("Your request has been received!");
                    FlashService.Success("Your Contact submission went through, you will receive a response between 24 and 48 hours.");
                    $scope.name = "";
                    $scope.message = "";
                    $scope.email = "";
                    $scope.subject = "";
                    $scope.captcha = "";
                }else{
                    // FlashService.Error(response.data.resultDescription);
                    vm.dataLoading = false;
                    $rootScope.loading = false;
                    FlashService.Error("There was an error while submitting your request. Please try again.");
                    // $location.path('/');
                };

            });
        }

    };

}]);
