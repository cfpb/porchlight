(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .controller('dashboardMainController', dashboardMainController);

  dashboardMainController.$inject = ['dashboardConfig'];

  function dashboardMainController(dashboardConfig){
    var vm = this;
    var chartConfig = angular.copy(dashboardConfig.chart);   
    vm.chartConfig = chartConfig;
    
  }
   
})();