/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    //export interface IPwnedService {
    //    check(address: string): ng.IPromise<ng.IHttpPromiseCallbackArg<BreachedAccount[]>>;
    //}
    var LoginService = (function () {
        function LoginService($http, appConfig) {
            this.$http = $http;
            this.appConfig = appConfig;
        }
        LoginService.prototype.login = function (loginuser) {
            var params = JSON.stringify(loginuser);
            return this.$http.put(this.appConfig.domain + '/Web/Security/CheckUser', params, {});
        };
        LoginService.prototype.changePassword = function (loginuser) {
            var params = JSON.stringify(loginuser);
            return this.$http.put(this.appConfig.domain + '/Web/Security/ChangeUserPassword', params, {});
        };
        LoginService.prototype.getUserDetailsbyId = function (id) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUserDetail/' + id, {});
        };
        LoginService.prototype.getUserDetailsbyPhone = function (phone) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUserDetailByPhone/' + phone, {});
        };
        LoginService.prototype.getUserDetailsbyUsername = function (username) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUserDetailByUserName/' + username, {});
        };
        LoginService.prototype.saveUserDetail = function (user) {
            var params = JSON.stringify(user);
            return this.$http.post(this.appConfig.domain + '/Web/Security/SaveUser', params, {});
        };
        LoginService.prototype.deleteUser = function (id) {
            return this.$http.put(this.appConfig.domain + '/Web/Security/DeleteUser/' + id, {});
        };
        return LoginService;
    }());
    LoginService.$inject = ["$http", "appConfig"];
    culamaApp.LoginService = LoginService;
    angular
        .module("culamaApp")
        .service("loginService", LoginService);
})(culamaApp || (culamaApp = {}));
