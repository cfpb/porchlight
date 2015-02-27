(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .controller('dashboardMainController', dashboardMainController);

    function dashboardMainController(CHART_CONFIG, RepoFactory, EventFactory){
      var vm = this;
      vm.chartConfig = angular.copy(CHART_CONFIG.chart);
      vm.pageChanged = pageChanged
      vm.pageSize = 100;
      vm.currentPage = 1;
      initialize();

      function initialize(){
        EventFactory.$on('repos:change', function(){
          refreshChart();
          refreshTable();
        });
        RepoFactory.getRepos();
      }

      function pageChanged(){
        refreshTable();
      }

      function refreshChart(){
        var chartSeries = angular.extend(vm.chartConfig.series[0], RepoFactory.getChartData()); 
         vm.chartConfig.series = [chartSeries];
      } 
      
      function refreshTable(){
          var pageStartIndex = (vm.currentPage -1) * vm.pageSize;
          var pageEndIndex   = pageStartIndex + vm.pageSize;
          vm.totalItems = RepoFactory.repos.length;
          vm.repositories = RepoFactory.repos.slice(pageStartIndex, pageEndIndex);
      } 

    }
   
})();

