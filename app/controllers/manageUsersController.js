/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var ManageUsersController = (function () {
    function ManageUsersController(scope, $rootScope, $compile, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, commonService, companyService, loginService) {
        this.scope = scope;
        this.$rootScope = $rootScope;
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$resource = $resource;
        this.DTOptionsBuilder = DTOptionsBuilder;
        this.DTColumnDefBuilder = DTColumnDefBuilder;
        this.commonService = commonService;
        this.companyService = companyService;
        this.loginService = loginService;
        this.newuser = new culamaApp.UserDetail();
        this.edituser = new culamaApp.UserDetail();
        if ($rootScope.LoggedUser.UserGroupId !== 1) {
            window.location.href = "#/error";
        }
        scope.vm = this;
        scope.vm.dt_data = [];
        scope.vm.CompanyName = $rootScope.LoggedUser.CustomerName;
        this.newuser.CustomerId = this.$rootScope.LoggedUser.CustomerId;
        scope.vm.IsPhoneUnique = true;
        scope.vm.IsPhoneUniqueProcess = false;
        scope.vm.IsUsernameUnique = true;
        scope.vm.IsUsernameUniqueProcess = false;
        this.scope.vm.IsEditMode = false;
        this.scope.vm.edituserid = this.getParameterByName("id");
        if (this.scope.vm.edituserid != "" && this.scope.vm.edituserid != null && this.scope.vm.edituserid != undefined) {
            this.scope.vm.IsEditMode = true;
        }
        this.getUsers();
        scope.vm.selectize_c_options = [
            {
                "Id": "1",
                "UserGroupName": "Admin"
            },
            {
                "Id": "2",
                "UserGroupName": "Customer Admin"
            },
            {
                "Id": "3",
                "UserGroupName": "Users"
            }];
        scope.vm.newuser.UserGroupId = 1;
        scope.vm.selectize_c_config = {
            plugins: {
                'tooltip': ''
            },
            create: false,
            maxItems: 1,
            placeholder: 'Select...',
            valueField: 'Id',
            labelField: 'UserGroupName'
        };
        scope.vm.selectize_a_options = [];
        scope.vm.selectize_a_config = {
            plugins: {
                'tooltip': ''
            },
            create: true,
            maxItems: 1,
            placeholder: 'Select...',
            valueField: 'Id',
            labelField: 'Description'
        };
        scope.vm.selectize_b_options = [];
        scope.vm.selectize_b_config = {
            plugins: {
                'tooltip': ''
            },
            create: false,
            maxItems: 1,
            placeholder: 'Select...',
            valueField: 'Id',
            labelField: 'Description'
        };
        scope.vm.companies = [];
        scope.vm.selectize_z_config = {
            plugins: {
                'tooltip': ''
            },
            create: false,
            maxItems: 1,
            placeholder: 'Select...',
            valueField: 'Id',
            labelField: 'CustomerName',
            onChange: function (value) {
                $.each(scope.vm.companies, function (index) {
                    if (this.Id == value) {
                        scope.vm.companyPrefix = this.Prefix;
                    }
                });
            }
        };
        scope.vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withDisplayLength(10)
            .withOption('initComplete', function () {
            $timeout(function () {
                $compile($('.dt-uikit .md-input'))(scope);
            });
        });
        scope.vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5)
        ];
        var $formValidate = $('#createUserForm');
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
        $formValidate = $('#editUserForm');
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
        this.lservice = loginService;
        this.cservice = commonService;
        this.getLanguages();
        this.getCompanies();
    }
    ManageUsersController.prototype.getLanguages = function () {
        var _this = this;
        this.cservice.getLanguages().then(function (result) {
            _this.scope.vm.selectize_a_options = result.data;
            _this.scope.vm.selectize_b_options = result.data;
        });
    };
    ManageUsersController.prototype.getUsers = function () {
        var _this = this;
        var currentObj = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getUsers().then(function (result) {
            _this.scope.vm.dt_data = result.data;
            _this.$rootScope.$emit("toggleLoader", false);
            if (_this.scope.vm.IsEditMode) {
                var euid = _this.scope.vm.edituserid;
                var findobj;
                $.each(_this.scope.vm.dt_data, function (index) {
                    if (this.UserId.toString() === euid) {
                        findobj = this;
                        if (findobj.Base64StringofUserPhoto != null)
                            currentObj.scope.userphoto = "data:image/jpeg;base64," + findobj.Base64StringofUserPhoto.toString();
                        else
                            currentObj.scope.userphoto = "assets/img/avatars/user.png";
                    }
                });
                _this.edituser = findobj;
                _this.edituser.UserName = _this.edituser.UserName.toString().replace(_this.edituser.Customer.Prefix + "-", "");
            }
        });
    };
    ManageUsersController.prototype.getCompanies = function () {
        var _this = this;
        this.$rootScope.$emit("toggleLoader", true);
        this.companyService.getCompanies().then(function (result) {
            _this.scope.vm.companies = result.data;
            _this.$rootScope.$emit("toggleLoader", false);
        });
    };
    ManageUsersController.prototype.CreateUser = function () {
        var _this = this;
        if (this.scope.vm.IsPhoneUnique && this.scope.vm.IsUsernameUnique && createUserForm.checkValidity()) {
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
                    var dataType = block[0].split(":")[1]; // In this case "image/png"
                    // get the real base64 content of the file
                    var realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."
                    // to create and add the String array of the Base64 String
                    for (var i = 0; i < realData.length; i++) {
                        base64Arr.push(realData[i]);
                    }
                }
            }
            this.newuser.UserPhoto = base64Arr;
            this.newuser.UserName = this.scope.vm.companyPrefix + "-" + this.newuser.UserName;
            this.companyService.createUser(this.newuser).then(function (result) {
                if (result.data) {
                    _this.$rootScope.$emit("successnotify", { msg: "Your user is created successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                _this.$rootScope.$emit("toggleLoader", false);
                _this.newuser = new culamaApp.UserDetail();
                window.location.href = "/#/manageusers";
            });
        }
    };
    ManageUsersController.prototype.EditUser = function () {
        var _this = this;
        if (this.scope.vm.IsPhoneUnique && this.scope.vm.IsUsernameUnique && editUserForm.checkValidity()) {
            this.$rootScope.$emit("toggleLoader", true);
            var base64Arr = [];
            var ConvertedBase64String = "";
            var checkLogoIsModified = document.getElementById("uploaded_Image1");
            if (checkLogoIsModified != null || checkLogoIsModified != undefined) {
                var editlogo = document.getElementById("uploaded_Image1").getAttribute("src");
                if (editlogo != this.edituser.Base64StringofUserPhoto) {
                    var editmyBaseString = editlogo;
                    // Split the base64 string in data and contentType
                    var editblock = editmyBaseString.split(";");
                    // Get the content type
                    var editdataType = editblock[0].split(":")[1]; // In this case "image/png"
                    // get the real base64 content of the file
                    var editrealData = editblock[1].split(",")[1]; // In this case "iVBORw0KGg....           
                    ConvertedBase64String = editrealData;
                }
            }
            else {
                ConvertedBase64String = this.edituser.Base64StringofUserPhoto;
            }
            // to create and add the String array of the Base64 String
            for (var i = 0; i < ConvertedBase64String.length; i++) {
                base64Arr.push(ConvertedBase64String[i]);
            }
            this.edituser.UserPhoto = base64Arr;
            this.edituser.Base64StringofUserPhoto = null;
            this.edituser.UserName = this.scope.vm.companyPrefix + "-" + this.edituser.UserName;
            this.lservice.saveUserDetail(this.edituser).then(function (result) {
                _this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    _this.edituser = result.data;
                    _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                    window.location.href = "/#/manageusers";
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
            });
        }
    };
    ManageUsersController.prototype.checkPhoneUnique = function () {
        var _this = this;
        this.scope.vm.IsPhoneUniqueProcess = true;
        if (this.scope.vm.IsEditMode) {
            this.lservice.getUserDetailsbyPhone(this.edituser.Phone).then(function (result) {
                _this.scope.vm.IsPhoneUniqueProcess = false;
                if (result.data != "") {
                    if (result.data.UserId !== _this.edituser.UserId) {
                        _this.scope.vm.IsPhoneUnique = false;
                        document.getElementById("user_input_phoneno").valid = false;
                    }
                    else {
                        _this.scope.vm.IsPhoneUnique = true;
                        document.getElementById("user_input_phoneno").valid = true;
                    }
                }
                else {
                    _this.scope.vm.IsPhoneUnique = true;
                    document.getElementById("user_input_phoneno").valid = true;
                }
            });
        }
        else {
            this.lservice.getUserDetailsbyPhone(this.newuser.Phone).then(function (result) {
                _this.scope.vm.IsPhoneUniqueProcess = false;
                if (result.data != "") {
                    _this.scope.vm.IsPhoneUnique = false;
                    document.getElementById("user_input_phoneno").valid = false;
                }
                else {
                    _this.scope.vm.IsPhoneUnique = true;
                    document.getElementById("user_input_phoneno").valid = true;
                }
            });
        }
    };
    ManageUsersController.prototype.checkUserNameUnique = function () {
        var _this = this;
        this.scope.vm.IsUsernameUniqueProcess = true;
        if (this.scope.vm.IsEditMode) {
            var uname = this.scope.vm.companyPrefix + "-" + this.edituser.UserName;
            this.lservice.getUserDetailsbyUsername(uname).then(function (result) {
                _this.scope.vm.IsUsernameUniqueProcess = false;
                if (result.data != "") {
                    if (result.data.UserId !== _this.edituser.UserId) {
                        _this.scope.vm.IsUsernameUnique = false;
                        document.getElementById("user_input_username").valid = false;
                    }
                    else {
                        _this.scope.vm.IsUsernameUnique = true;
                        document.getElementById("user_input_username").valid = true;
                    }
                }
                else {
                    _this.scope.vm.IsUsernameUnique = true;
                    document.getElementById("user_input_username").valid = true;
                }
            });
        }
        else {
            var uname = this.scope.vm.companyPrefix + "-" + this.newuser.UserName;
            this.lservice.getUserDetailsbyUsername(uname).then(function (result) {
                _this.scope.vm.IsUsernameUniqueProcess = false;
                if (result.data != "") {
                    _this.scope.vm.IsUsernameUnique = false;
                    document.getElementById("user_input_username").valid = false;
                }
                else {
                    _this.scope.vm.IsUsernameUnique = true;
                    document.getElementById("user_input_username").valid = true;
                }
            });
        }
    };
    ManageUsersController.prototype.getParameterByName = function (name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    ManageUsersController.$inject = ["$scope", "$rootScope", "$compile", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "companyService", "loginService"];
    return ManageUsersController;
}());
angular.module("culamaApp")
    .controller("manageUsersController", ManageUsersController);
