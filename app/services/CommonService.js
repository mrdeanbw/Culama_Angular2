/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
    var CommonService = (function () {
        function CommonService($http) {
            this.$http = $http;
        }
        CommonService.prototype.getLanguages = function () {
            return this.$http.get('http://127.0.0.1:62028/Web/GetLanguages');
        };
        CommonService.prototype.setLanguage = function (language) {
            localStorage.setItem("localelanguage", language);
        };
        CommonService.prototype.getTranslation = function (elemid, targetPage) {
            return this.$http.get('/data/language_resource.json');
        };
        return CommonService;
    }());
    CommonService.$inject = ["$http"];
    altairApp.CommonService = CommonService;
    angular
        .module("altairApp")
        .service("commonService", CommonService);
})(altairApp || (altairApp = {}));
