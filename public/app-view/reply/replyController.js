app.controller('ReplyController', ['$rootScope','$scope', '$location', 'HttpService', '$http','$window','FlashService','$modal', function( $rootScope,$scope,$location,HttpService,$http,$window,FlashService,$modal){
    var vm = this;

    $scope.location = $location.path();
    $scope.arr = $scope.location.split("/");
    $scope.page = $scope.arr[1];
    $scope.id = $scope.arr[$scope.arr.length-1];

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

    $rootScope.tempImageList = [];

    $scope.replyfiles = [];

   $scope.stopLoader = function(){
        $rootScope.loadingImage = false;
   };

   $scope.deleteImage = function(index){

        $rootScope.tempImageList.splice(index, 1);
        $scope.replyfiles = $rootScope.tempImageList;


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

        // $rootScope.loading = true;
        $scope.mainImage = "https://placehold.it/710X420";

        if ($scope.page === 'detail') {
          HttpService.GetAPost($scope.id)
          .then(function(response){

            if (response.status == '200') {
                $rootScope.currentPost.data = response.data;

                // $rootScope.regionList = $rootScope.masterList[response.data.state];
                // $scope.regions = $rootScope.regionList;

                vm.state = response.data.state;
                vm.region = response.data.region;
                vm.category = response.data.category;
                $scope.id = $rootScope.currentPost.data["_id"];
                $scope.title = $rootScope.currentPost.data.title;
                $rootScope.pageTitle = $scope.title;
                $scope.message = $rootScope.currentPost.data.body;
                $scope.age = $rootScope.currentPost.data.age;
                $scope.location = $rootScope.currentPost.data.location;
                $scope.region = $rootScope.currentPost.data.region;
                $scope.sender1 = $rootScope.currentPost.data.email;
                $scope.state = $rootScope.currentPost.data.state;
                $scope.category = $rootScope.currentPost.data.category;
                $scope.created = $rootScope.currentPost.data.created;
                $scope.files = $rootScope.currentPost.data.files;
                $rootScope.loading = false;
                if($scope.files.length > 0){
                    $scope.mainImage = $scope.files[0].secure_url;
                }
            }else{
                $rootScope.loading = false;
                vm.dataLoading = false;
                $location.path('/');
            };

        });
      } else {
        HttpService.GetPageWithPosts($scope.id)
        .then(function(response){

          if (response.status == '200' && response.data && response.data.page) {
              $scope.title = response.data.page.title;
              $scope.sender1 = response.data.page.email;
              $rootScope.loading = false;
          }else{
              $rootScope.loading = false;
              vm.dataLoading = false;
              $location.path('/');
          };

      });
      }
    };

    $scope.notify = function () {
        $scope.imageLength = 0;

        $scope.showError = true;
        $scope.showRequiredEmailError = false;
        $scope.showRequiredReplyMessageError = false;
        $scope.showEmailError = false;
        $scope.showImageError = false;

        $scope.showCaptchaError = false;

        if ($rootScope.tempImageList && $rootScope.tempImageList.length > 5) {
            $scope.showImageError = true;
            $scope.imageLength = $rootScope.tempImageList.length;
            // alert($rootScope.imageList.length+" files selected ... Max allowed files is 5.");
        }

        if (!$scope.email ){
            $scope.showRequiredEmailError = true;
            // alert("Please Select, Region and Category.");
        }

        if (!$scope.replymessage){
            $scope.showRequiredReplyMessageError = true;
            // alert("Please Select, Region and Category.");
        }

        if (!$scope.captcha){
            $scope.showCaptchaError = true;
            // alert("Please accept the terms and condition.");
        }

        if ($scope.email != $scope.confirmemail){
            $scope.showEmailError = true;
            // alert("Please accept the terms and condition.");
        }

        if ($scope.showCaptchaError || $scope.showRequiredEmailError || $scope.showRequiredReplyMessageError || $scope.showEmailError){
            $window.scrollTo(0, 0);

        }else{
            // $rootScope.loading = true;
            $scope.closeModal();

            if ($scope.page === 'detail') {
              FlashService.Success("You have successfully replied to this post, you may or may not get a response from this poster.");
              var options = { timeZone: "America/New_York"}
              var estTime = new Date();
              var data = {
                  "htmlmessage": "<p>"+$scope.replymessage +"</p><p><b>You can respond by replying directly to this email!</b></p><p>Original Post:</p><p>"+ $location.absUrl().replace("reply","detail")+"</p> Regards, <br/>Healthyfling Team<p>If you feel this message is spam or an advertisement, you can always block or report this email through your email provider. If this message is illegal or associated with anything illegal, PLEASE CONTACT THE AUTHORITIES!</p>",
                  "subject": "[HealthyFling] RE: "+( $scope.title || $scope.message)+" - "+estTime.toLocaleString("en-US", options)+" ET",
                  "sender1": $scope.sender1,
                  "attachments": $rootScope.tempImageList,
                  "x-from": $scope.email,
                  "x-post-id": $scope.id
              };

              $scope.showError = false;
              HttpService.SendMail(data)
              .then(function(response){

                  if (response.status == '200' || response.status == '250') {

                      $rootScope.loading = false;
                      // $location.path('/response');
                      // var redirect = "/detail/"+$scope.id+"?msg=true";
                      // $location.path(unescape(redirect));
                      $rootScope.loading = false;
                      // alert("Email has been sent to the poster!");
                  }else{
                      // FlashService.Error(response.data.resultDescription);
                      vm.dataLoading = false;
                      $rootScope.loading = false;
                      // alert("Email has been sent to the poster!");
                      FlashService.Error("There was an error while submitting your request. Please try again.");
                      // $location.path('/');
                  };

              });
            } else {
              FlashService.Success("You have successfully messaged to this page, you may or may not get a response from this page owner.");
              var options = { timeZone: "America/New_York"}
              var estTime = new Date();
              var data = {
                  "htmlmessage": "<p>"+$scope.replymessage +"</p><p><b>You can respond by replying directly to this email!</b></p><p>Original Page:</p><p>"+ $location.absUrl()+"</p> Regards, <br/>Healthyfling Team<p>If you feel this message is spam or an advertisement, you can always block or report this email through your email provider. If this message is illegal or associated with anything illegal, PLEASE CONTACT THE AUTHORITIES!</p>",
                  "subject": "[HealthyFling] RE: "+( $scope.title || $scope.message)+" - "+estTime.toLocaleString("en-US", options)+" ET",
                  "sender1": $scope.sender1,
                  "attachments": $rootScope.tempImageList,
                  "x-from": $scope.email,
                  "x-post-id": $scope.id
              };

              $scope.showError = false;
              console.log('asdfasdf');
              HttpService.SendMail(data)
              .then(function(response){

                  if (response.status == '200' || response.status == '250') {

                      $rootScope.loading = false;
                      // $location.path('/response');
                      // var redirect = "/detail/"+$scope.id+"?msg=true";
                      // $location.path(unescape(redirect));
                      $rootScope.loading = false;
                      // alert("Email has been sent to the poster!");
                  }else{
                      // FlashService.Error(response.data.resultDescription);
                      vm.dataLoading = false;
                      $rootScope.loading = false;
                      // alert("Email has been sent to the poster!");
                      FlashService.Error("There was an error while submitting your request. Please try again.");
                      // $location.path('/');
                  };

              });
            }
        }

    };

    $scope.closeModal = function(){

        $rootScope.modalInstance.close();
    }

}]);
