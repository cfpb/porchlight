(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .controller('dashboardHeaderController', dashboardHeaderController);

  function dashboardHeaderController($scope, $http, RepoFactory){
    var vm = this;
    vm.selected = undefined;
    vm.searchRepos = searchRepos;
    vm.selectRepo = selectRepo;
    vm.clear = clear; 

    initialize();

    function initialize(){}

    function clear(){
      vm.selected = undefined;
      getRepos();
    }

    function getRepos(){
      return RepoFactory.getRepos().then(function(response){
         return response.data;
      });
    }

    function searchRepos(searchTerm){
      return RepoFactory.searchRepos(searchTerm).then(function(response){
         return response.data;
      });
    }

    function selectRepo(repoModel){
      return RepoFactory.searchDatapoints(repoModel).then(function(response){
         return response.data;
      });
    }
  
  }


})();