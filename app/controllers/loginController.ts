/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module altairApp {
    class LoginController {
        lservice: any;
        public loginuser: LoginUser = new LoginUser();
        static $inject = ["$scope", "$rootScope","loginService"];
        constructor(public scope: any,public $rootScope: any,public loginService: LoginService) {
            scope.vm = this;
            this.lservice = loginService;
            scope.vm.selectize_a_options = ["English", "Chinese", "Russian", "French"];
            scope.vm.selectize_a = "English";

            scope.vm.selectize_a_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };

            scope.vm.registerFormActive = false;
            scope.vm.isloginfail = false;
            
        }

        login() {
            this.lservice.login(this.loginuser).then((result: ng.IHttpPromiseCallbackArg<User>) => {
                if (result.data.Username != null) {

                    if (typeof (Storage) !== "undefined") {
                        localStorage.setItem("loggeduser", JSON.stringify(result.data));
                    }
                    window.location.href = "/";
                } else {
                    this.scope.vm.isloginfail = true;
                }
                
            });
        }

       
    }

    angular.module("altairApp")
        .controller("loginController", LoginController);
}

