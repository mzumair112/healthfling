app.factory('HttpService', ['$http', '$rootScope',function($http,$rootScope){
    var service = {};

        service.Login = function (data) {
            var serializeData = JSON.stringify(data);
            var url = "/api/login";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
            return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error while trying to send authentication email'));
        };

        service.AddPost = function (data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/posts";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting sales report'));
        };

        service.ReactPost = function (postId, reaction) {
            var serializeData = JSON.stringify({postId: postId, reaction: reaction});
            var url = "/api/reactPost";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };

        service.LikePage = function (pageId) {
            var serializeData = JSON.stringify({pageId: pageId});
            var url = "/api/likePage";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };
        service.DislikePage = function (pageId) {
            var serializeData = JSON.stringify({pageId: pageId});
            var url = "/api/dislikePage";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };

        service.LikePost = function (postId) {
            var serializeData = JSON.stringify({postId: postId});
            var url = "/api/likePost";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };
        service.DislikePost = function (postId) {
            var serializeData = JSON.stringify({postId: postId});
            var url = "/api/dislikePost";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };
        service.LikePostPhoto = function (photoId) {
            var serializeData = JSON.stringify({photoId: photoId});
            var url = "/api/likePostPhoto";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };
        service.DislikePostPhoto = function (photoId) {
            var serializeData = JSON.stringify({photoId: photoId});
            var url = "/api/dislikePostPhoto";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };

        service.LikePostVideo = function (postId) {
            var serializeData = JSON.stringify({postId: postId});
            var url = "/api/likePostVideo";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };
        service.DislikePostVideo = function (postId) {
            var serializeData = JSON.stringify({postId: postId});
            var url = "/api/dislikePostVideo";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };

        service.LikeComment = function (commentId, reply) {
            var serializeData = JSON.stringify({commentId: commentId, reply: reply});
            var url = "/api/likeComment";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };
        service.DislikeComment = function (commentId, reply) {
            var serializeData = JSON.stringify({commentId: commentId, reply: reply});
            var url = "/api/dislikeComment";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };

        service.AddPostWithPage = function (data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/postWithPage";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting data'));
        };


        service.SendMail = function (data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/sendMail";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting sales report'));
        };

        service.GetPosts = function () {

            var params = "";

            if($rootScope.search.country == "Country" || $rootScope.search.country == ""){
                $rootScope.search.country = "";
            }else if($rootScope.search.country == "United States"){

            }else{
                params = params + "country="+$rootScope.search.country;
            }
            if($rootScope.search.state == "State" || $rootScope.search.state == "" || $rootScope.search.state == "Provinces"){
                $rootScope.search.state = "";
            }else if($rootScope.search.country == "United States"){
                params = params + "state="+$rootScope.search.state;
            }else{
                params = params + "&state="+$rootScope.search.state;
            }
            if($rootScope.search.region == "Region" || $rootScope.search.region == ""){
                $rootScope.search.region = "";
            }else{
                params = params + "&region="+$rootScope.search.region;
            }
            if($rootScope.search.category == "Category" || $rootScope.search.category == ""){
                $rootScope.search.category = "";
            }else{
                params = params + "&category="+$rootScope.search.category;
            }
            var url = "/api/posts?"+params;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.GetPagePosts = function () {

            var params = "";

            if($rootScope.search.country == "Country" || $rootScope.search.country == ""){
                $rootScope.search.country = "";
            }else if($rootScope.search.country == "United States"){

            }else{
                params = params + "country="+$rootScope.search.country;
            }
            if($rootScope.search.state == "State" || $rootScope.search.state == "" || $rootScope.search.state == "Provinces"){
                $rootScope.search.state = "";
            }else if($rootScope.search.country == "United States"){
                params = params + "state="+$rootScope.search.state;
            }else{
                params = params + "&state="+$rootScope.search.state;
            }
            if($rootScope.search.region == "Region" || $rootScope.search.region == ""){
                $rootScope.search.region = "";
            }else{
                params = params + "&region="+$rootScope.search.region;
            }
            if($rootScope.search.category == "Category" || $rootScope.search.category == ""){
                $rootScope.search.category = "";
            }else{
                params = params + "&category="+$rootScope.search.category;
            }
            var url = "/api/pages?"+params;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.GetAllPosts = function () {

            var params = "";

            var url = "/api/posts?"+params;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.GetAllPagePosts = function () {

            var params = "";

            var url = "/api/pages?"+params;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.GetPageWithPosts = function (pageId) {

            var url = "/api/page/" + pageId;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.GetPageForCurrentUser = function () {
            var url = "/api/user/page/";
            return $http({
                        url: url,
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.GetPostByPhoto = function (photoId) {

            var url = "/api/photo/" + photoId;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.EditPage = function (id, data) {
            var serializeData = JSON.stringify(data);
            var url = "/api/page/"+id;
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting sales report'));
        };

        service.GetComments = function (id) {

            var url = "/api/comments/"+id;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.GetAPost = function (id) {
            var url = "/api/posts/"+id;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };
        service.GetAPostForEdit = function (id) {
            var url = "/api/postForEdit/"+id;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.GetAPagePost = function (pageId, postId) {
            var url = "/api/page/"+pageId+"/post/"+postId;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.EditPost = function (id,data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/editpost/"+id;
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting sales report'));
        };

        service.FlagPostReason = function (id,data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/flagpostreason/"+id;
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting sales report'));
        };

        service.ReportPageReason = function (id,data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/reportpagereason/"+id;
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting sales report'));
        };

        service.SubscribePost = function (id,data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/subscribe/"+id;
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };

        service.ResendPageLink = function (data) {
            var serializeData = JSON.stringify(data);
            var url = "/api/resendPageLink/";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };

        service.ResendPostLink = function (data) {
            var serializeData = JSON.stringify(data);
            var url = "/api/resendPostLink/";
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };

        service.SubscribePage = function (id,data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/subscribePage/"+id;
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error'));
        };

        service.DeleteAPost = function (id) {
            var url = "/api/posts/"+id;
             return $http({
                        url: url,
                        method: "DELETE",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.DeleteAComment = function (id) {
            var url = "/api/comments/"+id;
             return $http({
                        url: url,
                        method: "DELETE",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.DeleteAReply = function (id) {
            var url = "/api/deletereply/"+id;
             return $http({
                        url: url,
                        method: "DELETE",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.FlagAReply = function (id,data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/flagreply/"+id;
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting sales report'));
        };

        service.UnflagAReply = function (id) {
            var url = "/api/unflagreply/"+id;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.FlagAComment = function (id) {
            var url = "/api/flagcomment/"+id;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.FlagACommentReason = function (id,data) {

            var serializeData = JSON.stringify(data);
            var url = "/api/flagcommentreason/"+id;
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting sales report'));
        };


        service.UnflagAComment = function (id) {
            var url = "/api/unflagcomment/"+id;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };

        service.ReplyAComment = function (id, data) {


            var serializeData = JSON.stringify(data);
            var url = "/api/replycomment/"+id;
            var config = {
                headers : {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': $rootScope.token
                }
            };
             return $http.post(url, serializeData, config).then(handleSuccess, handleError('Error getting result'));
        };

        service.FlagAPost = function (id) {
            var url = "/api/flagpost/"+id;
             return $http({
                        url: url,
                        method: "GET",
                        headers: {
                                    'Content-Type': 'application/json;'
                        }
                    }).then(handleSuccess, handleError('Error getting result'));
        };


        service.GetSalesPerMan = function (sessionId) {
            var url = "http://localhost:8080/salesmandata?sessionid="+sessionId;
             return $http({
                        url: url,
                        method: "POST",
                        headers: {
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'Authorization': $rootScope.token
                        }
                    }).then(handleSuccess, handleError('Error getting sales report'));
        };
        service.GetSalesPerMonth = function (sessionId) {
            var url = "http://localhost:8080/lastyeardata?sessionid="+sessionId;
             return $http({
                        url: url,
                        method: "POST",
                        headers: {
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'Authorization': $rootScope.token
                        }
                    }).then(handleSuccess, handleError('Error getting sales report'));
        };
        service.GetTopSalesOrder = function (sessionId) {
            var url = "http://localhost:8080/topsalesorders?sessionid="+sessionId;
             return $http({
                        url: url,
                        method: "POST",
                        headers: {
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'Authorization': $rootScope.token
                        }
                    }).then(handleSuccess, handleError('Error getting sales report'));
        };
        service.GetTopSalesMan = function (sessionId) {
            var url = "http://localhost:8080/topsalesmen?sessionid="+sessionId;
             return $http({
                        url: url,
                        method: "POST",
                        headers: {
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'Authorization': $rootScope.token
                        }
                    }).then(handleSuccess, handleError('Error getting sales report'));
        };

        return service;

        // private functions

        function handleSuccess(data) {
            return data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

}]);
