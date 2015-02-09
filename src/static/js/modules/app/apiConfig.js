(function() {

  'use strict';

  var BASE_URL = '/porchlight';

  angular
  .module('porchlight')
  .constant('API_CONFIG', {
    repositories: BASE_URL + '/repositories',
    repositories_search : BASE_URL + '/repositories?search=',
    datapoints   : BASE_URL + '/datapoints',
    datapoints_search   : BASE_URL + '/datapoints?limit=20&search='
  });

})();
