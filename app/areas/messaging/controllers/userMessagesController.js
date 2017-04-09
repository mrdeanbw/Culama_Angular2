/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var areas;
    (function (areas) {
        var messaging;
        (function (messaging) {
            var controllers;
            (function (controllers) {
                var UserMessagesController = (function () {
                    function UserMessagesController(scope, $rootScope, $sce, $filter, companyService, messageService, loginService) {
                        this.scope = scope;
                        this.$rootScope = $rootScope;
                        this.$sce = $sce;
                        this.$filter = $filter;
                        this.companyService = companyService;
                        this.messageService = messageService;
                        this.loginService = loginService;
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
                                option: function (data, escape) {
                                    return '<div class="option">' +
                                        '<span class="title">' + escape(data.FullIdentityName) + '</span>' +
                                        '</div>';
                                },
                                item: function (data, escape) {
                                    return '<div class="item participants-item"><p class="participants-label">' + escape(data.FullIdentityName) + '</p>' + '</div>';
                                }
                            }
                        };
                        this.scope.loggedUserId = this.$rootScope.LoggedUser.UserId;
                        this.scope.newMessage = new messaging.models.MessageThread();
                        var loggedUid = this.$rootScope.LoggedUser.UserId;
                        this.scope.showMessageUsers = function (m) {
                            if (m.MessageThreadUsers.length >= 3) {
                                var html = "";
                                $.each(m.MessageThreadUsers, function () {
                                    if (this.UserId != loggedUid) {
                                        html += "<li style='color: #444;'>" + this.User.FullIdentityName + "</li>";
                                    }
                                });
                                return $sce.trustAsHtml("<div> <div class='uk-button-dropdown' >You and &nbsp;<a>" + (m.MessageThreadUsers.length - 1) + " more <i style='font- size: 13px;color: #9c9c9c;' class='material-icons arrow'>&#xE313;</i></a><div class='uk-dropdown'><ul class='uk-nav uk-nav-dropdown'>" + html + "</ul></div></div></div>");
                            }
                            else {
                                return $sce.trustAsHtml("<div>You and " + m.MessageThreadUsers[1].User.FullName + "</div>");
                            }
                        };
                        this.scope.$on('onLastRepeat', function (scope1, element, attrs) {
                            if ($(element).attr("id") == "chat_div") {
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
                        });
                        var umg = this;
                        this.scope.scopeLoadMessages = function (id) {
                            umg.loadMessages(id, true);
                        };
                        this.scope.scopeSendMessage = function () {
                            umg.sendMessage();
                        };
                        this.scope.CreateMessage = function () {
                            umg.createMessage();
                        };
                    }
                    UserMessagesController.prototype.getMessageThreadByUserId = function (id, isLoadMessage) {
                        var currentObj = this;
                        currentObj.$rootScope.$emit("toggleLoader", true);
                        currentObj.messageService.getMessageThreadsByUserId(id).then(function (result) {
                            currentObj.scope.Messages = result.data;
                            if (result.data.length > 0) {
                                currentObj.scope.IsHasMessages = true;
                                if (isLoadMessage) {
                                    var CurrentUrl = window.location.href;
                                    var SplitUrl = CurrentUrl.toString().split('/');
                                    var pagename = SplitUrl[SplitUrl.length - 1];
                                    if (pagename == "user_messages" || pagename == "create_user_messages") {
                                        currentObj.loadMessages(currentObj.scope.Messages[0].Id, true);
                                    }
                                    else {
                                        var splitpagename = pagename.toString().split('?');
                                        var msgTID = splitpagename[1].toString().split('=')[1];
                                        var allThreads = result.data.slice();
                                        var activeThread = "";
                                        $.each(allThreads, function (index) {
                                            var m = this;
                                            if (m.Id == msgTID) {
                                                activeThread = m.Id;
                                            }
                                        });
                                        currentObj.loadMessages(activeThread, true);
                                    }
                                }
                            }
                            currentObj.$rootScope.$emit("toggleLoader", false);
                        });
                    };
                    UserMessagesController.prototype.getCompanyDetail = function (companyid) {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        this.companyService.getCompanyById(companyid).then(function (result) {
                            _this.scope.Customer = result.data;
                            _this.$rootScope.$emit("toggleLoader", false);
                        });
                    };
                    UserMessagesController.prototype.getCompanyUsers = function (companyid) {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        this.companyService.getUsersByCompanyId(companyid).then(function (result) {
                            var loggedUid = _this.$rootScope.LoggedUser.UserId;
                            var companyusers = result.data.slice();
                            var addedrecipients = [];
                            var IsAll = _this.scope.Customer.IsAllowMsgAllToEveryone;
                            if (IsAll == true || _this.$rootScope.LoggedUser.IsAllowMsgToEveryone == true) {
                                $.each(result.data, function (index) {
                                    if (this.UserId == loggedUid) {
                                        result.data.splice(index, 1);
                                    }
                                });
                                _this.scope.selectizeUsersOptions = result.data;
                            }
                            else {
                                var remainrecipients = [];
                                var companyRecipients = _this.scope.Customer.RecipientList;
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
                                _this.scope.selectizeUsersOptions = addedrecipients;
                            }
                            _this.$rootScope.$emit("toggleLoader", false);
                        });
                    };
                    UserMessagesController.prototype.loadMessages = function (messageId, IsRefreshAll) {
                        var currentObj = this;
                        if (IsRefreshAll) {
                            this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, false);
                            this.updateMsgThreadReadPropery(this.$rootScope.LoggedUser.UserId, messageId);
                        }
                        var msg;
                        $.each(this.scope.Messages, function () {
                            if (this.Id == messageId) {
                                msg = this;
                            }
                        });
                        this.scope.SelectedMessageThread = msg;
                        if (msg != undefined) {
                            var olderGroupMembers = [];
                            for (var i = 0; i < msg.MessageThreadUsers.length; i++) {
                                if (msg.MessageThreadUsers[i].UserId != currentObj.$rootScope.LoggedUser.UserId)
                                    olderGroupMembers.push(msg.MessageThreadUsers[i].UserId);
                            }
                            currentObj.scope.olderChatingGroup = olderGroupMembers;
                            $.each(msg.MessageThreadDetails, function () {
                                if (typeof this.CreatedOn === 'string') {
                                    this.CreatedOn = new Date(parseInt(this.CreatedOn.substr(6)));
                                }
                            });
                            var md = this.$filter('orderBy')(msg.MessageThreadDetails, 'CreatedOn');
                            var chatObjs = [];
                            var ft = this.$filter;
                            $.each(md, function () {
                                var chatobj = new messaging.models.Chat();
                                chatobj.UserId = this.UserId;
                                chatobj.Date = ft('date')(this.CreatedOn, "dd MMM HH:mm");
                                chatobj.Content = [this.TextContent];
                                chatObjs.push(chatobj);
                            });
                            this.scope.chatMessages = chatObjs;
                        }
                    };
                    UserMessagesController.prototype.createMessage = function () {
                        var currentObj = this;
                        var currentUser = new messaging.models.MessageThreadUser();
                        currentUser.UserId = this.$rootScope.LoggedUser.UserId.toString();
                        currentUser.Id = 0;
                        var users = new Array();
                        users.push(currentUser);
                        $.each(currentObj.scope.newMessageUsers, function (index) {
                            var msgu = new messaging.models.MessageThreadUser();
                            msgu.UserId = parseInt(this);
                            msgu.Id = 0;
                            users.push(msgu);
                        });
                        currentObj.scope.newMessage.MessageThreadUsers = users;
                        currentObj.scope.newMessage.CreatedUserId = currentObj.$rootScope.LoggedUser.UserId;
                        if (currentObj.scope.createMessageForm.$valid) {
                            currentObj.$rootScope.$emit("toggleLoader", true);
                            currentObj.messageService.createMessageThread(currentObj.scope.newMessage).then(function (result) {
                                if (result.data) {
                                    currentObj.$rootScope.$emit("successnotify", { msg: "Your message group is created successfully", status: "success" });
                                }
                                else {
                                    currentObj.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                                }
                                currentObj.$rootScope.$emit("toggleLoader", false);
                                window.location.href = "/#/user_messages";
                            });
                        }
                    };
                    UserMessagesController.prototype.sendMessage = function () {
                        var _this = this;
                        if (this.scope.SendMessageContent.toString().trim() != "") {
                            var msgu = new messaging.models.Message();
                            msgu.MessageId = this.scope.SelectedMessageThread.Id;
                            msgu.UserId = this.$rootScope.LoggedUser.UserId;
                            msgu.TextContent = this.scope.SendMessageContent.toString().trim();
                            this.$rootScope.$emit("toggleLoader", true);
                            this.messageService.sendMessageThread(msgu).then(function (result) {
                                if (result.data != null) {
                                    var mlist = _this.scope.Messages;
                                    $.each(mlist, function (index) {
                                        if (this.Id === result.data.Id) {
                                            mlist[index] = result.data;
                                        }
                                    });
                                    _this.scope.Messages = mlist;
                                    _this.loadMessages(result.data.Id, false);
                                }
                                else {
                                    _this.$rootScope.$emit("successnotify", { msg: "Message can't be sent. Please try again.", status: "danger" });
                                }
                                _this.scope.SendMessageContent = "";
                                _this.$rootScope.$emit("toggleLoader", false);
                            });
                        }
                    };
                    UserMessagesController.prototype.updateMsgThreadReadPropery = function (LoginuserID, MessageThreadID) {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        this.messageService.updateMsgThreadReadPropery(LoginuserID, MessageThreadID).then(function (result) {
                            var rs = result.data;
                            _this.$rootScope.$emit("toggleLoader", false);
                        });
                    };
                    return UserMessagesController;
                }());
                // loggedUid: any;
                UserMessagesController.$inject = ["$scope", "$rootScope", "$sce", "$filter", "companyService", "culamaApp.services.MessageService", "loginService"];
                var options = [];
                angular.module("culamaApp")
                    .controller("userMessagesController", UserMessagesController);
            })(controllers = messaging.controllers || (messaging.controllers = {}));
        })(messaging = areas.messaging || (areas.messaging = {}));
    })(areas = culamaApp.areas || (culamaApp.areas = {}));
})(culamaApp || (culamaApp = {}));