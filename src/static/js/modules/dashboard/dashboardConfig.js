(function() {

  'use strict';

  angular
  .module('porchlight.dashboard')
  .constant('dashboardConfig',{
    chart : {
      options: {
        chart: {
          type: 'bar'
        }
      },
      series: [{
        data: [10, 15, 12, 8, 7]
      }],
      title: {
        text: 'Hello'
      },

      loading: false
    }
  })

})();