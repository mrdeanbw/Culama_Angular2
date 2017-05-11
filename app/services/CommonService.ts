/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module culamaApp {


    export class CommonService {

        static $inject = ["$http", "appConfig"];
        constructor(private $http: ng.IHttpService, public appConfig: any) {

        }


        getLanguages(): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/GetLanguages');
        }

        setLanguage(language) {
            localStorage.setItem("localelanguage", language);

        }

        getLanguage() {
            return localStorage.getItem("localelanguage");
        }

        getTranslation(elemid, targetPage): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get('/data/language_resource.json');
        }

        getUserConnectedThreads(userid: number): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetUserConnectedThreadByUserID/' + userid, {
            });
        }
    }

    angular
        .module("culamaApp")
        .service("commonService", CommonService);
}