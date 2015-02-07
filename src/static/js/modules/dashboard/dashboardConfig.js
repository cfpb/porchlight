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
          type: 'area'
        }
      },
      yAxis: {
       title: {
        text: 'Unshipped Value'
      }
    },

            xAxis: {
              type: 'datetime',
              labels: {
                formatter: function () {
       
                 var date = this.value;                 
                 if (!isNaN(date)){
                    date = new Date(this.value);

                    date = (date.getMonth() + 1) +  '/' + date.getDate() + '/' +  date.getFullYear() + '<br/>' + date.toLocaleTimeString();
                  
                 }
                    return date; // clean, unformatted number for year
                  }
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
