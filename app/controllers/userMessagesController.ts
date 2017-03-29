/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
class UserMessagesController {
    // loggedUid: any;
    static $inject = ["$scope", "$rootScope", "$sce", "$filter", "companyService", "messagesService", "loginService"];
    constructor(public scope: any, public $rootScope: any, public $sce: any, public $filter: any, public companyService: altairApp.CompanyService, public messageService: altairApp.MessagesService, public loginService: altairApp.LoginService) {
        this.scope.Messages = [];
        this.getMessageThreadByUserId(this.$rootScope.LoggedUser.UserId, true);
        this.scope.IsHasMessages = false;
        this.scope.isUserCreateMessage = true;

        this.scope.isUserTypeMessage = true;

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
                    return '<div class="item participants-item"><input title="IsAdmin" type="checkbox" id="' + planets_data.UserId + '" onclick="setIsAdmin(' + planets_data.UserId + ');" />' + '<p class="participants-label">' +escape(planets_data.FullIdentityName) + '</p>' + '</div>';
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
                        html += "<li style='color: #444;'>" + this.User.FullIdentityName + "</li>"
                    }
                });
                return $sce.trustAsHtml("<div> <div class='uk-button-dropdown' >You and &nbsp;<a>" + (m.MessageThreadUsers.length - 1) + " more <i style='font- size: 13px;color: #9c9c9c;' class='material-icons arrow'>&#xE313;</i></a><div class='uk-dropdown'><ul class='uk-nav uk-nav-dropdown'>" + html + "</ul></div></div></div>");
            } else {
                return $sce.trustAsHtml("<div>You and " + m.MessageThreadUsers[1].User.FullIdentityName + "</div>");
            }
        }

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

        })
        var umg = this;
        this.scope.scopeLoadMessages = function (id) {
            umg.loadMessages(id, true);
        }

        this.scope.scopeSendMessage = function () {
            umg.sendMessage();
        }
        
        //this.scope.addButton = function () {
        //    alert("hi..");
        //}
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
            var umcontoller = this;
            var IsAll = true;
            $.each(result.data, function (index) {
                if (this.UserId == loggedUid) {
                    result.data.splice(index, 1);
                    if (!this.IsAllowMsgToEveryone) {
                        IsAll = this.IsAllowMsgToEveryone;
                        umcontoller.getUserMessages(this.UserId, result.data);
                    }
                }
            });
            if (IsAll) {
                this.scope.selectize_users_options = result.data;
            }
            this.$rootScope.$emit("toggleLoader", false);
        });
    }

    getUserMessages(userid, userslist) {
        var currentObj = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.loginService.getUserMessagesbyId(userid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
            if (result.data != null && result.data.length > 0) {          
                var umObjList = [];
                $.each(result.data, function (index) {
                    var umobj = this;
                    $.each(userslist, function () {
                        if (this.UserId == umobj.AllowSendUserId) {
                            umObjList.push(this);
                        }
                    });
                });
                this.scope.isUserCreateMessage = true;
                this.scope.selectize_users_options = umObjList;
            }
            else {
                this.scope.isUserCreateMessage = this.$rootScope.LoggedUser.IsAllowMsgToEveryone;
            }

            var CurrentUrl = window.location.href;
            var SplitUrl = CurrentUrl.toString().split('/');
            var pagename = SplitUrl[SplitUrl.length - 1];

            if (pagename.toString().toLowerCase() == "create_user_messages" && this.scope.isUserCreateMessage == false) {
                window.location.href = "/#/user_messages";
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
        $.each(this.scope.Messages, function () {
            if (this.Id == messageId) {
                msg = this;
            }
        });

        this.scope.SelectedMessageThread = msg;       

        this.CurrentChatingMembers();

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


    }

    CreateMessage() {
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

    CurrentChatingMembers() {
        var currentObj = this;
        this.loginService.getUserMessagesbyId(this.$rootScope.LoggedUser.UserId).then((result: ng.IHttpPromiseCallbackArg<any>) => {
            if (result.data != null && result.data.length > 0) {
                debugger;
                var IsDifferentMembers = true;
                var oldMembers = currentObj.scope.olderChatingGroup;
                var newMembers = [];
                for (var j = 0; j < result.data.length; j++) {
                    newMembers.push(result.data[j].AllowSendUserId);
                }

                if (oldMembers.length == newMembers.length) {
                    var old = new Set(oldMembers);
                    for (var p = 0; p < newMembers.length; p++) {
                        if (old.has(newMembers[p]))
                            IsDifferentMembers = false;
                        else {
                            IsDifferentMembers = true;
                            break;
                        }
                    }

                    currentObj.scope.isUserTypeMessage = IsDifferentMembers;
                }
                else {
                    currentObj.scope.isUserTypeMessage = false;
                }
            }
        });
    }
}

var options = [];

// Function For the Add/Remove the Admin Permission to the Members
function setIsAdmin(UserID) {
    var AdminIDs = "";
    if (document.getElementById(UserID).checked) {
        options.push(UserID);
    } else {
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