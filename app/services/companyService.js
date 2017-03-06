/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
    var CompanyService = (function () {
        function CompanyService($http, appConfig) {
            this.$http = $http;
            this.appConfig = appConfig;
        }
        CompanyService.prototype.getUsersByCompanyId = function (companyid) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUsers?companyid=' + companyid, {});
        };
        CompanyService.prototype.getUsers = function () {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUsers', {});
        };
        CompanyService.prototype.createUser = function (user) {
            var params = JSON.stringify(user);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateUser', params, {});
        };
        return CompanyService;
    }());
    CompanyService.$inject = ["$http", "appConfig"];
    altairApp.CompanyService = CompanyService;
    angular
        .module("altairApp")
        .service("companyService", CompanyService);
})(altairApp || (altairApp = {}));
