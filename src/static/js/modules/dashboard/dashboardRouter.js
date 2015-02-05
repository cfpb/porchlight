(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .config(dashboardRouterConfig);

  function dashboardRouterConfig($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('main.dashboard', {
        controller : 'dashboardController',
        controllerAs : 'dashboardCtrl',
        views: {
            "header@": {
                templateUrl: "views/dashboardHeaderView.tpl.html",
                controller : 'dashboardHeaderController',
                controllerAs : 'dashboardHeaderCtrl'
            },
            "main@": {
                templateUrl: "views/dashboardMainView.tpl.html",
                controller : 'dashboardMainController',
                controllerAs : 'dashboardMainController'
            },
            "footer@": {
                templateUrl: "views/dashboardFooterView.tpl.html"
            }
        }
    });
  }
   
})();