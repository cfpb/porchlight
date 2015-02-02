(function() {

  'use strict';

  angular
    .module('porchlight.dashboard', []);

  angular
    .module('porchlight', [
    	'ngCookies',
  		'ngResource',
  		'ngSanitize',
      'ui.router',
      'ngSanitize',
      'templates-main',
      'highcharts-ng',
      'porchlight.dashboard',

    ]);


  angular
    .module('porchlight')
    .config(appConfig);

  appConfig.$inject = ['$locationProvider'];

  function appConfig($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
      });
  };

})();