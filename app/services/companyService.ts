/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module culamaApp {


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

        getUserGroups(): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUserGroups', {
            });
        }

        getCompanies(): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetCompanies', {
            });
        }

        getCompanyById(id: string): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.Customer>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetCustomerDetails/' + id, {
            });
        }

        createUser(user: culamaApp.UserDetail): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>> {
            var params = JSON.stringify(user);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateUser', params, {
            });
        }

        createCompany(customer: culamaApp.Customer): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            var params = JSON.stringify(customer);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateCustomer', params, {});
        }

        saveCompanyDetail(customer: culamaApp.Customer): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.Customer>> {
            var params = JSON.stringify(customer);
            return this.$http.post(this.appConfig.domain + '/Web/Security/SaveCompany', params, {
            });
        }

        deleteCompany(id: string): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            return this.$http.put(this.appConfig.domain + '/Web/Security/DeleteCustomer/' + id, {
            });
        }

        updateUsersDetails(userlist: any): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            var params = JSON.stringify(userlist);
            return this.$http.put(this.appConfig.domain + '/Web/Security/UpdateUsersDetails', params, {
            });
        }

    }

    angular
        .module("culamaApp")
        .service("companyService", CompanyService);
}