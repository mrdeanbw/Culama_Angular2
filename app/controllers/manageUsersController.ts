/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
class ManageUsersController {
    lservice: any;
    cservice: any;
    public newuser: altairApp.UserDetail = new altairApp.UserDetail();
    static $inject = ["$scope", "$rootScope", "$compile", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "companyService", "loginService"];
    constructor(public scope: any, public $rootScope: any, public $compile: any, public $timeout: any, public $resource: any, public DTOptionsBuilder: any, public DTColumnDefBuilder: any, public commonService: altairApp.CommonService, public companyService: altairApp.CompanyService, public loginService: altairApp.LoginService) {

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
            }];

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

    getLanguages() {
        this.cservice.getLanguages().then((result: ng.IHttpPromiseCallbackArg<any>) => {
            this.scope.vm.selectize_a_options = result.data;
            this.scope.vm.selectize_b_options = result.data;
        });
    }

    getUsers() {
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getUsers().then((result: ng.IHttpPromiseCallbackArg<any>) => {
            this.scope.vm.dt_data = result.data;
            this.$rootScope.$emit("toggleLoader", false);
        });
    }

    CreateUser() {
        if (this.scope.vm.IsPhoneUnique && this.scope.vm.IsUsernameUnique && createUserForm.checkValidity()) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.createUser(this.newuser).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
                if (result.data) {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Your user is created successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                this.$rootScope.$emit("toggleLoader", false);
                this.newuser = new altairApp.UserDetail();
                window.location.href = "/#/manageusers";

            });
        }
    }

    checkPhoneUnique() {
        this.scope.vm.IsPhoneUniqueProcess = true;
        this.lservice.getUserDetailsbyPhone(this.newuser.Phone).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
            this.scope.vm.IsPhoneUniqueProcess = false;
            if (result.data != "") {
                this.scope.vm.IsPhoneUnique = false;
                document.getElementById("user_input_phoneno").valid = false;
            } else {
                this.scope.vm.IsPhoneUnique = true;
                document.getElementById("user_input_phoneno").valid = true;
            }
        });
    }

    checkUserNameUnique() {
        this.scope.vm.IsUsernameUniqueProcess = true;
        this.lservice.getUserDetailsbyUsername(this.newuser.UserName).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
            this.scope.vm.IsUsernameUniqueProcess = false;
            if (result.data != "") {
                this.scope.vm.IsUsernameUnique = false;
                document.getElementById("user_input_username").valid = false;
            } else {
                this.scope.vm.IsUsernameUnique = true;
                document.getElementById("user_input_username").valid = true;
            }
        });
    }
}

angular.module("altairApp")
    .controller("manageUsersController", ManageUsersController);