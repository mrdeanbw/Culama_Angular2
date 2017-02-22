/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module altairApp {
    class LoginController {
        lservice: any;
        public loginuser: altairApp.LoginUser = new altairApp.LoginUser();
        static $inject = ["$scope", "$rootScope", "loginService"];
        constructor(public scope: any, public $rootScope: any, public loginService: altairApp.LoginService) {
            scope.vm = this;
            this.lservice = loginService;
            scope.vm.selectize_a_options = [
                { id: 1, title: 'English', value: 'US' },
                { id: 2, title: 'Hindi', value: 'IN' }
            ];

            //scope.vm.initSelect = 0;
            scope.vm.selectize_a = localStorage.getItem("localelanguage");
            scope.vm.selectize_a_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'value',
                labelField: 'title',
                onInitialize: function (selectize) {
                    // receives the selectize object as an argument
                },
                onChange: function (value) {
                    // Nothing happens when typing into input
                    this.changeLanguage();
                }
            };

            scope.vm.registerFormActive = false;
            scope.vm.isloginfail = false;

            var $formValidate = $('#myLoginForm');

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

        login() {
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.login(this.loginuser).then((result: ng.IHttpPromiseCallbackArg<altairApp.User>) => {
                if (result.data.Username != null) {

                    if (typeof (Storage) !== "undefined") {
                        localStorage.setItem("loggeduser", JSON.stringify(result.data));
                    }
                    window.location.href = "/";
                } else {
                    this.$rootScope.$emit("toggleLoader", false);
                    this.scope.vm.isloginfail = true;
                }

            });
        }

        changeLanguage() {
            this.$rootScope.$emit("changeLanguage", this.scope.vm.selectize_a);
            //if (this.scope.vm.initSelect > 0) {
            //    alert("gi");
            //    this.$rootScope.$emit("changeLanguage", this.scope.vm.selectize_a);    
            //}

        }


    }

    angular.module("altairApp")
        .controller("loginController", LoginController);

  
}

