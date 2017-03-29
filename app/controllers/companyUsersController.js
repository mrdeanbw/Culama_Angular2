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
            this.edituser = new altairApp.UserDetail();
            this.cservice = companyService;
            this.lservice = loginService;
            this.scope.cardview = true;
            this.scope.CompanyName = $rootScope.LoggedUser.CustomerName;
            this.scope.companyPrefix = $rootScope.LoggedUser.CustomerPrefix;
            this.newuser.CustomerId = this.$rootScope.LoggedUser.CustomerId;
            this.scope.IsPhoneUnique = true;
            this.scope.IsPhoneUniqueProcess = false;
            this.scope.IsUsernameUnique = true;
            this.scope.IsUsernameUniqueProcess = false;
            this.scope.IsEditMode = false;
            this.scope.edituserid = this.getParameterByName("id");
            if (this.scope.edituserid != "" && this.scope.edituserid != null && this.scope.edituserid != undefined) {
                this.scope.IsEditMode = true;
            }
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
            this.scope.userroles = ['Company Admin', 'Users'];
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
            $formValidate = $('#editUserForm');
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
            var cobj = this;
            scope.deleteUser = function (id) {
                UIkit.modal.confirm('Are you sure want to delete?', function () {
                    cobj.DeleteCompanyUser(id);
                });
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
                if (_this.scope.IsEditMode) {
                    var euid = _this.scope.edituserid;
                    var findobj;
                    $.each(_this.scope.contact_list, function (index) {
                        if (this.UserId.toString() === euid) {
                            findobj = this;
                        }
                    });
                    _this.edituser = findobj;
                    _this.edituser.UserName = _this.edituser.UserName.toString().replace(_this.edituser.Customer.Prefix + "-", "");
                }
            });
        };
        CompanyUsersController.prototype.CreateUser = function () {
            var _this = this;
            if (this.scope.IsPhoneUnique && this.scope.IsUsernameUnique && createUserForm.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.newuser.UserName = this.scope.companyPrefix + "-" + this.newuser.UserName;
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
        CompanyUsersController.prototype.EditUser = function () {
            var _this = this;
            if (this.scope.IsPhoneUnique && this.scope.IsUsernameUnique && editUserForm.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.edituser.UserName = this.scope.companyPrefix + "-" + this.edituser.UserName;
                this.lservice.saveUserDetail(this.edituser).then(function (result) {
                    _this.$rootScope.$emit("toggleLoader", false);
                    if (result.data != "") {
                        _this.edituser = result.data;
                        _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                        window.location.href = "/#/companyusers";
                    }
                    else {
                        _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                });
            }
        };
        CompanyUsersController.prototype.DeleteCompanyUser = function (id) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.deleteUser(id).then(function (result) {
                _this.$rootScope.$emit("toggleLoader", false);
                if (result.data) {
                    var userlist = _this.scope.contact_list;
                    $.each(userlist, function (index) {
                        if (this.UserId === id) {
                            userlist.splice(index, 1);
                            return false;
                        }
                    });
                    _this.scope.contact_list = userlist;
                    _this.$rootScope.$emit("successnotify", { msg: "Your user is deleted successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
            });
        };
        CompanyUsersController.prototype.checkPhoneUnique = function () {
            var _this = this;
            this.scope.IsPhoneUniqueProcess = true;
            if (this.scope.IsEditMode) {
                this.lservice.getUserDetailsbyPhone(this.edituser.Phone).then(function (result) {
                    _this.scope.IsPhoneUniqueProcess = false;
                    if (result.data != "") {
                        if (result.data.UserId !== _this.edituser.UserId) {
                            _this.scope.IsPhoneUnique = false;
                            document.getElementById("user_input_phoneno").valid = false;
                        }
                        else {
                            _this.scope.IsPhoneUnique = true;
                            document.getElementById("user_input_phoneno").valid = true;
                        }
                    }
                    else {
                        _this.scope.IsPhoneUnique = true;
                        document.getElementById("user_input_phoneno").valid = true;
                    }
                });
            }
            else {
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
            }
        };
        CompanyUsersController.prototype.checkUserNameUnique = function () {
            var _this = this;
            this.scope.IsUsernameUniqueProcess = true;
            if (this.scope.IsEditMode) {
                var uname = this.scope.companyPrefix + "-" + this.edituser.UserName;
                this.lservice.getUserDetailsbyUsername(uname).then(function (result) {
                    _this.scope.IsUsernameUniqueProcess = false;
                    if (result.data != "") {
                        if (result.data.UserId !== _this.edituser.UserId) {
                            _this.scope.IsUsernameUnique = false;
                            document.getElementById("user_input_username").valid = false;
                        }
                        else {
                            _this.scope.IsUsernameUnique = true;
                            document.getElementById("user_input_username").valid = true;
                        }
                    }
                    else {
                        _this.scope.IsUsernameUnique = true;
                        document.getElementById("user_input_username").valid = true;
                    }
                });
            }
            else {
                var uname = this.scope.companyPrefix + "-" + this.newuser.UserName;
                this.lservice.getUserDetailsbyUsername(uname).then(function (result) {
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
            }
        };
        CompanyUsersController.prototype.getParameterByName = function (name) {
            var url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        return CompanyUsersController;
    }());
    CompanyUsersController.$inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "loginService"];
    angular.module("altairApp")
        .controller("companyUsersController", CompanyUsersController);
})(altairApp || (altairApp = {}));
