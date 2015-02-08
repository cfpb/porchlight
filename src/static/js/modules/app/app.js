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
      'ui.bootstrap',
      'templates-main',
      'highcharts-ng',
      'porchlight.dashboard',
      'ngActivityIndicator'
    ]);

  angular
    .module('porchlight')
    .config(appConfig);

  function appConfig($locationProvider) {
  
    Highcharts && Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    
  };

})();