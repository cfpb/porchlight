(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .config(dashboardRouterConfig);

  dashboardRouterConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function dashboardRouterConfig($stateProvider, $urlRouterProvider, templatesMain){
    $stateProvider
      .state('main.dashboard', {
        templateUrl: "views/dashboardView.tpl.html",
        controller : 'dashboardController',
        controllerAs : 'dashboardCtrl'

    });
  }
   
})();