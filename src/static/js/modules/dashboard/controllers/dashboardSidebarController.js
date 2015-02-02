(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .controller('dashboardSidebarController', dashboardSidebarController);

  dashboardSidebarController.$inject = [];

  function dashboardSidebarController(){
    var vm = this;
    vm.toggle =  toggle;
    vm.active = true;

    function toggle(){
      vm.active = !vm.active;
    }

  }
   
})();