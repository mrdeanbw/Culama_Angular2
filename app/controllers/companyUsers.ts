/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
module altairApp {
    class CompanyUsersController {
        cservice: any;
        static $inject = ["$scope", "$rootScope", "companyService", "$compile", "$timeout", "$resource", "DTOptionsBuilder","DTColumnDefBuilder"];
        constructor(public scope: any, public $rootScope: any, public companyService: altairApp.CompanyService, public $compile: any, public $timeout: any, public $resource: any, public DTOptionsBuilder: any, public DTColumnDefBuilder: any ) {
            this.cservice = companyService;
            this.scope.cardview = true;
            this.scope.CompnayName = $rootScope.LoggedUser.CustomerName;
            this.getCompanyUsers(this.$rootScope.LoggedUser.CustomerId.toString());

            scope.userroles = ['Compnay Admin', 'Users'];


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

            scope.changeView = function (view) {
                if (view != "card") {
                    scope.cardview = false;
                } else {
                    scope.cardview = true;
                }

            };
        }

        getCompanyUsers(companyid) {
            this.$rootScope.$emit("toggleLoader", true);
            this.cservice.getUsersByCompanyId(companyid).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.contact_list = result.data;
                this.$rootScope.$emit("toggleLoader", false);

            });
        }


        //changeView(view) {
        //    alert("hi");
        //    if (view != "card") {
        //        this.scope.cardview = false;
        //    } else {
        //        this.scope.cardview = true;
        //    }
        //}

    }

    angular.module("altairApp")
        .controller("companyUsersController", CompanyUsersController);


}

