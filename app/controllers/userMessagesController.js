/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var UserMessagesController = (function () {
    function UserMessagesController(scope, $rootScope, companyService, messageService) {
        this.scope = scope;
        this.$rootScope = $rootScope;
        this.companyService = companyService;
        this.messageService = messageService;
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
    UserMessagesController.prototype.getMessageThreadByUserId = function (id) {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.messageService.getMessageThreadsByUserId(id).then(function (result) {
            _this.scope.Messages = result.data;
            if (result.data == null) {
                _this.scope.IsHasMessages = true;
            }
            _this.$rootScope.$emit("toggleLoader", false);
        });
    };
    UserMessagesController.prototype.getCompanyUsers = function (companyid) {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getUsersByCompanyId(companyid).then(function (result) {
            _this.scope.selectize_users_options = result.data;
            _this.$rootScope.$emit("toggleLoader", false);
        });
    };
    return UserMessagesController;
}());
UserMessagesController.$inject = ["$scope", "$rootScope", "companyService", "messagesService"];
angular.module("altairApp")
    .controller("userMessagesController", UserMessagesController);
