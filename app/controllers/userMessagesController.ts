/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
class UserMessagesController {
    static $inject = ["$scope", "$rootScope", "companyService","messagesService"];
    constructor(public scope: any, public $rootScope: any, public companyService: altairApp.CompanyService, public messageService: altairApp.MessagesService) {
        this.scope.Messages = [];
        this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId);
        this.scope.IsHasMessages = false;

        this.getCompanyUsers(this.$rootScope.LoggedUser.CustomerId);

        this.scope.selectize_users_options = [];
            

        this.scope.selectize_users_config = {
            plugins: {
                'remove_button': {
                    label: ''
                }
            },
            maxItems: null,
            valueField: 'UserId',
            labelField: 'FullIdentityName',
            searchField: 'FullIdentityName',
            create: false,
            render: {
                option: function (planets_data, escape) {
                    return '<div class="option">' +
                        '<span class="title">' + escape(planets_data.FullIdentityName) + '</span>' +
                        '</div>';
                },
                item: function (planets_data, escape) {
                    return '<div class="item">' + escape(planets_data.FullIdentityName) + '</div>';
                }
            }
        };
    }

    getMessageThreadByUserId(id) {
        this.$rootScope.$emit("toggleLoader", true);
        this.messageService.getMessageThreadsByUserId(id).then((result: ng.IHttpPromiseCallbackArg<any>) => {
            this.scope.Messages = result.data;

            if (result.data == null) {
                this.scope.IsHasMessages = true;
            }
            this.$rootScope.$emit("toggleLoader", false);

        });
    }

    getCompanyUsers(companyid) {
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getUsersByCompanyId(companyid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
            this.scope.selectize_users_options = result.data;
            this.$rootScope.$emit("toggleLoader", false);
        });
    }
}

angular.module("altairApp")
    .controller("userMessagesController", UserMessagesController);