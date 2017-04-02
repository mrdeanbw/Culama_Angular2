/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var ascope;
var mainCobj;
module culamaApp {
    class ManageCustomersController {
        lservice: any;
        cservice: any;
        public newuser: culamaApp.UserDetail = new culamaApp.UserDetail();
        public newcompany: culamaApp.Customer = new culamaApp.Customer();
        public editcompany: culamaApp.Customer = new culamaApp.Customer();
        static $inject = ["$scope", "$rootScope", "$compile", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "companyService", "loginService"];
        constructor(public scope: any, public $rootScope: any, public $compile: any, public $timeout: any, public $resource: any, public DTOptionsBuilder: any, public DTColumnDefBuilder: any, public commonService: culamaApp.CommonService, public companyService: culamaApp.CompanyService, public loginService: culamaApp.LoginService) {
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


            this.getCompanies();

            var cobj = this;
            mainCobj = this;
            ascope = this.scope;
            scope.vm.deleteCompany = function (id) {
                UIkit.modal.confirm('Are you sure want to delete?', function () {
                    cobj.DeleteCompany(id);
                });
            }

            scope.vm.getOtherCompanyUsers = function (um) {
                var selectize_userlist = [];
                $.each(ascope.vm.editcompanyUsers, function () {
                    if (this.UserId != um.UserId) {
                        selectize_userlist.push(this);
                    }
                });
                return selectize_userlist;
            };

            scope.vm.selectize_users_config = {
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
                        $.each(ascope.vm.editcompanyUsers, function (index) {
                            if (this.UserId == parseInt(targetUserid)) {
                                targetUser = ascope.vm.editcompanyUsers[index];
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
                        $.each(ascope.vm.editcompanyUsers, function (index) {
                            if (this.UserId == parseInt(targetUserid)) {
                                targetUser = ascope.vm.editcompanyUsers[index];
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

           

        }
        getCompanies() {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.getCompanies().then((result: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.vm.dt_data = result.data;
                this.$rootScope.$emit("toggleLoader", false);
                if (this.scope.IsEditMode) {
                    var ecid = this.scope.editcompanyid;
                    var findobj;
                    $.each(this.scope.vm.dt_data, function (index) {
                        if (this.Id.toString() === ecid) {
                            findobj = this;
                        }
                    });
                    this.editcompany = findobj;
                    this.getCompanyUsers(this.editcompany.Id);
                }
            });
        }

        CreateCompany() {
            if (createCompanyForm.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.companyService.createCompany(this.newcompany).then((result: ng.IHttpPromiseCallbackArg<boolean>) => {
                    if (result.data) {
                        this.$rootScope.$emit("successnotify",
                            { msg: "Company is created successfully", status: "success" });
                    } else {
                        this.$rootScope.$emit("successnotify",
                            { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                    this.$rootScope.$emit("toggleLoader", false);
                    this.newcompany = new culamaApp.Customer();
                    window.location.href = "/#/managecompanies";

                });
            }
        }

        EditCompany() {
            if (editCompanyForm.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.companyService.saveCompanyDetail(this.editcompany).then((result: ng.IHttpPromiseCallbackArg<culamaApp.Customer>) => {
                    this.$rootScope.$emit("toggleLoader", false);
                    if (result.data != "") {
                        this.editcompany = result.data;
                        this.$rootScope.$emit("successnotify",
                            { msg: "Your information is updated successfully", status: "success" });
                        window.location.href = "/#/managecompanies";
                    } else {
                        this.$rootScope.$emit("successnotify",
                            { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                });
            }
        }

        saveCompany() {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.saveCompanyDetail(this.editcompany).then((result: ng.IHttpPromiseCallbackArg<culamaApp.Customer>) => {
                this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    this.editcompany = result.data;

                    var cmobj = this;
                    var ccheck = this.editcompany.IsAllowMsgAllToEveryone;
                    $.each(this.scope.vm.editcompanyUsers, function () {
                        var u = this;
                        u.IsAllowMsgToEveryone = ccheck;
                        cmobj.saveCompanyUser(u);
                    });

                    this.$rootScope.$emit("successnotify",
                        { msg: "Your information is updated successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }

            });
        }

        saveCompanyUser(user) {
            if (user.IsAllowMsgToEveryone) {
                user.UserMessages = [];
            }
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.saveUserDetail(user).then((result: ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>) => {
                this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {

                    $.each(this.scope.vm.editcompanyUsers, function (index) {
                        var u = this;
                        if (u.UserId == user.UserId) {
                            u = result.data;
                        }
                    })

                    this.$rootScope.$emit("successnotify",
                        { msg: "Your information is updated successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
            });
        }

        DeleteCompany(id) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.deleteCompany(id).then((result: ng.IHttpPromiseCallbackArg<boolean>) => {
                this.$rootScope.$emit("toggleLoader", false);
                if (result.data) {
                    var companylist = this.scope.vm.dt_data;
                    $.each(companylist, function (index) {
                        if (this.Id === id) {
                            companylist.splice(index, 1);
                            return false;
                        }
                    });
                    this.scope.vm.dt_data = companylist;

                    this.$rootScope.$emit("successnotify",
                        { msg: "Company is deleted successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
            });
        }

        getCompanyUsers(companyid) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.getUsersByCompanyId(companyid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.vm.editcompanyUsers = result.data;
                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        getParameterByName(name) {

            var url = window.location.href;

            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
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

        }
    }

    angular.module("culamaApp")
        .controller("manageCustomersController", ManageCustomersController);

    angular.module("culamaApp")
        .filter("myFilter", culamaApp.myFilter);
}