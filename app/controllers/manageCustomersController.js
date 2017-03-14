/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var ManageCustomersController = (function () {
    function ManageCustomersController(scope, $rootScope, $compile, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, commonService, companyService, loginService) {
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
        this.newcompany = new altairApp.Customer();
        this.editcompany = new altairApp.Customer();
        this.lservice = loginService;
        this.cservice = commonService;
        if ($rootScope.LoggedUser.UserGroupId !== 1) {
            window.location.href = "#/error";
        }
        scope.vm = this;
        scope.vm.dt_data = [];
        scope.vm.editcompanyUsers = [];
        this.scope.IsEditMode = false;
        this.scope.editcompanyid = this.getParameterByName("id");
        if (this.scope.editcompanyid != "" && this.scope.editcompanyid != null && this.scope.editcompanyid != undefined) {
            this.scope.IsEditMode = true;
        }
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
        scope.vm.dtuserOptions = DTOptionsBuilder
            .newOptions()
            .withDisplayLength(10)
            .withOption('initComplete', function () {
            $timeout(function () {
                $compile($('.dt-uikit .md-input'))(scope);
            });
        });
        scope.vm.dtuserColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5)
        ];
        var $formValidate = $('#createCompanyForm');
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
        $formValidate = $('#editCompanyForm');
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
        var cobj = this;
        scope.vm.deleteCompany = function (id) {
            UIkit.modal.confirm('Are you sure want to delete?', function () {
                cobj.DeleteCompany(id);
            });
        };
        this.getCompanies();
    }
    ManageCustomersController.prototype.getCompanies = function () {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getCompanies().then(function (result) {
            _this.scope.vm.dt_data = result.data;
            _this.$rootScope.$emit("toggleLoader", false);
            if (_this.scope.IsEditMode) {
                var ecid = _this.scope.editcompanyid;
                var findobj;
                $.each(_this.scope.vm.dt_data, function (index) {
                    if (this.Id.toString() === ecid) {
                        findobj = this;
                    }
                });
                _this.editcompany = findobj;
                _this.getCompanyUsers(_this.editcompany.Id);
            }
        });
    };
    ManageCustomersController.prototype.CreateCompany = function () {
        var _this = this;
        if (createCompanyForm.checkValidity()) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.createCompany(this.newcompany).then(function (result) {
                if (result.data) {
                    _this.$rootScope.$emit("successnotify", { msg: "Company is created successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                _this.$rootScope.$emit("toggleLoader", false);
                _this.newcompany = new altairApp.Customer();
                window.location.href = "/#/managecompanies";
            });
        }
    };
    ManageCustomersController.prototype.EditCompany = function () {
        var _this = this;
        if (editCompanyForm.checkValidity()) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.saveCompanyDetail(this.editcompany).then(function (result) {
                _this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    _this.editcompany = result.data;
                    _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                    window.location.href = "/#/managecompanies";
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
            });
        }
    };
    ManageCustomersController.prototype.saveCompany = function () {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.saveCompanyDetail(this.editcompany).then(function (result) {
            _this.$rootScope.$emit("toggleLoader", false);
            if (result.data != "") {
                _this.editcompany = result.data;
                var cmobj = _this;
                var ccheck = _this.editcompany.IsAllowMsgAllToEveryone;
                $.each(_this.scope.vm.editcompanyUsers, function () {
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
    ManageCustomersController.prototype.saveCompanyUser = function (user) {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.lservice.saveUserDetail(user).then(function (result) {
            _this.$rootScope.$emit("toggleLoader", false);
            if (result.data != "") {
                $.each(_this.scope.vm.editcompanyUsers, function (index) {
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
    ManageCustomersController.prototype.DeleteCompany = function (id) {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.deleteCompany(id).then(function (result) {
            _this.$rootScope.$emit("toggleLoader", false);
            if (result.data) {
                var companylist = _this.scope.vm.dt_data;
                $.each(companylist, function (index) {
                    if (this.Id === id) {
                        companylist.splice(index, 1);
                        return false;
                    }
                });
                _this.scope.vm.dt_data = companylist;
                _this.$rootScope.$emit("successnotify", { msg: "Company is deleted successfully", status: "success" });
            }
            else {
                _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
            }
        });
    };
    ManageCustomersController.prototype.getCompanyUsers = function (companyid) {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getUsersByCompanyId(companyid).then(function (result) {
            _this.scope.vm.editcompanyUsers = result.data;
            _this.$rootScope.$emit("toggleLoader", false);
        });
    };
    ManageCustomersController.prototype.getParameterByName = function (name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    return ManageCustomersController;
}());
ManageCustomersController.$inject = ["$scope", "$rootScope", "$compile", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "companyService", "loginService"];
angular.module("altairApp")
    .controller("manageCustomersController", ManageCustomersController);
