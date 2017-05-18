
/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp.areas.companyWall.controllers {
    class CompanyWallController {
        public newwall: culamaApp.areas.companyWall.models.Wall = new culamaApp.areas.companyWall.models.Wall();
        static $inject = ["$scope", "$rootScope", "$sce", "$filter", "$compile", "$timeout", "DTOptionsBuilder", "DTColumnDefBuilder", "companyWallService"];

        constructor(public scope: ICompanyWallScope, public $rootScope: any, public $sce: any, public $filter: any, public $compile: any, public $timeout: any, public DTOptionsBuilder: any, public DTColumnDefBuilder: any, public companyWallService: culamaApp.CompanyWallService) {
            this.scope.cardview = true;
            this.scope.isHasWalls = false;
            this.scope.isEditMode = false;
            this.scope.editedWallId;

            this.getCompanyWalls();

            var $formValidate = $('#formCompanyWall');
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

            var currObj = this;
            this.scope.saveWallInfo = function () {
                debugger;
                currObj.createCompanyWall();
            }

            this.scope.editWallInfo = function (wallid) {
                currObj.scope.isEditMode = true;
                currObj.scope.editedWallId = wallid;
                currObj.getCompanyWalls();
            }

            this.scope.deletewall = function (id) {
                UIkit.modal.confirm('Are you sure you want to delete?', function () {
                    currObj.deleteCompanyWall(id);
                });
            }

            this.scope.changeView = function (view) {
                if (view != "card") {
                    currObj.scope.cardview = false;
                } else {
                    currObj.scope.cardview = true;
                }

            };
        }

        getCompanyWalls() {
            this.$rootScope.$emit("toggleLoader", true);
            var ft = this.$filter;
            this.companyWallService.getCompanyWalls().then((result: ng.IHttpPromiseCallbackArg<any>) => {
                if (result.data.length > 0) {
                    this.scope.isHasWalls = true;
                    $.each(result.data, function () {
                        if (typeof this.CreatedOn === 'string') {
                            var createdon = new Date(parseInt(this.CreatedOn.substr(6)));
                            this.CreatedOn = ft('date')(createdon, "dd MMM yyyy");
                        }

                        if (this.WallBase64String != null)
                            this.WallImage = "data:image/jpeg;base64," + this.WallBase64String.toString();
                        else
                            this.WallImage = "assets/img/avatars/avatar_02.png";
                    });
                    this.scope.companyWalls = result.data;                    
                    if (this.scope.isEditMode) {
                        var wallid = this.scope.editedWallId;
                        var findobj;
                        $.each(this.scope.companyWalls, function (index) {
                            if (this.Id === wallid) {
                                findobj = this;
                            }
                        });
                        this.newwall = findobj;
                    }
                }
                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        createCompanyWall() {
            this.$rootScope.$emit("toggleLoader", true);
            var base64Arr = [];
            var checkLogoIsModified = document.getElementById("uploaded_Image1");
            if (checkLogoIsModified != null || checkLogoIsModified != undefined) {
                var logo = document.getElementById("uploaded_Image1").getAttribute("src");
                if (logo != "assets/img/avatars/user.png") {
                    var myBaseString = logo;
                    var reader = new FileReader();

                    // Split the base64 string in data and contentType
                    var block = myBaseString.split(";");

                    // Get the content type
                    var dataType = block[0].split(":")[1];// In this case "image/png"

                    // get the real base64 content of the file
                    var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

                    // to create and add the String array of the Base64 String
                    for (var i = 0; i < realData.length; i++) {
                        base64Arr.push(realData[i]);
                    }
                }
            }
            this.newwall.WallImage = base64Arr;
            this.companyWallService.createCompanyWall(this.newwall).then((result: ng.IHttpPromiseCallbackArg<culamaApp.Wall>) => {
                debugger;
                if (result.data) {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Your wall is created successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                this.$rootScope.$emit("toggleLoader", false);
                this.newwall = new culamaApp.areas.companyWall.models.Wall();
                var modal = UIkit.modal("#dailog_create_companywall");
                modal.hide();
                this.getCompanyWalls();
            });
        }

        editCompanyWall() {
            this.$rootScope.$emit("toggleLoader", true);
            var base64Arr = [];
            var ConvertedBase64String = "";
            var checkLogoIsModified = document.getElementById("uploaded_Image1");

            if (checkLogoIsModified != null || checkLogoIsModified != undefined) {
                var editlogo = document.getElementById("uploaded_Image1").getAttribute("src");
                if (editlogo != this.newwall.WallBase64String) {

                    var editmyBaseString = editlogo;

                    // Split the base64 string in data and contentType
                    var editblock = editmyBaseString.split(";");

                    // Get the content type
                    var editdataType = editblock[0].split(":")[1];// In this case "image/png"

                    // get the real base64 content of the file
                    var editrealData = editblock[1].split(",")[1];// In this case "iVBORw0KGg....           

                    ConvertedBase64String = editrealData;
                    //this.edituser.Base64StringofUserPhoto = editrealData.toString();
                }
            }
            else {
                ConvertedBase64String = this.newwall.WallBase64String;
            }
            // to create and add the String array of the Base64 String
            for (var i = 0; i < ConvertedBase64String.length; i++) {
                base64Arr.push(ConvertedBase64String[i]);
            }
            this.newwall.WallImage = base64Arr;
            this.newwall.WallBase64String = null;
            this.newwall.CreatedOn = null;
            this.companyWallService.updateCompanyWall(this.newwall).then((result: ng.IHttpPromiseCallbackArg<culamaApp.Wall>) => {
                if (result.data != "") {                    
                    this.$rootScope.$emit("successnotify",
                        { msg: "Your information is updated successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                var modal = UIkit.modal("#dailog_create_companywall");
                modal.hide();
                this.getCompanyWalls();
                this.$rootScope.$emit("toggleLoader", false);
            });
        }

        deleteCompanyWall(id) {
            this.$rootScope.$emit("toggleLoader", true);
            this.companyWallService.deleteCompanyWall(id).then((result: ng.IHttpPromiseCallbackArg<boolean>) => {
                if (result.data) {
                    var companywalllist = this.scope.companyWalls;
                    $.each(companywalllist, function (index) {
                        if (this.Id === id) {
                            companywalllist.splice(index, 1);
                            return false;
                        }
                    });
                    this.scope.companyWalls = companywalllist;

                    this.$rootScope.$emit("successnotify",
                        { msg: "Your wall is deleted successfully", status: "success" });
                } else {
                    this.$rootScope.$emit("successnotify",
                        { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                this.$rootScope.$emit("toggleLoader", false);
            });
        }
    }

    angular.module("culamaApp")
        .controller("companyWallController", CompanyWallController);
}