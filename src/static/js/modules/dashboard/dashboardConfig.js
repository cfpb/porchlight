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

})();