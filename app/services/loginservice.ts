/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module culamaApp {

    //export interface IPwnedService {
    //    check(address: string): ng.IPromise<ng.IHttpPromiseCallbackArg<BreachedAccount[]>>;
    //}

    export class LoginService {

        static $inject = ["$http", "appConfig"];
        constructor(private $http: ng.IHttpService, public appConfig: any) {

        }


        login(loginuser: culamaApp.LoginUser): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.User>> {
            var params = JSON.stringify(loginuser);
            return this.$http.put(this.appConfig.domain + '/Web/Security/CheckUser', params, {
            });
        }


        changePassword(loginuser: culamaApp.LoginUser): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            var params = JSON.stringify(loginuser);
            return this.$http.put(this.appConfig.domain + '/Web/Security/ChangeUserPassword', params, {
            });
        }

        getUserDetailsbyId(id: string): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUserDetail/' + id, {
            });
        }

        getUserDetailsbyPhone(phone: string): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUserDetailByPhone/' + phone, {
            });
        }

        getUserDetailsbyUsername(username: string): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUserDetailByUserName/' + username, {
            });
        }

        saveUserDetail(user: culamaApp.UserDetail): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>> {
            var params = JSON.stringify(user);
            return this.$http.post(this.appConfig.domain + '/Web/Security/SaveUser', params, {
            });
        }

        deleteUser(id: string): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            return this.$http.put(this.appConfig.domain + '/Web/Security/DeleteUser/' + id, {
            });
        }


    }

    angular
        .module("culamaApp")
        .service("loginService", LoginService);
}