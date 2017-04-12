/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp {
    class MyProfileController {
        lservice: any;
        cservice: any;
        public userDetail: culamaApp.UserDetail = new culamaApp.UserDetail();
        public userAccount: culamaApp.LoginUser = new culamaApp.LoginUser();
        static $inject = ["$scope", "$rootScope", "$filter", "loginService", "commonService"];
        constructor(public scope: any, public $rootScope: any, public $filter: any, public loginService: culamaApp.LoginService, public commonService: culamaApp.CommonService) {

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

        getUser(id) {
            var ft = this.$filter;
            this.lservice.getUserDetailsbyId(id.toString()).then((result: ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>) => {
                debugger;
                var x = result.data;
                if (typeof result.data.PhoneActivatedOn === 'string' || typeof result.data.LastActivationAttempt === 'string') {
                    var activationon = new Date(parseInt(result.data.PhoneActivatedOn.substr(6)));
                    var lastactivation = new Date(parseInt(result.data.LastActivationAttempt.substr(6)));

                    this.scope.vm.PhoneActivatedOn = ft('date')(activationon, "MMM dd yyyy HH:mm");
                    this.scope.vm.LastActivationAttempt = ft('date')(lastactivation, "MMM dd yyyy HH:mm");
                }

                this.userDetail = result.data;
                var CurrentScope = this.scope.vm;
                if (this.userDetail != undefined) {
                    if (this.userDetail.TitleTranslation != undefined) {
                        this.scope.vm.title = this.userDetail.TitleTranslation.DefaultValue;
                        this.scope.vm.IsPhoneActivated = this.userDetail.IsPhoneActivated;
                        var Entries = this.userDetail.TitleTranslation.Entries;
                        if (Entries.length > 0) {
                            $.each(Entries,
                                function (index) {
                                    if (this.Language.LookupCode === CurrentScope.CurrentLanguage) {
                                        CurrentScope.title = this.Value;
                                    }
                                });
                        }
                    }
                }
            });
        }


        getLanguages() {
            this.cservice.getLanguages().then((result: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.vm.selectize_a_options = result.data;
                this.scope.vm.selectize_b_options = result.data;
            });
        }

        checkPhoneUnique() {
            var $formValidate = $('#form_validation');
            this.scope.vm.IsPhoneUniqueProcess = true;
            this.lservice.getUserDetailsbyPhone(this.userDetail.Phone).then((result: ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>) => {
                this.scope.vm.IsPhoneUniqueProcess = false;
                if (result.data != "") {
                    if (result.data.UserId !== this.userDetail.UserId) {
                        this.scope.vm.IsPhoneUnique = false;
                        document.getElementById("login_phoneno").valid = false;

                    } else {
                        this.scope.vm.IsPhoneUnique = true;
                        document.getElementById("login_phoneno").valid = true;
                    }

                } else {
                    this.scope.vm.IsPhoneUnique = true;
                    document.getElementById("login_phoneno").valid = true;
                }
            });
        }

        checkPasswordMatch() {
            this.scope.vm.IsPasswordMatch = (this.scope.vm.newpassword == this.scope.vm.confirmpassword);
        }

        saveInfo() {
            if (this.scope.vm.IsPhoneUnique && form_validation.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.lservice.saveUserDetail(this.userDetail).then((result: ng.IHttpPromiseCallbackArg<culamaApp.UserDetail>) => {

                    if (result.data != "") {
                        this.userDetail = result.data;
                        this.$rootScope.$emit("successnotify",
                            { msg: "Your information is updated successfully", status: "success" });
                    } else {
                        this.$rootScope.$emit("successnotify",
                            { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                    this.$rootScope.$emit("toggleLoader", false);
                });
            }

        }

        saveAccountInfo() {
            if (this.scope.vm.IsPasswordMatch && form_validation.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.userAccount.username = this.scope.vm.userDetail.UserName;
                this.userAccount.password = this.scope.vm.newpassword;
                this.lservice.changePassword(this.userAccount).then((result: ng.IHttpPromiseCallbackArg<boolean>) => {
                    this.$rootScope.$emit("toggleLoader", false);
                    if (result.data) {
                        this.$rootScope.$emit("logout", {});
                    } else {
                        this.$rootScope.$emit("successnotify",
                            { msg: "Something went wrong. Please try again.", status: "danger" });
                    }

                });
            }

        }

    }

    angular.module("culamaApp")
        .controller("myProfileController", MyProfileController);

}
