(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .config(appRouterConfig);

  appRouterConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function appRouterConfig($stateProvider, $urlRouterProvider, templatesMain){
    //For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: "/",
        views: {
            "header": {
                templateUrl: "views/headerView.tpl.html"
            },
            "main": {
                templateUrl: "views/mainView.tpl.html"
            },
            "footer": {
                templateUrl: "views/footerView.tpl.html"
            }
        }
     });

  }
   
})();