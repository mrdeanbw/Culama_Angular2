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

        updateMsgThreadReadPropery(id: string, msgid: string): ng.IPromise<ng.IHttpPromiseCallbackArg<boolean>> {
            return this.$http.put(this.appConfig.domain + '/Web/Security/UpdateMsgThreadReadPropery/' + id + '/' + msgid, {
            });
        }

        getMessageReadInfoByUserID(userid: number): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            return this.$http.get(this.appConfig.domain + '/Web/Security/GetMessageReadInfoByUserID/' + userid, {
            });
        }
    }
    angular.module('culamaApp').service('culamaApp.services.MessageService', MessageService);
}