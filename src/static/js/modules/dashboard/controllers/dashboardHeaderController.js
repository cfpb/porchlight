(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .controller('dashboardHeaderController', dashboardHeaderController);

  function dashboardHeaderController($scope, $http){

    var vm = this;
    vm.selected = undefined;

    initialize();

    function initialize(){

      vm.data = [{domain: "cf.gov", project: "ask", repo: "ask", commit: "asdfadsf", commit_date: "6/1/2014", deploy_date: "", lines_added: 5, lines_deleted: 6},
          {domain: "cf.gov", project: "ask", repo: "ask", commit: "asdfadsf2", commit_date: "6/2/2014", deploy_date: "", lines_added: 2, lines_deleted: 10},
          {domain: "cf.gov", project: "ask", repo: "ask", commit: "asdfadsf3", commit_date: "6/2/2014", deploy_date: "6/5/2014", lines_added: 10, lines_deleted: 10},
          {domain: "cf.gov", project: "jobs", repo: "jobs", commit: "asdfadsf4", commit_date: "6/5/2014", deploy_date: "6/5/2014", lines_added: 5, lines_deleted: 6},
          {domain: "cf.gov", project: "oah", repo: "oah-api", commit: "asdfadsf9", commit_date: "8/10/2014", deploy_date: "", lines_added: 100, lines_deleted: 50}]
     }

    $http.get('/porchlight').success(function(data){
      console.log(data)
    })

  }

})();