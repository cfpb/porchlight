(function() {

  'use strict';

  angular
    .module('porchlight')
    .config(appRouterConfig);

  function appRouterConfig($stateProvider, $urlRouterProvider){
    //For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: "/"
     });
  }
   
})();