
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

        getCompanyWallPostInfoByPostId(wallPostId: string): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.areas.companyWall.models.WallPost>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetWallPostDetailsByWallPostID/' + wallPostId, {
            });
        }

        getWallInfoByWallId(wallId: string): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.areas.companyWall.models.Wall>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetWallDetailsByWallID/' + wallId, {
            });
        }

        createWallPost(wallpost: culamaApp.areas.companyWall.models.WallPost): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.areas.companyWall.models.WallPost>> {
            var params = JSON.stringify(wallpost);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateWallPost', params, {
            });
        }

        saveWallPostDetails(wallpost: culamaApp.areas.companyWall.models.WallPost): ng.IPromise<ng.IHttpPromiseCallbackArg<culamaApp.areas.companyWall.models.WallPost>> {
            var params = JSON.stringify(wallpost);
            return this.$http.post(this.appConfig.domain + '/Web/Security/SaveWallPostDetails', params, {
            });
        }

        deleteWallPost(wallPostId: string): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            return this.$http.put(this.appConfig.domain + '/Web/Security/DeleteWallPost/' + wallPostId, {
            });
        }

    }

    angular
        .module("culamaApp")
        .service("companyWallPostService", CompanyWallPostService);
}