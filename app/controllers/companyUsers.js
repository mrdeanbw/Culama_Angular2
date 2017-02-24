/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
    var CompanyUsersController = (function () {
        function CompanyUsersController(scope, $rootScope, companyService, $compile, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.companyService = companyService;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.$resource = $resource;
            this.DTOptionsBuilder = DTOptionsBuilder;
            this.DTColumnDefBuilder = DTColumnDefBuilder;
            this.cservice = companyService;
            this.scope.cardview = true;
            this.scope.CompnayName = $rootScope.LoggedUser.CustomerName;
            this.getCompanyUsers(this.$rootScope.LoggedUser.CustomerId.toString());
            scope.userroles = ['Compnay Admin', 'Users'];
            scope.$on('onLastRepeat', function (scope1, element, attrs) {
                scope.$apply(function () {
                    UIkit.grid($('#contact_list'), {
                        controls: '#contact_list_filter',
                        gutter: 20
                    });
                });
            });
            scope.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDisplayLength(10)
                .withOption('initComplete', function () {
                $timeout(function () {
                    $compile($('.dt-uikit .md-input'))(scope);
                });
            });
            scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5)
            ];
            scope.changeView = function (view) {
                if (view != "card") {
                    scope.cardview = false;
                }
                else {
                    scope.cardview = true;
                }
            };
        }
        CompanyUsersController.prototype.getCompanyUsers = function (companyid) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getUsersByCompanyId(companyid).then(function (result) {
                _this.scope.contact_list = result.data;
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        return CompanyUsersController;
    }());
    CompanyUsersController.$inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder"];
    angular.module("altairApp")
        .controller("companyUsersController", CompanyUsersController);
})(altairApp || (altairApp = {}));
