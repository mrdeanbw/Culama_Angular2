/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp {
    class UserDashboardController {
        static $inject = ["$scope", "$rootScope", "$sce", "$filter", "companyService", "culamaApp.services.MessageService", "loginService"];
        constructor(public scope: any, public $rootScope: any, public $sce: any, public $filter: any, public companyService: culamaApp.CompanyService, public messageService: culamaApp.services.MessageService, public loginService: culamaApp.LoginService) {
            this.scope.loggedUserID = this.$rootScope.LoggedUser.UserId;
            this.scope.newMessages = [];
            this.scope.firstThreeMsg = [];
            this.scope.IsHasMessages = false;
            this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, true);

        }

        getMessageThreadByUserId(id, isLoadMessage) {
            var currentObj = this;
            currentObj.$rootScope.$emit("toggleLoader", true);
            currentObj.messageService.getMessageReadInfoByUserID(id).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                if (result.data.length > 0) {
                    currentObj.scope.IsHasMessages = true;
                    currentObj.scope.newMessages = result.data;
                    if (result.data.length > 3) {
                        var newmsg = [];
                        for (var i = 0; i < 3; i++) {
                            newmsg.push(result.data[i]);
                        }
                        currentObj.scope.firstThreeMsg = newmsg;
                    }
                    else
                        currentObj.scope.firstThreeMsg = result.data;
                }
                currentObj.$rootScope.$emit("toggleLoader", false);
            });
        }

    }

    export function myFilter() {
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

    angular.module("culamaApp")
        .controller("userDashboardController", UserDashboardController);

    angular.module("culamaApp")
        .filter("myFilter", culamaApp.myFilter);
}

