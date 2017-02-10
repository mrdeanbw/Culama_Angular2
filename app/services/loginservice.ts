/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module altairApp {

    //export interface IPwnedService {
    //    check(address: string): ng.IPromise<ng.IHttpPromiseCallbackArg<BreachedAccount[]>>;
    //}

    export class LoginService {

        static $inject = ["$http"];
        constructor(private $http: ng.IHttpService) {

        }


        login(loginuser: LoginUser): ng.IPromise<ng.IHttpPromiseCallbackArg<User>> {
            var params = JSON.stringify(loginuser);
            return this.$http.put('http://127.0.0.1:62028/Web/Security/CheckUser', params, {
            });
        }

        getUserDetailsbyId(id:string): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get('http://127.0.0.1:62028/Web/Security/GetUserDetail/' + id, {
            });
        }
        

    }

    angular
        .module("altairApp")
        .service("loginService", LoginService);
}