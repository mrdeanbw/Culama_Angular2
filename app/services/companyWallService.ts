
/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp {
    export class CompanyWallService {

        static $inject = ["$http", "appConfig"];
        constructor(private $http: ng.IHttpService, public appConfig: any) {
        }

        getCompanyWalls(): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetCompanyWalls', {
            });
        }

        createCompanyWall(wallInfo: culamaApp.Wall): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.Wall>> {
            var params = JSON.stringify(wallInfo);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateCompanyWall', params, {
            });
        }

        updateCompanyWall(wall: culamaApp.Wall): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.Wall>> {
            var params = JSON.stringify(wall);
            return this.$http.post(this.appConfig.domain + '/Web/Security/UpdateCompanyWall', params, {
            });
        }

        deleteCompanyWall(id: string): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            return this.$http.put(this.appConfig.domain + '/Web/Security/DeleteCompanyWall/' + id, {
            });
        }

    }

    angular
        .module("culamaApp")
        .service("companyWallService", CompanyWallService);
}
