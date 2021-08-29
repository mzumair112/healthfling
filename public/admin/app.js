var app = angular.module('app', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'angularMoment', 'vcRecaptcha' ]);


app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
    $routeProvider
        // .when('/', {
        //     controller: 'LoginController',
        //     templateUrl: 'app-view/login/LoginView.html',
        //     controllerAs: 'vm'
        // })

        .when('/', {
            controller: 'DashboardController',
            templateUrl: 'app-view/dashboard/DashboardView.html',
            controllerAs: 'vm'
        })

        .when('/pages', {
            controller: 'PageController',
            templateUrl: 'app-view/page/PageListView.html',
            controllerAs: 'vm'
        })

        .when('/post', {
            controller: 'PostController',
            templateUrl: 'app-view/post/PostView.html',
            controllerAs: 'vm'
        })

        .when('/users', {
            controller: 'UserController',
            templateUrl: 'app-view/user/UsersView.html',
            controllerAs: 'vm'
        })

        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'app-view/login/LoginView.html',
            controllerAs: 'vm'
        })

        .when('/create', {
            controller: 'CreateController',
            templateUrl: 'app-view/create/CreateView.html',
            controllerAs: 'vm'
        })

        .when('/search', {
            controller: 'SearchController',
            templateUrl: 'app-view/search/SearchView.html',
            controllerAs: 'vm'
        })

        .when('/pagePosts', {
            controller: 'PagePostController',
            templateUrl: 'app-view/pagePost/PagePostView.html',
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
        .when('/flagPage/:id', {
            controller: 'FlagController',
            templateUrl: 'app-view/flag/FlagView.html',
            controllerAs: 'vm'
        })

        .when('/unflag', {
            controller: 'UnflagController',
            templateUrl: 'app-view/unflag/UnflagView.html',
            controllerAs: 'vm'
        })

        .when('/unflag/:id', {
            controller: 'UnflagController',
            templateUrl: 'app-view/unflag/UnflagView.html',
            controllerAs: 'vm'
        })
        .when('/unflagPage/:id', {
            controller: 'UnflagController',
            templateUrl: 'app-view/unflag/UnflagView.html',
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
        .when('/deletePage/:id', {
            controller: 'DeleteController',
            templateUrl: 'app-view/delete/DeleteView.html',
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

        .otherwise({ redirectTo: '404.html' });

}]);



app.run(['$rootScope', '$location', '$cookieStore', '$http','$route', '$templateCache', function($rootScope, $location, $cookieStore, $http,$route,$templateCache ){

       // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

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
            var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
            var loggedIn = $rootScope.globals.currentUser;

            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }

            if($location.path().indexOf("/detail") !== -1){
                $http.get("/data.json")
                .success(function (data) {
                    $rootScope.masterList = data;
                    $route.reload();

                });
            }
        });

        $rootScope.visitedSearchPage = false;

        $rootScope.loading = false;
        $rootScope.loadingImage = false;
        $rootScope.adposts = {};
        $rootScope.search = {};
        $rootScope.search.status = "";
        $rootScope.search.state = "State";
        $rootScope.search.region = "Region";
        $rootScope.search.category = "Category";

        $rootScope.currentPost = {};

        $rootScope.pageTitle = "Healthy Fling";

        $http.get("/data.json")
        .success(function (data) {
            $rootScope.masterList = data;
        })
        .error(function (data) {

        });

       $rootScope.stateList = ['State',"Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Territories"];
       $rootScope.regionList = ['Region'];
       $rootScope.categoryList = ['Category','Men Seeking Woman','Women Seeking Men', 'Men Seeking Men', 'Woman Seeking Woman','t4m', 'm4t', 't4w', 'w4t', 't4t', 'mw4mw', 'mw4w', 'mw4m', 'w4mw', 'm4mw', 'w4ww', 'm4mm', 'mm4m', 'ww4w', 'ww4m', 'mm4w', 'm4ww', 'w4mm', 't4mw', 'mw4t'];
       $rootScope.locationList = ['Location','Location1','Location2'];


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

                        $http.post("/api/uploadimages",JSON.stringify(value), {'Content-Type': 'application/json; charset=utf-8','Authorization': undefined })
                        .success(function (data) {

                            values.push(data);
                            $rootScope.imageList.push(data);

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
