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
      searchDatapoints  : searchDatapoints,
      getChartData : getChartData,
      repos        : repos
    };

    return service
    
    function searchRepos(searchTerm){
      $activityIndicator.startAnimating();
      return $http.get(API_CONFIG.repositories_search+searchTerm).success(function () {
        $activityIndicator.stopAnimating();
      }).error(function () {
        //TODO.SEB.02.05.2015
        //Need to configure interceptor to handle ajax loader/errors
      })
    }

    function searchDatapoints(repoModel){
      var model =  angular.copy(repoModel);
      $activityIndicator.startAnimating();
      return $http.get(API_CONFIG.datapoints_search+model.url).success(function (data) {
        $activityIndicator.stopAnimating();
         model.datapoints = angular.extend(model.datapoints, data);
        service.setRepos(model);
      }).error(function () {
      })
    }

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
        return a[0] - b[0]
      });

      return chartObj;
    }

    function getRepos(){
      $activityIndicator.startAnimating();
      return $http.get(API_CONFIG.repositories).success(function (data) {
      $activityIndicator.stopAnimating();
      if(Array.isArray(data) && data.length>0){
          service.setRepos(data);
        }
      }).error(function () {
      })
    }

    function setRepos(data){
      service.repos = parseReposData(data);
      EventFactory.$emit('repos:change')
    }

    function parseReposData(data){
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
        if(repo.datapoints){
          repo.datapoints.forEach(function(dataPoint){
           var flattenedRepo = angular.extend(Object.create(repo), dataPoint);
           flattenedRepos.push(flattenedRepo);
          })
        }      
      });

      return flattenedRepos;
    }

  }

})();