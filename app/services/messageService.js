/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
var culamaApp;
(function (culamaApp) {
    var services;
    (function (services) {
        var MessageService = (function () {
            function MessageService($http, appConfig) {
                this.$http = $http;
                this.appConfig = appConfig;
            }
            MessageService.prototype.getMessageThreadsByUserId = function (userid) {
                return this.$http.get(this.appConfig.domain + '/Web/Security/GetMessageThreadsByUserId/' + userid, {});
            };
            MessageService.prototype.createMessageThread = function (msgObj) {
                var params = JSON.stringify(msgObj);
                return this.$http.post(this.appConfig.domain + '/Web/Security/CreateMessageThread', params, {});
            };
            MessageService.prototype.sendMessageThread = function (msgObj) {
                var params = JSON.stringify(msgObj);
                return this.$http.post(this.appConfig.domain + '/Web/Security/SendMessage', params, {});
            };
            return MessageService;
        }());
        MessageService.$inject = ["$http", "appConfig"];
        services.MessageService = MessageService;
        angular.module('culamaApp.services').service('culamaApp.services.MessageService', MessageService);
    })(services = culamaApp.services || (culamaApp.services = {}));
})(culamaApp || (culamaApp = {}));
