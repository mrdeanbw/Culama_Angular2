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
            this.scope.selectize_users_options = [];
            var cmobj = this;
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
            debugger;
            this.getCompanyDetail(this.scope.CustomerId);
            this.getCompanyUsers(this.scope.CustomerId);
            scope.saveCompany = function () {
                cmobj.saveCompany();
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
            debugger;
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getCompanyById(companyid).then(function (result) {
                _this.scope.Customer = result.data;
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        CompanyMessageSettingController.prototype.getCompanyUsers = function (companyid) {
            var _this = this;
            debugger;
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getUsersByCompanyId(companyid).then(function (result) {
                _this.scope.CompanyUsers = result.data;
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        CompanyMessageSettingController.prototype.saveCompany = function () {
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
                        u.IsAllowMsgToEveryone = ccheck;
                        if (u.IsAllowMsgToEveryone) {
                            u.UserMessages = [];
                        }
                        cmobj.saveCompanyUser(u);
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
                    $.each(_this.scope.CompanyUsers, function (index) {
                        var u = this;
                        if (u.UserId == user.UserId) {
                            u = result.data;
                        }
                    });
                    _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        return CompanyMessageSettingController;
    }());
    CompanyMessageSettingController.$inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "commonService", "loginService"];
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
    angular.module("altairApp")
        .controller("companyMessageSettingController", CompanyMessageSettingController);
    angular.module("altairApp")
        .filter("myFilter", altairApp.myFilter);
})(altairApp || (altairApp = {}));
