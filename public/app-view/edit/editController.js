app.controller('EditController', ['$rootScope','$scope','$location' ,'HttpService', '$http', '$window', 'MetaService', function( $rootScope,$scope,$location,HttpService,$http,$window, MetaService ){
    var vm = this;

    $rootScope.metaservice = MetaService;
    $rootScope.metaservice.set('Post an Ad');

    $scope.countries = $rootScope.countryList;
    $scope.states = $rootScope.stateList;
    $scope.regions = $rootScope.regionList;

    $scope.newstates = ["State"];
    $scope.newregions = [];

    // $scope.embedSocial = [''];
    // $scope.addEmbedSocialField = function() {
    //     $scope.embedSocial.push('');
    // }

    $scope.imageUrl = [{}];
    $scope.addImageUrlField = function() {
        $scope.imageUrl.push({});
    }

    $scope.haircolorList = $rootScope.haircolorList;
    $scope.heightList = $rootScope.heightList;
    $scope.ethnicityList = $rootScope.ethnicityList;
    $scope.orientationList = $rootScope.orientationList;
    $scope.bodytypeList = $rootScope.bodytypeList;
    $scope.eyecolorList = $rootScope.eyecolorList;
    $scope.statusList = $rootScope.statusList;
    $scope.genderList = $rootScope.genderList;
    $scope.bodyHairList = $rootScope.bodyHairList;
    $scope.hivstatusList = $rootScope.hivstatusList;
    $scope.anonymouscommentList = [ "enabled", "disabled" ];
    $scope.notifiedList = [ "yes", "no" ];

    var range = ["Age"];
    for(var i=0;i<201;i++) {
      range.push(i);
    }
    $scope.ageRange = range;

    range = ["Weight"];
    for(var i=90;i<501;i++) {
      range.push(i);
    }

    $scope.weightRange = range;

    if ($scope.regions && $scope.regions.indexOf("Region") == -1){
        $scope.regions.unshift("Region");
    }
    $scope.categories = $rootScope.categoryList;

    vm.state = $rootScope.search.state;
    vm.region = $rootScope.search.region;
    vm.category = $rootScope.search.category;

    $rootScope.imageList = [];

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
            $scope.regions = ['Region'];
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

   $scope.changeNewPostList = function(data){
        if(data != "" && data != undefined && data != "State" && data != "Provinces"){
            $scope.newregions = $scope.newmasterList[data];
            $scope.newregions.unshift("Region");
            var temp = $scope.newregions;
            $scope.newregions = temp.filter(function(item, pos){
              return temp.indexOf(item)== pos;
            });
        }else{
            $scope.newregions = ['Region'];
        }
   };

   $scope.changeNewPostStateList = function(data){
        if(data != "" && data != undefined && data != "Country"){
            $scope.newmasterList = $rootScope.masterListAll[data];
            $scope.newstates = Object.keys($rootScope.masterListAll[data]);
            // $rootScope.regionList = $rootScope.masterListAll[data];

            if (data != "United States" && data != "Canada") {
                $scope.newregions = $scope.newmasterList["State"];
                $scope.newregions.unshift("Region");
                var temp = $scope.newregions;
                $scope.newregions = temp.filter(function(item, pos){
                  return temp.indexOf(item)== pos;
                });
            }
        }else{
            // $scope.regions = ['Region'];
        }
   };

   $scope.stopLoader = function(){
        $rootScope.loadingImage = false;
   };

   $scope.deleteImage = function(index){

        $rootScope.imageList.splice(index, 1);
        $scope.files = $rootScope.imageList;


   };

    vm.files = [];



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


    vm.check=function(){
        if (vm.data.files.length > 0) {
            alert(vm.data.files.length+" files selected ... Max allowed files is 5.");
        }

    };

    vm.search = function () {
        $rootScope.search.state = this.state;
        $rootScope.search.region = this.region;
        $rootScope.search.category = this.category;

        $location.path('/search');
    };

    vm.data = {
        "title": "",
        "country" : "Country",
        "state": "State",
        "region": "Region",
        "category": "Category",
        "location": "",
        "age": "",
        "message": "",
        "haircolor": "Hair Color",
        "height": "Height",
        "ethnicity": "Ethnicity",
        "orientation": "Orientation",
        "bodytype": "Body Type",
        "eyecolor": "Eye Color",
        "status": "Status",
        "gender": "Gender",
        "bodyhair": "Body Hair",
        "hivstatus": "HIV Status",
        "anonymouscomment" : "disabled",
        "notified" : "no",
        "share" : "disabled",
        "embed": "",
        "weight" : "Weight",
        "mage" : "Age"
    };
    $scope.editPost = function(id){

        $scope.showImageError = false;
        $scope.showRequiredCountryError = false;
        $scope.showRequiredStateError = false;
        $scope.showRequiredRegionError = false;
        $scope.showRequiredCategoryError = false;
        $scope.showMessageError = false;
        $scope.showTitleError = false;
        $scope.showCaptchaError = false;

        $scope.showError = true;
        if ($rootScope.imageList && $rootScope.imageList.length > 10) {
            $scope.showImageError = true;
            $scope.imageLength = $rootScope.imageList.length;
            // alert($rootScope.imageList.length+" files selected ... Max allowed files is 5.");
        }
        if ((!$scope.country ||$scope.country == 'Country')){
            $scope.showRequiredCountryError = true;
            // alert("Please Select, Region and Category.");
        }
        if ((!$scope.state ||$scope.state == 'State' || $scope.state == 'Provinces') && ($scope.country == "United States" || $scope.country == "Canada")){
            $scope.showRequiredStateError = true;
            // alert("Please Select, Region and Category.");
        }
        if ((!$scope.region ||$scope.region == 'Region')){
            $scope.showRequiredRegionError = true;
            // alert("Please Select, Region and Category.");
        }
        if ((!$scope.category ||$scope.category == 'Category')){
            $scope.showRequiredCategoryError = true;
            // alert("Please Select, Region and Category.");
        }
        if (!$scope.title){
            $scope.showTitleError = true;
            // alert("Please enter title of the post.");
        }
        if (!$scope.message){
            $scope.showMessageError = true;
            // alert("Please enter title of the post.");
        }
        if (!$scope.captcha){
            $scope.showCaptchaError = true;
            // alert("Please accept the terms and condition.");
        }

        if (($scope.haircolor == 'Hair Color')){
            $scope.haircolor = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.height == 'Height')){
            $scope.height = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.ethnicity == 'Ethnicity')){
            $scope.ethnicity = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.orientation == 'Orientation')){
            $scope.orientation = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.bodytype == 'Body Type')){
            $scope.bodytype = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.eyecolor == 'Eye Color')){
            $scope.eyecolor = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.mstatus == 'Status')){
            $scope.mstatus = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.gender == 'Gender')){
            $scope.gender = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.bodyhair == 'Body Hair')){
            $scope.bodyhair = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.hivstatus == 'HIV Status')){
            $scope.hivstatus = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.weight == 'Weight')){
            $scope.weight = "";
            // alert("Please Select, Region and Category.");
        }

        if (($scope.mage == 'Age')){
            $scope.mage = "";
            // alert("Please Select, Region and Category.");
        }

        if( $scope.showRequiredStateError || $scope.showRequiredCountryError || $scope.showRequiredRegionError || $scope.showRequiredCategoryError || $scope.showMessageError || $scope.showImageError || $scope.showTitleError ){

            $window.scrollTo(0, 0);
            if($scope.mage == ""){
                $scope.mage = "Age";
            }
            if($scope.haircolor == ""){
                $scope.haircolor = "Hair Color";
            }
            if($scope.height == ""){
                $scope.height = "Height";
            }
            if($scope.ethnicity == ""){
                $scope.ethnicity = "Ethnicity";
            }
            if($scope.orientation == ""){
                $scope.orientation = "Orientation";
            }
            if($scope.bodytype == ""){
                $scope.bodytype = "Body Type";
            }
            if($scope.eyecolor == ""){
                $scope.eyecolor = "Eye Color";
            }
            if($scope.mstatus == ""){
                $scope.mstatus = "Status";
            }
            if($scope.gender == ""){
                $scope.gender = "Gender";
            }
            if($scope.bodyhair == ""){
                $scope.bodyhair = "Body Hair";
            }
            if($scope.hivstatus == ""){
                $scope.hivstatus = "HIV Status";
            }
            if($scope.weight == ""){
                $scope.weight = "Weight";
            }
        }else{
            $scope.showImageError = false;
            $rootScope.loading = true;
            //
            var postData = {
                "title": $scope.title,
                "country": $scope.country,
                "state": $scope.state,
                "region": $scope.region,
                "category": $scope.category,
                "location": $scope.location,
                "age": $scope.age,
                "message": $scope.message,
                "haircolor": $scope.haircolor,
                "height": $scope.height,
                "ethnicity": $scope.ethnicity,
                "orientation": $scope.orientation,
                "bodytype": $scope.bodytype,
                "eyecolor": $scope.eyecolor,
                "mstatus": $scope.mstatus,
                "gender": $scope.gender,
                "bodyhair": $scope.bodyhair,
                "hivstatus": $scope.hivstatus,
                "anonymouscomment" : $scope.anonymouscomment,
                "notified" : $scope.notified,
                "embed": ($scope.embed ? $scope.embed.replace("src=", "xxx=").replace("href=", "yyyy="): ''),
                "share" : $scope.share,
                "city" : $scope.city,
                "zip" : $scope.zip,
                "weight" : $scope.weight,
                "mage" : $scope.mage,
                "files": $rootScope.imageList
            };

             HttpService.EditPost(id,postData)
            .then(function(response){
                if (response.status == '200') {


                    // alert("Your ad has been created. A verification mail will be sent shortly!");
                    if (response && response.data && response.data["_id"]) {
                        $location.path('/detail/'+response.data["_id"]);
                    }
                    $rootScope.loading = false;
                }else{
                    $rootScope.loading = false;
                    // FlashService.Error(response.data.resultDescription);
                    vm.dataLoading = false;
                    $location.path('/');
                };

            });
        }
    }

    $scope.editPostPage = function(id){
        $scope.showImageError = false;
        $scope.showMessageError = false;
        $scope.showTitleError = false;
        $scope.showCaptchaError = false;

        $scope.showError = true;
        if ($rootScope.imageList && $rootScope.imageList.length > 10) {
            $scope.showImageError = true;
            $scope.imageLength = $rootScope.imageList.length;
            // alert($rootScope.imageList.length+" files selected ... Max allowed files is 5.");
        }
        if (!$scope.title){
            $scope.showTitleError = true;
            // alert("Please enter title of the post.");
        }
        if (!$scope.message){
            $scope.showMessageError = true;
            // alert("Please enter title of the post.");
        }
        if (!$scope.captcha){
            $scope.showCaptchaError = true;
            // alert("Please accept the terms and condition.");
        }

        if($scope.showMessageError || $scope.showImageError || $scope.showTitleError){

            $window.scrollTo(0, 0);
        }else{
            $scope.showImageError = false;
            $rootScope.loading = true;

            $rootScope.imageList = [];

            if ($scope.imageUrl) {
                $scope.imageUrl.map(function(item) {
                  $rootScope.imageList.push({
                    secure_url: item.secure_url,
                    resource_type: 'imageURL',
                    signature: item.signature || ''
                  });
              });
            }

            $scope.files.map(function(item) {
              $rootScope.imageList.push({
                secure_url: item.secure_url,
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

            // if ($scope.embedSocial.length) {
            //     $scope.embedSocial.map(function(item, i) {
            //         $scope.embedSocial[i] = escape(item);
            //     });
            // }

            var postData = {
                "title": $scope.title,
                "message": $scope.message,
                "anonymouscomment" : $scope.anonymouscomment,
                "notified" : $rootScope.currentPost.data.notified,
                "embed": ($scope.embed ? $scope.embed.replace("src=", "xxx=").replace("href=", "yyyy="): ''),
                "embedDescription": $scope.embedDescription,
                "files": $rootScope.imageList,
                "sharedData": $scope.sharedData
            };
            // "embedSocial": $scope.embedSocial,

             HttpService.EditPost(id,postData)
            .then(function(response){
                if (response.status == '200') {


                    // alert("Your ad has been created. A verification mail will be sent shortly!");
                    if (response && response.data && response.data["_id"]) {
                        $location.path('/page/' + $rootScope.currentPost.data.page + '/post/' + response.data["_id"]);
                    }
                    $rootScope.loading = false;
                }else{
                    $rootScope.loading = false;
                    // FlashService.Error(response.data.resultDescription);
                    vm.dataLoading = false;
                    $location.path('/');
                };

            });
        }
    }

    vm.detail = function (id) {
      $location.path("/detail/"+id);
    };

     $scope.initController = function () {



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
        $rootScope.loading = true;
        $scope.mainImage = "https://placehold.it/710X420";
        HttpService.GetAPostForEdit(id)
        .then(function(response){

            if (response.status == '200') {

              if (response.data.page) {

                $rootScope.currentPost.data = response.data;
                $scope.id = $rootScope.currentPost.data["_id"];
                $scope.title = $rootScope.currentPost.data.title;
                $rootScope.pageTitle = $scope.title;
                $scope.message = $rootScope.currentPost.data.body;
                $scope.created = $rootScope.currentPost.data.created;
                $scope.notified = $rootScope.currentPost.data.notified || 'no';
                $rootScope.imageList = $rootScope.currentPost.data.files;
                $scope.files = $rootScope.currentPost.data.files;
                // $scope.embedSocial = $rootScope.currentPost.data.embedSocial;
                // if ($scope.embedSocial.length) {
                //     $scope.embedSocial.map(function(item, i) {
                //         $scope.embedSocial[i] = unescape(item);
                //     });
                // } else {
                //     $scope.embedSocial = [''];
                // }
                $scope.sharedData = $rootScope.currentPost.data.sharedData || {};
                $scope.imageUrl = [{}];
                $scope.files.map(function(item) {
                  if (item.resource_type === 'imageURL') {
                    $scope.imageUrl.push(item);
                  }
                });
                $scope.files = $scope.files.filter(function(item) {
                  return !item.resource_type;
                });
                $scope.anonymouscomment = $rootScope.currentPost.data.anonymouscomment || "disabled";
                $scope.share = $rootScope.currentPost.data.share || "disabled";
                $scope.embed = ($rootScope.currentPost.data.embed ? $rootScope.currentPost.data.embed.replace("xxx=", "src=").replace("yyyy=", "href=") : '');
                $scope.embedDescription = $rootScope.currentPost.data.embedDescription;
                $rootScope.loading = false;

                if($scope.files.length > 0){
                    $scope.mainImage = $scope.files[0].secure_url;
                }

              } else {
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
                $scope.country = $rootScope.currentPost.data.country;
                $scope.state = $rootScope.currentPost.data.state;
                $scope.category = $rootScope.currentPost.data.category;
                $scope.created = $rootScope.currentPost.data.created;
                $scope.files = $rootScope.currentPost.data.files;
                $scope.city = $rootScope.currentPost.data.city;
                $scope.zip = $rootScope.currentPost.data.zip;
                $rootScope.imageList = $rootScope.currentPost.data.files;

                $scope.newmasterList = $rootScope.masterListAll[$scope.country];
                $scope.newstates = Object.keys($rootScope.masterListAll[$scope.country]);
                if ($scope.country == "United States" || $scope.country == "Canada") {
                    $scope.newregions = $scope.newmasterList[$scope.state];
                }else{
                    $scope.newregions = $scope.newmasterList["State"];
                }
                $scope.newregions.unshift("Region");

                $scope.haircolor = $rootScope.currentPost.data.haircolor || "Hair Color";
                $scope.height = $rootScope.currentPost.data.height || "Height";
                $scope.ethnicity = $rootScope.currentPost.data.ethnicity || "Ethnicity";
                $scope.orientation = $rootScope.currentPost.data.orientation || "Orientation";
                $scope.bodytype = $rootScope.currentPost.data.bodytype || "Body Type";
                $scope.eyecolor = $rootScope.currentPost.data.eyecolor || "Eye Color";
                $scope.mstatus = $rootScope.currentPost.data.mstatus || "Status";
                $scope.gender = $rootScope.currentPost.data.gender || "Gender";
                $scope.bodyhair = $rootScope.currentPost.data.bodyhair || "Body Hair";
                $scope.hivstatus = $rootScope.currentPost.data.hivstatus || "HIV Status";
                $scope.weight = $rootScope.currentPost.data.weight || "Weight";
                $scope.mage = $rootScope.currentPost.data.mage || "Age";
                $scope.anonymouscomment = $rootScope.currentPost.data.anonymouscomment || "disabled";
                $scope.notified = $rootScope.currentPost.data.notified || "no";
                $scope.share = $rootScope.currentPost.data.share || "disabled";
                $scope.embed = ($rootScope.currentPost.data.embed ? $rootScope.currentPost.data.embed.replace("xxx=", "src=").replace("yyyy=", "href=") : '');

                $rootScope.loading = false;
                if($scope.files.length > 0){
                    $scope.mainImage = $scope.files[0].secure_url;
                }
              }

            }else{
                $rootScope.loading = false;
                vm.dataLoading = false;
                $location.path('/');
            };

        });
    };

}]);
