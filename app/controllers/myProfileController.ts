/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />

module altairApp {
    class MyProfileController {
        lservice: any;
        cservice: any;
        public userDetail: altairApp.UserDetail = new altairApp.UserDetail();
        static $inject = ["$scope", "$rootScope", "loginService", "commonService"];
        constructor(public scope: any, public $rootScope: any, public loginService: altairApp.LoginService, public commonService: altairApp.CommonService) {

            scope.vm = this;
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
            this.lservice.getUserDetailsbyId(id.toString()).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
                this.userDetail = result.data;
                var CurrentScope = this.scope.vm;
                if (this.userDetail != undefined) {
                    if (this.userDetail.TitleTranslation != undefined) {
                        this.scope.vm.title = this.userDetail.TitleTranslation.DefaultValue;
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
            this.lservice.getUserDetailsbyPhone(this.userDetail.Phone).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {
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

        saveInfo() {
            if (this.scope.vm.IsPhoneUnique && form_validation.checkValidity()) {
                this.$rootScope.$emit("toggleLoader", true);
                this.lservice.saveUserDetail(this.userDetail).then((result: ng.IHttpPromiseCallbackArg<altairApp.UserDetail>) => {

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
       
    }

    angular.module("altairApp")
        .controller("myProfileController", MyProfileController);

}
