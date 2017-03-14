/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
    var CompanyService = (function () {
        function CompanyService($http, appConfig) {
            this.$http = $http;
            this.appConfig = appConfig;
        }
        CompanyService.prototype.getUsersByCompanyId = function (companyid) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUsers?companyid=' + companyid, {});
        };
        CompanyService.prototype.getUsers = function () {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUsers', {});
        };
        CompanyService.prototype.getCompanies = function () {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetCompanies', {});
        };
        CompanyService.prototype.getCompanyById = function (id) {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetCustomerDetails/' + id, {});
        };
        CompanyService.prototype.createUser = function (user) {
            var params = JSON.stringify(user);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateUser', params, {});
        };
        CompanyService.prototype.createCompany = function (customer) {
            var params = JSON.stringify(customer);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateCustomer', params, {});
        };
        CompanyService.prototype.saveCompanyDetail = function (customer) {
            var params = JSON.stringify(customer);
            return this.$http.post(this.appConfig.domain + '/Web/Security/SaveCompany', params, {});
        };
        CompanyService.prototype.deleteCompany = function (id) {
            return this.$http.put(this.appConfig.domain + '/Web/Security/DeleteCustomer/' + id, {});
        };
        return CompanyService;
    }());
    CompanyService.$inject = ["$http", "appConfig"];
    altairApp.CompanyService = CompanyService;
    angular
        .module("altairApp")
        .service("companyService", CompanyService);
})(altairApp || (altairApp = {}));
