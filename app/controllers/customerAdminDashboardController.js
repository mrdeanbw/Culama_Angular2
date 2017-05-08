/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var CustomerAdminDashboardController = (function () {
        function CustomerAdminDashboardController(scope, $rootScope, $interval, $timeout, messageService, loginService) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.$interval = $interval;
            this.$timeout = $timeout;
            this.messageService = messageService;
            this.loginService = loginService;
            this.scope.loggedUserID = this.$rootScope.LoggedUser.UserId;
            this.scope.newMessages = [];
            this.scope.firstThreeMsg = [];
            this.scope.IsHasMessages = false;
            if ($rootScope.LoggedUser.UserGroupId != undefined) {
                if ($rootScope.LoggedUser.UserGroupId !== 1 && $rootScope.LoggedUser.UserGroupId !== 2) {
                    window.location.href = "#/user_dashboard";
                }
            }
            this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, true);
        }
        CustomerAdminDashboardController.prototype.getMessageThreadByUserId = function (id, isLoadMessage) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.messageService.getMessageReadInfoByUserID(id).then(function (result) {
                if (result.data.length > 0) {
                    _this.scope.IsHasMessages = true;
                    _this.scope.newMessages = result.data;
                    if (result.data.length > 3) {
                        var newmsg = [];
                        for (var i = 0; i < 3; i++) {
                            newmsg.push(result.data[i]);
                        }
                        _this.scope.firstThreeMsg = newmsg;
                    }
                    else
                        _this.scope.firstThreeMsg = result.data;
                }
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        CustomerAdminDashboardController.$inject = ["$scope", "$rootScope", "$interval", "$timeout", "culamaApp.services.MessageService", "loginService"];
        return CustomerAdminDashboardController;
    }());
    function myFilter() {
        return function (msginfo) {
            var filter = [];
            for (var i = 0; i < msginfo.length; i++) {
                filter.push(msginfo[i]);
                var msgcontent = "";
                var sendername = "";
                if (msginfo[i].MessageThreadDetail.TextContent.length >= 12)
                    msgcontent = msginfo[i].MessageThreadDetail.TextContent.toString().substr(0, 12) + "...";
                else
                    msgcontent = msginfo[i].MessageThreadDetail.TextContent;
                if (msginfo[i].MessageThreadDetail.User.FullIdentityName.length >= 12)
                    sendername = msginfo[i].MessageThreadDetail.User.FullIdentityName.toString().substr(0, 12) + "...";
                else
                    sendername = msginfo[i].MessageThreadDetail.User.FullIdentityName;
                filter[i].MessageThreadDetail.TextContent = msgcontent;
                filter[i].MessageThreadDetail.User.FullIdentityName = sendername;
            }
            return filter;
        };
    }
    culamaApp.myFilter = myFilter;
    angular.module("culamaApp")
        .controller("customerAdminDashboardController", CustomerAdminDashboardController);
    angular.module("culamaApp")
        .filter("myFilter", culamaApp.myFilter);
})(culamaApp || (culamaApp = {}));
