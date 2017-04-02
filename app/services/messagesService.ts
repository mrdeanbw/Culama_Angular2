/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module culamaApp {


    export class MessagesService {

        static $inject = ["$http", "appConfig"];
        constructor(private $http: ng.IHttpService, public appConfig: any) {
        }

        getMessageThreadsByUserId(userid: number): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetMessageThreadsByUserId/' + userid, {
            });
        }

        createMessageThread(msgObj: any): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            var params = JSON.stringify(msgObj);
            return this.$http.post(this.appConfig.domain + '/Web/Security/CreateMessageThread', params, {
            });
        }

        sendMessageThread(msgObj: any): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            var params = JSON.stringify(msgObj);
            return this.$http.post(this.appConfig.domain + '/Web/Security/SendMessage', params, {
            });
        }

    }

    angular
        .module("culamaApp")
        .service("messagesService", MessagesService);
}