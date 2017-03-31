/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var ascope;
var mainCobj;
var altairApp;
(function (altairApp) {
    var CompanyMessageSettingController = (function () {
        function CompanyMessageSettingController(scope, $rootScope, companyService, $compile, $timeout, commonService, loginService) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.companyService = companyService;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.commonService = commonService;
            this.loginService = loginService;
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
        CompanyMessageSettingController.prototype.getCompanyDetail = function (companyid) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getCompanyById(companyid).then(function (result) {
                _this.scope.Customer = result.data;
                if (result.data.RecipientList != null)
                    _this.getRecipients(result.data.RecipientList);
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        CompanyMessageSettingController.prototype.getCompanyUsers = function (companyid) {
            var _this = this;
            var currentObj = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getUsersByCompanyId(companyid).then(function (result) {
                var notAllowedMsg = [];
                _this.scope.CompanyUsers = result.data;
                _this.scope.selectize_allrecipient_users = result.data;
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
                _this.scope.selectize_users_notAllowed_Msg = notAllowedMsg;
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        CompanyMessageSettingController.prototype.saveCompany = function (RecipientID, actionname) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.saveCompanyDetail(this.scope.Customer).then(function (result) {
                _this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    _this.scope.Customer = result.data;
                    var cmobj = _this;
                    var ccheck = _this.scope.Customer.IsAllowMsgAllToEveryone;
                    $.each(_this.scope.CompanyUsers, function () {
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
                    _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                setTimeout(function () {
                    this.$rootScope.$emit("toggleLoader", false);
                }, 500);
            });
        };
        CompanyMessageSettingController.prototype.saveCompanyUser = function (user) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.saveUserDetail(user).then(function (result) {
                _this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    var tCusers = _this.scope.CompanyUsers;
                    $.each(tCusers, function (index) {
                        var u = this;
                        if (u.UserId == user.UserId) {
                            tCusers[index] = result.data;
                        }
                    });
                    _this.scope.CompanyUsers = tCusers;
                    _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        CompanyMessageSettingController.prototype.getSelectedUserInfo = function (selecteduserid, isAllowMessage) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.getUserDetailsbyId(selecteduserid).then(function (result) {
                if (result.data != "" || result.data != null) {
                    if (isAllowMessage == true)
                        result.data.IsAllowMsgToEveryone = true;
                    else if (isAllowMessage == false)
                        result.data.IsAllowMsgToEveryone = false;
                    _this.saveCompanyUser(result.data);
                }
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        CompanyMessageSettingController.prototype.getRecipients = function (recipientUserIDs) {
            this.$rootScope.$emit("toggleLoader", true);
            var Recipients = [];
            var splitedUsers = recipientUserIDs.toString().split(',');
            for (var i = 0; i < splitedUsers.length; i++) {
                this.lservice.getUserDetailsbyId(splitedUsers[i]).then(function (result) {
                    Recipients.push(result.data);
                });
            }
            this.scope.recipients_users = Recipients;
            this.$rootScope.$emit("toggleLoader", false);
        };
        CompanyMessageSettingController.$inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "commonService", "loginService"];
        return CompanyMessageSettingController;
    }());
    function myFilter() {
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
    altairApp.myFilter = myFilter;
    function customFilterForAllowMessage() {
        return function (user) {
            var filtered = [];
            for (var i = 0; i < user.length; i++) {
                if (user[i].IsAllowMsgToEveryone == true)
                    filtered.push(user[i]);
            }
            return filtered;
        };
    }
    altairApp.customFilterForAllowMessage = customFilterForAllowMessage;
    angular.module("altairApp")
        .controller("companyMessageSettingController", CompanyMessageSettingController);
    angular.module("altairApp")
        .filter("myFilter", altairApp.myFilter);
    angular.module("altairApp")
        .filter("customFilterForAllowMessage", altairApp.customFilterForAllowMessage);
})(altairApp || (altairApp = {}));
