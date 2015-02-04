(function() {

  'use strict';

  angular
    .module('porchlight')
    .controller('AppController', appController);

  appController.$inject = ['$state'];

  function appController($state){
    
    initialize();

    function initialize(){
      $state.transitionTo('main.dashboard');
    }
    
  }
   
})();