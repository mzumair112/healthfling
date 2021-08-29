app.controller('DeleteController', ['$rootScope','$scope', '$location', 'HttpService', '$http','$window', 'FlashService', function( $rootScope,$scope,$location,HttpService,$http,$window,FlashService ){
    var vm = this;

    $rootScope.pageTitle = "Healthy Fling";

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
        HttpService.DeleteAPost(id)
        .then(function(response){

            if (response.status == '200') {
                $rootScope.currentPost.data = response.data;

                $rootScope.regionList = $rootScope.masterList[response.data.state];
                $scope.regions = $rootScope.regionList;

                vm.country = "United States";
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
                $scope.country = "United States";
                $scope.state = $rootScope.currentPost.data.state;
                $scope.category = $rootScope.currentPost.data.category;
                $scope.created = $rootScope.currentPost.data.created;
                $scope.files = $rootScope.currentPost.data.files;
                $rootScope.loading = false;
                if($scope.files.length > 0){
                    $scope.mainImage = $scope.files[0].url;
                }
            }else{
                $rootScope.loading = false;
                vm.dataLoading = false;
                $location.path('/');
            };

        });
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

}]);


app.controller('DetailController', ['$rootScope','$scope','$location','HttpService','$http','$route','FlashService','$document','$modal','$window', function( $rootScope,$scope,$location,HttpService,$http,$route,FlashService,$document,$modal,$window){
    var vm = this;

    if($rootScope.visitedSearchPage){
        $rootScope.loading = true;
    }

    $scope.replyNotified = false;
    $scope.showShareButtons = false;
    $scope.showEmbedButtons = false;
    $scope.replyNotifiedEmail = "";
    $scope.currentPath = $location.absUrl();
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


   $scope.addComment = function(id){


        $scope.showError = true;

        if (($scope.mage == 'Age')){
            $scope.mage = "";
            // alert("Please Select, Region and Category.");
        }

        if( $scope.commentmessage == undefined && $scope.commentmessage == '' || $scope.captcha == undefined){

            FlashService.Error("Please select the Capcha!");
            $window.scrollTo(0, 0);
        }else{
            $scope.showImageError = false;
            $rootScope.loading = true;
            //
            var postData = {
                "commentmessage": $scope.commentmessage,
                "email": $scope.replyNotifiedEmail,
                "commentfiles": $rootScope.imageList,
                "commentembed": $scope.commentembed.replace("src=", "xxx=").replace("href=", "yyyy=")
            };


             HttpService.EditPost(id,postData)
            .then(function(response){
                if (response.status == '200') {


                    // alert("Your ad has been created. A verification mail will be sent shortly!");
                    if (response && response.data && response.data["_id"]) {
                        $location.path('/detail/'+response.data["_id"]);
                        FlashService.Success("Your comment has been successfully added.");
                        $scope.loadComments($scope.id);
                        $scope.commentmessage = "";
                        $scope.commentembed = "";
                        $window.scrollTo(0, 0);
                    }
                    $rootScope.loading = false;
                    $rootScope.imageList = [];
                    $scope.commentsMainImage = [];
                    $scope.replyMainImage = [];
                    $scope.comments = [];
                }else{
                    $rootScope.loading = false;
                    // FlashService.Error(response.data.resultDescription);
                    vm.dataLoading = false;
                    $location.path('/');
                };

            });
        }
    }

    $scope.replyComment = function(id){


        // $scope.showError = true;

        // if (($scope.mage == 'Age')){
        //     $scope.mage = "";
        //     // alert("Please Select, Region and Category.");
        // }

        // if( $scope.commentmessage == undefined && $scope.commentmessage == '' || $scope.captcha == undefined){
        //
        //     FlashService.Error("Please select the Capcha!");
        //     $window.scrollTo(0, 0);
        // }else{
        //     $scope.showImageError = false;
        //     $rootScope.loading = true;
        //     //
        //     var postData = {
        //         "commentmessage": $scope.commentmessage,
        //     };
        //
        //      HttpService.EditPost(id,postData)
        //     .then(function(response){
        //         if (response.status == '200') {
        //
        //
        //             // alert("Your ad has been created. A verification mail will be sent shortly!");
        //             if (response && response.data && response.data["_id"]) {
        //                 $location.path('/detail/'+response.data["_id"]);
        //                 FlashService.Success("Your comment has been successfully added.");
        //                 $scope.loadComments($scope.id);
        //                 $scope.commentmessage = "";
        //                 $window.scrollTo(0, 0);
        //             }
        //             $rootScope.loading = false;
        //         }else{
        //             $rootScope.loading = false;
        //             // FlashService.Error(response.data.resultDescription);
        //             vm.dataLoading = false;
        //             $location.path('/');
        //         };

        //     });
        // }
    }


   $scope.changeMainImage = function(file,embed){
        if(embed == false){
            $scope.mainImage = file.secure_url;
        }else{
            $scope.mainImage = file;
        }
   }

   $scope.changeCommentsMainImage = function(url,index){
        $scope.commentsMainImage[index] = url;
   }

   $scope.changeReplyMainImage = function(url,parent_index,index){


        $scope.replyMainImage[parent_index][index] = url;
   }



    var path = $location.path();
    var arr = path.split("/");
    var id = arr[arr.length-1];
    $scope.id = id;

    $scope.loadComments = function(id){
        $scope.commentsMainImage = [];
        $scope.replyMainImage = [];
        $scope.comments = [];
        var commentReply = [];
        HttpService.GetComments(id)
        .then(function(response){

            if (response.status == '200') {
                for (var i = 0; i < response.data.length; i++) {
                    var obj = response.data[i];
                    if(obj.embed){
                        obj.embed = obj.embed.replace('xxx=', 'src=').replace('yyyy=', 'href=');
                    }
                    if(obj != undefined && obj.files.length > 0){
                        obj['mainImage'] = obj.files[0].secure_url;
                    }else if(obj != undefined && obj.embed != "" && obj.files.length == 0){
                        obj['mainImage'] = obj.embed;
                    }

                    obj.replies.reverse();

                    commentReply = [];

                    for (var j = 0; j < obj.replies.length; j++) {
                        if (obj.replies[j].label != undefined) {
                            var index = $scope.findIndexByKeyValue(obj.replies, '_id', obj.replies[j].label);
                            if (index > -1) {
                                var owner = obj.replies[index].owner;

                                if (owner == "poster") {
                                    obj.replies[j].responseLabel = '(Response to "Reply '+(index+1)+' posters response")';
                                }else{
                                    obj.replies[j].responseLabel = '(Response to "Reply '+(index+1)+'")';
                                }
                            }
                        }
                        if(obj.replies[j].embed != undefined && obj.replies[j].embed != ''){

                            obj.replies[j].embed = obj.replies[j].embed.replace('xxx=', 'src=').replace('yyyy=', 'href=');
                        }else{
                            obj.replies[j].embed = "";
                        }
                        if(obj.replies[j] != undefined && obj.replies[j].files.length > 0){
                            obj.replies[j]['mainImage'] = obj.replies[j].files[0].secure_url;
                        }else if(obj.replies[j] != undefined && obj.replies[j].embed != "" && obj.replies[j].files.length == 0){
                            obj.replies[j]['mainImage'] = obj.replies[j].embed;
                        }
                        commentReply.push(obj.replies[j]['mainImage']);
                    }
                    $scope.replyMainImage.push(commentReply);
                    $scope.commentsMainImage.push(obj['mainImage']);
                    $scope.comments.push(obj);
                }


            }else{

                // $rootScope.loading = false;
                // vm.dataLoading = false;
                // $location.path('/expired');
            };

        });
    }

    $scope.findIndexByKeyValue = function(_array, key, value) {
        for (var i = 0; i < _array.length; i++) {
            if (_array[i][key] == value) {
                return i;
            }
        }
        return -1;
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

    $scope.deleteReply = function(id){
        $rootScope.loading = true;
        HttpService.DeleteAReply(id)
        .then(function(response){

            if (response.status == '200') {
                $scope.loadComments($scope.id);
                FlashService.Success("The reply has been successfully deleted.");
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
        $scope.mainImage = "https://placehold.it/710X420";
        HttpService.GetAPost(id)
        .then(function(response){

            $scope.is_edit = false;
            if (response.status == '200' && response.data["_id"]) {
                $rootScope.currentPost.data = response.data;
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

                $scope.haircolor = $rootScope.currentPost.data.haircolo;
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
                $scope.embed = $rootScope.currentPost.data.embed.replace("xxx=", "src=").replace("yyyy=", "href=") || '';
                $scope.share = $rootScope.currentPost.data.share || 'disabled';

                $rootScope.loading = false;

                if($scope.files.length > 0){
                    $scope.mainImage = $scope.files[0].secure_url;
                }else if($scope.embed != "" && $scope.files.length == 0){
                    $scope.mainImage = $scope.embed;
                }


            }else{
                $rootScope.loading = false;
                vm.dataLoading = false;
                $location.path('/expired');
            };

        });

        $scope.loadComments(id);

    };

    $rootScope.reloadPost = function(){
        vm.state = $rootScope.currentPost.data.body;
    }

    vm.post = function () {
        $location.path('/post');
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

    $scope.toggleShareButton = function(){
        if($scope.showShareButtons && $scope.showShareButtons == true){
            $scope.showShareButtons = false;
        }else{
            $scope.showShareButtons = true;
        }
    }

    $scope.openModal = function (){
         $rootScope.modalInstance = $modal.open({
            templateUrl: 'app-view/reply/ReplyView.html'
        });
    }

     $scope.openModal_flag = function (){
         $rootScope.modalInstance = $modal.open({
            templateUrl: 'app-view/flag/FlagView.html'
        });
    }

    $scope.openCommentModal = function (comment,reply){
        $rootScope.comment = comment;
        $rootScope.comment.replyLabel = reply["_id"];
        if (reply["owner"] == "poster" && $rootScope.currentPost.data.notified == "yes") {
            $rootScope.comment.replyEmail = $rootScope.currentPost.data.email || "";
            $rootScope.comment.ownerEmail = $rootScope.currentPost.data.email;
        }else{
            $rootScope.comment.replyEmail = reply["email"] || '';
            $rootScope.comment.ownerEmail = $rootScope.currentPost.data.email;
        }
        $rootScope.modalInstance = $modal.open({
            templateUrl: 'app-view/comment/CommentView.html'
        });
    }

    $scope.openCommentModalPoster = function (comment,reply){
        $rootScope.comment = comment;
        $rootScope.comment.replyLabel = reply["_id"];
        $rootScope.comment.replyEmail = reply["email"] || '';
        $rootScope.comment.ownerEmail = $rootScope.currentPost.data.email;
        $rootScope.comment.owner = "poster";
        $rootScope.modalInstance = $modal.open({
            templateUrl: 'app-view/comment/CommentView.html'
        });
    }

    $scope.openCommentsModal_flag = function (comment){
        $rootScope.comment_to_flag = comment;
         $rootScope.modalInstance = $modal.open({
            templateUrl: 'app-view/options/OptionsView.html'
        });
    }

    $scope.openReplyModal_flag = function (reply){
        $rootScope.reply_to_flag = reply;
        $rootScope.modalInstance = $modal.open({
            templateUrl: 'app-view/options/OptionsView.html'
        });
    }

    $scope.unflagReply = function(id){

        $rootScope.loading = true;
        HttpService.UnflagAReply(id)
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

    $scope.$on("reloadComments",function () {
        $scope.loadComments($scope.id);
    });

    $scope.deleteImage = function(index){

        $rootScope.imageList.splice(index, 1);
        $scope.files = $rootScope.imageList;


   };

   $scope.stopLoader = function(){
        $rootScope.loadingImage = false;
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
