/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var CompanyWallService = (function () {
        function CompanyWallService($http, appConfig) {
            this.$http = $http;
            this.appConfig = appConfig;
        }
        CompanyWallService.prototype.getCompanyWalls = function () {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetCompanyWalls', {});
        };
        CompanyWallService.prototype.createCompanyWall = function (wallInfo) {
            var params = JSON.stringify(wallInfo);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateCompanyWall', params, {});
        };
        CompanyWallService.prototype.updateCompanyWall = function (wall) {
            var params = JSON.stringify(wall);
            return this.$http.post(this.appConfig.domain + '/Web/Security/UpdateCompanyWall', params, {});
        };
        CompanyWallService.prototype.deleteCompanyWall = function (id) {
            return this.$http.put(this.appConfig.domain + '/Web/Security/DeleteCompanyWall/' + id, {});
        };
        CompanyWallService.$inject = ["$http", "appConfig"];
        return CompanyWallService;
    }());
    culamaApp.CompanyWallService = CompanyWallService;
    angular
        .module("culamaApp")
        .service("companyWallService", CompanyWallService);
})(culamaApp || (culamaApp = {}));
