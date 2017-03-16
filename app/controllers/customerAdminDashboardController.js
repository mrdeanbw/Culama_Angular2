/// <reference path="../views/error.html" />
angular
    .module('altairApp')
    .controller('customerAdminDashBoardCtrl', [
       '$rootScope',
        '$scope',
        '$interval',
        '$timeout',
        'variables',
         function ($rootScope, $scope, $interval, $timeout, sale_chart_data, user_data, variables) {

             if ($rootScope.LoggedUser.UserGroupId != undefined) {
                 if ($rootScope.LoggedUser.UserGroupId !== 1 && $rootScope.LoggedUser.UserGroupId !== 2) {
                     window.location.href = "#/user_dashboard";
                 }
             }
             
          
         }
    ]);