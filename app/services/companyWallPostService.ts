
/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp {
    export class CompanyWallPostService {

        static $inject = ["$http", "appConfig"];
        constructor(private $http: ng.IHttpService, public appConfig: any) {
        }

        getCompanyWallPostsByWallId(wallId: number): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetWallPostDetailsByWallID/' + wallId, {
            });
        }
    }

    angular
        .module("culamaApp")
        .service("companyWallPostService", CompanyWallPostService);
}