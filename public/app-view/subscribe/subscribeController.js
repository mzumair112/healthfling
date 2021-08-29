app.controller('SubscribeController', ['$rootScope','$scope', '$location', 'HttpService', '$http', 'FlashService','$window', function( $rootScope,$scope,$location,HttpService,$http,FlashService,$window ){
    var vm = this;

    $rootScope.pageTitle = "Healthy Fling";

    $scope.states = $rootScope.stateList;
    $scope.regions = $rootScope.regionList;
    if ($scope.regions && $scope.regions.indexOf("Region") == -1){
        $scope.regions.unshift("Region");
    }
    $scope.categories = $rootScope.categoryList;

    $scope.selection = [];

    $scope.toggleSelection = function (selectionName, listSelection) {
        var idx = listSelection.indexOf(selectionName);

        // is currently selected
        if (idx > -1) {
          listSelection.splice(idx, 1);
        }

        // is newly selected
        else {
          listSelection.push(selectionName);
        }
    };

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

    vm.search = function () {
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

     $scope.initController = function () {

        $http.get("/data.json")
        .success(function (data) {
            $rootScope.masterList = data;
        })

        // vm.state = $rootScope.search.state;
        // vm.region = $rootScope.search.region;
        // vm.category = $rootScope.search.category;
    };

    $scope.resendPageLink = function(){

        $rootScope.loading = true;

        $scope.showError = false;
        $scope.closeModal();

        var postData = {
            "email": $scope.email
        };

        HttpService.ResendPageLink(postData)
        .then(function(response){
            if (response.status == '200' && response.data && response.data.sent) {
                FlashService.Success("Email sent successfully!");
                $rootScope.loading = false;
            }else{
                $rootScope.loading = false;
                FlashService.Error("There was an error while submitting your request. Please try again.");
                vm.dataLoading = false;
            };

        });
    };

    $scope.submit = function(){
        var path = $location.path();
        var arr = path.split("/");
        var id = $rootScope.subscribePostId || arr[arr.length-1];
        $scope.id = id;
        $rootScope.loading = true;
        $scope.mainImage = "https://placehold.it/710X420";

        if ($scope.showReasonError) {
            
            $window.scrollTo(0, 0);

        }else{
            $scope.showError = false;
            $scope.closeModal();

            var postData = {
                "email": $scope.email
            };

            HttpService.SubscribePost(id,postData)
            .then(function(response){
              $rootScope.subscribePostId = undefined;
                if (response.status == '200') {
                    
                    
                    if (response && response.data && response.data["_id"]) {
                        FlashService.Success("You subscribed successfully!");
                    }
                    $rootScope.loading = false;
                }else{
                    $rootScope.loading = false;
                    FlashService.Error("There was an error while submitting your request. Please try again.");
                    vm.dataLoading = false;
                    // $location.path('/');
                };

            });
        }
    };

    $scope.submitPage = function(){
        var path = $location.path();
        var arr = path.split("/");
        var id = $rootScope.subscribePageId || arr[arr.length-1];
        $scope.id = id;
        $rootScope.loading = true;
        $scope.mainImage = "https://placehold.it/710X420";

        if ($scope.showReasonError) {
            
            $window.scrollTo(0, 0);

        }else{
            $scope.showError = false;
            $scope.closeModal();

            var postData = {
                "email": $scope.email
            };

            HttpService.SubscribePage(id,postData)
            .then(function(response){
              $rootScope.subscribePageId = undefined;
              
                if (response.status == '200') {
                    
                    if (response && response.data && response.data["_id"]) {
                        FlashService.Success("You subscribed successfully!");
                    }
                    if (response && response.data == '"EMAIL_ALREADY_SUBSCRIBED"') {
                        FlashService.Error("You already subscribed with this email.");
                    }
                    $rootScope.loading = false;
                }else{
                    $rootScope.loading = false;
                    FlashService.Error("There was an error while submitting your request. Please try again.");
                    vm.dataLoading = false;
                    // $location.path('/');
                };

            });
        }
    };

    $scope.notify = function () {
        if (!$scope.captcha){
            alert("Please accept the terms and condition.");
        }else if(!$scope.email){
            alert("Email address is missing");
        }else{
            $rootScope.loading = true;
            var data = {
                "htmlmessage": "<p>"+$scope.replymessage +"</p><p>"+ $location.absUrl().replace("reply","detail")+"</p><p><a href='mailto:"+$scope.email+"?subject="+"Re: "+$scope.title+"'>Reply to this message</a> </p> Regards, <br/>Healthyfling Team",
                "subject": "Re: "+( $scope.title || $scope.message),
                "sender1": $scope.sender1
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

    $scope.closeModal = function(){
        
        $rootScope.modalInstance.close();
    }

}]);
