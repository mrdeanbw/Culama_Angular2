/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
    //export interface IPwnedService {
    //    check(address: string): ng.IPromise<ng.IHttpPromiseCallbackArg<BreachedAccount[]>>;
    //}
    var LoginService = (function () {
        function LoginService($http) {
            this.$http = $http;
        }
        LoginService.prototype.login = function (loginuser) {
            var params = JSON.stringify(loginuser);
            return this.$http.put('http://127.0.0.1:62028/Web/Security/CheckUser', params, {});
        };
        LoginService.prototype.getUserDetailsbyId = function (id) {
            return this.$http.get('http://127.0.0.1:62028/Web/Security/GetUserDetail/' + id, {});
        };
        LoginService.prototype.getUserDetailsbyPhone = function (phone) {
            return this.$http.get('http://127.0.0.1:62028/Web/Security/GetUserDetailByPhone/' + phone, {});
        };
        LoginService.prototype.saveUserDetail = function (user) {
            var params = JSON.stringify(user);
            return this.$http.post('http://127.0.0.1:62028/Web/Security/SaveUser', params, {});
        };
        return LoginService;
    }());
    LoginService.$inject = ["$http"];
    altairApp.LoginService = LoginService;
    angular
        .module("altairApp")
        .service("loginService", LoginService);
})(altairApp || (altairApp = {}));
