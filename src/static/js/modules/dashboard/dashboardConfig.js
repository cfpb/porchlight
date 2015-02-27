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
                        type : 'column'
                    },
                    navigator: { 
                        enabled: true 
                    },
                    rangeSelector: {
                         selected: 4
                     },
                },
                exporting: {
                    enabled: true
                },
                yAxis: {
                    title: {
                        text: 'Unshipped Value'
                    },
                    opposite: false
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function() {
                            var date = this.value;
                            if (!isNaN(date)) {
                                date = new Date(this.value);
                                date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                            }
                            return date;
                        }
                    }
                },
                series: [{
                    negativeColor: '#f1f2f2',
                    threshold: 0,
    
                    color: '#0072CE',
                }],
                title: {
                    text: ' '
                },
                loading: false
            }
        })

})();