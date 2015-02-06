(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .factory('EventFactory', EventFactory);

  function EventFactory($rootScope){
    return $rootScope.$new(true);
   }

})();