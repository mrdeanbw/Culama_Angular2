/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
    //export interface IPwnedService {
    //    check(address: string): ng.IPromise<ng.IHttpPromiseCallbackArg<BreachedAccount[]>>;
    //}
    var CommonService = (function () {
        function CommonService($http) {
            this.$http = $http;
        }
        CommonService.prototype.login = function (loginuser) {
            var params = JSON.stringify(loginuser);
            return this.$http.put('http://127.0.0.1:62028/Web/Security/CheckUser', params, {});
        };
        CommonService.prototype.getUserDetailsbyId = function (id) {
            return this.$http.get('http://127.0.0.1:62028/Web/Security/GetUserDetail/' + id, {});
        };
        return CommonService;
    }());
    CommonService.$inject = ["$http"];
    altairApp.CommonService = CommonService;
    angular
        .module("altairApp")
        .service("commonService", CommonService);
})(altairApp || (altairApp = {}));
