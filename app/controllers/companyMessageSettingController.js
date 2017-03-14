/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
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
            this.scope.CompnayName = $rootScope.LoggedUser.CustomerName;
            this.scope.CustomerId = this.$rootScope.LoggedUser.CustomerId;
            this.getCompanyDetail(this.scope.CustomerId);
            this.getCompanyUsers(this.scope.CustomerId);
            var cmobj = this;
            scope.saveCompany = function () {
                cmobj.saveCompany();
            };
            scope.saveCompanyUser = function (u) {
                cmobj.saveCompanyUser(u);
            };
        }
        CompanyMessageSettingController.prototype.getCompanyDetail = function (companyid) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getCompanyById(companyid).then(function (result) {
                _this.scope.Customer = result.data;
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        CompanyMessageSettingController.prototype.getCompanyUsers = function (companyid) {
            var _this = this;
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
                        cmobj.saveCompanyUser(u);
                    });
                    _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
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
            });
        };
        return CompanyMessageSettingController;
    }());
    CompanyMessageSettingController.$inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "commonService", "loginService"];
    angular.module("altairApp")
        .controller("companyMessageSettingController", CompanyMessageSettingController);
})(altairApp || (altairApp = {}));
