(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .controller('dashboardMainController', dashboardMainController);

    function dashboardMainController(CHART_CONFIG, RepoFactory, EventFactory){
      var vm = this;
      vm.chartConfig = angular.copy(CHART_CONFIG.chart);

      initialize();

      function initialize(){
        RepoFactory.getRepos().then(function(){
          vm.repositories = RepoFactory.repos;
        })

        EventFactory.$on('repos:change', function(){
          vm.repositories = RepoFactory.repos;
          console.debug(RepoFactory.getChartData());
          vm.chartConfig.series.data = RepoFactory.getChartData();
        })
      
      }

      function populateChart(){

      }
    }
   
})();