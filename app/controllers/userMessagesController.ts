/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
class UserMessagesController {
    static $inject = ["$scope", "$rootScope","$sce", "companyService", "messagesService"];
    constructor(public scope: any, public $rootScope: any, public $sce: any, public companyService: altairApp.CompanyService, public messageService: altairApp.MessagesService) {
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
                        html += "<li style='color: #444;'>" + this.User.FullIdentityName +"</li>"
                    }
                });
                return $sce.trustAsHtml("<div> <div class='uk-button-dropdown' data-uk-dropdown>You and &nbsp;<a>" + (m.MessageThreadUsers.length-1) +" more <i style='font- size: 13px;color: #9c9c9c;' class='material-icons arrow'>&#xE313;</i></a><div class='uk-dropdown'><ul class='uk-nav uk-nav-dropdown'>" + html +"</ul></div></div></div>");
            } else {
                return $sce.trustAsHtml("<div>You and " + m.MessageThreadUsers[1].User.FullIdentityName + "</div>");
            }
        }

        this.scope.$on('onLastRepeat', function (scope1, element, attrs) {
            scope.$apply(function () {
                UIkit.dropdown($('.uk-button-dropdown'), {
                    mode: 'hover'
                });
            });
        })
    }

    getMessageThreadByUserId(id) {
        this.$rootScope.$emit("toggleLoader", true);
        this.messageService.getMessageThreadsByUserId(id).then((result: ng.IHttpPromiseCallbackArg<any>) => {
            this.scope.Messages = result.data;
            
            if (result.data.length > 0) {
                this.scope.IsHasMessages = true;
            }
            this.$rootScope.$emit("toggleLoader", false);

        });
    }

    getCompanyUsers(companyid) {
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getUsersByCompanyId(companyid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
            var loggedUid = this.$rootScope.LoggedUser.UserId;
            $.each(result.data, function (index) {
                if (this.UserId == loggedUid) {
                    result.data.splice(index, 1);
                }
            });

            this.scope.selectize_users_options = result.data;
            this.$rootScope.$emit("toggleLoader", false);
        });
    }

    CreateMessage() {
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
            this.messageService.createMessageThread(this.newmessage).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                if (result.data) {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Your message group is created successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                this.$rootScope.$emit("toggleLoader", false);
                window.location.href = "/#/user_messages";

            });
        }
    }
}

angular.module("altairApp")
    .controller("userMessagesController", UserMessagesController);