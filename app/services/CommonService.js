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
        return CommonService;
    }());
    CommonService.$inject = ["$http"];
    altairApp.CommonService = CommonService;
    angular
        .module("altairApp")
        .service("commonService", CommonService);
})(altairApp || (altairApp = {}));
