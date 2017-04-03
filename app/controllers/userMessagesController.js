/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var UserMessagesController = (function () {
    function UserMessagesController(scope, $rootScope, $sce, $filter, companyService, messageService, loginService) {
        this.scope = scope;
        this.$rootScope = $rootScope;
        this.$sce = $sce;
        this.$filter = $filter;
        this.companyService = companyService;
        this.messageService = messageService;
        this.loginService = loginService;
        this.scope.Messages = [];
        this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, true);
        this.scope.IsHasMessages = false;
        this.scope.isUserCreateMessage = true;
        this.scope.isUserTypeMessage = true;
        this.scope.Customer;
        this.getCompanyDetail(this.$rootScope.LoggedUser.CustomerId);
        this.getCompanyUsers(this.$rootScope.LoggedUser.CustomerId);
        this.scope.selectize_users_options = [];
        this.scope.olderChatingGroup = [];
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
                    return '<div class="item participants-item"><input title="IsAdmin" type="checkbox" id="' + planets_data.UserId + '" onclick="setIsAdmin(' + planets_data.UserId + ');" />' + '<p class="participants-label">' + escape(planets_data.FullIdentityName) + '</p>' + '</div>';
                }
            }
        };
        this.scope.LoggedUserId = this.$rootScope.LoggedUser.UserId;
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
                return $sce.trustAsHtml("<div>You and " + m.MessageThreadUsers[1].User.FullIdentityName + "</div>");
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
    }
    UserMessagesController.prototype.getMessageThreadByUserId = function (id, isLoadMessage) {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.messageService.getMessageThreadsByUserId(id).then(function (result) {
            _this.scope.Messages = result.data;
            if (result.data.length > 0) {
                _this.scope.IsHasMessages = true;
                if (isLoadMessage) {
                    _this.loadMessages(_this.scope.Messages[0].Id, true);
                }
            }
            _this.$rootScope.$emit("toggleLoader", false);
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
    //getCompanyUsers(companyid) {
    //    this.$rootScope.$emit("toggleLoader", true);
    //    this.companyService.getUsersByCompanyId(companyid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
    //        debugger;
    //        var loggedUid = this.$rootScope.LoggedUser.UserId;
    //        var umcontoller = this;
    //        var IsAll = true;
    //        $.each(result.data, function (index) {
    //            if (this.UserId == loggedUid) {
    //                result.data.splice(index, 1);
    //                if (!this.IsAllowMsgToEveryone) {
    //                    IsAll = this.IsAllowMsgToEveryone;
    //                    //umcontoller.getUserMessages(this.UserId, result.data);
    //                }
    //            }
    //        });
    //        if (IsAll) {
    //            this.scope.selectize_users_options = result.data;
    //        }
    //        this.$rootScope.$emit("toggleLoader", false);
    //    });
    //}
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
                _this.scope.selectize_users_options = result.data;
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
                _this.scope.selectize_users_options = addedrecipients;
            }
            _this.$rootScope.$emit("toggleLoader", false);
        });
    };
    //getUserMessages(userid, userslist) {
    //    var currentObj = this;
    //    this.$rootScope.$emit("toggleLoader", true);
    //    this.loginService.getUserMessagesbyId(userid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
    //        if (result.data != null && result.data.length > 0) {          
    //            var umObjList = [];
    //            $.each(result.data, function (index) {
    //                var umobj = this;
    //                $.each(userslist, function () {
    //                    if (this.UserId == umobj.AllowSendUserId) {
    //                        umObjList.push(this);
    //                    }
    //                });
    //            });
    //            this.scope.isUserCreateMessage = true;
    //            this.scope.selectize_users_options = umObjList;
    //        }
    //        else {
    //            this.scope.isUserCreateMessage = this.$rootScope.LoggedUser.IsAllowMsgToEveryone;
    //        }
    //        var CurrentUrl = window.location.href;
    //        var SplitUrl = CurrentUrl.toString().split('/');
    //        var pagename = SplitUrl[SplitUrl.length - 1];
    //        if (pagename.toString().toLowerCase() == "create_user_messages" && this.scope.isUserCreateMessage == false) {
    //            window.location.href = "/#/user_messages";
    //        }
    //        this.$rootScope.$emit("toggleLoader", false);
    //    });
    //}
    UserMessagesController.prototype.loadMessages = function (messageId, IsRefreshAll) {
        var currentObj = this;
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
        //this.CurrentChatingMembers();
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
                var chatobj = new Object();
                chatobj.user_id = this.UserId;
                chatobj.date = ft('date')(this.CreatedOn, "dd MMM HH:mm");
                chatobj.content = [this.TextContent];
                chatObjs.push(chatobj);
            });
            this.scope.chat_messages = chatObjs;
        }
    };
    UserMessagesController.prototype.CreateMessage = function () {
        var _this = this;
        var LogidUserID = this.$rootScope.LoggedUser.UserId.toString();
        var users = [];
        this.selectize_Users.push(this.$rootScope.LoggedUser.UserId.toString());
        if (this.selectize_Users.length > 0) {
            debugger;
            var adminPermissionIDs = document.getElementById('HDFIsAdminIDs').value;
            var adminIDs = adminPermissionIDs.toString().split(',');
            var adminSet = new Set(adminIDs);
            $.each(this.selectize_Users, function (index) {
                debugger;
                var msgu = new Object();
                msgu.UserId = parseInt(this);
                msgu.MessageId = 0;
                msgu.IsActive = true;
                if (LogidUserID == parseInt(this).toString())
                    msgu.IsAdmin = true;
                else
                    msgu.IsAdmin = adminSet.has(parseInt(this).toString());
                //msgu.IsAdmin = true;
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
    UserMessagesController.prototype.sendMessage = function () {
        var _this = this;
        if (this.scope.SendMessageContent.toString().trim() != "") {
            var msgu = new Object();
            msgu.MessageId = this.scope.SelectedMessageThread.Id;
            msgu.UserId = this.$rootScope.LoggedUser.UserId;
            msgu.TextContent = this.scope.SendMessageContent.toString().trim();
            msgu.IsActive = true;
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
                    _this.$rootScope.$emit("successnotify", { msg: "Message can't sent. Please try again.", status: "danger" });
                }
                _this.scope.SendMessageContent = "";
                _this.$rootScope.$emit("toggleLoader", false);
            });
        }
    };
    // loggedUid: any;
    UserMessagesController.$inject = ["$scope", "$rootScope", "$sce", "$filter", "companyService", "messagesService", "loginService"];
    return UserMessagesController;
}());
var options = [];
// Function For the Add/Remove the Admin Permission to the Members
function setIsAdmin(UserID) {
    var AdminIDs = "";
    if (document.getElementById(UserID).checked) {
        options.push(UserID);
    }
    else {
        for (var i = 0; i < options.length; i++) {
            if (options[i] == UserID)
                options.splice(i, 1);
        }
    }
    AdminIDs = options.toString();
    // To Add the IDs in the Hidden Fields
    document.getElementById("HDFIsAdminIDs").value = AdminIDs;
}
angular.module("altairApp")
    .controller("userMessagesController", UserMessagesController);
