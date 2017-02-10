/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var altairApp;
(function (altairApp) {
    var MyProfileController = (function () {
        function MyProfileController(scope, $rootScope, loginService) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.loginService = loginService;
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
        MyProfileController.prototype.getUser = function (id) {
            var _this = this;
            this.lservice.getUserDetailsbyId(id.toString()).then(function (result) {
                _this.scope.vm.fullName = result.data.FullIdentityName.toString();
                _this.scope.vm.login_firstname = result.data.FullIdentityName.toString().split(" ")[0];
                _this.scope.vm.login_lastname = result.data.FullIdentityName.toString().split(" ")[1];
                _this.scope.vm.companyname = result.data.Customer.CustomerName;
                _this.scope.vm.title = "Sr.Web Developer";
                _this.scope.vm.phone = result.data.Phone.toString();
                _this.scope.vm.username = result.data.UserName;
            });
        };
        return MyProfileController;
    }());
    MyProfileController.$inject = ["$scope", "$rootScope", "loginService"];
    angular.module("altairApp")
        .controller("myProfileController", MyProfileController);
})(altairApp || (altairApp = {}));
