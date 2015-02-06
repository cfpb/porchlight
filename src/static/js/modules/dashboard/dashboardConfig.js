(function() {

  'use strict';

  angular
  .module('porchlight.dashboard')
  .constant('CHART_CONFIG',{
    chart : {
      options: {
        colors: ['#0072CE'],
        chart :{ 
          spacingTop : 50,
          type: 'spline'
        }
      },
      yAxis: {
             title: {
                text: 'Unshipped Value'
            }
      },
      xAxis: {
          type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%b %e, %Y'
            },
            title: {
                text: 'Date'
            }
      },
      legend: {
                enabled: false
      },
      series: [{
        name : 'Repos',
        data: []
      }],
      title: {
        text: ' '
      },
      loading: false
    }
  })

})();
