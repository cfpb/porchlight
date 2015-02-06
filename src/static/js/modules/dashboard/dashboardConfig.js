(function() {

  'use strict';

  angular
  .module('porchlight.dashboard')
  .constant('CHART_CONFIG',{
    chart : {
      options: {
        colors: ['#0072CE'],
        chart :{ 
          spacingTop : 50
        }
      },
      yAxis: {
            min: 0,
             title: {
                text: 'Unshipped Value'
            }
      },
      xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
      },
      series: [{
        data: [10, 15, 12, 8, 7, 3, 3, 3, 3,3,3,200]
      }],
      title: {
        text: ' '
      },

      loading: false
    }
  })

})();
