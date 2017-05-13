/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var CompanyWallPostService = (function () {
        function CompanyWallPostService($http, appConfig) {
            this.$http = $http;
            this.appConfig = appConfig;
        }
        CompanyWallPostService.prototype.getCompanyWallPostsByWallId = function (wallId) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetWallPostDetailsByWallID/' + wallId, {});
        };
        CompanyWallPostService.$inject = ["$http", "appConfig"];
        return CompanyWallPostService;
    }());
    culamaApp.CompanyWallPostService = CompanyWallPostService;
    angular
        .module("culamaApp")
        .service("companyWallPostService", CompanyWallPostService);
})(culamaApp || (culamaApp = {}));
