
/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp.areas.companyWall.controllers {
    class CompanyWallPostController {

        static $inject = ["$scope", "$rootScope", "$sce", "$filter", "companyWallPostService"];

        constructor(public scope: any, public $rootScope: any, public $sce: any, public $filter: any, public companyWallPostService: culamaApp.CompanyWallPostService) {
            this.scope.isWallPosts = false;
            debugger;
            this.scope.wallID = this.getParameterByName("wid");

            this.getWallPosts(this.scope.wallID);

            var $formValidate = $('#wallPostForm');
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
        }

        getWallPosts(wallId) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyWallPostService.getCompanyWallPostsByWallId(wallId).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                debugger;
                if (result.data.length > 0) {
                    this.scope.isWallPosts = true;
                    this.scope.wallPosts = result.data;
                }
            });
        }

        getParameterByName(wallinfo) {
            var url = window.location.href;
            wallinfo = wallinfo.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + wallinfo + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

    }

    angular.module("culamaApp")
        .controller("companyWallPostController", CompanyWallPostController);
}