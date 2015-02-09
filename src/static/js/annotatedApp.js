(function() {

  'use strict';

  angular
    .module('porchlight.dashboard', []);

  angular
    .module('porchlight', [
    	'ngCookies',
  		'ngResource',
  		'ngSanitize',
      'ui.router',
      'ui.bootstrap',
      'templates-main',
      'highcharts-ng',
      'ngActivityIndicator',
      'porchlight.dashboard'
    ]);

  angular
    .module('porchlight')
    .config(appConfig);

  function appConfig($locationProvider) {
  
    window.Highcharts && Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

  }
  appConfig.$inject = ["$locationProvider"];;

})();;
(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .factory('EventFactory', EventFactory);

  function EventFactory($rootScope){
    return $rootScope.$new(true);
   }
   EventFactory.$inject = ["$rootScope"];

})();;
(function() {

  'use strict';

  angular
  .module('porchlight.dashboard')
  .factory('HttpFactory', HttpFactory);

  function HttpFactory($http, API_CONFIG, type ,$activityIndicator, EventFactory){
    var repos = [];

    var service = {
      get     : get
    };

    return service

    function get(type, config) {
      if (!config && angular.isArray(type)) {
        config = type;
        type = 'get';
      }
      var deferred = $q.defer();
      $http[type].apply($http, config)
      .success(function (data) {
        deferred.resolve(data);
      })
      .error(function (reason) {
        deferred.reject(reason);
      });
    return deferred.promise;
    };
  }
  HttpFactory.$inject = ["$http", "API_CONFIG", "type", "$activityIndicator", "EventFactory"];

})();;
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
        var utcA = a[0];
        var utcB = b[0];
        if(utcA<utcB){
          return -1
        }else if(utcB<utcA){
            return 1
        }else{
            return 0
        } 
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
          repo.datapoints.results.forEach(function(dataPoint){
           var flattenedRepo = angular.extend(angular.copy(repo), dataPoint)
           flattenedRepos.push(flattenedRepo);
          })
          parsedData = flattenedRepos;
        }
      
      });

      return parsedData
    }

  }
  RepoFactory.$inject = ["$http", "API_CONFIG", "$filter", "$activityIndicator", "EventFactory"];

})();;
angular.module('templates-main', ['views/dashboardFooterView.tpl.html', 'views/dashboardHeaderView.tpl.html', 'views/dashboardMainView.tpl.html']);

angular.module("views/dashboardFooterView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/dashboardFooterView.tpl.html",
    "<!-- Footer stuff -->");
}]);

angular.module("views/dashboardHeaderView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/dashboardHeaderView.tpl.html",
    "<div class=\"content_wrapper\">\n" +
    "	<div class='title-ctr u-w25pct'>\n" +
    "		<h1 class=\"site-title title-link\">Porchlight</h1>\n" +
    "	</div>\n" +
    "	<div class='search-ctr u-w50pct'>\n" +
    "		<div class=\"btn-inside-input\">\n" +
    "			<input type=\"text\" placeholder='Start by entering a repo name...' ng-model=\"dashboardHeaderCtrl.selected\" typeahead-wait-ms=\"2\"typeahead=\"data.name for data in dashboardHeaderCtrl.searchRepos($viewValue)\" typeahead-on-select=\"dashboardHeaderCtrl.selectRepo($item)\"   class=\"input__super\" />\n" +
    "			<button ng-click=\"dashboardHeaderCtrl.clear()\" ng-show=\"dashboardHeaderCtrl.selected\" class=\"btn btn__super clear_btn btn_link btn__secondary\">\n" +
    "				<span class=\"u-visually-hidden\">Clear</span>\n" +
    "				<span class=\"cf-icon cf-icon-delete\"></span>\n" +
    "			</button>\n" +
    "			<button class=\"btn btn__super btn_link btn__secondary\">\n" +
    "				<span class=\"u-visually-hidden\">Search</span>\n" +
    "				<span class=\"cf-icon cf-icon-search\"></span>\n" +
    "			</button>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class='logo-ctr u-w20pct'>\n" +
    "		<div></div>\n" +
    "		<img src=\"./static/images/cfpb_logo.png\" class=\"logo\" alt=\"Consumer Financial Protection Bureau\" width=\"151\">\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("views/dashboardMainView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/dashboardMainView.tpl.html",
    "<div ui-view class='wrapper'>\n" +
    "<section id=\"dashboard-main\">\n" +
    "	 <highchart id=\"chart1\" config=\"dashboardMainCtrl.chartConfig\"></highchart>\n" +
    "	 <table id=\"data-table\">\n" +
    "			<thead>\n" +
    "				<tr class=\"header\">\n" +
    "					<th>Domain</th>\n" +
    "					<th>Project</th>\n" +
    "					<th>Repo</th>\n" +
    "	       	<th>Commit</th>\n" +
    "	       	<th>Commit Date</th>\n" +
    "	       	<th>Deploy Date</th>\n" +
    "					<th>Cumulative Unshipped</th>\n" +
    "				</tr>\n" +
    "			</thead>\n" +
    "			<tbody>\n" +
    "				<tr ng-repeat=\"repo in dashboardMainCtrl.repositories\">\n" +
    "	    		<td>{{repo.domain}}</td>\n" +
    "	    		<td>{{repo.project}}</td>\n" +
    "	    		<td><a ng-href=\"{{repo.url}}\" target=\"_new\">{{repo.name}}</a></td>\n" +
    "	    		<td class=\"commit_hash\">{{repo.undeployed_identifier}}</td>\n" +
    "	    		<td>{{repo.undeployed_datetime  | date:'MM/dd/yyyy'}}</td>\n" +
    "	    		<td>{{repo.deployed_datetime | date:'MM/dd/yyyy'}}</td>\n" +
    "	    		<td>{{repo.value}}</td>\n" +
    "	 		  </tr>\n" +
    "			</tbody>\n" +
    "	</table>\n" +
    "</section>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
;
(function() {

  'use strict';

  var BASE_URL = '/porchlight';

  angular
  .module('porchlight')
  .constant('API_CONFIG', {
    repositories: BASE_URL + '/repositories',
    repositories_search : BASE_URL + '/repositories?search=',
    datapoints   : BASE_URL + '/datapoints',
    datapoints_search   : BASE_URL + '/datapoints?limit=20&search='
  });

})();
;
(function() {

  'use strict';

  angular
    .module('porchlight')
    .controller('AppController', appController);


  function appController($state){
    
    initialize();

    function initialize(){
      $state.transitionTo('main.dashboard');
    }
    
  }
  appController.$inject = ["$state"];
   
})();;
(function() {

  'use strict';

  angular
    .module('porchlight')
    .config(appRouterConfig);

  function appRouterConfig($stateProvider, $urlRouterProvider){
    //For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: "/"
     });
  }
  appRouterConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
   
})();;
(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .controller('dashboardController', dashboardController);

  function dashboardController(){
    var vm = this;
  }
   
})();;
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
  dashboardHeaderController.$inject = ["$scope", "$http", "RepoFactory"];


})();;
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
    dashboardMainController.$inject = ["CHART_CONFIG", "RepoFactory", "EventFactory"];
   
})();

;
(function() {

    'use strict';

    angular
        .module('porchlight.dashboard')
        .constant('CHART_CONFIG', {
            chart: {
                useHighStocks: true,
                options: {
                    colors: ['#0072CE'],
                    style: {
                      fontFamily: '"Avenir Next", Arial, Helvetica, sans-serif',
                      fontSize: "13px"
                    },
                    chart: {
                        spacingTop: 25,
                        spacingBottom: 25,
                        type : 'column'
                    },
                    scrollbar: {
                          enabled: false
                    }
                },

                yAxis: {
                    title: {
                        text: 'Unshipped Value'
                    },
                    opposite: false
                },
                rangeSelector : {
                  selected : 1,
               },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function() {
                            var date = this.value;
                            if (!isNaN(date)) {
                                date = new Date(this.value);
                                date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + '<br/>' + date.toLocaleTimeString();

                            }
                            return date; // clean, unformatted number for year
                        }
                    }
                },
                series: [{
                    negativeColor: '#f1f2f2',
                    threshold: 0,
                    data: [
                        [-100, 1],
                        [1, -100]
                    ],
                    color: '#0072CE',
                }],
                title: {
                    text: ' '
                },
                loading: false
            }
        })

})();;
(function() {

  'use strict';

  angular
    .module('porchlight.dashboard')
    .config(dashboardRouterConfig);

  function dashboardRouterConfig($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('main.dashboard', {
        controller : 'dashboardController',
        controllerAs : 'dashboardCtrl',
        views: {
            "header@": {
                templateUrl: "views/dashboardHeaderView.tpl.html",
                controller : 'dashboardHeaderController',
                controllerAs : 'dashboardHeaderCtrl'
            },
            "main@": {
                templateUrl: "views/dashboardMainView.tpl.html",
                controller : 'dashboardMainController',
                controllerAs : 'dashboardMainCtrl'
            },
            "footer@": {
                templateUrl: "views/dashboardFooterView.tpl.html"
            }
        }
    });
  }
  dashboardRouterConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
   
})();;
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.0 - 2014-11-16
 * License: MIT
 * Modified by https://github.com/sebworks - 2015-02-05
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls","ui.bootstrap.typeahead","ui.bootstrap.position","ui.bootstrap.bindHtml"]);
angular.module("ui.bootstrap.tpls", ["template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]);
angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position', 'ui.bootstrap.bindHtml'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('typeaheadParser', ['$parse', function ($parse) {

  //                      00000111000000000000022200000000000000003333333333333330000000000044000
  var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;

  return {
    parse:function (input) {

      var match = input.match(TYPEAHEAD_REGEXP);
      if (!match) {
        throw new Error(
          'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
            ' but got "' + input + '".');
      }

      return {
        itemName:match[3],
        source:$parse(match[4]),
        viewMapper:$parse(match[2] || match[1]),
        modelMapper:$parse(match[1])
      };
    }
  };
}])

  .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
    function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

  var HOT_KEYS = [9, 13, 27, 38, 40];

  return {
    require:'ngModel',
    link:function (originalScope, element, attrs, modelCtrl) {

      //SUPPORTED ATTRIBUTES (OPTIONS)

      //minimal no of characters that needs to be entered before typeahead kicks-in
      var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

      //minimal wait time after last character typed before typehead kicks-in
      var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

      //should it restrict model values to the ones selected from the popup only?
      var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

      //binding to a variable that indicates if matches are being retrieved asynchronously
      var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

      //a callback executed when a match is selected
      var onSelectCallback = $parse(attrs.typeaheadOnSelect);

      var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

      var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

      var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

      //INTERNAL VARIABLES

      //model setter executed upon match selection
      var $setModelValue = $parse(attrs.ngModel).assign;

      //expressions used by typeahead
      var parserResult = typeaheadParser.parse(attrs.typeahead);

      var hasFocus;

      //create a child scope for the typeahead directive so we are not polluting original scope
      //with typeahead-specific data (matches, query etc.)
      var scope = originalScope.$new();
      originalScope.$on('$destroy', function(){
        scope.$destroy();
      });

      // WAI-ARIA
      var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
      element.attr({
        'aria-autocomplete': 'list',
        'aria-expanded': false,
        'aria-owns': popupId
      });

      //pop-up element used to display matches
      var popUpEl = angular.element('<div typeahead-popup></div>');
      popUpEl.attr({
        id: popupId,
        matches: 'matches',
        active: 'activeIdx',
        select: 'select(activeIdx)',
        query: 'query',
        position: 'position'
      });
      //custom item template
      if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
        popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
      }

      var resetMatches = function() {
        scope.matches = [];
        scope.activeIdx = -1;
        element.attr('aria-expanded', false);
      };

      var getMatchId = function(index) {
        return popupId + '-option-' + index;
      };

      // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
      // This attribute is added or removed automatically when the `activeIdx` changes.
      scope.$watch('activeIdx', function(index) {
        if (index < 0) {
          element.removeAttr('aria-activedescendant');
        } else {
          element.attr('aria-activedescendant', getMatchId(index));
        }
      });

      var getMatchesAsync = function(inputValue) {

        var locals = {$viewValue: inputValue};
        isLoadingSetter(originalScope, true);
        $q.when(parserResult.source(originalScope, locals)).then(function(matches) {

          //it might happen that several async queries were in progress if a user were typing fast
          //but we are interested only in responses that correspond to the current view value
          var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
          if (onCurrentRequest && hasFocus) {
            if (matches.length > 0) {

              scope.activeIdx = focusFirst ? 0 : -1;
              scope.matches.length = 0;

              //transform labels
              for(var i=0; i<matches.length; i++) {
                locals[parserResult.itemName] = matches[i];
                scope.matches.push({
                  id: getMatchId(i),
                  label: parserResult.viewMapper(scope, locals),
                  model: matches[i]
                });
              }

              scope.query = inputValue;
              //position pop-up with matches - we need to re-calculate its position each time we are opening a window
              //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
              //due to other elements being rendered
              scope.position = appendToBody ? $position.offset(element) : $position.position(element);
              scope.position.top = scope.position.top + element.prop('offsetHeight');

              element.attr('aria-expanded', true);
            } else {
              resetMatches();
            }
          }
          if (onCurrentRequest) {
            isLoadingSetter(originalScope, false);
          }
        }, function(){
          resetMatches();
          isLoadingSetter(originalScope, false);
        });
      };

      resetMatches();

      //we need to propagate user's query so we can higlight matches
      scope.query = undefined;

      //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later 
      var timeoutPromise;

      var scheduleSearchWithTimeout = function(inputValue) {
        timeoutPromise = $timeout(function () {
          getMatchesAsync(inputValue);
        }, waitTime);
      };

      var cancelPreviousTimeout = function() {
        if (timeoutPromise) {
          $timeout.cancel(timeoutPromise);
        }
      };

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
      modelCtrl.$parsers.unshift(function (inputValue) {

        hasFocus = true;

        if (inputValue && inputValue.length >= minSearch) {
          if (waitTime > 0) {
            cancelPreviousTimeout();
            scheduleSearchWithTimeout(inputValue);
          } else {
            getMatchesAsync(inputValue);
          }
        } else {
          isLoadingSetter(originalScope, false);
          cancelPreviousTimeout();
          resetMatches();
        }

        if (isEditable) {
          return inputValue;
        } else {
          if (!inputValue) {
            // Reset in case user had typed something previously.
            modelCtrl.$setValidity('editable', true);
            return inputValue;
          } else {
            modelCtrl.$setValidity('editable', false);
            return undefined;
          }
        }
      });

      modelCtrl.$formatters.push(function (modelValue) {

        var candidateViewValue, emptyViewValue;
        var locals = {};

        if (inputFormatter) {

          locals.$model = modelValue;
          return inputFormatter(originalScope, locals);

        } else {

          //it might happen that we don't have enough info to properly render input value
          //we need to check for this situation and simply return model value if we can't apply custom formatting
          locals[parserResult.itemName] = modelValue;
          candidateViewValue = parserResult.viewMapper(originalScope, locals);
          locals[parserResult.itemName] = undefined;
          emptyViewValue = parserResult.viewMapper(originalScope, locals);

          return candidateViewValue!== emptyViewValue ? candidateViewValue : modelValue;
        }
      });

      scope.select = function (activeIdx) {
        //called from within the $digest() cycle
        var locals = {};
        var model, item;

        locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
        model = parserResult.modelMapper(originalScope, locals);
        $setModelValue(originalScope, model);
        modelCtrl.$setValidity('editable', true);

        onSelectCallback(originalScope, {
          $item: item,
          $model: model,
          $label: parserResult.viewMapper(originalScope, locals)
        });

        resetMatches();

        //return focus to the input element if a match was selected via a mouse click event
        // use timeout to avoid $rootScope:inprog error
        $timeout(function() { element[0].focus(); }, 0, false);
      };

      //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
      element.bind('keydown', function (evt) {

        //typeahead is open and an "interesting" key was pressed
        if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
          return;
        }

        // if there's nothing selected (i.e. focusFirst) and enter is hit, don't do anything
        if (scope.activeIdx == -1 && (evt.which === 13 || evt.which === 9)) {
          return;
        }

        evt.preventDefault();

        if (evt.which === 40) {
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();

        } else if (evt.which === 38) {
          scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();

        } else if (evt.which === 13 || evt.which === 9) {
          scope.$apply(function () {
            scope.select(scope.activeIdx);
          });

        } else if (evt.which === 27) {
          evt.stopPropagation();

          resetMatches();
          scope.$digest();
        }
      });

      element.bind('blur', function (evt) {
        hasFocus = false;
      });

      // Keep reference to click handler to unbind it.
      var dismissClickHandler = function (evt) {
        if (element[0] !== evt.target) {
          resetMatches();
          scope.$digest();
        }
      };

      $document.bind('click', dismissClickHandler);

      originalScope.$on('$destroy', function(){
        $document.unbind('click', dismissClickHandler);
        if (appendToBody) {
          $popup.remove();
        }
      });

      var $popup = $compile(popUpEl)(scope);
      if (appendToBody) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }
    }
  };

}])

  .directive('typeaheadPopup', function () {
    return {
      restrict:'EA',
      scope:{
        matches:'=',
        query:'=',
        active:'=',
        position:'=',
        select:'&'
      },
      replace:true,
      templateUrl:'template/typeahead/typeahead-popup.html',
      link:function (scope, element, attrs) {

        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function () {
          return scope.matches.length > 0;
        };

        scope.isActive = function (matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function (matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function (activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

  .directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
    return {
      restrict:'EA',
      scope:{
        index:'=',
        match:'=',
        query:'='
      },
      link:function (scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        $http.get(tplUrl, {cache: $templateCache}).success(function(tplContent){
           element.replaceWith($compile(tplContent.trim())(scope));
        });
      }
    };
  }])

  .filter('typeaheadHighlight', function() {

    function escapeRegexp(queryToEscape) {
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function(matchItem, query) {
      return query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
    };
  });

angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        var shiftWidth = {
          center: function () {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function () {
            return hostElPos.left;
          },
          right: function () {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function () {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function () {
            return hostElPos.top;
          },
          bottom: function () {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  }]);

angular.module('ui.bootstrap.bindHtml', [])

  .directive('bindHtmlUnsafe', function () {
    return function (scope, element, attr) {
      element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
      scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
        element.html(value || '');
      });
    };
  });
angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-match.html",
    "<a tabindex=\"-1\" bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></a>");
}]);

angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-popup.html",
    "<ul class=\"dropdown-menu\" ng-show=\"isOpen()\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
    "    <li ng-click=\"selectMatch($index)\"  ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" role=\"option\" id=\"{{match.id}}\">\n" +
    "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
