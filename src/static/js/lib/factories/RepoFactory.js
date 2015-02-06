(function() {

  'use strict';

  angular
  .module('porchlight.dashboard')
  .factory('RepoFactory', RepoFactory);

  function RepoFactory($http, API_CONFIG, $filter,$activityIndicator, EventFactory){
    var repos = [];
    var service = {
      getRepos     : getRepos,
      setRepos     : setRepos,
      getChartData : getChartData,
      repos        : repos
    };

    initialize();

    return service

    function initialize(){

    }
    //TODO.SEB.02.05.2015
    //Need to handle this in a filter
    function getChartData(){
      var chartData = [];
       chartData=service.repos.map(function(repo) {
        return [repo.undeployed_datetime, repo.value]
      });
    }

    function getRepos(searchTerm){
      var api_url = searchTerm?(API_CONFIG.repositories_search + searchTerm): API_CONFIG.repositories;
      $activityIndicator.startAnimating();
      return $http.get(api_url).success(function (data) {
        $activityIndicator.stopAnimating();
        if(Array.isArray(data) && data.length>0){
          service.setRepos(data);

        }
      }).error(function () {
         //TODO.SEB.02.05.2015
         //Need a mechanism for handling errors
       })
    }

    function setRepos(data){
      service.repos = parseData(data);
      EventFactory.$emit('repos:change')
    }

    function parseData(data){
      var parsedData = angular.copy(data);
      var flattenedRepos = [];
      if(Array.isArray(parsedData) == false){
        parsedData = [parsedData];
      }
      //var cumulative = 0;
      //var currDomain = '';
      //var dateFormat = 'm/dd/yy';
      var domain     = '';
      var domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/igm;
      //var dateFilter = $filter('date');

      parsedData.forEach(function(repo) {
        if(domainRegex.lastIndex = 0, domain = domainRegex.exec(repo.url)){
          repo.domain = domain[1];
        }

        //TODO.SEB.02.05.2015
        //Need to handle this in a filter
        if(repo.dataPointsValues){
          repo.dataPointsValues.forEach(function(dataPoint){
           var flattenedRepo = angular.extend(angular.copy(repo), dataPoint)
           flattenedRepos.push(flattenedRepo);
          })
          parsedData = flattenedRepos;
        }

        //if (repo.domain != currDomain) {
        //  cumulative = 0;   
        //}

       //currDomain = repo.domain;
       //repo.commit_date = dateFilter(repo.commit_date, dateFormat);
       //repo.deploy_date = dateFilter(repo.deploy_date, dateFormat);
       //cumulative += (repo.lines_added + repo.lines_deleted);

       //if(repo.deploy_date != null ) {
       //   cumulative = 0;
       //} 

        //repo.cumulative_lines = cumulative;
      });

      return parsedData
    }

  }

})();