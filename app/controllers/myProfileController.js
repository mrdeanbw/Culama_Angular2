/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
    var MyProfileController = (function () {
        function MyProfileController(scope, $rootScope, loginService, commonService) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.loginService = loginService;
            this.commonService = commonService;
            this.userDetail = new altairApp.UserDetail();
            scope.vm = this;
            scope.vm.selectize_a_options = [];
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
            this.lservice.getUserDetailsbyId(id.toString()).then(function (result) {
                _this.userDetail = result.data;
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
        return MyProfileController;
    }());
    MyProfileController.$inject = ["$scope", "$rootScope", "loginService", "commonService"];
    angular.module("altairApp")
        .controller("myProfileController", MyProfileController);
})(altairApp || (altairApp = {}));
