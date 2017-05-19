/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var ascope;
var mainCobj;
module culamaApp {

    class CompanyMessageSettingController {
        cservice: any;
        lservice: any;
        static $inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "commonService", "loginService"];
        constructor(public scope: any, public $rootScope: any, public companyService: culamaApp.CompanyService, public $compile: any, public $timeout: any, public commonService: culamaApp.CommonService, public loginService: culamaApp.LoginService) {
            this.cservice = companyService;
            this.lservice = loginService;
            this.scope.CompanyUsers = [];
            this.scope.Customer = new culamaApp.Customer();
            if ($rootScope.LoggedUser.UserGroupId !== 1 && $rootScope.LoggedUser.UserGroupId !== 2) {
                window.location.href = "#/error";
            }

            var cmobj = this;
            // Start Point 

            this.scope.SelectedUser = "";
            this.scope.recipientUsers = "";

            this.scope.selectize_users_notAllowed_Msg = [];

            this.scope.allowedUsers = [];

            this.scope.selectize_allrecipient_users = [];
            this.scope.recipients_users = [];
            this.scope.recipients_user_ids = [];

            this.scope.selectize_all_users_config = {
                plugins: {
                    'tooltip': ''
                },
                create: true,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'UserId',
                labelField: 'FullIdentityName'
            };


            this.scope.addUser = function (selecteduserid, isAllowMessage) {
                //cmobj.getSelectedUserInfo(selecteduserid, isAllowMessage);
                if (isAllowMessage == true) {
                    var notAllowedUsers = cmobj.scope.selectize_users_notAllowed_Msg;
                    for (var t = 0; t < notAllowedUsers.length; t++) {
                        if (notAllowedUsers[t].UserId == selecteduserid) {
                            cmobj.scope.allowedUsers.push(notAllowedUsers[t]);
                            cmobj.scope.selectize_users_notAllowed_Msg.splice(t, 1);                            
                            break;
                        }
                    }
                }
                else {
                    var AllowedUsers = cmobj.scope.allowedUsers;
                    for (var t = 0; t < AllowedUsers.length; t++) {
                        if (AllowedUsers[t].UserId == selecteduserid) {
                            cmobj.scope.selectize_users_notAllowed_Msg.push(AllowedUsers[t]);
                            cmobj.scope.allowedUsers.splice(t, 1);
                            break;
                        }
                    }
                }

                //cmobj.scope.allowedUsers = newaddedMember;
            };

            this.scope.recipientAction = function (selectedrecipientid, ActionName) {
                if (cmobj.scope.Customer.RecipientList != null) {
                    var alreadyExistRecipients = cmobj.scope.Customer.RecipientList.toString().split(',');
                    cmobj.scope.recipients_user_ids = alreadyExistRecipients;
                }

                if (ActionName == "add") {
                    cmobj.scope.recipients_user_ids.push(selectedrecipientid);
                    
                    var AllUsers = cmobj.scope.selectize_allrecipient_users;
                    for (var t = 0; t < AllUsers.length; t++) {
                        if (AllUsers[t].UserId == selectedrecipientid) {
                            cmobj.scope.recipients_users.push(AllUsers[t]);
                            cmobj.scope.selectize_allrecipient_users.splice(t, 1);
                            break;
                        }
                    }
                }
                else if (ActionName == "remove") {
                    // Remove it
                    for (var i = 0; i < cmobj.scope.recipients_user_ids.length; i++) {
                        if (cmobj.scope.recipients_user_ids[i] == selectedrecipientid)
                            cmobj.scope.recipients_user_ids.splice(i, 1);
                    }

                    for (var i = 0; i < cmobj.scope.recipients_users.length; i++) {
                        if (cmobj.scope.recipients_users[i].UserId == selectedrecipientid)
                            cmobj.scope.recipients_users.splice(i, 1);
                    }

                    // Push it
                    var AllUsers = cmobj.scope.CompanyUsers;
                    for (var t = 0; t < AllUsers.length; t++) {
                        if (AllUsers[t].UserId == selectedrecipientid) {
                            cmobj.scope.selectize_allrecipient_users.push(AllUsers[t]);
                            break;
                        }
                    }
                }
                //cmobj.scope.recipients_user_ids.push(selectedrecipientid);
                cmobj.scope.Customer.RecipientList = cmobj.scope.recipients_user_ids.toString();
                if (cmobj.scope.Customer.RecipientList == "")
                    cmobj.scope.Customer.RecipientList = null;


                //cmobj.saveCompany(selectedrecipientid, ActionName);
            };

            // End Point



            this.scope.selectize_users_options = [];
            //var cmobj = this;
            mainCobj = this;
            ascope = this.scope;
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
                create: true,
                placeholder: "Choose Users to send messages",
                render: {
                    option: function (planets_data, escape) {
                        return '<div class="option">' +
                            '<span class="title">' + escape(planets_data.FullIdentityName) + '</span>' +
                            '</div>';
                    },
                    item: function (planets_data, escape) {
                        return '<div class="item">' + escape(planets_data.FullIdentityName) + '</div>';
                    }
                },
                onItemAdd: function (input) {
                    var targetUserid = this.$input.attr("target");
                    var targetUser;
                    if (!isNaN(targetUserid)) {
                        $.each(ascope.CompanyUsers, function (index) {
                            if (this.UserId == parseInt(targetUserid)) {
                                targetUser = ascope.CompanyUsers[index];
                            }
                        });
                        var userMsgs = targetUser.UserMessages;
                        var isExsits = false;
                        $.each(userMsgs, function () {
                            if (this.AllowSendUserId == parseInt(input)) {
                                isExsits = true;
                            }
                        });
                        if (!isExsits) {
                            var msgu = new Object();
                            msgu.UserId = parseInt(targetUserid);
                            msgu.AllowSendUserId = parseInt(input);
                            targetUser.UserMessages.push(msgu);
                            mainCobj.saveCompanyUser(targetUser, false);
                        }
                    }


                },
                onItemRemove: function (input) {
                    var targetUserid = this.$input.attr("target");
                    var targetUser;
                    if (!isNaN(targetUserid)) {
                        $.each(ascope.CompanyUsers, function (index) {
                            if (this.UserId == parseInt(targetUserid)) {
                                targetUser = ascope.CompanyUsers[index];
                            }
                        });

                        var userMsgs = targetUser.UserMessages;
                        $.each(userMsgs, function (index) {
                            if (this.AllowSendUserId == parseInt(input)) {
                                userMsgs.splice(index, 1);
                            }
                        });

                        mainCobj.saveCompanyUser(targetUser, false);
                    }
                },
                onInitialize: function (planets_data) {
                }
            };


            this.scope.CompanyName = $rootScope.LoggedUser.CustomerName;
            this.scope.CustomerId = this.$rootScope.LoggedUser.CustomerId;
            this.getCompanyDetail(this.scope.CustomerId);
            this.getCompanyUsers(this.scope.CustomerId);

            scope.allowEveryonetoMessage = function () {
                var ccheck = cmobj.scope.Customer.IsAllowMsgAllToEveryone;
                if (ccheck == true) {
                    cmobj.scope.Customer.RecipientList = null;
                }
                else {
                    cmobj.scope.selectize_users_notAllowed_Msg = cmobj.scope.CompanyUsers;
                    cmobj.scope.allowedUsers = [];
                }
                //cmobj.saveCompany("", "");
            };

            scope.saveCompanyUser = function (u) {
                if (u.IsAllowMsgToEveryone) {
                    u.UserMessages = [];
                }
                cmobj.saveCompanyUser(u, false);
            };

            scope.getOtherCompanyUsers = function (um) {
                var selectize_userlist = [];
                $.each(ascope.CompanyUsers, function () {
                    if (this.UserId != um.UserId) {
                        selectize_userlist.push(this);
                    }
                });
                return selectize_userlist;
            };

            scope.saveCompanyMsgSetting = function (isAllowMsgAllToEveryone) {
                if (isAllowMsgAllToEveryone == true)
                    cmobj.UpdateUserInformation(isAllowMsgAllToEveryone, "");
                else {
                    var allowedUserList = cmobj.scope.allowedUsers;
                    cmobj.UpdateUserInformation(isAllowMsgAllToEveryone, allowedUserList);
                }
            };

            scope.cancelRequest = function () {
                location.reload();
            }
        }

        getCompanyDetail(companyid) {
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getCompanyById(companyid).then((result: ng.IHttpPromiseCallbackArg<culamaApp.Customer>) => {
                this.scope.Customer = result.data;

                if (result.data.RecipientList != null)
                    this.getRecipients(result.data.RecipientList);

                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        getCompanyUsers(companyid) {

            var currentObj = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getUsersByCompanyId(companyid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                var notAllowedMsg = [];
                var allowedmsg = [];

                this.scope.CompanyUsers = result.data;

                this.scope.allowedUsers = result.data.slice();

                this.scope.selectize_allrecipient_users = result.data.slice();
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].IsAllowMsgToEveryone == false)
                        notAllowedMsg.push(result.data[i]);
                    else
                        allowedmsg.push(result.data[i]);
                }
                if (this.scope.Customer.RecipientList != null) {
                    var alreadyExistRecipients = this.scope.Customer.RecipientList.toString().split(',');
                    for (var x = 0; x < currentObj.scope.selectize_allrecipient_users.length; x++) {
                        for (var m = 0; m < alreadyExistRecipients.length; m++) {
                            if (alreadyExistRecipients[m] == currentObj.scope.selectize_allrecipient_users[x].UserId)
                                currentObj.scope.selectize_allrecipient_users.splice(x, 1);
                        }
                    }
                }

                this.scope.selectize_users_notAllowed_Msg = notAllowedMsg;

                this.scope.allowedUsers = allowedmsg;

                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        saveCompany(RecipientID, actionname) {
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.saveCompanyDetail(this.scope.Customer).then((result: ng.IHttpPromiseCallbackArg<culamaApp.Customer>) => {
                this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    this.scope.Customer = result.data;
                    var cmobj = this;
                    var ccheck = this.scope.Customer.IsAllowMsgAllToEveryone;
                    var allcompanyusers = [];

                    $.each(this.scope.CompanyUsers, function () {                    
                        var u = this;
                        allcompanyusers.push(u);
                        if (RecipientID == "") {
                            u.IsAllowMsgToEveryone = ccheck;
                            if (u.IsAllowMsgToEveryone) {
                                u.UserMessages = [];
                            }
                            cmobj.saveCompanyUser(u, true);
                        }
                        else {
                            if (actionname == "add") {
                                if (u.UserId == RecipientID) {
                                    cmobj.scope.recipients_users.push(u);

                                    var AllUsers = cmobj.scope.selectize_allrecipient_users;
                                    for (var t = 0; t < AllUsers.length; t++) {
                                        if (AllUsers[t].UserId == RecipientID) {
                                            cmobj.scope.selectize_allrecipient_users.splice(t, 1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });

                    if (ccheck == true) {
                        this.scope.selectize_allrecipient_users = allcompanyusers;
                        cmobj.scope.recipients_users = [];
                    }

                    if (ccheck == false) {
                        this.scope.selectize_users_notAllowed_Msg = allcompanyusers;
                    }

                    this.$rootScope.$emit("successnotify",
                        { msg: "Your information is updated successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }

                var curobject = this;
                setTimeout(function () {
                    curobject.$rootScope.$emit("toggleLoader", false);
                }, 500);


            });
        }

        saveCompanyUser(user, isupdateallusers) {
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.saveUserDetail(user).then((result: ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>) => {
                this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    var tCusers = this.scope.CompanyUsers;
                    $.each(tCusers, function (index) {
                        var u = this;
                        if (u.UserId == user.UserId) {
                            tCusers[index] = result.data;
                        }
                    })
                    this.scope.CompanyUsers = tCusers;

                    if (isupdateallusers == false)
                        this.$rootScope.$emit("successnotify",
                            { msg: "Your information is updated successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        getSelectedUserInfo(selecteduserid, isAllowMessage) {
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.getUserDetailsbyId(selecteduserid).then((result: ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>) => {
                if (result.data != "" || result.data != null) {
                    if (isAllowMessage == true)
                        result.data.IsAllowMsgToEveryone = true;
                    else if (isAllowMessage == false)
                        result.data.IsAllowMsgToEveryone = false;

                    //this.saveCompanyUser(result.data, false);
                }
                this.$rootScope.$emit("toggleLoader", false);
            });

        }

        getRecipients(recipientUserIDs) {
            this.$rootScope.$emit("toggleLoader", true);
            var Recipients = [];
            var splitedUsers = recipientUserIDs.toString().split(',');
            for (var i = 0; i < splitedUsers.length; i++) {
                this.lservice.getUserDetailsbyId(splitedUsers[i]).then((result: ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>) => {
                    Recipients.push(result.data);
                });
            }
            this.scope.recipients_users = Recipients;
            this.$rootScope.$emit("toggleLoader", false);
        }

        UpdateUserInformation(isAllowMsgAllToEveryone, allowedUserList) {
            this.$rootScope.$emit("toggleLoader", true);            
            var userupdatedinfo = [];

            $.each(this.scope.Customer.Users, function () {
                var x = this;
                var allowmsg = false;
                if (isAllowMsgAllToEveryone == false) {
                    for (var i = 0; i < allowedUserList.length; i++) {
                        if (x.UserId == allowedUserList[i].UserId) {
                            allowmsg = true;
                            break;
                        }
                    }
                }
                else {
                    allowmsg = true;
                }
                x.IsAllowMsgToEveryone = allowmsg;
                userupdatedinfo.push(x)
            });

            this.scope.Customer.IsAllowMsgAllToEveryone = isAllowMsgAllToEveryone;
            this.scope.Customer.Users = userupdatedinfo;

            this.cservice.saveCompanyDetail(this.scope.Customer).then((result: ng.IHttpPromiseCallbackArg<culamaApp.Customer>) => {
                if (result.data != "") {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Your information is updated successfully", status: "success" });
                }
                else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                this.$rootScope.$emit("toggleLoader", false);
            });

        }

    }

    export function myFilter() {
        return function (um) {
            //  filter stuff here
            var selectize_userlist = [];
            if (um.length > 0) {
                $.each(um, function () {
                    selectize_userlist.push(this.AllowSendUserId.toString());
                });
            }
            return selectize_userlist;

        };
    }

    export function customFilterForAllowMessage() {
        return function (user) {
            var filtered = [];
            for (var i = 0; i < user.length; i++) {
                if (user[i].IsAllowMsgToEveryone == true)
                    filtered.push(user[i]);
            }
            return filtered;
        };
    }

    angular.module("culamaApp")
        .controller("companyMessageSettingController", CompanyMessageSettingController);

    angular.module("culamaApp")
        .filter("myFilter", culamaApp.myFilter);

    angular.module("culamaApp")
        .filter("customFilterForAllowMessage", culamaApp.customFilterForAllowMessage);



}