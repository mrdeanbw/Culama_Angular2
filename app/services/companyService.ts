/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module altairApp {


    export class CompanyService {

        static $inject = ["$http", "appConfig"];
        constructor(private $http: ng.IHttpService, public appConfig: any) {
        }


        getUsersByCompanyId(companyid: number): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUsers?companyid=' + companyid, {
            });
        }

        getUsers(): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUsers', {
            });
        }

        createUser(user: altairApp.UserDetail): ng.IPromise<ng.IHttpPromiseCallbackArg<altairApp.UserDetail>> {
            var params = JSON.stringify(user);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateUser', params, {
            });
        }

    }

    angular
        .module("altairApp")
        .service("companyService", CompanyService);
}