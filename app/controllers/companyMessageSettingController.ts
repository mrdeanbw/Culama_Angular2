/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var ascope;
var mainCobj;
module altairApp {

    class CompanyMessageSettingController {
        cservice: any;
        lservice: any;
        static $inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "commonService", "loginService"];
        constructor(public scope: any, public $rootScope: any, public companyService: altairApp.CompanyService, public $compile: any, public $timeout: any, public commonService: altairApp.CommonService, public loginService: altairApp.LoginService) {
            this.cservice = companyService;
            this.lservice = loginService;
            this.scope.CompanyUsers = [];
            this.scope.Customer = new altairApp.Customer();

            if ($rootScope.LoggedUser.UserGroupId !== 1 && $rootScope.LoggedUser.UserGroupId !== 2) {
                window.location.href = "#/error";
            }

            var cmobj = this;
            // Start Point :: Added by Mehul Patel

            this.scope.SelectedUser = "";
            this.scope.recipientUsers = "";

            this.scope.selectize_users_notAllowed_Msg = [];
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
                cmobj.getSelectedUserInfo(selecteduserid, isAllowMessage);
                if (isAllowMessage == true) {
                    var notAllowedUsers = cmobj.scope.selectize_users_notAllowed_Msg;
                    for (var t = 0; t < notAllowedUsers.length; t++) {
                        if (notAllowedUsers[t].UserId == selecteduserid) {
                            cmobj.scope.selectize_users_notAllowed_Msg.splice(t, 1);
                            break;
                        }
                    }
                }
                else {
                    var AllowedUsers = cmobj.scope.CompanyUsers;
                    for (var t = 0; t < AllowedUsers.length; t++) {
                        if (AllowedUsers[t].UserId == selecteduserid) {
                            cmobj.scope.selectize_users_notAllowed_Msg.push(AllowedUsers[t]);
                            break;
                        }
                    }
                }
            };

            this.scope.recipientAction = function (selectedrecipientid, ActionName) {
                debugger;
                if (cmobj.scope.Customer.RecipientList != null) {
                    var alreadyExistRecipients = cmobj.scope.Customer.RecipientList.toString().split(',');
                    cmobj.scope.recipients_user_ids = alreadyExistRecipients;
                }

                if (ActionName == "add") {
                    cmobj.scope.recipients_user_ids.push(selectedrecipientid);
                }
                else if (ActionName == "remove") {
                    // Remove it
                    for (var i = 0; i < cmobj.scope.recipients_user_ids.length; i++) {
                        if (cmobj.scope.recipients_user_ids[i] == selectedrecipientid)
                            cmobj.scope.recipients_user_ids.splice(i, 1);
                    }

                    for (var i = 0; i < cmobj.scope.recipients_users.length; i++) {
                        if (cmobj.scope.recipients_users[i] == selectedrecipientid)
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

                var x = cmobj.scope.recipients_user_ids;
                var xyz = cmobj.scope.recipients_users;

                //cmobj.scope.recipients_user_ids.push(selectedrecipientid);
                cmobj.scope.Customer.RecipientList = cmobj.scope.recipients_user_ids.toString();
                cmobj.saveCompany(selectedrecipientid, ActionName);
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
                            mainCobj.saveCompanyUser(targetUser);
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

                        mainCobj.saveCompanyUser(targetUser);
                    }
                },
                onInitialize: function (planets_data) {
                }
            };


            this.scope.CompanyName = $rootScope.LoggedUser.CustomerName;
            this.scope.CustomerId = this.$rootScope.LoggedUser.CustomerId;
            this.getCompanyDetail(this.scope.CustomerId);
            this.getCompanyUsers(this.scope.CustomerId);

            scope.saveCompany = function () {
                cmobj.saveCompany("", "");
            };

            scope.saveCompanyUser = function (u) {
                if (u.IsAllowMsgToEveryone) {
                    u.UserMessages = [];
                }
                cmobj.saveCompanyUser(u);
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
        }

        getCompanyDetail(companyid) {
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getCompanyById(companyid).then((result: ng.IHttpPromiseCallbackArg<altairApp.Customer>) => {
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
                this.scope.CompanyUsers = result.data;
                this.scope.selectize_allrecipient_users = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].IsAllowMsgToEveryone == false)
                        notAllowedMsg.push(result.data[i]);
                }

                if (currentObj.scope.Customer.RecipientList != null) {
                    var alreadyExistRecipients = currentObj.scope.Customer.RecipientList.toString().split(',');
                    for (var x = 0; x < currentObj.scope.selectize_allrecipient_users.length; x++) {
                        for (var m = 0; m < alreadyExistRecipients.length; m++) {
                            var aaaaa = alreadyExistRecipients[m];
                            var bbbbb = currentObj.scope.selectize_allrecipient_users[x].UserId;
                            if (alreadyExistRecipients[m] == currentObj.scope.selectize_allrecipient_users[x].UserId)
                                currentObj.scope.selectize_allrecipient_users.splice(x, 1);
                        }
                    }
                }

                this.scope.selectize_users_notAllowed_Msg = notAllowedMsg;
                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        saveCompany(RecipientID, actionname) {
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.saveCompanyDetail(this.scope.Customer).then((result: ng.IHttpPromiseCallbackArg<altairApp.Customer>) => {

                this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    this.scope.Customer = result.data;

                    var cmobj = this;
                    var ccheck = this.scope.Customer.IsAllowMsgAllToEveryone;
                    $.each(this.scope.CompanyUsers, function () {
                        var u = this;
                        if (RecipientID == "") {
                            u.IsAllowMsgToEveryone = ccheck;
                            if (u.IsAllowMsgToEveryone) {
                                u.UserMessages = [];
                            }
                            cmobj.saveCompanyUser(u);
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

                    this.$rootScope.$emit("successnotify",
                        { msg: "Your information is updated successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }

                setTimeout(function () {
                    this.$rootScope.$emit("toggleLoader", false);
                }, 500);


            });
        }

        saveCompanyUser(user) {
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.saveUserDetail(user).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
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
            this.lservice.getUserDetailsbyId(selecteduserid).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
                if (result.data != "" || result.data != null) {
                    if (isAllowMessage == true)
                        result.data.IsAllowMsgToEveryone = true;
                    else if (isAllowMessage == false)
                        result.data.IsAllowMsgToEveryone = false;

                    this.saveCompanyUser(result.data);
                }
                this.$rootScope.$emit("toggleLoader", false);
            });

        }

        getRecipients(recipientUserIDs) {
            this.$rootScope.$emit("toggleLoader", true);
            var Recipients = [];
            var splitedUsers = recipientUserIDs.toString().split(',');
            for (var i = 0; i < splitedUsers.length; i++) {
                this.lservice.getUserDetailsbyId(splitedUsers[i]).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
                    Recipients.push(result.data);
                });
            }
            this.scope.recipients_users = Recipients;
            this.$rootScope.$emit("toggleLoader", false);
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

    angular.module("altairApp")
        .controller("companyMessageSettingController", CompanyMessageSettingController);

    angular.module("altairApp")
        .filter("myFilter", altairApp.myFilter);

    angular.module("altairApp")
        .filter("customFilterForAllowMessage", altairApp.customFilterForAllowMessage);



}