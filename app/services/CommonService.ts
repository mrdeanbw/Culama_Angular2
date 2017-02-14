/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module altairApp {

   
    export class CommonService {

        static $inject = ["$http"];
        constructor(private $http: ng.IHttpService) {

        }


        getLanguages(): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get('http://127.0.0.1:62028/Web/GetLanguages');
        }


    }

    angular
        .module("altairApp")
        .service("commonService", CommonService);
}