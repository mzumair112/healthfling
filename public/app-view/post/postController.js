app.controller("PostController", [
  "$rootScope",
  "$scope",
  "$location",
  "HttpService",
  "$window",
  '$modal',
  "FlashService",
  'MetaService',
  '$timeout',
  '$route',
  function($rootScope, $scope, $location, HttpService, $window, $modal, FlashService, MetaService, $timeout, $route) {
    var vm = this;

    $scope.params = $location.search();

    $rootScope.metaservice = MetaService;
    $rootScope.metaservice.set('Post an ad');

    $scope.imageUrl = [{}];
    $scope.addImageUrlField = function() {
        $scope.imageUrl.push({});
    }

    window.onbeforeunload = function (e) {
      if($location.path().indexOf('/post') > -1 && ($location.path().slice(0, 6) === '/post' || $location.path().slice(0, 6) === '/post?')) {
        e = e || window.event;

        // For IE and Firefox prior to version 4
        if (e) {
          e.returnValue = 'Sure?';
        }

        // For Safari
        return 'Sure?';
      }
    };

    $scope.countries = $rootScope.countryList;
    $scope.states = $rootScope.stateList;
    $scope.regions = $rootScope.regionList;

    $scope.newstates = ["State"];
    $scope.newregions = [];

    $scope.haircolors = $rootScope.haircolorList;
    $scope.heights = $rootScope.heightList;
    $scope.ethnicity = $rootScope.ethnicityList;
    $scope.orientation = $rootScope.orientationList;
    $scope.bodytype = $rootScope.bodytypeList;
    $scope.eyecolor = $rootScope.eyecolorList;
    $scope.status = $rootScope.statusList;
    $scope.gender = $rootScope.genderList;
    $scope.bodyhair = $rootScope.bodyHairList;
    $scope.hivstatus = $rootScope.hivstatusList;

    $scope.anonymouscomment = ["enabled", "disabled"];
    $scope.notified = ["yes", "no"];
    $scope.postermode = ["Personals", "Pages"];

    var range = ["Age"];
    for (var i = 0; i < 201; i++) {
      range.push(i);
    }
    $scope.ageRange = range;

    range = ["Weight"];
    for (var i = 90; i < 501; i++) {
      range.push(i);
    }

    $scope.weightRange = range;

    if ($scope.regions && $scope.regions.indexOf("Region") == -1) {
      $scope.regions.unshift("Region");
    }
    $scope.categories = $rootScope.categoryList;

    $scope.savedPreference = $rootScope.savedPreference == "locked";
    vm.savedPreference = $rootScope.savedPreference == "locked";

    vm.country = $rootScope.search.country || "Country";
    vm.state = $rootScope.search.state || "State";
    vm.region = $rootScope.search.region || "Region";
    vm.category = $rootScope.search.category || "Category";

    $rootScope.imageList = [];
    $rootScope.profilePic = [];
    $rootScope.coverPic = [];

    $scope.changeListInCtrl = function(data) {
      if (
        data != "" &&
        data != undefined &&
        data != "State" &&
        data != "Provinces"
      ) {
        $rootScope.regionList = $rootScope.masterList[data];

        $scope.regions = $rootScope.regionList;
        $scope.regions.unshift("Region");
        var temp = $scope.regions;
        $scope.regions = temp.filter(function(item, pos) {
          return temp.indexOf(item) == pos;
        });
      } else {
        if (vm.country == "United States" || vm.country == "Canada") {
          $scope.regions = ["Region"];
        }
      }
    };

    $scope.changeStateListInCtrl = function(data) {
      if (data != "" && data != undefined && data != "Country") {
        $rootScope.masterList = $rootScope.masterListAll[data];
        $rootScope.stateList = Object.keys($rootScope.masterListAll[data]);
        $scope.states = $rootScope.stateList;
        // $rootScope.regionList = $rootScope.masterListAll[data];

        if (data != "United States" && data != "Canada") {
          $rootScope.regionList = $rootScope.masterList["State"];
          $scope.regions = $rootScope.regionList;
          $scope.regions.unshift("Region");
          var temp = $scope.regions;
          $scope.regions = temp.filter(function(item, pos) {
            return temp.indexOf(item) == pos;
          });
        } else if (data == "Canada") {

          vm.state = "Provinces";
        }
      } else {
        // $scope.regions = ['Region'];
      }
    };

    $scope.changeNewPostList = function(data) {
      if (
        data != "" &&
        data != undefined &&
        data != "State" &&
        data != "Provinces"
      ) {
        $scope.newregions = $scope.newmasterList[data];
        $scope.newregions.unshift("Region");
        var temp = $scope.newregions;
        $scope.newregions = temp.filter(function(item, pos) {
          return temp.indexOf(item) == pos;
        });
      } else {
        $scope.newregions = ["Region"];
      }
    };

    $scope.changeNewPostStateList = function(data) {
      if (data != "" && data != undefined && data != "Country") {
        $scope.newmasterList = $rootScope.masterListAll[data];
        $scope.newstates = Object.keys($rootScope.masterListAll[data]);
        // $rootScope.regionList = $rootScope.masterListAll[data];

        if (data != "United States" && data != "Canada") {
          $scope.newregions = $scope.newmasterList["State"];
          $scope.newregions.unshift("Region");
          var temp = $scope.newregions;
          $scope.newregions = temp.filter(function(item, pos) {
            return temp.indexOf(item) == pos;
          });
        }
      } else {
        // $scope.regions = ['Region'];
      }
    };

    vm.lockPreference = function() {
      $window.localStorage.setItem("healthyfling_preference", "locked");
      $window.localStorage.setItem(
        "healthyfling_preference_country",
        vm.country
      );
      $window.localStorage.setItem("healthyfling_preference_state", vm.state);
      $window.localStorage.setItem("healthyfling_preference_region", vm.region);
      $window.localStorage.setItem(
        "healthyfling_preference_category",
        vm.category
      );
      $rootScope.savedPreference = true;
      vm.savedPreference = true;
      $scope.savedPreference = "locked";
      FlashService.Success("Search preference saved for easier browsing.");

    };

    vm.unlockPreference = function() {
      $window.localStorage.setItem("healthyfling_preference", "unlocked");

      vm.country = $rootScope.search.country = "Country";
      vm.state = $rootScope.search.state = "State";
      vm.region = $rootScope.search.region = "Region";
      vm.category = $rootScope.search.category = "Category";

      $rootScope.savedPreference = false;
      vm.savedPreference = false;
      $scope.savedPreference = "unlocked";
      FlashService.Success("Search preference has been deleted.");

    };

    $scope.stopLoader = function() {
      $rootScope.loadingImage = false;
      $rootScope.loadingProfileImage = false;
      $rootScope.loadingCoverImage = false;
    };

    $scope.deleteImage = function(index) {

      $rootScope.imageList.splice(index, 1);
      vm.data.files = $rootScope.imageList;


    };

    $scope.deleteProfilePic = function() {

      $rootScope.profilePic = [];
    };

    $scope.deleteCoverPic = function() {

      $rootScope.coverPic = [];
    };

    vm.files = [];

    vm.post = function() {
      $location.path("/post");
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


    //    vm.upload=function(){
    //     alert(vm.data.files.length+" files selected ... Write your Upload Code");

    // };

    vm.check = function() {
      if (vm.data.files.length > 0) {
        alert(
          vm.data.files.length + " files selected ... Max allowed files is 5."
        );
      }
    };

    vm.search = function() {
      $rootScope.search.country = this.country;
      $rootScope.search.state = this.state;
      $rootScope.search.region = this.region;
      $rootScope.search.category = this.category;
      $location.path("/search");
    };

    vm.data = {
      title: "",
      country: "Country",
      state: "State",
      region: "Region",
      category: "Category",
      location: "",
      age: "",
      message: "",
      haircolor: "Hair Color",
      height: "Height",
      ethnicity: "Ethnicity",
      orientation: "Orientation",
      bodytype: "Body Type",
      eyecolor: "Eye Color",
      mstatus: "Status",
      gender: "Gender",
      bodyhair: "Body Hair",
      hivstatus: "HIV Status",
      anonymouscomment: "disabled",
      notified: "no",
      share: "disabled",
      embed: "",
      weight: "Weight",
      mage: "Age",
      postermode: "Personals",
      imageURL: []
    };

    $scope.update = function() {
        if (vm.data.postermode === "Pages") {
          HttpService.GetPageForCurrentUser()
            .then(function(response){
                if (response.status == '200') {
                    $location.search({
                        page: true,
                        addPost: true
                    });

                    $timeout(function () {
                        // 0 ms delay to reload the page.
                        $route.reload();
                    }, 0);
                }
            });
        }
    };

    if (!$scope.params.editPage && $scope.params.page && !$scope.params.page.length) {
        vm.data.postermode = 'Pages';
        HttpService.GetPageForCurrentUser()
        .then(function(response){
            if (response.status == '200') {
                if (response.data && response.data._id) {
                    $scope.pageIdExists = true;
                    $rootScope.profilePic = [];
                    $rootScope.coverPic = [];
                    $scope.page = response.data;
                    $rootScope.profilePic = [$scope.page.profilePic];
                    $rootScope.coverPic = [$scope.page.coverPic];
                    vm.data.pageLocation = $scope.page.location;
                    vm.data.pageWebsite = $scope.page.website;
                    vm.data.pageTitle = $scope.page.title;
                } else {
                    $scope.pageIdExists = false;
                    $scope.params.editPage = false;
                }

                $scope.params.page = true;
                $scope.params.addPost = true;
                $location.search({
                    page: true,
                    addPost: true
                });
            }
        });
    }

    if ($scope.params.editPage && $scope.params.page && $scope.params.page.length) {
        vm.data.postermode = 'Pages';
        HttpService.GetPageForCurrentUser()
        .then(function(response){
            if (response.status == '200') {
                if (response.data) {
                    $scope.pageIdExists = true;
                    $rootScope.profilePic = [];
                    $rootScope.coverPic = [];
                    $scope.params.page = true;
                    $scope.params.editPage = true;
                    $scope.page = response.data;
                    $rootScope.profilePic = [$scope.page.profilePic];
                    $rootScope.coverPic = [$scope.page.coverPic];
                    vm.data.pageLocation = $scope.page.location;
                    vm.data.pageWebsite = $scope.page.website;
                    vm.data.pageTitle = $scope.page.title;
                    $location.search({
                        page: true,
                        editPage: true
                    });
                } else {
                    alert("Unauthorized request");
                    $location.path("/");
                }
            }
        });
    }

    vm.addPost = function() {
      vm.showImageError = false;
      vm.showRequiredCountryError = false;
      vm.showRequiredStateError = false;
      vm.showRequiredRegionError = false;
      vm.showRequiredCategoryError = false;
      vm.showMessageError = false;
      vm.showTitleError = false;
      vm.showCaptchaError = false;
      vm.showAgeError = false;

      vm.showError = true;
      if ($rootScope.imageList && $rootScope.imageList.length > 20) {
        vm.showImageError = true;
        vm.imageLength = $rootScope.imageList.length;
        // alert($rootScope.imageList.length+" files selected ... Max allowed files is 5.");
      }
      if (!vm.data.country || vm.data.country == "Country") {
        vm.showRequiredCountryError = true;
        // alert("Please Select, Region and Category.");
      }
      if (
        (!vm.data.state ||
          vm.data.state == "State" ||
          vm.data.state == "Provinces") &&
        (vm.data.country == "United States" || vm.data.country == "Canada")
      ) {
        vm.showRequiredStateError = true;
        // alert("Please Select, Region and Category.");
      }
      if (!vm.data.region || vm.data.region == "Region") {
        vm.showRequiredRegionError = true;
        // alert("Please Select, Region and Category.");
      }
      if (!vm.data.category || vm.data.category == "Category") {
        vm.showRequiredCategoryError = true;
        // alert("Please Select, Region and Category.");
      }

      if (!vm.data.title) {
        vm.showTitleError = true;
        // alert("Please enter title of the post.");
      }
      if (!vm.data.message) {
        vm.showMessageError = true;
        // alert("Please enter title of the post.");
      }
      if (!vm.captcha) {
        vm.showCaptchaError = true;
        // alert("Please accept the terms and condition.");
      }

      if (vm.data.age && isNaN(vm.data.age)) {
        vm.showAgeError = true;
      }

      if (vm.data.haircolor == "Hair Color") {
        vm.data.haircolor = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.height == "Height") {
        vm.data.height = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.ethnicity == "Ethnicity") {
        vm.data.ethnicity = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.orientation == "Orientation") {
        vm.data.orientation = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.bodytype == "Body Type") {
        vm.data.bodytype = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.eyecolor == "Eye Color") {
        vm.data.eyecolor = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.mstatus == "Status") {
        vm.data.mstatus = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.gender == "Gender") {
        vm.data.gender = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.bodyhair == "Body Hair") {
        vm.data.bodyhair = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.hivstatus == "HIV Status") {
        vm.data.hivstatus = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.mage == "Age") {
        vm.data.mage = "";
        // alert("Please Select, Region and Category.");
      }

      if (vm.data.weight == "Weight") {
        vm.data.weight = "";
        // alert("Please Select, Region and Category.");
      }

      if (
        vm.showRequiredStateError ||
        vm.showRequiredCountryError ||
        vm.showRequiredRegionError ||
        vm.showAgeError ||
        vm.showRequiredCategoryError ||
        vm.showMessageError ||
        vm.showCaptchaError ||
        vm.showImageError ||
        vm.showTitleError
      ) {

        $window.scrollTo(0, 0);
        if (vm.data.mage == "") {
          vm.data.mage = "Age";
        }
        if (vm.data.haircolor == "") {
          vm.data.haircolor = "Hair Color";
        }
        if (vm.data.height == "") {
          vm.data.height = "Height";
        }
        if (vm.data.ethnicity == "") {
          vm.data.ethnicity = "Ethnicity";
        }
        if (vm.data.orientation == "") {
          vm.data.orientation = "Orientation";
        }
        if (vm.data.bodytype == "") {
          vm.data.bodytype = "Body Type";
        }
        if (vm.data.eyecolor == "") {
          vm.data.eyecolor = "Eye Color";
        }
        if (vm.data.mstatus == "") {
          vm.data.mstatus = "Status";
        }
        if (vm.data.gender == "") {
          vm.data.gender = "Gender";
        }
        if (vm.data.bodyhair == "") {
          vm.data.bodyhair = "Body Hair";
        }
        if (vm.data.hivstatus == "") {
          vm.data.hivstatus = "HIV Status";
        }
        if (vm.data.weight == "") {
          vm.data.weight = "Weight";
        }
      } else {
        vm.showError = false;
        vm.showImageError = false;
        $rootScope.loading = true;
        var postData = {
          title: this.data.title,
          country: this.data.country,
          state: this.data.state,
          region: this.data.region,
          category: this.data.category,
          location: this.data.location,
          age: this.data.age,
          message: this.data.message,
          haircolor: this.data.haircolor,
          height: this.data.height,
          ethnicity: this.data.ethnicity,
          orientation: this.data.orientation,
          bodytype: this.data.bodytype,
          eyecolor: this.data.eyecolor,
          mstatus: this.data.mstatus,
          gender: this.data.gender,
          bodyhair: this.data.bodyhair,
          hivstatus: this.data.hivstatus,
          anonymouscomment: this.data.anonymouscomment,
          notified: this.data.notified,
          city: this.data.city,
          zip: this.data.zip,
          share: this.data.share,
          embed: this.data.embed
            .replace("src=", "xxx=")
            .replace("href=", "yyyy="),
          weight: this.data.weight,
          mage: this.data.mage,
          files: $rootScope.imageList,
          postermode: this.data.postermode
        };
        HttpService.AddPost(postData).then(function(response) {
          if (response.status == "200") {
            // alert("Your ad has been created. A verification mail will be sent shortly!");
            if (response && response.data && response.data["_id"]) {
                 FlashService.Success("Completed successfully");
                 $location.search({ success: true })
               $location.path("/detail/" + response.data._id);
            } else if (
              response &&
              response.data &&
              response.data["data"] == "limit reached"
            ) {
              if (vm.data.mage == "") {
                vm.data.mage = "Age";
              }
              if (vm.data.haircolor == "") {
                vm.data.haircolor = "Hair Color";
              }
              if (vm.data.height == "") {
                vm.data.height = "Height";
              }
              if (vm.data.ethnicity == "") {
                vm.data.ethnicity = "Ethnicity";
              }
              if (vm.data.orientation == "") {
                vm.data.orientation = "Orientation";
              }
              if (vm.data.bodytype == "") {
                vm.data.bodytype = "Body Type";
              }
              if (vm.data.eyecolor == "") {
                vm.data.eyecolor = "Eye Color";
              }
              if (vm.data.mstatus == "") {
                vm.data.mstatus = "Status";
              }
              if (vm.data.gender == "") {
                vm.data.gender = "Gender";
              }
              if (vm.data.bodyhair == "") {
                vm.data.bodyhair = "Body Hair";
              }
              if (vm.data.hivstatus == "") {
                vm.data.hivstatus = "HIV Status";
              }
              if (vm.data.weight == "") {
                vm.data.weight = "Weight";
              }
              FlashService.Error(
                "Maximum Limit Reached: You have too many posts at one time. You can delete some posts or wait till your other posts expire!"
              );
              $window.scrollTo(0, 0);
            }
            $rootScope.loading = false;
          } else {
            $rootScope.loading = false;
            // FlashService.Error(response.data.resultDescription);
            vm.dataLoading = false;
            $location.path("/");
          }
        });
      }
    };


    vm.addPostAndPage = function() {
      vm.showImageError = false;
      vm.showMessageError = false;
      vm.showTitleError = false;
      vm.showPageTitleError = false;
      vm.showCaptchaError = false;

      vm.showError = true;

      if ($rootScope.imageList && $rootScope.imageList.length > 20) {
        vm.showImageError = true;
        vm.imageLength = $rootScope.imageList.length;
        // alert($rootScope.imageList.length+" files selected ... Max allowed files is 5.");
      }

      if ((!$scope.params.page || ($scope.params.page && $scope.params.page.length < 8)) && !vm.data.pageTitle) {
        vm.showPageTitleError = true;
        // alert("Please enter title of the post.");
      }

      if (!vm.data.title) {
        vm.showTitleError = true;
        // alert("Please enter title of the post.");
      }
      if (!vm.data.message) {
        vm.showMessageError = true;
        // alert("Please enter title of the post.");
      }
      if (!vm.captcha) {
        vm.showCaptchaError = true;
        // alert("Please accept the terms and condition.");
      }

      if (!$scope.page) {
        $scope.page = {};
      }

      if (
        vm.showPageTitleError ||
        vm.showTitleError ||
        vm.showMessageError ||
        vm.showCaptchaError ||
        vm.showImageError
      ) {
        $window.scrollTo(0, 0);
      } else {
        vm.showError = false;
        vm.showImageError = false;
        $rootScope.loading = true;

        if ($scope.imageUrl) {
          $scope.imageUrl.map(function(item) {
            $rootScope.imageList.push({
              secure_url: item.secure_url,
              resource_type: 'imageURL',
              signature: item.signature || ''
            });
          });

          function removeDuplicates(myArr, prop) {
            return myArr.filter(function (obj, pos, arr) {
              return arr.map(function (mapObj) {
                return mapObj[prop];
              }).indexOf(obj[prop]) === pos;
            });
          }

          $rootScope.imageList = removeDuplicates($rootScope.imageList, 'secure_url');
        }

        // if ($scope.embedSocial.length) {
        //     $scope.embedSocial.map(function(item, i) {
        //         $scope.embedSocial[i] = escape(item);
        //     });
        // }

        var postData = {
          pageId: $scope.page._id,
          pageTitle: this.data.pageTitle,
          pageMessage: this.data.pageMessage,
          profilePic: ($rootScope.profilePic && $rootScope.profilePic.length ? $rootScope.profilePic[0] : null),
          coverPic: ($rootScope.coverPic && $rootScope.coverPic.length ? $rootScope.coverPic[0] : null),
          location: this.data.pageLocation,
          website: this.data.pageWebsite,
          title: this.data.title,
          message: this.data.message,
          anonymouscomment: this.data.anonymouscomment,
          notified: this.data.notified,
          share: this.data.share,
          sharedData: this.data.sharedData,
          embed: this.data.embed
            .replace("src=", "xxx=")
            .replace("href=", "yyyy="),
          embedDescription: this.data.embedDescription,
          files: $rootScope.imageList,
          postermode: this.data.postermode
        };
        // embedSocial: $scope.embedSocial,
        HttpService.AddPostWithPage(postData).then(function(response) {
          if (response.status == "200") {
            if (response && response.data && response.data["_id"]) {
                FlashService.Success("Completed successfully");
                $location.search({ success: true })
              $location.path("/page/" + response.data.page.url + "/post/" + response.data._id);
            } else if (response && response.data && response.data["data"] == "limit reached") {
              FlashService.Error(
                "Maximum Limit Reached: You have too many posts at one time. You can delete some posts or wait till your other posts expire!"
              );
              $window.scrollTo(0, 0);
          } else if (response && response.data && response.data["code"] == 11000) {
              FlashService.Error(
                "The page title is already in use, please, rename it!"
              );
              $window.scrollTo(0, 0);
            }
            $rootScope.loading = false;
          } else {
            $rootScope.loading = false;
            vm.dataLoading = false;
            $location.path("/");
          }
        });
      }
    };
    vm.updatePage = function() {

      $rootScope.loading = true;

      var pageData = {
        profilePic: ($rootScope.profilePic && $rootScope.profilePic.length ? $rootScope.profilePic[0] : null),
        coverPic: ($rootScope.coverPic && $rootScope.coverPic.length ? $rootScope.coverPic[0] : null),
        location: this.data.pageLocation,
        website: this.data.pageWebsite
      };
      HttpService.EditPage($scope.page._id, pageData).then(function(response) {
        if (response.status == "200") {
          $rootScope.loading = false;
          $location.search({});
          $location.path('/'+$scope.page.url);
        } else {
          $rootScope.loading = false;
          vm.dataLoading = false;
          $location.path("/");
        }
      });
    };

    $scope.resendPageLink = function (){
      // $rootScope.subscribePageId = $routeParams.id;
      $rootScope.modalInstance = $modal.open({
         templateUrl: 'app-view/subscribe/ResendPageLink.html'
         // templateUrl: 'app-view/subscribe/SubscribePageView.html'
     });
   }

  }
]);
