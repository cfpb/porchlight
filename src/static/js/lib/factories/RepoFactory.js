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
      searchRepos  : searchRepos,
      getChartData : getChartData,
      repos        : repos
    };

    return service

    //TODO.SEB.02.05.2015
    //Need to handle this in a filter
    function getChartData(){
      var chartObj = {};

      chartObj.data = service.repos.map(function(repo) {
        var date = new Date(repo.undeployed_datetime);
        var utcDate = date.getTime();
        return [utcDate, repo.value]
      });

      chartObj.data.sort(function(a,b){
        if(a.undeployed_datetime<b.undeployed_datetime){
          return - 1
        }else{
            return 1
        }
      });
      
      console.debug(chartObj)
      return [chartObj];
    }

    function searchRepos(searchTerm){
      $activityIndicator.startAnimating();
      return $http.get(API_CONFIG.repositories_search + searchTerm).success(function () {
      $activityIndicator.stopAnimating();
      }).error(function () {
        //TODO.SEB.02.05.2015
        //Need a mechanism for handling errors
      })
    }

    function getRepos(){
      $activityIndicator.startAnimating();
      return $http.get(API_CONFIG.repositories).success(function (data) {
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
      var domain      = '';
      var domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/igm;

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
      
      });

      return parsedData
    }

  }

})();