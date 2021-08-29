app.controller('CommentController', ['$rootScope','$scope', '$location', 'HttpService', '$http','$window','FlashService','$modal', '$routeParams', function( $rootScope,$scope,$location,HttpService,$http,$window,FlashService,$modal, $routeParams){
    var vm = this;

    $scope.sendPostVerificationEmail = function(email) {
        if (!email) {
            return;
        }

        var postData = {
            "email": email,
            "postId": $routeParams.postId
        }

        HttpService.ResendPostLink(postData)
        .then(function(response){
            if (response.status == '200' && response.data && response.data.sent) {
                FlashService.Success("Email sent successfully!");
                $rootScope.loading = false;
                $scope.closeModal();
                $window.scrollTo(0, 0);
            } else {
                $rootScope.loading = false;
                FlashService.Error("There was an error while submitting your request. Please try again.");
                vm.dataLoading = false;
            };

        });
    }

    $scope.replyNotified = false;
    $scope.showEmbedButtons = false;
    $scope.replyNotifiedEmail = "";
    $scope.replyembed = "";

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
        $scope.commentMessage = $rootScope.comment.body;
        $scope.commentId = $rootScope.comment["_id"];
        $scope.commentLabel = $rootScope.comment["replyLabel"];
        $scope.commentEmail = $rootScope.comment["replyEmail"];
        $scope.commentOwner = $rootScope.comment["owner"];
        $scope.ownerEmail = $rootScope.comment["ownerEmail"];

        $http.get("/data.json")
        .success(function (data) {
            $rootScope.masterList = data;
        })

        // vm.state = $rootScope.search.state;
        // vm.region = $rootScope.search.region;
        // vm.category = $rootScope.search.category;
        var path = $location.path();
        var arr = path.split("/");
        var id = arr[arr.length-1];
        $scope.id = id;
        // $rootScope.loading = true;
        $scope.mainImage = "https://placehold.it/710X420";
        HttpService.GetAPost(id)
        .then(function(response){

            if (response.status == '200') {
                $rootScope.currentPost.data = response.data;

                $rootScope.regionList = $rootScope.masterList[response.data.state];
                $scope.regions = $rootScope.regionList;

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
    };

    $scope.notify = function (replymessage) {

        $scope.imageLength = 0;

        $scope.showError = true;
        $scope.showRequiredReplyMessageError = false;
        if (!replymessage){
            $scope.showRequiredReplyMessageError = true;
            // alert("Please Select, Region and Category.");
        }

        if ($scope.showRequiredReplyMessageError){

            $window.scrollTo(0, 0);

        }else{
            // $rootScope.loading = true;
            $scope.closeModal();
            FlashService.Success("You have successfully replied to this comment!");

            $rootScope.loading = true;

            var postData = {
                "commentmessage": replymessage,
                "commentfiles": $rootScope.tempImageList,
                "commentembed": $scope.replyembed.replace("src=", "xxx=").replace("href=", "yyyy="),
                "commentemail": $scope.replyNotifiedEmail,
                "label":  $scope.commentLabel,
                "owner":  $scope.commentOwner,
                "replyEmail" : $scope.commentEmail
            };

            HttpService.ReplyAComment($scope.commentId, postData)
            .then(function(response){

                if (response.status == '200') {
                    // $scope.loadComments($scope.id);
                    FlashService.Success("You have successfully replied to this comment!");
                    $rootScope.loading = false;
                    $window.scrollTo(0, 0);
                    $rootScope.tempImageList = [];
                    $rootScope.comment = {};
                    $rootScope.$broadcast("reloadComments");

                }else{

                    $rootScope.loading = false;
                    // $rootScope.loading = false;
                    // vm.dataLoading = false;
                    // $location.path('/expired');
                    $rootScope.comment = {};
                };

            });

        }

    };

    $scope.toggleReplyNotify = function(){
        if($scope.replyNotified && $scope.replyNotified == true){
            $scope.replyNotified = false;
            $scope.replyNotifiedEmail = "";
        }else{
            $scope.replyNotified = true;
        }
    }

    $scope.toggleEmbedButton = function(){
        if($scope.showEmbedButtons && $scope.showEmbedButtons == true){
            $scope.showEmbedButtons = false;
        }else{
            $scope.showEmbedButtons = true;
        }
    }

    $scope.closeModal = function(){

        $rootScope.comment = {};
        $rootScope.modalInstance.close();
    }

}]);
