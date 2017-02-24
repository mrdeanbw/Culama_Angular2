/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
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
        return CommonService;
    }());
    CommonService.$inject = ["$http", "appConfig"];
    altairApp.CommonService = CommonService;
    angular
        .module("altairApp")
        .service("commonService", CommonService);
})(altairApp || (altairApp = {}));
