(function() {

  'use strict';

  angular
  .module('porchlight.dashboard')
  .constant('dashboardConfig',{
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
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            min: 0,
            title: false
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
