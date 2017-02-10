/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />

module altairApp {
    class MyProfileController {
        lservice: any;
        static $inject = ["$scope", "$rootScope", "loginService"];
        constructor(public scope: any, public $rootScope: any, public loginService: LoginService) {
            
            scope.vm = this;

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

            scope.vm.selectize_b_options = ["English", "Chinese", "Russian", "French"];

            scope.vm.selectize_b = "Russian";

            scope.vm.selectize_b_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };

            this.lservice = loginService;
            this.getUser(this.$rootScope.LoggedUser.UserId);



        }

        getUser(id) {
            this.lservice.getUserDetailsbyId(id.toString()).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.vm.fullName = result.data.FullIdentityName.toString();
                this.scope.vm.login_firstname = result.data.FullIdentityName.toString().split(" ")[0];
                this.scope.vm.login_lastname = result.data.FullIdentityName.toString().split(" ")[1];
                this.scope.vm.companyname = result.data.Customer.CustomerName;
                this.scope.vm.title = "Sr.Web Developer";
                this.scope.vm.phone = result.data.Phone.toString();
                this.scope.vm.username = result.data.UserName;
            });
        }


    }

    angular.module("altairApp")
        .controller("myProfileController", MyProfileController);
}
