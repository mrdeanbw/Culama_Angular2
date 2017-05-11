/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var CommonService = (function () {
        function CommonService($http, appConfig) {
            this.$http = $http;
            this.appConfig = appConfig;
        }
        CommonService.prototype.getLanguages = function () {
            return this.$http.get(this.appConfig.domain + '/Web/GetLanguages');
        };
        CommonService.prototype.setLanguage = function (language) {
            localStorage.setItem("localelanguage", language);
        };
        CommonService.prototype.getLanguage = function () {
            return localStorage.getItem("localelanguage");
        };
        CommonService.prototype.getTranslation = function (elemid, targetPage) {
            return this.$http.get('/data/language_resource.json');
        };
        CommonService.prototype.getUserConnectedThreads = function (userid) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUserConnectedThreadByUserID/' + userid, {});
        };
        CommonService.$inject = ["$http", "appConfig"];
        return CommonService;
    }());
    culamaApp.CommonService = CommonService;
    angular
        .module("culamaApp")
        .service("commonService", CommonService);
})(culamaApp || (culamaApp = {}));
