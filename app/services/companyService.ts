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

        getCompanies(): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetCompanies', {
            });
        }

        createUser(user: altairApp.UserDetail): ng.IPromise<ng.IHttpPromiseCallbackArg<altairApp.UserDetail>> {
            var params = JSON.stringify(user);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateUser', params, {
            });
        }

        createCompany(customer: altairApp.Customer): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            var params = JSON.stringify(customer);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateCustomer', params, {
            });
        }

        saveCompanyDetail(customer: altairApp.Customer): ng.IPromise<ng.IHttpPromiseCallbackArg<altairApp.Customer>> {
            var params = JSON.stringify(customer);
            return this.$http.post(this.appConfig.domain + '/Web/Security/SaveCompany', params, {
            });
        }

        deleteCompany(id: string): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            return this.$http.put(this.appConfig.domain + '/Web/Security/DeleteCustomer/' + id, {
            });
        }

    }

    angular
        .module("altairApp")
        .service("companyService", CompanyService);
}