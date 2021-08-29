app.controller('MediaVideoController', ['$rootScope','$scope','$location','HttpService','$http','$route','FlashService','$document','$modal','$window', '$routeParams', 'MetaService', function( $rootScope,$scope,$location,HttpService,$http,$route,FlashService,$document,$modal,$window, $routeParams, MetaService){
    var vm = this;

    if($rootScope.visitedSearchPage){
        $rootScope.loading = true;
    }

    $scope.likePost = function(postId) {
        if (!$rootScope.isLoggedIn) {
            return alert("You need to be logged in!");
        }
      // Check in the localStorage if this post is already liked
      if (!window.localStorage.getItem(postId+'video')) {
        // Increment post like by one and save it in the localstorage to avoid additional like
        window.localStorage.setItem(postId+'video', true);
        HttpService.LikePostVideo(postId)
        .then(function(response) {
          $scope.currentPost.data.videoLike = $scope.currentPost.data.videoLike + 1;
        });
      }
    }

    $scope.dislikePost = function(postId) {
        if (!$rootScope.isLoggedIn) {
            return alert("You need to be logged in!");
        }
      // Check in the localStorage if this post is already disliked
      if (!window.localStorage.getItem(postId+'video')) {
        // Increment post like by one and save it in the localstorage to avoid additional like
        window.localStorage.setItem(postId+'video', true);
        HttpService.DislikePostVideo(postId)
        .then(function(response) {
          $scope.currentPost.data.videoDislike = $scope.currentPost.data.videoDislike + 1;
        });
      }
    }

    $scope.replyNotified = false;
    $scope.showShareButtons = false;
    $scope.showEmbedButtons = false;
    $scope.replyNotifiedEmail = "";
    $scope.embed = "";
    $scope.commentembed = "";
    $scope.comments = [];
    $scope.commentsMainImage = [];
    $scope.replyMainImage = [];


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
    $scope.regions = $rootScope.regionList || ["REGION"];
    if ($scope.regions && $scope.regions.indexOf("Region") == -1){
        $scope.regions.unshift("Region");
    }
    $scope.categories = $rootScope.categoryList;

    $scope.savedPreference = ($rootScope.savedPreference == "locked");
    vm.savedPreference = ($rootScope.savedPreference == "locked");

     $scope.changeListInCtrl = function(data){
        if(data != "" && data != undefined && data != "State" && data != "Provinces"){
            $rootScope.masterList = $rootScope.masterListAll[vm.country];
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
            $rootScope.stateList = ['State'];
            $scope.states = $rootScope.stateList;
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

   $rootScope.imageList = [];

    var path = $location.path();
    var arr = path.split("/");
    var id = arr[arr.length-1];
    $scope.id = id;
    $scope.currentPath = $location.absUrl();

    $scope.toggleShareButton = function(){
        if($scope.showShareButtons && $scope.showShareButtons == true){
            $scope.showShareButtons = false;
        }else{
            $scope.showShareButtons = true;
        }
    }

    $scope.initController = function () {

        // $http.get("/data.json")
        // .success(function (data) {
        //     $rootScope.masterList = data;
        // })

        $http.get("/data_country.json")
        .success(function (data) {
            $rootScope.masterListAll = data;


        });

        $rootScope.is_flagged = false;

        vm.country = $rootScope.search.country;
        vm.state = $rootScope.search.state;
        vm.region = $rootScope.search.region;
        vm.category = $rootScope.search.category;
        $scope.comments = [];
        var path = $location.path();
        var arr = path.split("/");
        var id = arr[arr.length-1];
        $scope.id = id;
        if($rootScope.visitedSearchPage){
            $rootScope.loading = true;
        }
        $scope.mainImage = {
            secure_url: "https://www.healthyfling.com/processed/default-52adc3dc03639885e8aa93763e29868269dd3b9dad4689f140c0175b4f945922.png"
        };

        HttpService.GetAPagePost($routeParams.id, $routeParams.postId)
        .then(function(response){

            $scope.is_edit = false;
            if (response.status == '200' && response.data["_id"]) {
                $rootScope.currentPost.data = response.data;

                // if ($rootScope.currentPost.data.embedSocial.length) {
                //     $rootScope.currentPost.data.embedSocial.map(function(item, i) {
                //         $rootScope.currentPost.data.embedSocial[i] = unescape(item);
                //     });
                // }

                $rootScope.metaservice = MetaService;
                $rootScope.metaservice.set(response.data.title, response.data.body, (response.data.files.length && response.data.files[0] && response.data.files[0].secure_url ? response.data.files[0].secure_url : false));

                var params = $location.search();
                if(params && params.success == 'true'){
                    FlashService.Success("Your post is now Live.");
                }else if(params && params.edit == 'true'){
                    $scope.is_edit = true;
                }else if($location.url().indexOf("msg=true") > -1){
                    FlashService.Success("You have successfully replied to this post, you may or may not get a response from this poster.");
                }

                vm.country = response.data.country || "United States";

                $rootScope.masterList = $rootScope.masterListAll[vm.country];


                $rootScope.regionList = $rootScope.masterList[response.data.state];
                $scope.regions = $rootScope.regionList;


                vm.state = response.data.state;
                vm.region = response.data.region;
                vm.category = response.data.category;
                $scope.title = $rootScope.currentPost.data.title;
                $rootScope.pageTitle = $scope.title;
                $scope.post_id = $rootScope.currentPost.data["_id"];
                $scope.message = $rootScope.currentPost.data.body;
                $scope.message = $scope.message.replace(/[\r\n]/g, '<br/>');
                $scope.age = $rootScope.currentPost.data.age;
                $scope.region = $rootScope.currentPost.data.region;
                $scope.location = $rootScope.currentPost.data.location;
                $scope.sender1 = $rootScope.currentPost.data.email;
                $scope.country = $rootScope.currentPost.data.country || "United States";
                $scope.state = $rootScope.currentPost.data.state;
                $scope.category = $rootScope.currentPost.data.category;
                $scope.created = $rootScope.currentPost.data.created;
                $scope.expires = new Date($rootScope.currentPost.data.created);
                $scope.expires.setDate($scope.expires.getDate() + 8);
                $scope.files = $rootScope.currentPost.data.files;
                $scope.status = $rootScope.currentPost.data.status;
                $scope.haircolor = $rootScope.currentPost.data.haircolor;
                $scope.city = $rootScope.currentPost.data.city;
                $scope.zip = $rootScope.currentPost.data.zip;
                $scope.height = $rootScope.currentPost.data.height;
                $scope.ethnicity = $rootScope.currentPost.data.ethnicity;
                $scope.orientation = $rootScope.currentPost.data.orientation;
                $scope.bodytype = $rootScope.currentPost.data.bodytype;
                $scope.eyecolor = $rootScope.currentPost.data.eyecolor;
                $scope.mstatus = $rootScope.currentPost.data.mstatus;
                $scope.gender = $rootScope.currentPost.data.gender;
                $scope.bodyhair = $rootScope.currentPost.data.bodyhair;
                $scope.hivstatus = $rootScope.currentPost.data.hivstatus;
                $scope.weight = $rootScope.currentPost.data.weight;
                $scope.mage = $rootScope.currentPost.data.mage;
                $scope.anonymouscomment = $rootScope.currentPost.data.anonymouscomment || 'disabled';
                $scope.embed = ($rootScope.currentPost.data.embed ? $rootScope.currentPost.data.embed.replace("xxx=", "src=").replace("yyyy=", "href=") : '');
                $scope.embedDescription = $rootScope.currentPost.data.embedDescription || '';
                $scope.share = $rootScope.currentPost.data.share || 'disabled';

                $rootScope.loading = false;

                if ($scope.embed.indexOf('<iframe') > -1) {
                    $scope.iframe = true;
                } else {
                  $scope.iframe = false;
                  if ($scope.embed.indexOf('youtube.com') > -1) {
                    $scope.embed = 'https://www.youtube.com/embed/' + $scope.embed.slice($scope.embed.indexOf('v=')+2, $scope.embed.length);
                  }
                }
            }else{
                $rootScope.loading = false;
                vm.dataLoading = false;
                $location.path('/expired');
            };

        });

    };

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
        $rootScope.loading = true;
        $rootScope.search.country = this.country;
        $rootScope.search.state = this.state;
        $rootScope.search.region = this.region;
        $rootScope.search.category = this.category;
        $location.path('/search');
    };

    vm.searchFilter = function (country, state,region,category) {
        if(country == 'Country' && state == 'State' && region == 'Region'){

        }else{
            $rootScope.loading = true;
            $rootScope.search.country = country;
            $rootScope.search.state = state;
            $rootScope.search.region = region;
            $rootScope.search.category = category;

            $location.path('/search');
        };
    };

    $scope.toggleShareButton = function(){
        if($scope.showShareButtons && $scope.showShareButtons == true){
            $scope.showShareButtons = false;
        }else{
            $scope.showShareButtons = true;
        }
    }

     $scope.openModal_flag = function (){
         $rootScope.modalInstance = $modal.open({
            templateUrl: 'app-view/flag/FlagView.html'
        });
    }

   $scope.stopLoader = function(){
        $rootScope.loadingImage = false;
   };

   $scope.closeModal = function() {
        $rootScope.modalInstance.close();
   };
}]);
