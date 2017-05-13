/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var areas;
    (function (areas) {
        var companyWall;
        (function (companyWall) {
            var controllers;
            (function (controllers) {
                var CompanyWallPostController = (function () {
                    function CompanyWallPostController(scope, $rootScope, $sce, $filter, companyWallPostService) {
                        this.scope = scope;
                        this.$rootScope = $rootScope;
                        this.$sce = $sce;
                        this.$filter = $filter;
                        this.companyWallPostService = companyWallPostService;
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
                    CompanyWallPostController.prototype.getWallPosts = function (wallId) {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        this.companyWallPostService.getCompanyWallPostsByWallId(wallId).then(function (result) {
                            debugger;
                            if (result.data.length > 0) {
                                _this.scope.isWallPosts = true;
                                _this.scope.wallPosts = result.data;
                            }
                        });
                    };
                    CompanyWallPostController.prototype.getParameterByName = function (wallinfo) {
                        var url = window.location.href;
                        wallinfo = wallinfo.replace(/[\[\]]/g, "\\$&");
                        var regex = new RegExp("[?&]" + wallinfo + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
                        if (!results)
                            return null;
                        if (!results[2])
                            return '';
                        return decodeURIComponent(results[2].replace(/\+/g, " "));
                    };
                    CompanyWallPostController.$inject = ["$scope", "$rootScope", "$sce", "$filter", "companyWallPostService"];
                    return CompanyWallPostController;
                }());
                angular.module("culamaApp")
                    .controller("companyWallPostController", CompanyWallPostController);
            })(controllers = companyWall.controllers || (companyWall.controllers = {}));
        })(companyWall = areas.companyWall || (areas.companyWall = {}));
    })(areas = culamaApp.areas || (culamaApp.areas = {}));
})(culamaApp || (culamaApp = {}));
