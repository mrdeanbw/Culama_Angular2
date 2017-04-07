/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp.areas.messaging.controllers {
    class UserMessagesController {
        // loggedUid: any;
        static $inject = ["$scope", "$rootScope", "$sce", "$filter", "companyService", "messagesService", "loginService"];

        constructor(public scope: IUserMessageScope, public $rootScope: any, public $sce: any, public $filter: any, public companyService: culamaApp.CompanyService, public messageService: culamaApp.services.MessageService, public loginService: culamaApp.LoginService) {
            this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, true);
            this.scope.isHasMessages = false;
            this.scope.isUserCreateMessage = true;
            this.scope.isUserTypeMessage = true;
            this.scope.selectizeUsersOptions = [];
            this.getCompanyDetail(this.$rootScope.LoggedUser.CustomerId);
            this.getCompanyUsers(this.$rootScope.LoggedUser.CustomerId);

            this.scope.selectizeUsersConfig = {
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
                    option: function(data, escape) {
                        return '<div class="option">' +
                            '<span class="title">' + escape(data.FullIdentityName) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        return '<div class="item participants-item"><p class="participants-label">' + escape(data.FullIdentityName) + '</p>' + '</div>';
                    }
                }
            };
            this.scope.loggedUserId = this.$rootScope.LoggedUser.UserId;
            this.scope.newMessage = new models.MessageThread();
            var loggedUid = this.$rootScope.LoggedUser.UserId;
            this.scope.showMessageUsers = function(m) {
                if (m.MessageThreadUsers.length >= 3) {
                    var html = "";
                    $.each(m.MessageThreadUsers, function() {
                        if (this.UserId != loggedUid) {
                            html += "<li style='color: #444;'>" + this.User.FullIdentityName + "</li>"
                        }
                    });
                    return $sce.trustAsHtml("<div> <div class='uk-button-dropdown' >You and &nbsp;<a>" + (m.MessageThreadUsers.length - 1) + " more <i style='font- size: 13px;color: #9c9c9c;' class='material-icons arrow'>&#xE313;</i></a><div class='uk-dropdown'><ul class='uk-nav uk-nav-dropdown'>" + html + "</ul></div></div></div>");
                } else {
                    return $sce.trustAsHtml("<div>You and " + m.MessageThreadUsers[1].User.FullIdentityName + "</div>");
                }
            }

            this.scope.$on('onLastRepeat', function(scope1, element, attrs) {
                if ($(element).attr("id") == "chat_div") {
                    var pchartobj = $('#chat_div').parents("div.scroll-content");
                    $(pchartobj).scrollTop($(pchartobj)[0].scrollHeight);

                } else {
                    scope.$apply(function() {
                        UIkit.dropdown($('.uk-button-dropdown'), {
                            mode: 'hover'
                        });
                    });
                }

            })
            var umg = this;
            this.scope.scopeLoadMessages = function(id) {
                umg.loadMessages(id, true);
            }

            this.scope.scopeSendMessage = function() {
                umg.sendMessage();
            }

            this.scope.CreateMessage = function() { umg.createMessage(); }
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

        getCompanyDetail(companyid) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.getCompanyById(companyid).then((result: ng.IHttpPromiseCallbackArg<culamaApp.Customer>) => {
                this.scope.Customer = result.data;
                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        getCompanyUsers(companyid) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.getUsersByCompanyId(companyid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                var loggedUid = this.$rootScope.LoggedUser.UserId;
                var companyusers = result.data.slice();
                var addedrecipients = [];
                var IsAll = this.scope.Customer.IsAllowMsgAllToEveryone;

                if (IsAll == true) {
                    $.each(result.data, function(index) {
                        if (this.UserId == loggedUid) {
                            result.data.splice(index, 1);
                            if (!this.IsAllowMsgToEveryone) {
                                IsAll = this.IsAllowMsgToEveryone;
                            }
                        }
                    });
                    if (IsAll) {
                        this.scope.selectizeUsersOptions = result.data;
                    }
                } else {
                    var remainrecipients = [];
                    var companyRecipients = this.scope.Customer.RecipientList;

                    if (companyRecipients != null) {
                        var splitedrecipients = companyRecipients.toString().split(',');

                        for (var i = 0; i < splitedrecipients.length; i++) {
                            if (splitedrecipients[i] != loggedUid)
                                remainrecipients.push(splitedrecipients[i]);
                        }

                        for (var x = 0; x < companyusers.length; x++) {
                            for (var m = 0; m < remainrecipients.length; m++) {
                                if (remainrecipients[m] == companyusers[x].UserId)
                                    addedrecipients.push(companyusers[x]);
                            }
                        }
                    }
                    this.scope.selectizeUsersOptions = addedrecipients;
                }
                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        loadMessages(messageId, IsRefreshAll) {

            var currentObj = this;
            if (IsRefreshAll) {
                this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, false);
            }

            var msg;
            $.each(this.scope.Messages, function() {
                if (this.Id == messageId) {
                    msg = this;
                }
            });

            this.scope.SelectedMessageThread = msg;

            //this.CurrentChatingMembers();

            if (msg != undefined) {

                var olderGroupMembers = [];
                for (var i = 0; i < msg.MessageThreadUsers.length; i++) {
                    if (msg.MessageThreadUsers[i].UserId != currentObj.$rootScope.LoggedUser.UserId)
                        olderGroupMembers.push(msg.MessageThreadUsers[i].UserId);
                }
                currentObj.scope.olderChatingGroup = olderGroupMembers;
                $.each(msg.MessageThreadDetails, function() {
                    if (typeof this.CreatedOn === 'string') {
                        this.CreatedOn = new Date(parseInt(this.CreatedOn.substr(6)));
                    }
                });
                var md = this.$filter('orderBy')(msg.MessageThreadDetails, 'CreatedOn');
                var chatObjs = [];
                var ft = this.$filter;
                $.each(md, function() {
                    var chatobj: models.Chat = new models.Chat();
                    chatobj.UserId = this.UserId;
                    chatobj.Date = ft('date')(this.CreatedOn, "dd MMM HH:mm");
                    chatobj.Content = [this.TextContent];
                    chatObjs.push(chatobj);
                });

                this.scope.chatMessages = chatObjs;
            }


        }

        createMessage() {
            var currentObj = this;
            var currentUser = new models.MessageThreadUser();
            currentUser.UserId = this.$rootScope.LoggedUser.UserId.toString();
            currentUser.Id = 0;
            var users = new Array<models.MessageThreadUser>();
            users.push(currentUser);

                $.each(currentObj.scope.newMessageUsers, function(index) {
                    var msgu = new models.MessageThreadUser();
                    msgu.UserId = parseInt(this);
                    msgu.Id = 0;

                    users.push(msgu);
            });

            currentObj.scope.newMessage.MessageThreadUsers = users;
            currentObj.scope.newMessage.CreatedUserId = currentObj.$rootScope.LoggedUser.UserId;
            if (currentObj.scope.createMessageForm.$valid) {

                currentObj.$rootScope.$emit("toggleLoader", true);
                currentObj.messageService.createMessageThread(currentObj.scope.newMessage).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                    if (result.data) {
                        currentObj.$rootScope.$emit("successnotify",
                        { msg: "Your message group is created successfully", status: "success" });
                    } else {
                        currentObj.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                    currentObj.$rootScope.$emit("toggleLoader", false);
                    window.location.href = "/#/user_messages";

                });
            }
        }

        sendMessage() {
            if (this.scope.SendMessageContent.toString().trim() != "") {
                var msgu = new models.Message();
                msgu.MessageId = this.scope.SelectedMessageThread.Id;
                msgu.UserId = this.$rootScope.LoggedUser.UserId;
                msgu.TextContent = this.scope.SendMessageContent.toString().trim();

                this.$rootScope.$emit("toggleLoader", true);
                this.messageService.sendMessageThread(msgu).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                    if (result.data != null) {
                        var mlist = this.scope.Messages;
                        $.each(mlist, function(index) {
                            if (this.Id === result.data.Id) {
                                mlist[index] = result.data;
                            }
                        });
                        this.scope.Messages = mlist;
                        this.loadMessages(result.data.Id, false);
                    } else {
                        this.$rootScope.$emit("successnotify",
                        { msg: "Message can't send. Please try again.", status: "danger" });
                    }
                    this.scope.SendMessageContent = "";
                    this.$rootScope.$emit("toggleLoader", false);
                });
            }
        }

        //CurrentChatingMembers() {
        //    var currentObj = this;
        //    this.loginService.getUserMessagesbyId(this.$rootScope.LoggedUser.UserId).then((result: ng.IHttpPromiseCallbackArg<any>) => {
        //        if (result.data != null && result.data.length > 0) {
        //            debugger;
        //            var IsDifferentMembers = true;
        //            var oldMembers = currentObj.scope.olderChatingGroup;
        //            var newMembers = [];
        //            for (var j = 0; j < result.data.length; j++) {
        //                newMembers.push(result.data[j].AllowSendUserId);
        //            }

        //            if (oldMembers.length == newMembers.length) {
        //                var old = new Set(oldMembers);
        //                for (var p = 0; p < newMembers.length; p++) {
        //                    if (old.has(newMembers[p]))
        //                        IsDifferentMembers = false;
        //                    else {
        //                        IsDifferentMembers = true;
        //                        break;
        //                    }
        //                }

        //                currentObj.scope.isUserTypeMessage = IsDifferentMembers;
        //            }
        //            else {
        //                currentObj.scope.isUserTypeMessage = false;
        //            }
        //        }
        //    });
        //}
    }

    var options = [];


    angular.module("culamaApp")
        .controller("userMessagesController", UserMessagesController);
}