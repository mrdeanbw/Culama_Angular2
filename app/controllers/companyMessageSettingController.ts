/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module altairApp {
    class CompanyMessageSettingController {
        cservice: any;
        lservice: any;
        static $inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "commonService", "loginService"];
        constructor(public scope: any, public $rootScope: any, public companyService: altairApp.CompanyService, public $compile: any, public $timeout: any, public commonService: altairApp.CommonService, public loginService: altairApp.LoginService) {
            this.cservice = companyService;
            this.lservice = loginService;
            this.scope.CompanyUsers = [];
            this.scope.Customer = new altairApp.Customer();

            if ($rootScope.LoggedUser.UserGroupId !== 1 && $rootScope.LoggedUser.UserGroupId !== 2) {
                window.location.href = "#/error";
            }

            this.scope.selectize_users_options = [];
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
                create: false,
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
                    alert(this.$input.attr("target"));
                },
                onItemRemove: function (input) {
                    alert(this.$input.attr("target"));
                },
                onChange: function () {
                    alert("changed");
                }
            };


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

        getCompanyDetail(companyid) {
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getCompanyById(companyid).then((result: ng.IHttpPromiseCallbackArg<altairApp.Customer>) => {
                this.scope.Customer = result.data;
                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        getCompanyUsers(companyid) {
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getUsersByCompanyId(companyid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.CompanyUsers = result.data;
                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        saveCompany() {
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.saveCompanyDetail(this.scope.Customer).then((result: ng.IHttpPromiseCallbackArg<altairApp.Customer>) => {
                this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    this.scope.Customer = result.data;

                    var cmobj = this;
                    var ccheck = this.scope.Customer.IsAllowMsgAllToEveryone;
                    $.each(this.scope.CompanyUsers, function () {
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
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.saveUserDetail(user).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
                this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {

                    $.each(this.scope.CompanyUsers, function (index) {
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


    }
    angular.module("altairApp")
        .controller("companyMessageSettingController", CompanyMessageSettingController);
}