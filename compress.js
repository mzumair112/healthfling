const minify = require('@node-minify/core');
// const gcc = require('@node-minify/google-closure-compiler');
const uglifyjs = require('@node-minify/uglify-js');
const cssnano = require('@node-minify/cssnano');

// Using UglifyJS

minify({
  compressor: uglifyjs,
  input: ['./public/app-lib/jquery-1.11.1.min.js', './public/app-lib/jquery-2.1.4.min.js', './public/app-lib/bootstrap.min.js', './public/app-lib/jquery-ui.min.js', './public/app-lib/custom.js', './public/app-lib/angular.min.js', './public/app-lib/ui-bootstrap-tpls.min.js','./public/app-lib/angular-route.min.js', './public/app-lib/angular-cookies.min.js', './public/app-lib/moment.min.js', './public/app-lib/angular-moment.min.js', './public/app-lib/angular-recaptcha.min.js', './public/app-lib/angular-socialshare.min.js', './public/app-lib/me-lazyload.min.js'],
  output: './public/dist/app_lib.js',
  callback: function(err, min) {
  	console.log("completed compressing library");
  }
});

minify({
  compressor: uglifyjs,
  input: './public/app-services/*.js',
  output: './public/dist/app_services.js',
  callback: function(err, min) {
  	console.log("completed compressing services");
  }
});

minify({
  compressor: uglifyjs,
  input: ['./public/app-view/home/homeController.js', './public/app-view/page/media/video/mediaVideoController.js', './public/app-view/page/media/photo/mediaPhotoController.js', './public/app-view/report/reportController.js', './public/app-view/subscribe/subscribeController.js', './public/app-view/login/loginController.js', './public/app-view/post/postController.js', './public/app-view/search/searchController.js', './public/app-view/pages/pagesController.js', './public/app-view/page/pageController.js', './public/app-view/page/media/mediaController.js', './public/app-view/contact/contactController.js', './public/app-view/response/responseController.js', './public/app-view/delete/deleteController.js', './public/app-view/expired/expiredController.js', './public/app-view/error/errorController.js', './public/app-view/reply/replyController.js', './public/app-view/comment/commentController.js', './public/app-view/edit/editController.js', './public/app-view/flag/flagController.js', './public/app-view/options/optionsController.js', './public/app-view/detail/detailController.js', './public/app-view/pagePostDetail/detailController.js'],
  output: './public/dist/app_controllers.js',
  callback: function(err, min) {
  	console.log("completed compressing controllers");
  }
});

minify({
  compressor: cssnano,
  input: ['./public/app-content/css/jquery-ui.min.css', './public/app-content/css/bootstrap.min.css', './public/app-content/css/font-awesome.min.css'],
  output: './public/dist/app_lib.css',
  callback: function(err, min) {
    console.log("completed compressing css libraries");
  }
});

minify({
  compressor: cssnano,
  input: ['./public/app-content/css/custom.css', './public/app-content/css/responsive.css' ],
  output: './public/dist/app.css',
  callback: function(err, min) {
    console.log("completed compressing custom css");
  }
});
