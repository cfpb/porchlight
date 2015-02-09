(function() {

  'use strict';

  angular
  .module('porchlight.dashboard')
  .factory('HttpFactory', HttpFactory);

  function HttpFactory($http, API_CONFIG, type ,$activityIndicator, EventFactory){
    var repos = [];

    var service = {
      get     : get
    };

    return service

    function get(type, config) {
      if (!config && angular.isArray(type)) {
        config = type;
        type = 'get';
      }
      var deferred = $q.defer();
      $http[type].apply($http, config)
      .success(function (data) {
        deferred.resolve(data);
      })
      .error(function (reason) {
        deferred.reject(reason);
      });
    return deferred.promise;
    };
  }

})();