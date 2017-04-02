/// <reference path="../views/error.html" />
angular
    .module('culamaApp')
    .controller('companyDashBoardCtrl', [
       '$rootScope',
        '$scope',
        '$interval',
        '$timeout',
        'variables',
         function ($rootScope, $scope, $interval, $timeout, sale_chart_data, user_data, variables) {

             if ($rootScope.LoggedUser.UserGroupId !== 1 && $rootScope.LoggedUser.UserGroupId !== 2) {
                 window.location.href = "#/user_dashboard";
             }
             // statistics
             $scope.dynamicStats = [
                 {
                     id: '1',
                     title: 'Total Users',
                     count: '0',
                     chart_data: [5, 3, 9, 6, 5, 9, 7],
                     chart_options: {
                         height: 28,
                         width: 48,
                         fill: ["#d84315"],
                         padding: 0.2
                     }
                 },
                 {
                     id: '2',
                     title: 'Active Users',
                     count: '0',
                     chart_data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
                     chart_options: {
                         height: 28,
                         width: 64,
                         fill: "#d1e4f6",
                         stroke: "#0288d1"
                     }
                 },
                 {
                     id: '3',
                     title: 'Messages',
                     count: '0',
                     chart_data: ['64/100'],
                     chart_options: {
                         height: 24,
                         width: 24,
                         fill: ["#8bc34a", "#eee"]
                     }
                 },
                 {
                     id: '4',
                     title: 'Flows',
                     count: '1',
                     chart_data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2, 5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
                     chart_options: {
                         height: 28,
                         width: 64,
                         fill: "#efebe9",
                         stroke: "#5d4037"
                     }
                 }
             ];

             // countUp update
             $scope.$on('onLastRepeat', function (scope, element, attrs) {
                 $scope.dynamicStats[0].count = '12456';
                 $scope.dynamicStats[1].count = '142384';
                 $scope.dynamicStats[2].count = '64';

                 // update live statistics
                 function getRandomVal(min, max) {
                     return Math.floor(Math.random() * (max - min + 1)) + min;
                 }

                 $interval(function () {
                     var random = Math.round(Math.random() * 10);
                     var live_values = $scope.dynamicStats[3].chart_data.toString().split(",");

                     live_values.shift();
                     live_values.push(random);
                     live_values.join(",");

                     var countTo = getRandomVal(20, 100);

                     $scope.dynamicStats[3].chart_data = live_values;
                     $scope.dynamicStats[3].count = ($scope.dynamicStats[3].count == countTo) ? countTo : getRandomVal(20, 120);

                 }, 2000)
             });

         }
    ]);