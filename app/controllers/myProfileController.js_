/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var MyProfileController = (function () {
        function MyProfileController(scope, $rootScope, $filter, loginService, commonService) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.$filter = $filter;
            this.loginService = loginService;
            this.commonService = commonService;
            this.userDetail = new culamaApp.UserDetail();
            this.userAccount = new culamaApp.LoginUser();
            scope.vm = this;
            scope.vm.title = "";
            scope.vm.newpassword = "";
            scope.vm.confirmpassword = "";
            scope.vm.IsPasswordMatch = true;
            scope.vm.title = "";
            scope.vm.selectize_a_options = [];
            scope.vm.CurrentLanguage = $rootScope.CurrentLocaleLanguage;
            scope.vm.IsPhoneUnique = true;
            scope.vm.IsPhoneUniqueProcess = false;
            scope.vm.selectize_a_config = {
                plugins: {
                    'tooltip': ''
                },
                create: true,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'Id',
                labelField: 'Description'
            };
            scope.vm.selectize_b_options = [];
            scope.vm.selectize_b_config = {
                plugins: {
                    'tooltip': ''
                },
                create: true,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'Id',
                labelField: 'Description'
            };
            var $formValidate = $('#form_validation');
            $formValidate.parsley()
                .on('form:validated', function () {
                scope.$apply();
            })
                .on('field:validated', function (parsleyField) {
                if ($(parsleyField.$element).hasClass('md-input')) {
                    scope.$apply();
                }
            });
            this.lservice = loginService;
            this.cservice = commonService;
            this.getLanguages();
            this.getUser(this.$rootScope.LoggedUser.UserId);
        }
        MyProfileController.prototype.getUser = function (id) {
            var _this = this;
            var ft = this.$filter;
            this.lservice.getUserDetailsbyId(id.toString()).then(function (result) {
                debugger;
                var x = result.data;
                if (typeof result.data.PhoneActivatedOn === 'string' || typeof result.data.LastActivationAttempt === 'string') {
                    var activationon = new Date(parseInt(result.data.PhoneActivatedOn.substr(6)));
                    var lastactivation = new Date(parseInt(result.data.LastActivationAttempt.substr(6)));
                    _this.scope.vm.PhoneActivatedOn = ft('date')(activationon, "MMM dd yyyy HH:mm");
                    _this.scope.vm.LastActivationAttempt = ft('date')(lastactivation, "MMM dd yyyy HH:mm");
                }
                _this.userDetail = result.data;
                var CurrentScope = _this.scope.vm;
                if (_this.userDetail != undefined) {
                    if (_this.userDetail.TitleTranslation != undefined) {
                        _this.scope.vm.title = _this.userDetail.TitleTranslation.DefaultValue;
                        _this.scope.vm.IsPhoneActivated = _this.userDetail.IsPhoneActivated;
                        var Entries = _this.userDetail.TitleTranslation.Entries;
                        if (Entries.length > 0) {
                            $.each(Entries, function (index) {
                                if (this.Language.LookupCode === CurrentScope.CurrentLanguage) {
                                    CurrentScope.title = this.Value;
                                }
                            });
                        }
                    }
                }
            });
        };
        MyProfileController.prototype.getLanguages = function () {
            var _this = this;
            this.cservice.getLanguages().then(function (result) {
                _this.scope.vm.selectize_a_options = result.data;
                _this.scope.vm.selectize_b_options = result.data;
            });
        };
        MyProfileController.prototype.checkPhoneUnique = function () {
            var _this = this;
            var $formValidate = $('#form_validation');
            this.scope.vm.IsPhoneUniqueProcess = true;
            this.lservice.getUserDetailsbyPhone(this.userDetail.Phone).then(function (result) {
                _this.scope.vm.IsPhoneUniqueProcess = false;
                if (result.data != "") {
                    if (result.data.UserId !== _this.userDetail.UserId) {
                        _this.scope.vm.IsPhoneUnique = false;
                        document.getElementById("login_phoneno").valid = false;
                    }
                    else {
                        _this.scope.vm.IsPhoneUnique = true;
                        document.getElementById("login_phoneno").valid = true;
                    }
                }
                else {
                    _this.scope.vm.IsPhoneUnique = true;
                    document.getElementById("login_phoneno").valid = true;
                }
            });
        };
        MyProfileController.prototype.checkPasswordMatch = function () {
            this.scope.vm.IsPasswordMatch = (this.scope.vm.newpassword == this.scope.vm.confirmpassword);
        };
        MyProfileController.prototype.saveInfo = function () {
            var _this = this;
            if (this.scope.vm.IsPhoneUnique && form_validation.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.lservice.saveUserDetail(this.userDetail).then(function (result) {
                    if (result.data != "") {
                        _this.userDetail = result.data;
                        _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                    }
                    else {
                        _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                    _this.$rootScope.$emit("toggleLoader", false);
                });
            }
        };
        MyProfileController.prototype.saveAccountInfo = function () {
            var _this = this;
            if (this.scope.vm.IsPasswordMatch && form_validation.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.userAccount.username = this.scope.vm.userDetail.UserName;
                this.userAccount.password = this.scope.vm.newpassword;
                this.lservice.changePassword(this.userAccount).then(function (result) {
                    _this.$rootScope.$emit("toggleLoader", false);
                    if (result.data) {
                        _this.$rootScope.$emit("logout", {});
                    }
                    else {
                        _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                });
            }
        };
        return MyProfileController;
    }());
    MyProfileController.$inject = ["$scope", "$rootScope", "$filter", "loginService", "commonService"];
    angular.module("culamaApp")
        .controller("myProfileController", MyProfileController);
})(culamaApp || (culamaApp = {}));
