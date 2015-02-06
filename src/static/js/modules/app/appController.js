(function() {

  'use strict';

  angular
    .module('porchlight')
    .controller('AppController', appController);


  function appController($state){
    
    initialize();

    function initialize(){
      $state.transitionTo('main.dashboard');
    }
    
  }
   
})();