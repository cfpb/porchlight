(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .controller('dashboardHeaderController', dashboardHeaderController);

  function dashboardHeaderController($scope, $http, RepoFactory){
    var vm = this;
    vm.selected = undefined;
    vm.getRepos = getRepos;
    vm.selectRepo = selectRepo;
    vm.clear = clear; 

    initialize();

    function initialize(){}

    function clear(){
      vm.selected = undefined;
    }

    function getRepos(searchTerm){
      return RepoFactory.searchRepos(searchTerm).then(function(response){
         return response.data;
      })
    }

    function selectRepo(repoModel){
      //TODO.SEB.02.05.2015
      //Need to move this to a factory
      $http.get('/porchlight/datapoints?limit=20search='+repoModel.url).success(function (data) {
        repoModel.dataPointsValues = data.results;
        RepoFactory.setRepos(repoModel);
        //RepoFactory.setRepos(data);
      }).error(function () {
         //TODO.SEB.02.05.2015
         //Need a mechanism for handling errors
       })
    }
  }

})();