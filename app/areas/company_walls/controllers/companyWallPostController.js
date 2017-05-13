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
                        this.wallpost = new culamaApp.areas.companyWall.models.WallPost();
                        var currObj = this;
                        this.scope.isWallPosts = false;
                        this.scope.isEditMode = false;
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
                        this.scope.saveWallPostInfo = function () {
                            currObj.createWallPost();
                        };
                    }
                    CompanyWallPostController.prototype.getWallPosts = function (wallId) {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        var ft = this.$filter;
                        this.companyWallPostService.getCompanyWallPostsByWallId(wallId).then(function (result) {
                            if (result.data.length > 0) {
                                $.each(result.data, function () {
                                    if (typeof this.CreatedOn === 'string') {
                                        var activationon = new Date(parseInt(this.CreatedOn.substr(6)));
                                        this.CreatedOn = ft('date')(activationon, "dd MMM yyyy");
                                    }
                                });
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
                    CompanyWallPostController.prototype.createWallPost = function () {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        var imgArray = [];
                        var isImgs = $('#preview_images').html();
                        if (isImgs != "") {
                            var addedImgs = $('#preview_images').find('img');
                            $.each(addedImgs, function () {
                                var base64Arr = [];
                                var imgsrc = this.src;
                                // Split the base64 string in data and contentType
                                var block = imgsrc.split(";");
                                // Get the content type
                                var dataType = block[0].split(":")[1]; // In this case "image/png"
                                // get the real base64 content of the file
                                var realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."
                                for (var i = 0; i < realData.length; i++) {
                                    base64Arr.push(realData[i]);
                                }
                                imgArray.push(base64Arr);
                            });
                            this.wallpost.WallPostImages = imgArray;
                        }
                        this.wallpost.WallId = this.scope.wallID;
                        this.wallpost.CreatorId = this.$rootScope.LoggedUser.UserId;
                        this.companyWallPostService.createWallPost(this.wallpost).then(function (result) {
                            debugger;
                            if (result.data) {
                                _this.$rootScope.$emit("successnotify", { msg: "Wall Post is created successfully", status: "success" });
                                _this.wallpost = new culamaApp.areas.companyWall.models.WallPost();
                                _this.$rootScope.$emit("toggleLoader", false);
                                window.location.href = "/#/managecompanywallposts?wid=" + _this.scope.wallID;
                            }
                            else {
                                _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                            }
                            _this.$rootScope.$emit("toggleLoader", false);
                        });
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
