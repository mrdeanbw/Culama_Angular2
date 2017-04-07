/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var UserDashboardController = (function () {
        function UserDashboardController(scope, $rootScope, $sce, $filter, companyService, messageService, loginService) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.$sce = $sce;
            this.$filter = $filter;
            this.companyService = companyService;
            this.messageService = messageService;
            this.loginService = loginService;
            this.scope.loggedUserID = this.$rootScope.LoggedUser.UserId;
            this.scope.newMessages = [];
            this.scope.firstThreeMsg = [];
            this.scope.IsHasMessages = false;
            debugger;
            this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, true);
        }
        UserDashboardController.prototype.getMessageThreadByUserId = function (id, isLoadMessage) {
            var _this = this;
            debugger;
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
        UserDashboardController.$inject = ["$scope", "$rootScope", "$sce", "$filter", "companyService", "messagesService", "loginService"];
        return UserDashboardController;
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
        .controller("userDashboardController", UserDashboardController);
    angular.module("culamaApp")
        .filter("myFilter", culamaApp.myFilter);
})(culamaApp || (culamaApp = {}));
