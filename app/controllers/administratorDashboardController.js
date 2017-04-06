/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var AdministratorDashboardController = (function () {
    function AdministratorDashboardController(scope, $rootScope, $interval, $timeout) {
        this.scope = scope;
        this.$rootScope = $rootScope;
        this.$interval = $interval;
        this.$timeout = $timeout;
        if ($rootScope.LoggedUser.UserGroupId !== 1) {
            if ($rootScope.LoggedUser.UserGroupId === 2) {
                window.location.href = "#/customer_admin_dashboard";
            }
            else if ($rootScope.LoggedUser.UserGroupId === 3) {
                window.location.href = "#/user_dashboard";
            }
        }
        scope.vm = this;
        // statistics
        scope.vm.dynamicStats = [
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
                title: 'Companies',
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
                title: 'Active Users',
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
                title: 'Messages',
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
    }
    return AdministratorDashboardController;
}());
AdministratorDashboardController.$inject = ["$scope", "$rootScope", "$interval", "$timeout"];
angular.module("culamaApp")
    .controller("administratorDashboardController", AdministratorDashboardController);
