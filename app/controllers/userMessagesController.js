/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var UserMessagesController = (function () {
    function UserMessagesController(scope, $rootScope, $sce, companyService, messageService) {
        this.scope = scope;
        this.$rootScope = $rootScope;
        this.$sce = $sce;
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
        var loggedUid = this.$rootScope.LoggedUser.UserId;
        this.scope.showMessageUsers = function (m) {
            if (m.MessageThreadUsers.length > 3) {
                var html = "";
                $.each(m.MessageThreadUsers, function () {
                    debugger;
                    if (this.UserId != loggedUid) {
                        html += "<li style='color: #444;'>" + this.User.FullIdentityName + "</li>";
                    }
                });
                return $sce.trustAsHtml("<div> <div class='uk-button-dropdown' data-uk-dropdown>You and &nbsp;<a>" + (m.MessageThreadUsers.length - 1) + " more <i style='font- size: 13px;color: #9c9c9c;' class='material-icons arrow'>&#xE313;</i></a><div class='uk-dropdown'><ul class='uk-nav uk-nav-dropdown'>" + html + "</ul></div></div></div>");
            }
            else {
                return $sce.trustAsHtml("<div>You and " + m.MessageThreadUsers[1].User.FullIdentityName + "</div>");
            }
        };
        this.scope.$on('onLastRepeat', function (scope1, element, attrs) {
            scope.$apply(function () {
                UIkit.dropdown($('.uk-button-dropdown'), {
                    mode: 'hover'
                });
            });
        });
    }
    UserMessagesController.prototype.getMessageThreadByUserId = function (id) {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.messageService.getMessageThreadsByUserId(id).then(function (result) {
            _this.scope.Messages = result.data;
            if (result.data.length > 0) {
                _this.scope.IsHasMessages = true;
            }
            _this.$rootScope.$emit("toggleLoader", false);
        });
    };
    UserMessagesController.prototype.getCompanyUsers = function (companyid) {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getUsersByCompanyId(companyid).then(function (result) {
            var loggedUid = _this.$rootScope.LoggedUser.UserId;
            $.each(result.data, function (index) {
                if (this.UserId == loggedUid) {
                    result.data.splice(index, 1);
                }
            });
            _this.scope.selectize_users_options = result.data;
            _this.$rootScope.$emit("toggleLoader", false);
        });
    };
    UserMessagesController.prototype.CreateMessage = function () {
        var _this = this;
        var users = [];
        this.selectize_Users.push(this.$rootScope.LoggedUser.UserId.toString());
        if (this.selectize_Users.length > 0) {
            $.each(this.selectize_Users, function (index) {
                var msgu = new Object();
                msgu.UserId = parseInt(this);
                msgu.MessageId = 0;
                msgu.IsActive = true;
                msgu.IsAdmin = true;
                users.push(msgu);
            });
        }
        this.newmessage.MessageThreadUsers = users;
        this.newmessage.CreatedUserId = this.$rootScope.LoggedUser.UserId;
        if (createMessageForm.checkValidity()) {
            this.$rootScope.$emit("toggleLoader", true);
            this.messageService.createMessageThread(this.newmessage).then(function (result) {
                if (result.data) {
                    _this.$rootScope.$emit("successnotify", { msg: "Your message group is created successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                _this.$rootScope.$emit("toggleLoader", false);
                window.location.href = "/#/user_messages";
            });
        }
    };
    return UserMessagesController;
}());
UserMessagesController.$inject = ["$scope", "$rootScope", "$sce", "companyService", "messagesService"];
angular.module("altairApp")
    .controller("userMessagesController", UserMessagesController);
