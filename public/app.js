var app = angular.module('app', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'angularMoment', 'vcRecaptcha', '720kb.socialshare', 'me-lazyload' ]);

app.service('MetaService', function() {
  var title = 'Healthy Fling';
  var description = 'Your new favorite personals site to create, search and reply to personal ads.';
  var image = 'https://www.healthyfling.com/app-content/images/logo.png';
  return {
    set: function(titleNew, descriptionNew, imageNew) {
      title = (titleNew ? titleNew : 'Healthy Fling');
      description = (descriptionNew ? descriptionNew : 'Your new favorite personals site to create, search and reply to personal ads.');
      image = (imageNew ? imageNew : 'https://www.healthyfling.com/app-content/images/logo.png');
    },
    title: function() { return title; },
    description: function() { return description; },
    image: function() { return image; }
  }
});

app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/', {
    controller: 'HomeController',
    templateUrl: 'app-view/home/HomeView.html',
    controllerAs: 'vm'
  })

  .when('/terms', {
      templateUrl: 'terms.html',
      reloadOnSearch: false
  })

  .when('/policy', {
      templateUrl: 'policy.html',
      reloadOnSearch: false
  })

  .when('/disclaimer', {
      templateUrl: 'disclaimer.html',
      reloadOnSearch: false
  })

  .when('/winmoney', {
      templateUrl: 'winmoney.html',
      reloadOnSearch: false
  })

  .when('/post', {
    controller: 'PostController',
    templateUrl: 'app-view/post/PostView.html',
    controllerAs: 'vm',
    reloadOnSearch: false
  })

  .when('/search', {
    controller: 'SearchController',
    templateUrl: 'app-view/search/SearchView.html',
    controllerAs: 'vm'
  })

  .when('/pages', {
    controller: 'PagesController',
    templateUrl: 'app-view/pages/PagesView.html',
    controllerAs: 'vm'
  })

  .when('/page/:pageId/post/:postId', {
    controller: 'PagePostDetailController',
    templateUrl: 'app-view/pagePostDetail/DetailView.html',
    controllerAs: 'vm'
  })

  .when('/contact', {
    controller: 'ContactController',
    templateUrl: 'app-view/contact/ContactView.html',
    controllerAs: 'vm'
  })

  .when('/response', {
    controller: 'ResponseController',
    templateUrl: 'app-view/response/ResponseView.html',
    controllerAs: 'vm'
  })

  .when('/expired', {
    controller: 'ExpiredController',
    templateUrl: 'app-view/expired/ExpiredView.html',
    controllerAs: 'vm'
  })

  .when('/error', {
    controller: 'ErrorController',
    templateUrl: 'app-view/error/ErrorView.html',
    controllerAs: 'vm'
  })

  .when('/reply', {
    controller: 'ReplyController',
    templateUrl: 'app-view/reply/ReplyView.html',
    controllerAs: 'vm'
  })

  .when('/reply/:id', {
    controller: 'ReplyController',
    templateUrl: 'app-view/reply/ReplyView.html',
    controllerAs: 'vm'
  })

  .when('/subscribe', {
    controller: 'SubscribeController',
    templateUrl: 'app-view/subscribe/SubscribeView.html',
    controllerAs: 'vm'
  })

  .when('/flag', {
    controller: 'FlagController',
    templateUrl: 'app-view/flag/FlagView.html',
    controllerAs: 'vm'
  })

  .when('/flag/:id', {
    controller: 'FlagController',
    templateUrl: 'app-view/flag/FlagView.html',
    controllerAs: 'vm'
  })

  .when('/options', {
    controller: 'OptionsController',
    templateUrl: 'app-view/options/OptionsView.html',
    controllerAs: 'vm'
  })

  .when('/options/:id', {
    controller: 'OptionsController',
    templateUrl: 'app-view/options/OptionsView.html',
    controllerAs: 'vm'
  })

  .when('/detail', {
    controller: 'DetailController',
    templateUrl: 'app-view/detail/DetailView.html',
    controllerAs: 'vm'
  })

  .when('/detail/:id', {
    controller: 'DetailController',
    templateUrl: 'app-view/detail/DetailView.html',
    controllerAs: 'vm'
  })

  .when('/edit', {
    controller: 'EditController',
    templateUrl: 'app-view/edit/EditView.html',
    controllerAs: 'vm'
  })

  .when('/edit/:id', {
    controller: 'EditController',
    templateUrl: 'app-view/edit/EditView.html',
    controllerAs: 'vm'
  })

  .when('/delete', {
    controller: 'DeleteController',
    templateUrl: 'app-view/delete/DeleteView.html',
    controllerAs: 'vm'
  })

  .when('/delete/:id', {
    controller: 'DeleteController',
    templateUrl: 'app-view/delete/DeleteView.html',
    controllerAs: 'vm'
  })

  .when('/comment', {
    controller: 'CommentController',
    templateUrl: 'app-view/comment/CommentView.html',
    controllerAs: 'vm'
  })

  .when('/comment/:id', {
    controller: 'CommentController',
    templateUrl: 'app-view/comment/CommentView.html',
    controllerAs: 'vm'
  })
  .when('/:id', {
    controller: 'PageController',
    templateUrl: 'app-view/page/PageView.html',
    controllerAs: 'vm'
  })
  .when('/:id/media', {
    controller: 'MediaController',
    templateUrl: 'app-view/page/media/PageView.html',
    controllerAs: 'vm'
  })
  .when('/:id/media/photo/:photoId', {
    controller: 'MediaPhotoController',
    templateUrl: 'app-view/page/media/photo/DetailView.html',
    controllerAs: 'vm'
  })
  .when('/:id/media/video/:postId', {
    controller: 'MediaVideoController',
    templateUrl: 'app-view/page/media/video/DetailView.html',
    controllerAs: 'vm'
  })

  .otherwise({ redirectTo: '404.html' });



}]);

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
});
function testInterceptor($window, $rootScope) {
  return {
    request: function(config) {
      return config;
    },

    requestError: function(config) {
      return config;
    },

    response: function(res) {
      return res;
    },

    responseError: function(res) {
        if (res.status === 401) {
            window.scrollTo(0, 0);
             alert("You are not authorized!");

             if ($rootScope.isLoggedIn === true || $window.localStorage.getItem("token")) {
                //  $window.localStorage.removeItem("token");
                //  $rootScope.isLoggedIn = false;
                //  $rootScope.email = null
             }
        }
      return res;
    }
  }
}
app.factory('testInterceptor', testInterceptor).config(function($httpProvider) {
    $httpProvider.interceptors.push('testInterceptor');
});

app.run(['$rootScope', '$location', '$cookieStore', '$http','$route', '$templateCache','$window', 'MetaService', function($rootScope, $location, $cookieStore, $http, $route, $templateCache, $window, MetaService ){
  var queryString = $location.search();

  if (queryString && queryString.accessToken) {
    $window.localStorage.setItem("token", queryString.accessToken);
    $location.search({})
  }
  var token = $window.localStorage.getItem("token");
  if (token) {
      var url = "/api/user";
      var config = {
          headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Authorization': token
          }
      };
      $user = $http.get(url, config).then(function(response) {
        $rootScope.email = response.data.email
      });

      $http.defaults.headers.common['authorization'] = token;
      $rootScope.token = token;
      $rootScope.isLoggedIn = true;
  } else {
    $rootScope.isLoggedIn = false;
  }

  // keep user logged in after page refresh
  // $rootScope.globals = $cookieStore.get('globals') || {};
  // if ($rootScope.globals.currentUser) {
  // }

  var url;
  for (var i in $route.routes) {
    if ($route.routes[i].preload) {
      if (url = $route.routes[i].templateUrl) {
        $http.get(url, { cache: $templateCache });
      }
    }
  }


  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    // redirect to login page if not logged in and trying to access a restricted page
    // var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
    // var loggedIn = $rootScope.globals.currentUser;
    // if (restrictedPage && !loggedIn) {
    //     $location.path('/login');
    // }

    if($location.path() == "/" && $rootScope.savedPreference == "locked" && $rootScope.preferenceLoaded != true){
      $location.path('/search');
      $rootScope.preferenceLoaded = true;

    }
    if($location.path().indexOf("/detail") !== -1){
      // $http.get("/data.json")
      // .success(function (data) {
      //     $rootScope.masterList = data;
      //     $route.reload();
      //
      // });

      $http.get("/data_country.json")
      .success(function (data) {
        $rootScope.masterListAll = data;


      });
    }
  });


  $rootScope.visitedSearchPage = false;

  $rootScope.preferenceLoaded = false;
  $rootScope.loading = false;
  $rootScope.loadingImage = false;
  $rootScope.adposts = {};
  $rootScope.search = {};
  $rootScope.search.country = "Country";
  $rootScope.search.state = "State";
  $rootScope.search.region = "Region";
  $rootScope.search.category = "Category";
  $rootScope.is_flagged = false;
  $rootScope.comment_to_flag = {};
  $rootScope.reply_to_flag = {};

  $rootScope.savedPreference = $window.localStorage.getItem("healthyfling_preference");

  if ($rootScope.savedPreference == "locked") {
    $rootScope.search.country = $window.localStorage.getItem("healthyfling_preference_country") || "Country";
    $rootScope.search.state = $window.localStorage.getItem("healthyfling_preference_state") || "State";
    $rootScope.search.region = $window.localStorage.getItem("healthyfling_preference_region") || "Region";
    $rootScope.search.category = $window.localStorage.getItem("healthyfling_preference_category") || "Category";
  }

  $rootScope.currentPost = {};

  $rootScope.comment = {};

  $rootScope.pageTitle = "Healthy Fling";

  // $http.get("/data.json")
  // .success(function (data) {
  //     $rootScope.masterList = data;
  // })
  // .error(function (data) {
  //
  // });

  $http.get("/data_country.json")
  .success(function (data) {
    $rootScope.masterListAll = data;


  })
  .error(function (data) {

  });

  $rootScope.countryList = ['Country', "United States", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Bolivia", "Brazil", "Bulgaria", "Canada", "Caribbean Islands", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Czech Republic", "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Ethiopia", "Finland", "France", "Germany", "Ghana", "Greece", "Guam / Micronesia", "Guatemala", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel and Palestine", "Italy", "Japan", "Kenya", "Korea", "Kuwait", "Lebanon", "Luxembourg", "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nicaragua", "Norway", "Pakistan", "Panama", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Romania", "Russian Federation", "Singapore", "South Africa", "Spain", "Sweden", "Switzerland", "Taiwan", "Thailand", "Tunisia", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Venezuela", "Vietnam", "Virgin Islands, U.S."];
  $rootScope.stateList = ['State'];
  $rootScope.regionList = ['Region'];
  $rootScope.categoryList = ['Category','Men Seeking Woman','Women Seeking Men', 'Men Seeking Men', 'Woman Seeking Woman','t4m', 'm4t', 't4w', 'w4t', 't4t', 'mw4mw', 'mw4w', 'mw4m', 'w4mw', 'm4mw', 'w4ww', 'm4mm', 'mm4m', 'ww4w', 'ww4m', 'mm4w', 'm4ww', 'w4mm', 't4mw', 'mw4t'];
  $rootScope.locationList = ['Location','Location1','Location2'];

  $rootScope.haircolorList = ['Hair Color','Black','Blonde','Brunette','White','Red','Brown','Bald'];
  $rootScope.heightList = ["Height","4'0","4'1","4'2","4'3","4'4","4'5","4'6","4'7","4'8","4'9","4'10","4'11","5'0","5'1","5'2","5'3","5'4","5'5","5'6","5'7","5'8","5'9","5'10","5'11","6'0","6'1","6'2","6'3","6'4","6'5","6'6","6'7","6'8","6'9","6'10","6'11","7'0","7'1","7'2","7'3","7'4","7'5","7'6","7'7","7'8","7'9","7'10","7'11","8'0","8'1","8'2","8'3","8'4","8'5","8'6","8'7","8'8","8'9","8'10","8'11"];
  $rootScope.ethnicityList = ["Ethnicity","White","Black","Hispanic/Latino","Asian","Native American","Pacific Islanders","Native Hawaiians","Middle Eastern","South Asian","European","Multi-Racial"];
  $rootScope.orientationList = ["Orientation","Straight","Gay","Bi","Lesbian"];
  $rootScope.bodytypeList = ["Body Type","Athletic","Lean","Muscualr","Bear","Jock","Daddy","Otter","Military","Hourglass","Pear","Bananna (Rectangular)","Petite","Apple","Slim","Average","Chubby","husky","Obese","Twink"];
  $rootScope.eyecolorList = ["Eye Color","Black","Brown","Green","Blue","Hazel"];
  $rootScope.statusList = ["Status","Single","Married","Open Relationship","complicated"];
  $rootScope.genderList = ["Gender","Male","Female","Trans"];
  $rootScope.bodyHairList = ["Body Hair","Hairy","Some hair","Light hair","Smooth"];
  $rootScope.hivstatusList = ["HIV Status","Negative","Positive (Detectable)","Positive (Undetectable)"];

  $rootScope.flagOptionList = ["Child pornograpy and or endangerment","Prostitution","Promoted terrorism","Spam or misleading", "Others"];

  $rootScope.changeList = function(data){
    $rootScope.regionList = $rootScope.masterList[data];

  };
}]);

app.directive('ngFileModel', ['$parse','$http','$rootScope', function ($parse,$http,$rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.ngFileModel);
      var isMultiple = attrs.multiple;
      var modelSetter = model.assign;
      element.bind('change', function () {
        $rootScope.loadingImage = true;
        var values = [];
        angular.forEach(element[0].files, function (item) {
          var fileReader = new FileReader();
          var myFormData = new FormData();
          fileReader.onload = function (event) {

            myFormData.append('imgUploader', item);
            $http.post("/api/uploadimagestolocal",myFormData, {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
            .success(function (data) {

              values.push(data);
              $rootScope.imageList.push(data);

            })
            .error(function (data) {

            });
          };
          fileReader.readAsDataURL(item);
          // var fileReader = new FileReader();
          // value ={};
          // fileReader.onload = function (event) {
          //     var uri = event.target.result;
          //     value = {
          //        // File Name
          //         // name: item.name,
          //         //File Size
          //         // size: item.size,
          //         //File URL to view
          //         url: uri
          //         // File Input Value
          //         // _file: item
          //     };
          //
          //     $http.post("/api/uploadimagestolocal",JSON.stringify(value), {'Content-Type': 'application/json; charset=utf-8','Authorization': undefined })
          //     .success(function (data) {
          //
          //         values.push(data);
          //         $rootScope.imageList.push(data);
          //
          //     })
          //     .error(function (data) {
          //
          //     });

          //     // values.push(value);
          // };
          // fileReader.readAsDataURL(item);

        });
        scope.$apply(function () {
          if (isMultiple) {
            modelSetter(scope, values);
          } else {
            modelSetter(scope, values[0]);
          }
        });
        angular.element("input[type='file']").val(null);
      });
    }
  };
}]);

app.directive('ngProfilepicModel', ['$parse','$http','$rootScope', function ($parse,$http,$rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var model = $parse(attrs.ngProfilepicModel);
      var isMultiple = attrs.multiple;
      var modelSetter = model.assign;
      element.bind('change', function () {
        $rootScope.loadingProfileImage = true;
        var values = [];
        angular.forEach(element[0].files, function (item) {
          var fileReader = new FileReader();
          var myFormData = new FormData();
          fileReader.onload = function (event) {
            myFormData.append('imgUploader', item);
            $http.post("/api/uploadimagestolocal",myFormData, {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
            .success(function (data) {
              values.push(data);
              $rootScope.profilePic = [data.secure_url];
            })
            .error(function (data) {

            });
          };
          fileReader.readAsDataURL(item);
        });
        scope.$apply(function () {
          if (isMultiple) {
            modelSetter(scope, values);
          } else {
            modelSetter(scope, values[0]);
          }
        });
        angular.element("input[type='file']").val(null);
      });
    }
  };
}]);

app.directive('ngCoverpicModel', ['$parse','$http','$rootScope', function ($parse,$http,$rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var model = $parse(attrs.ngCoverpicModel);
      var isMultiple = attrs.multiple;
      var modelSetter = model.assign;
      element.bind('change', function () {
        $rootScope.loadingCoverImage = true;
        var values = [];
        angular.forEach(element[0].files, function (item) {
          var fileReader = new FileReader();
          var myFormData = new FormData();
          fileReader.onload = function (event) {
            myFormData.append('imgUploader', item);
            $http.post("/api/uploadimagestolocal?original=true",myFormData, {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
            .success(function (data) {
              values.push(data);
              $rootScope.coverPic = [data.secure_url];
            })
            .error(function (data) {

            });
          };
          fileReader.readAsDataURL(item);
        });
        scope.$apply(function () {
          if (isMultiple) {
            modelSetter(scope, values);
          } else {
            modelSetter(scope, values[0]);
          }
        });
        angular.element("input[type='file']").val(null);
      });
    }
  };
}]);

app.directive('ngReplyFileModel', ['$parse','$http','$rootScope', function ($parse,$http,$rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.ngFileModel);
      var isMultiple = attrs.multiple;
      var modelSetter = model.assign;
      element.bind('change', function () {
        $rootScope.loadingImage = true;
        var values = [];
        angular.forEach(element[0].files, function (item) {
          var fileReader = new FileReader();
          var myFormData = new FormData();
          fileReader.onload = function (event) {

            myFormData.append('imgUploader', item);
            $http.post("/api/uploadimagestolocal",myFormData, {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
            .success(function (data) {

              values.push(data);
              $rootScope.tempImageList.push(data);

            })
            .error(function (data) {

            });
          };
          fileReader.readAsDataURL(item);

        });
        scope.$apply(function () {
          if (isMultiple) {
            modelSetter(scope, values);
          } else {
            modelSetter(scope, values[0]);
          }
        });
        angular.element("input[type='file']").val(null);
      });
    }
  };
}]);

app.directive('ngTempFileModel', ['$parse','$http','$rootScope', function ($parse,$http,$rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.ngTempFileModel);
      var isMultiple = attrs.multiple;
      var modelSetter = model.assign;
      element.bind('change', function () {
        $rootScope.loadingImage = true;
        var values = [];
        angular.forEach(element[0].files, function (item) {
          var fileReader = new FileReader();
          value ={};
          fileReader.onload = function (event) {
            var uri = event.target.result;
            value = {
              // File Name
              // name: item.name,
              //File Size
              // size: item.size,
              //File URL to view
              url: uri
              // File Input Value
              // _file: item
            };

            $http.post("/api/uploadtempimages",JSON.stringify(value), {'Content-Type': 'application/json; charset=utf-8','Authorization': undefined })
            .success(function (data) {

              values.push(data);
              $rootScope.tempImageList.push(data);

            })
            .error(function (data) {

            });

            // values.push(value);
          };
          fileReader.readAsDataURL(item);

        });
        scope.$apply(function () {
          if (isMultiple) {
            modelSetter(scope, values);
          } else {
            modelSetter(scope, values[0]);
          }
        });
        angular.element("input[type='file']").val(null);
      });
    }
  };
}]);

app.directive('windowSize', function ($window) {
  return function (scope, element) {
    var w = angular.element($window);
    scope.getWindowDimensions = function () {
      return {
        'h': w.height(),
        'w': w.width()
      };
    };
    scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
      scope.windowHeight = newValue.h;
      scope.windowWidth = newValue.w;
      scope.style = function () {
        return {
          'height': (newValue.h - 100) + 'px',
          'width': (newValue.w - 100) + 'px'
        };
      };
    }, true);

    w.bind('resize', function () {
      scope.$apply();
    });
  }
});

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
    input.push(i);
    return input;
  };
});

app.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
});

app.filter('trusted', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
});
