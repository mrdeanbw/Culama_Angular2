/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module altairApp {


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


    }

    angular
        .module("altairApp")
        .service("commonService", CommonService);
}