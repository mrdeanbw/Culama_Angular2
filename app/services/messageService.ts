/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />

module culamaApp.services {
    export class MessageService {

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
    angular.module('culamaApp.services').service('culamaApp.services.MessageService', MessageService);
}