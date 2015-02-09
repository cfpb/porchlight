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

        

        EventFactory.$on('repos:change', function(){
          refreshChart();
          refreshTable();
        });

        RepoFactory.getRepos();
      }

      function refreshChart(){
        var chartSeries = angular.extend(vm.chartConfig.series[0], RepoFactory.getChartData()); 
         vm.chartConfig.series = [chartSeries];
      } 

       function refreshTable(){
          vm.repositories = RepoFactory.repos;
      } 

    }
   
})();

