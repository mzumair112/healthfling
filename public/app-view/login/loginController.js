app.controller('LoginController', ['$rootScope','$scope', '$location', 'HttpService', '$http', 'FlashService','$window', function( $rootScope,$scope,$location,HttpService,$http,FlashService,$window ){
    var vm = this;

    $scope.submit = function(){
        if (!$scope.email) {
            alert("Email is not valid!");
            return;
        }

        $rootScope.loading = true;

        $scope.closeModal();

        HttpService.Login({
            "email": $scope.email
        })
        .then(function(response){
            if (response.status == '200') {
                $rootScope.loading = false;
                FlashService.Success("We sent the link to your email");
                $scope.closeModal();
                $window.scrollTo(0, 0);
            }else{
                vm.dataLoading = false;
                $rootScope.loading = false;
                if (response.status == '403') {
                    FlashService.Error("This email has been blocked");
                } else {
                    FlashService.Error("There was an error while submitting your request. Please try again.");
                }
                $scope.closeModal();
                $window.scrollTo(0, 0);
            };
        });
    };


    $scope.closeModal = function(){
        $rootScope.modalInstance.close();
    }

}]);
