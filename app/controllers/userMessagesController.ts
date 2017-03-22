/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
class UserMessagesController {
   // loggedUid: any;
    static $inject = ["$scope", "$rootScope", "$sce", "$filter", "companyService", "messagesService"];
    constructor(public scope: any, public $rootScope: any, public $sce: any, public $filter: any, public companyService: altairApp.CompanyService, public messageService: altairApp.MessagesService) {
        this.scope.Messages = [];
        this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, true);
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
       this.scope.LoggedUserId = this.$rootScope.LoggedUser.UserId;
        var loggedUid = this.$rootScope.LoggedUser.UserId;
        this.scope.showMessageUsers = function (m) {
            if (m.MessageThreadUsers.length > 3) {
                var html = "";
                $.each(m.MessageThreadUsers, function () {
                    if (this.UserId != loggedUid) {
                        html += "<li style='color: #444;'>" + this.User.FullIdentityName + "</li>"
                    }
                });
                return $sce.trustAsHtml("<div> <div class='uk-button-dropdown' data-uk-dropdown>You and &nbsp;<a>" + (m.MessageThreadUsers.length - 1) + " more <i style='font- size: 13px;color: #9c9c9c;' class='material-icons arrow'>&#xE313;</i></a><div class='uk-dropdown'><ul class='uk-nav uk-nav-dropdown'>" + html + "</ul></div></div></div>");
            } else {
                return $sce.trustAsHtml("<div>You and " + m.MessageThreadUsers[1].User.FullIdentityName + "</div>");
            }
        }

        this.scope.$on('onLastRepeat', function (scope1, element, attrs) {
            if ($(element).attr("id") == "chat_div") {
                //setTimeout(function () {
                //    var pchartobj = $('#chat_div').parents("div.scroll-content");
                //    $(pchartobj).scrollTop($(pchartobj)[0].scrollHeight);
                //}, 500);
                var pchartobj = $('#chat_div').parents("div.scroll-content");
                $(pchartobj).scrollTop($(pchartobj)[0].scrollHeight);
                
            }
            else {
                scope.$apply(function () {
                    UIkit.dropdown($('.uk-button-dropdown'), {
                        mode: 'hover'
                    });
                });
            }
            
        })
        var umg = this;
        this.scope.scopeLoadMessages = function (id) {
            umg.loadMessages(id, true);
        }

        this.scope.scopeSendMessage = function () {
            umg.sendMessage();
        }

    }

    getMessageThreadByUserId(id, isLoadMessage) {
        this.$rootScope.$emit("toggleLoader", true);
        this.messageService.getMessageThreadsByUserId(id).then((result: ng.IHttpPromiseCallbackArg<any>) => {
            this.scope.Messages = result.data;

            if (result.data.length > 0) {
                this.scope.IsHasMessages = true;
                if (isLoadMessage) {
                    this.loadMessages(this.scope.Messages[0].Id, true);
                }

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

    loadMessages(messageId, IsRefreshAll) {

        if (IsRefreshAll) {
            this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, false);
        }


        var msg;
        $.each(this.scope.Messages, function () {
            if (this.Id == messageId) {
                msg = this;
            }
        });

        this.scope.SelectedMessageThread = msg;
        if (msg != undefined) {
            $.each(msg.MessageThreadDetails, function () {
                if (typeof this.CreatedOn === 'string') {
                    this.CreatedOn = new Date(parseInt(this.CreatedOn.substr(6)));
                }
            });
            var md = this.$filter('orderBy')(msg.MessageThreadDetails, 'CreatedOn');
            var chatObjs = [];
            var ft = this.$filter;
            $.each(md, function () {
                var chatobj = new Object();
                chatobj.user_id = this.UserId;
                chatobj.date = ft('date')(this.CreatedOn, "dd MMM HH:mm");
                chatobj.content = [this.TextContent];
                chatObjs.push(chatobj);
            });

            this.scope.chat_messages = chatObjs;
        }

        
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

    sendMessage() {
        if (this.scope.SendMessageContent.toString().trim() != "") {
            var msgu = new Object();
            msgu.MessageId = this.scope.SelectedMessageThread.Id;
            msgu.UserId = this.$rootScope.LoggedUser.UserId;
            msgu.TextContent = this.scope.SendMessageContent.toString().trim();
            msgu.IsActive = true;

            this.$rootScope.$emit("toggleLoader", true);
            this.messageService.sendMessageThread(msgu).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                if (result.data != null) {
                    var mlist = this.scope.Messages;
                    $.each(mlist, function (index) {
                        if (this.Id === result.data.Id) {
                            mlist[index] = result.data;
                        }
                    });
                    this.scope.Messages = mlist;
                    this.loadMessages(result.data.Id, false);
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Message can't sent. Please try again.", status: "danger" });
                }
                this.scope.SendMessageContent = "";
                this.$rootScope.$emit("toggleLoader", false);
            });
        }
    }
}

angular.module("altairApp")
    .controller("userMessagesController", UserMessagesController);