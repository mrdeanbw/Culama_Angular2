/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
    var CompanyUsersController = (function () {
        function CompanyUsersController(scope, $rootScope, companyService, $compile, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, commonService, loginService) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.companyService = companyService;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.$resource = $resource;
            this.DTOptionsBuilder = DTOptionsBuilder;
            this.DTColumnDefBuilder = DTColumnDefBuilder;
            this.commonService = commonService;
            this.loginService = loginService;
            this.newuser = new altairApp.UserDetail();
            this.cservice = companyService;
            this.lservice = loginService;
            this.scope.cardview = true;
            this.scope.CompnayName = $rootScope.LoggedUser.CustomerName;
            //scope.CompnayName = $rootScope.LoggedUser.CustomerName;
            this.newuser.CustomerId = this.$rootScope.LoggedUser.CustomerId;
            this.scope.IsPhoneUnique = true;
            this.scope.IsPhoneUniqueProcess = false;
            this.scope.IsUsernameUnique = true;
            this.scope.IsUsernameUniqueProcess = false;
            this.getCompanyUsers(this.$rootScope.LoggedUser.CustomerId.toString());
            this.scope.selectize_c_options = [
                {
                    "Id": "1",
                    "UserGroupName": "Admin"
                },
                {
                    "Id": "2",
                    "UserGroupName": "Customer Admin"
                },
                {
                    "Id": "3",
                    "UserGroupName": "Users"
                }
            ];
            this.newuser.UserGroupId = 1;
            this.scope.selectize_c_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'Id',
                labelField: 'UserGroupName'
            };
            this.scope.selectize_a_options = [];
            this.scope.selectize_a_config = {
                plugins: {
                    'tooltip': ''
                },
                create: true,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'Id',
                labelField: 'Description'
            };
            this.scope.selectize_b_options = [];
            this.scope.selectize_b_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'Id',
                labelField: 'Description'
            };
            this.scope.userroles = ['Compnay Admin', 'Users'];
            scope.$on('onLastRepeat', function (scope1, element, attrs) {
                scope.$apply(function () {
                    UIkit.grid($('#contact_list'), {
                        controls: '#contact_list_filter',
                        gutter: 20
                    });
                });
            });
            scope.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDisplayLength(10)
                .withOption('initComplete', function () {
                $timeout(function () {
                    $compile($('.dt-uikit .md-input'))(scope);
                });
            });
            scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5)
            ];
            var $formValidate = $('#createUserForm');
            if ($formValidate.length != 0) {
                $formValidate.parsley()
                    .on('form:validated', function () {
                    scope.$apply();
                })
                    .on('field:validated', function (parsleyField) {
                    if ($(parsleyField.$element).hasClass('md-input')) {
                        scope.$apply();
                    }
                });
            }
            this.getLanguages();
            scope.changeView = function (view) {
                if (view != "card") {
                    scope.cardview = false;
                }
                else {
                    scope.cardview = true;
                }
            };
        }
        CompanyUsersController.prototype.getLanguages = function () {
            var _this = this;
            this.commonService.getLanguages().then(function (result) {
                _this.scope.selectize_a_options = result.data;
                _this.scope.selectize_b_options = result.data;
            });
        };
        CompanyUsersController.prototype.getCompanyUsers = function (companyid) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getUsersByCompanyId(companyid).then(function (result) {
                _this.scope.contact_list = result.data;
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        CompanyUsersController.prototype.CreateUser = function () {
            var _this = this;
            if (this.scope.IsPhoneUnique && this.scope.IsUsernameUnique && createUserForm.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.cservice.createUser(this.newuser).then(function (result) {
                    if (result.data) {
                        _this.$rootScope.$emit("successnotify", { msg: "Your user is created successfully", status: "success" });
                    }
                    else {
                        _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                    _this.$rootScope.$emit("toggleLoader", false);
                    _this.newuser = new altairApp.UserDetail();
                    window.location.href = "/#/companyusers";
                });
            }
        };
        CompanyUsersController.prototype.checkPhoneUnique = function () {
            var _this = this;
            this.scope.IsPhoneUniqueProcess = true;
            this.lservice.getUserDetailsbyPhone(this.newuser.Phone).then(function (result) {
                _this.scope.IsPhoneUniqueProcess = false;
                if (result.data != "") {
                    _this.scope.IsPhoneUnique = false;
                    document.getElementById("user_input_phoneno").valid = false;
                }
                else {
                    _this.scope.IsPhoneUnique = true;
                    document.getElementById("user_input_phoneno").valid = true;
                }
            });
        };
        CompanyUsersController.prototype.checkUserNameUnique = function () {
            var _this = this;
            this.scope.IsUsernameUniqueProcess = true;
            this.lservice.getUserDetailsbyUsername(this.newuser.UserName).then(function (result) {
                _this.scope.IsUsernameUniqueProcess = false;
                if (result.data != "") {
                    _this.scope.IsUsernameUnique = false;
                    document.getElementById("user_input_username").valid = false;
                }
                else {
                    _this.scope.IsUsernameUnique = true;
                    document.getElementById("user_input_username").valid = true;
                }
            });
        };
        return CompanyUsersController;
    }());
    CompanyUsersController.$inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "loginService"];
    angular.module("altairApp")
        .controller("companyUsersController", CompanyUsersController);
})(altairApp || (altairApp = {}));
