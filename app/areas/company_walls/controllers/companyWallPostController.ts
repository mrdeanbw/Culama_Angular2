
/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp.areas.companyWall.controllers {
    class CompanyWallPostController {
        public wallpost: culamaApp.areas.companyWall.models.WallPost = new culamaApp.areas.companyWall.models.WallPost();
        static $inject = ["$scope", "$rootScope", "$sce", "$filter", "companyWallPostService"];

        constructor(public scope: any, public $rootScope: any, public $sce: any, public $filter: any, public companyWallPostService: culamaApp.CompanyWallPostService) {
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
            }
        }

        getWallPosts(wallId) {
            this.$rootScope.$emit("toggleLoader", true);
            var ft = this.$filter;
            this.companyWallPostService.getCompanyWallPostsByWallId(wallId).then((result: ng.IHttpPromiseCallbackArg<any>) => {
                if (result.data.length > 0) {
                    $.each(result.data, function () {
                        if (typeof this.CreatedOn === 'string') {
                            var activationon = new Date(parseInt(this.CreatedOn.substr(6)));
                            this.CreatedOn = ft('date')(activationon, "dd MMM yyyy");
                        }
                    });
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

        createWallPost() {
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
                    var dataType = block[0].split(":")[1];// In this case "image/png"

                    // get the real base64 content of the file
                    var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

                    for (var i = 0; i < realData.length; i++) {
                        base64Arr.push(realData[i]);
                    }
                    imgArray.push(base64Arr);
                });
                this.wallpost.WallPostImages = imgArray;
            }

            this.wallpost.WallId = this.scope.wallID;
            this.wallpost.CreatorId = this.$rootScope.LoggedUser.UserId;

            this.companyWallPostService.createWallPost(this.wallpost).then((result: ng.IHttpPromiseCallbackArg<culamaApp.areas.companyWall.models.WallPost>) => {
                debugger;
                if (result.data) {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Wall Post is created successfully", status: "success" });

                    this.wallpost = new culamaApp.areas.companyWall.models.WallPost();
                    this.$rootScope.$emit("toggleLoader", false);
                    window.location.href = "/#/managecompanywallposts?wid=" + this.scope.wallID;
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                this.$rootScope.$emit("toggleLoader", false); 
            });
        }

    }

    angular.module("culamaApp")
        .controller("companyWallPostController", CompanyWallPostController);
}