/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var ManageUsersController = (function () {
    function ManageUsersController(scope, $rootScope, $compile, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, commonService, companyService, loginService) {
        this.scope = scope;
        this.$rootScope = $rootScope;
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$resource = $resource;
        this.DTOptionsBuilder = DTOptionsBuilder;
        this.DTColumnDefBuilder = DTColumnDefBuilder;
        this.commonService = commonService;
        this.companyService = companyService;
        this.loginService = loginService;
        this.newuser = new altairApp.UserDetail();
        if ($rootScope.LoggedUser.UserGroupId !== 1) {
            window.location.href = "#/error";
        }
        scope.vm = this;
        scope.vm.dt_data = [];
        scope.vm.CompnayName = $rootScope.LoggedUser.CustomerName;
        this.newuser.CustomerId = this.$rootScope.LoggedUser.CustomerId;
        scope.vm.IsPhoneUnique = true;
        scope.vm.IsPhoneUniqueProcess = false;
        scope.vm.IsUsernameUnique = true;
        scope.vm.IsUsernameUniqueProcess = false;
        this.getUsers();
        scope.vm.selectize_c_options = [
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
        scope.vm.newuser.UserGroupId = 1;
        scope.vm.selectize_c_config = {
            plugins: {
                'tooltip': ''
            },
            create: false,
            maxItems: 1,
            placeholder: 'Select...',
            valueField: 'Id',
            labelField: 'UserGroupName'
        };
        scope.vm.selectize_a_options = [];
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
            create: false,
            maxItems: 1,
            placeholder: 'Select...',
            valueField: 'Id',
            labelField: 'Description'
        };
        scope.vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withDisplayLength(10)
            .withOption('initComplete', function () {
            $timeout(function () {
                $compile($('.dt-uikit .md-input'))(scope);
            });
        });
        scope.vm.dtColumnDefs = [
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
        this.lservice = loginService;
        this.cservice = commonService;
        this.getLanguages();
    }
    ManageUsersController.prototype.getLanguages = function () {
        var _this = this;
        this.cservice.getLanguages().then(function (result) {
            _this.scope.vm.selectize_a_options = result.data;
            _this.scope.vm.selectize_b_options = result.data;
        });
    };
    ManageUsersController.prototype.getUsers = function () {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getUsers().then(function (result) {
            _this.scope.vm.dt_data = result.data;
            _this.$rootScope.$emit("toggleLoader", false);
        });
    };
    ManageUsersController.prototype.CreateUser = function () {
        var _this = this;
        if (this.scope.vm.IsPhoneUnique && this.scope.vm.IsUsernameUnique && createUserForm.checkValidity()) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.createUser(this.newuser).then(function (result) {
                if (result.data) {
                    _this.$rootScope.$emit("successnotify", { msg: "Your user is created successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                _this.$rootScope.$emit("toggleLoader", false);
                _this.newuser = new altairApp.UserDetail();
                window.location.href = "/#/manageusers";
            });
        }
    };
    ManageUsersController.prototype.checkPhoneUnique = function () {
        var _this = this;
        this.scope.vm.IsPhoneUniqueProcess = true;
        this.lservice.getUserDetailsbyPhone(this.newuser.Phone).then(function (result) {
            _this.scope.vm.IsPhoneUniqueProcess = false;
            if (result.data != "") {
                _this.scope.vm.IsPhoneUnique = false;
                document.getElementById("user_input_phoneno").valid = false;
            }
            else {
                _this.scope.vm.IsPhoneUnique = true;
                document.getElementById("user_input_phoneno").valid = true;
            }
        });
    };
    ManageUsersController.prototype.checkUserNameUnique = function () {
        var _this = this;
        this.scope.vm.IsUsernameUniqueProcess = true;
        this.lservice.getUserDetailsbyUsername(this.newuser.UserName).then(function (result) {
            _this.scope.vm.IsUsernameUniqueProcess = false;
            if (result.data != "") {
                _this.scope.vm.IsUsernameUnique = false;
                document.getElementById("user_input_username").valid = false;
            }
            else {
                _this.scope.vm.IsUsernameUnique = true;
                document.getElementById("user_input_username").valid = true;
            }
        });
    };
    return ManageUsersController;
}());
ManageUsersController.$inject = ["$scope", "$rootScope", "$compile", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "companyService", "loginService"];
angular.module("altairApp")
    .controller("manageUsersController", ManageUsersController);
