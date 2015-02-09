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
        var data = [{"id":30,"created":"2016-02-05T13:37:49Z","undeployed_identifier":"398aed83f46495fff9adc735f5835320cdbda124","undeployed_datetime":"2016-02-05T13:37:49Z","deployed_identifier":"ccfafd77ca0741848feda09dbf54fdef234d9045","deployed_datetime":null,"value":710},{"id":60,"created":"2015-02-04T22:01:44Z","undeployed_identifier":"5f1a5e1a8c11f0894f428a8a6f60c8440b818af3","undeployed_datetime":"2015-02-04T22:01:44Z","deployed_identifier":"","deployed_datetime":null,"value":8362},{"id":59,"created":"2015-02-04T21:09:11Z","undeployed_identifier":"609231cab75c36b1eb6736e2a95bb11518661cc9","undeployed_datetime":"2015-02-04T21:09:11Z","deployed_identifier":"","deployed_datetime":null,"value":7230},{"id":58,"created":"2015-02-04T19:51:04Z","undeployed_identifier":"de685983602774ce68a3204f4ac1ddac6f099226","undeployed_datetime":"2015-02-04T19:51:04Z","deployed_identifier":"","deployed_datetime":null,"value":7230},{"id":57,"created":"2015-02-04T17:05:07Z","undeployed_identifier":"bc633bacf7482eb3595ee84cc8e779b71b2a2aca","undeployed_datetime":"2015-02-04T17:05:07Z","deployed_identifier":"","deployed_datetime":null,"value":6328},{"id":56,"created":"2015-02-04T15:44:42Z","undeployed_identifier":"cc554a49e754741708248e5ea7e79607018c42ea","undeployed_datetime":"2015-02-04T15:44:42Z","deployed_identifier":"","deployed_datetime":null,"value":4516},{"id":55,"created":"2015-02-04T15:30:28Z","undeployed_identifier":"5f72743a3d36104d4ae04d8a2e6e970eef0f759e","undeployed_datetime":"2015-02-04T15:30:28Z","deployed_identifier":"","deployed_datetime":null,"value":4514},{"id":54,"created":"2015-02-04T14:50:50Z","undeployed_identifier":"f99da3543c3f3ce9c434d2a2a2b0853ab9644782","undeployed_datetime":"2015-02-04T14:50:50Z","deployed_identifier":"","deployed_datetime":null,"value":4286},{"id":53,"created":"2015-02-04T14:48:24Z","undeployed_identifier":"88dbaba98ee03c8afb21de85542a2e07630c2193","undeployed_datetime":"2015-02-04T14:48:24Z","deployed_identifier":"","deployed_datetime":null,"value":4268},{"id":52,"created":"2015-02-04T14:47:54Z","undeployed_identifier":"7812cf663ef48ae4ca35754d4378ef58f7d1ff34","undeployed_datetime":"2015-02-04T14:47:54Z","deployed_identifier":"","deployed_datetime":null,"value":4268}]

        repoModel.dataPointsValues =  data;
        RepoFactory.setRepos(repoModel);
        //RepoFactory.setRepos(data);
      }).error(function () {
         //TODO.SEB.02.05.2015
         //Need a mechanism for handling errors
       })
    }
  }

})();