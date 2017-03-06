/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module altairApp {
    class CompanyUsersController {
        cservice: any;
        lservice: any;
        public newuser: altairApp.UserDetail = new altairApp.UserDetail();
        static $inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "loginService"];
        constructor(public scope: any, public $rootScope: any, public companyService: altairApp.CompanyService, public $compile: any, public $timeout: any, public $resource: any, public DTOptionsBuilder: any, public DTColumnDefBuilder: any, public commonService: altairApp.CommonService, public loginService: altairApp.LoginService) {
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
                }];

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
            })


            scope.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDisplayLength(10)
                .withOption('initComplete', function () {
                    $timeout(function () {
                        $compile($('.dt-uikit .md-input'))(scope);
                    })
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
                } else {
                    scope.cardview = true;
                }

            };
        }

        getLanguages() {
            this.commonService.getLanguages().then((result: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.selectize_a_options = result.data;
                this.scope.selectize_b_options = result.data;
            });
        }

        getCompanyUsers(companyid) {
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getUsersByCompanyId(companyid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.contact_list = result.data;
                this.$rootScope.$emit("toggleLoader", false);

            });
        }

        CreateUser() {
            if (this.scope.IsPhoneUnique && this.scope.IsUsernameUnique && createUserForm.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.cservice.createUser(this.newuser).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
                    if (result.data) {
                        this.$rootScope.$emit("successnotify",
                            { msg: "Your user is created successfully", status: "success" });
                    } else {
                        this.$rootScope.$emit("successnotify",
                            { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                    this.$rootScope.$emit("toggleLoader", false);
                    this.newuser = new altairApp.UserDetail();
                    window.location.href = "/#/companyusers";

                });
            }
        }

        checkPhoneUnique() {
            this.scope.IsPhoneUniqueProcess = true;
            this.lservice.getUserDetailsbyPhone(this.newuser.Phone).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
                this.scope.IsPhoneUniqueProcess = false;
                if (result.data != "") {
                    this.scope.IsPhoneUnique = false;
                    document.getElementById("user_input_phoneno").valid = false;
                } else {
                    this.scope.IsPhoneUnique = true;
                    document.getElementById("user_input_phoneno").valid = true;
                }
            });
        }

        checkUserNameUnique() {
            this.scope.IsUsernameUniqueProcess = true;
            this.lservice.getUserDetailsbyUsername(this.newuser.UserName).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
                this.scope.IsUsernameUniqueProcess = false;
                if (result.data != "") {
                    this.scope.IsUsernameUnique = false;
                    document.getElementById("user_input_username").valid = false;
                } else {
                    this.scope.IsUsernameUnique = true;
                    document.getElementById("user_input_username").valid = true;
                }
            });
        }

    }

    angular.module("altairApp")
        .controller("companyUsersController", CompanyUsersController);


}

