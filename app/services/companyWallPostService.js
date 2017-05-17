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
        CompanyWallPostService.prototype.getCompanyWallPostInfoByPostId = function (wallPostId) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetWallPostDetailsByWallPostID/' + wallPostId, {});
        };
        CompanyWallPostService.prototype.getWallInfoByWallId = function (wallId) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetWallDetailsByWallID/' + wallId, {});
        };
        CompanyWallPostService.prototype.createWallPost = function (wallpost) {
            var params = JSON.stringify(wallpost);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateWallPost', params, {});
        };
        CompanyWallPostService.prototype.saveWallPostDetails = function (wallpost) {
            var params = JSON.stringify(wallpost);
            return this.$http.post(this.appConfig.domain + '/Web/Security/SaveWallPostDetails', params, {});
        };
        CompanyWallPostService.prototype.deleteWallPost = function (wallPostId) {
            return this.$http.put(this.appConfig.domain + '/Web/Security/DeleteWallPost/' + wallPostId, {});
        };
        CompanyWallPostService.$inject = ["$http", "appConfig"];
        return CompanyWallPostService;
    }());
    culamaApp.CompanyWallPostService = CompanyWallPostService;
    angular
        .module("culamaApp")
        .service("companyWallPostService", CompanyWallPostService);
})(culamaApp || (culamaApp = {}));
