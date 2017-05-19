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
                    function CompanyWallPostController(scope, $rootScope, $sce, $compile, $filter, companyWallPostService) {
                        this.scope = scope;
                        this.$rootScope = $rootScope;
                        this.$sce = $sce;
                        this.$compile = $compile;
                        this.$filter = $filter;
                        this.companyWallPostService = companyWallPostService;
                        this.wallpost = new culamaApp.areas.companyWall.models.WallPost();
                        this.newwallpost = new culamaApp.areas.companyWall.models.WallPost();
                        var currObj = this;
                        var currUrl;
                        this.scope.isWallPosts = false;
                        this.scope.isEditMode = false;
                        this.scope.wallID = this.getParameterByName("wid");
                        this.getWallInfo(this.scope.wallID);
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
                        this.scope.editWallPost = function (wallPostId) {
                            currObj.scope.isEditMode = true;
                            currObj.getWallPostDetailsByWallPostId(wallPostId);
                        };
                        this.scope.deleteWallPost = function (wallpostId) {
                            UIkit.modal.confirm('Are you sure want to delete?', function () {
                                currObj.deleteWallPost(wallpostId);
                            });
                        };
                        this.scope.removeExistingImg = function (existingImgId) {
                            if (currObj.newwallpost.RemoveExistingImageIds == null)
                                currObj.newwallpost.RemoveExistingImageIds = existingImgId;
                            else
                                currObj.newwallpost.RemoveExistingImageIds += "," + existingImgId;
                            $('#span' + existingImgId).remove();
                        };
                    }
                    CompanyWallPostController.prototype.getWallInfo = function (wallId) {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        this.companyWallPostService.getWallInfoByWallId(wallId).then(function (result) {
                            if (result.data != null) {
                                if (result.data.WallBase64String != null)
                                    result.data.WallBase64String = "data:image/jpeg;base64," + result.data.WallBase64String.toString();
                                else
                                    result.data.WallBase64String = "assets/img/avatars/avatar_02.png";
                                _this.scope.wallDetails = result.data;
                            }
                            _this.$rootScope.$emit("toggleLoader", false);
                        });
                    };
                    CompanyWallPostController.prototype.getWallPosts = function (wallId) {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        var currentObj = this;
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
                        this.$rootScope.$emit("toggleLoader", false);
                    };
                    CompanyWallPostController.prototype.getWallPostDetailsByWallPostId = function (wallPostId) {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        var ft = this.$filter;
                        this.companyWallPostService.getCompanyWallPostInfoByPostId(wallPostId).then(function (result) {
                            if (result.data != null) {
                                _this.newwallpost = result.data;
                                if (result.data.WallPostMediaInfo != null) {
                                    var existingImgs = "";
                                    $("#preview_images").empty();
                                    for (var i = 0; i < result.data.WallPostMediaInfo.length; i++) {
                                        var fullImg = "data:image/png;base64," + result.data.WallPostMediaInfo[i].PostImageBase64String;
                                        existingImgs += "<span id='span" + result.data.WallPostMediaInfo[i].Id + "' class='pip pip-container'>";
                                        existingImgs += "<img class='imageThumb' src='" + fullImg + "' />";
                                        existingImgs += "<br/><span ng-click='removeExistingImg(" + result.data.WallPostMediaInfo[i].Id + ")' class='remove remove-icon'><a class=''><i class='material-icons'></i></a></span>";
                                        existingImgs += "</span>";
                                    }
                                    var compileDivInfo = _this.$compile(existingImgs)(_this.scope);
                                    $("#preview_images").append(compileDivInfo);
                                }
                            }
                        });
                        this.$rootScope.$emit("toggleLoader", false);
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
                            this.newwallpost.WallPostImages = imgArray;
                        }
                        this.newwallpost.WallId = this.scope.wallID;
                        this.newwallpost.CreatorId = this.$rootScope.LoggedUser.UserId;
                        this.companyWallPostService.createWallPost(this.newwallpost).then(function (result) {
                            if (result.data) {
                                _this.$rootScope.$emit("successnotify", { msg: "Wall Post is created successfully", status: "success" });
                                _this.newwallpost = new culamaApp.areas.companyWall.models.WallPost();
                                var modal = UIkit.modal("#WallPost_Dailog");
                                modal.hide();
                                $("#preview_images").empty();
                                _this.getWallPosts(_this.scope.wallID);
                            }
                            else {
                                _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                            }
                            _this.$rootScope.$emit("toggleLoader", false);
                        });
                    };
                    CompanyWallPostController.prototype.editWallPost = function () {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        var isImgs = $('#preview_images').html();
                        var imgArray = [];
                        if (isImgs != "") {
                            var addedImgs = $('#preview_images').find('.add-new-img').find('img');
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
                            this.newwallpost.WallPostImages = imgArray;
                        }
                        this.newwallpost.WallPostMediaInfo = null;
                        this.companyWallPostService.saveWallPostDetails(this.newwallpost).then(function (result) {
                            if (result.data != "") {
                                var ft = _this.$filter;
                                var createdon = new Date(parseInt(result.data.CreatedOn.substr(6)));
                                result.data.CreatedOn = ft('date')(createdon, "dd MMM yyyy");
                                var wallPostList = _this.scope.wallPosts;
                                $.each(wallPostList, function (index) {
                                    var u = this;
                                    if (u.Id == result.data.Id) {
                                        wallPostList[index] = result.data;
                                    }
                                });
                                _this.scope.wallPosts = wallPostList;
                                _this.newwallpost = new culamaApp.areas.companyWall.models.WallPost();
                                var modal = UIkit.modal("#WallPost_Dailog");
                                modal.hide();
                                $("#preview_images").empty();
                                _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                            }
                            else {
                                _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                            }
                            _this.$rootScope.$emit("toggleLoader", false);
                        });
                    };
                    CompanyWallPostController.prototype.deleteWallPost = function (wallpostId) {
                        var _this = this;
                        this.$rootScope.$emit("toggleLoader", true);
                        this.companyWallPostService.deleteWallPost(wallpostId).then(function (result) {
                            if (result.data) {
                                var wallPostList = _this.scope.wallPosts;
                                $.each(wallPostList, function (index) {
                                    if (this.Id === wallpostId) {
                                        wallPostList.splice(index, 1);
                                        return false;
                                    }
                                });
                                _this.scope.wallPosts = wallPostList;
                                _this.$rootScope.$emit("successnotify", { msg: "Wall Post is deleted successfully", status: "success" });
                            }
                            else {
                                _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                            }
                            _this.$rootScope.$emit("toggleLoader", false);
                        });
                    };
                    return CompanyWallPostController;
                }());
                CompanyWallPostController.$inject = ["$scope", "$rootScope", "$sce", "$compile", "$filter", "companyWallPostService"];
                angular.module("culamaApp")
                    .controller("companyWallPostController", CompanyWallPostController);
            })(controllers = companyWall.controllers || (companyWall.controllers = {}));
        })(companyWall = areas.companyWall || (areas.companyWall = {}));
    })(areas = culamaApp.areas || (culamaApp.areas = {}));
})(culamaApp || (culamaApp = {}));
