/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var CompanyUsersController = (function () {
        function CompanyUsersController(scope, $rootScope, companyService, $compile, $filter, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, commonService, loginService) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.companyService = companyService;
            this.$compile = $compile;
            this.$filter = $filter;
            this.$timeout = $timeout;
            this.$resource = $resource;
            this.DTOptionsBuilder = DTOptionsBuilder;
            this.DTColumnDefBuilder = DTColumnDefBuilder;
            this.commonService = commonService;
            this.loginService = loginService;
            this.newuser = new culamaApp.UserDetail();
            this.edituser = new culamaApp.UserDetail();
            this.cservice = companyService;
            this.lservice = loginService;
            this.scope.cardview = true;
            this.scope.CompanyName = $rootScope.LoggedUser.CustomerName;
            this.scope.companyPrefix = $rootScope.LoggedUser.CustomerPrefix;
            this.newuser.CustomerId = this.$rootScope.LoggedUser.CustomerId;
            this.scope.IsPhoneUnique = true;
            this.scope.IsPhoneUniqueProcess = false;
            this.scope.IsUsernameUnique = true;
            this.scope.IsUsernameUniqueProcess = false;
            this.scope.IsEditMode = false;
            this.scope.edituserid = this.getParameterByName("id");
            if (this.scope.edituserid != "" && this.scope.edituserid != null && this.scope.edituserid != undefined) {
                this.scope.IsEditMode = true;
            }
            this.getCompanyUsers(this.$rootScope.LoggedUser.CustomerId.toString());
            //this.scope.selectize_c_options = [
            //    {
            //        "Id": "1",
            //        "UserGroupName": "Admin"
            //    },
            //    {
            //        "Id": "2",
            //        "UserGroupName": "Customer Admin"
            //    },
            //    {
            //        "Id": "3",
            //        "UserGroupName": "Users"
            //    }];
            //this.newuser.UserGroupId = 1;
            this.scope.selectize_c_options = [];
            this.scope.selectize_c_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'Id',
                labelField: 'Name'
                //labelField: 'UserGroupName'
            };
            this.scope.selectize_a_options = [];
            this.scope.selectize_a_config = {
                plugins: {
                    'tooltip': ''
                },
                create: true,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'Id',
                labelField: 'Description'
            };
            this.scope.selectize_b_options = [];
            this.scope.selectize_b_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'Id',
                labelField: 'Description'
            };
            //this.scope.userroles = ['Company Admin', 'Users'];
            this.scope.userroles = [];
            scope.$on('onLastRepeat', function (scope1, element, attrs) {
                scope.$apply(function () {
                    UIkit.grid($('#contact_list'), {
                        controls: '#contact_list_filter',
                        gutter: 20
                    });
                });
            });
            scope.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDisplayLength(10)
                .withOption('initComplete', function () {
                $timeout(function () {
                    $compile($('.dt-uikit .md-input'))(scope);
                });
            });
            scope.dtColumnDefs = [
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
            this.getLanguages();
            this.getUserGroups();
            scope.changeView = function (view) {
                if (view != "card") {
                    scope.cardview = false;
                }
                else {
                    scope.cardview = true;
                }
            };
            var cobj = this;
            scope.deleteUser = function (id) {
                UIkit.modal.confirm('Are you sure you want to delete?', function () {
                    cobj.DeleteCompanyUser(id);
                });
            };
        }
        CompanyUsersController.prototype.getLanguages = function () {
            var _this = this;
            this.commonService.getLanguages().then(function (result) {
                _this.scope.selectize_a_options = result.data;
                _this.scope.selectize_b_options = result.data;
            });
        };
        CompanyUsersController.prototype.getUserGroups = function () {
            var _this = this;
            this.cservice.getUserGroups().then(function (result) {
                var roles = [];
                if (result.data.length > 0) {
                    _this.scope.selectize_c_options = result.data;
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].Name.toLowerCase() != "Administrator".toLowerCase()) {
                            roles.push(result.data[i].Name);
                        }
                    }
                    _this.scope.userroles = roles;
                }
            });
        };
        CompanyUsersController.prototype.getCompanyUsers = function (companyid) {
            var _this = this;
            var currentObj = this;
            this.$rootScope.$emit("toggleLoader", true);
            var ft = this.$filter;
            this.cservice.getUsersByCompanyId(companyid).then(function (result) {
                $.each(result.data, function () {
                    if (typeof this.PhoneActivatedOn === 'string' || typeof this.LastActivationAttempt === 'string') {
                        var activationon = new Date(parseInt(this.PhoneActivatedOn.substr(6)));
                        var lastactivation = new Date(parseInt(this.LastActivationAttempt.substr(6)));
                        this.PhoneActivatedOn = ft('date')(activationon, "MMM dd yyyy HH:mm");
                        this.LastActivationAttempt = ft('date')(lastactivation, "MMM dd yyyy HH:mm");
                    }
                    if (this.Base64StringofUserPhoto != null)
                        this.user_photo = "data:image/jpeg;base64," + this.Base64StringofUserPhoto.toString();
                    else
                        this.user_photo = "assets/img/avatars/avatar_02.png";
                });
                _this.scope.contact_list = result.data;
                _this.$rootScope.$emit("toggleLoader", false);
                if (_this.scope.IsEditMode) {
                    var euid = _this.scope.edituserid;
                    var findobj;
                    $.each(_this.scope.contact_list, function (index) {
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
        CompanyUsersController.prototype.CreateUser = function () {
            var _this = this;
            if (this.scope.IsPhoneUnique && this.scope.IsUsernameUnique && createUserForm.checkValidity()) {
                var base64Arr = [];
                this.$rootScope.$emit("toggleLoader", true);
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
                        //this.newuser.Base64StringofUserPhoto = realData;
                    }
                }
                this.newuser.UserPhoto = base64Arr;
                this.newuser.UserName = this.scope.companyPrefix + "-" + this.newuser.UserName;
                this.cservice.createUser(this.newuser).then(function (result) {
                    if (result.data) {
                        _this.$rootScope.$emit("successnotify", { msg: "Your user is created successfully", status: "success" });
                    }
                    else {
                        _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                    _this.$rootScope.$emit("toggleLoader", false);
                    _this.newuser = new culamaApp.UserDetail();
                    window.location.href = "/#/companyusers";
                });
            }
        };
        CompanyUsersController.prototype.EditUser = function () {
            var _this = this;
            if (this.scope.IsPhoneUnique && this.scope.IsUsernameUnique && editUserForm.checkValidity()) {
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
                        //this.edituser.Base64StringofUserPhoto = editrealData.toString();
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
                this.edituser.UserName = this.scope.companyPrefix + "-" + this.edituser.UserName;
                this.lservice.saveUserDetail(this.edituser).then(function (result) {
                    _this.$rootScope.$emit("toggleLoader", false);
                    if (result.data != "") {
                        _this.edituser = result.data;
                        _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                        window.location.href = "/#/companyusers";
                    }
                    else {
                        _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                });
            }
        };
        CompanyUsersController.prototype.DeleteCompanyUser = function (id) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.deleteUser(id).then(function (result) {
                _this.$rootScope.$emit("toggleLoader", false);
                if (result.data) {
                    var userlist = _this.scope.contact_list;
                    $.each(userlist, function (index) {
                        if (this.UserId === id) {
                            userlist.splice(index, 1);
                            return false;
                        }
                    });
                    _this.scope.contact_list = userlist;
                    _this.$rootScope.$emit("successnotify", { msg: "Your user is deleted successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
            });
        };
        CompanyUsersController.prototype.checkPhoneUnique = function () {
            var _this = this;
            this.scope.IsPhoneUniqueProcess = true;
            if (this.scope.IsEditMode) {
                this.lservice.getUserDetailsbyPhone(this.edituser.Phone).then(function (result) {
                    _this.scope.IsPhoneUniqueProcess = false;
                    if (result.data != "") {
                        if (result.data.UserId !== _this.edituser.UserId) {
                            _this.scope.IsPhoneUnique = false;
                            document.getElementById("user_input_phoneno").valid = false;
                        }
                        else {
                            _this.scope.IsPhoneUnique = true;
                            document.getElementById("user_input_phoneno").valid = true;
                        }
                    }
                    else {
                        _this.scope.IsPhoneUnique = true;
                        document.getElementById("user_input_phoneno").valid = true;
                    }
                });
            }
            else {
                this.lservice.getUserDetailsbyPhone(this.newuser.Phone).then(function (result) {
                    _this.scope.IsPhoneUniqueProcess = false;
                    if (result.data != "") {
                        _this.scope.IsPhoneUnique = false;
                        document.getElementById("user_input_phoneno").valid = false;
                    }
                    else {
                        _this.scope.IsPhoneUnique = true;
                        document.getElementById("user_input_phoneno").valid = true;
                    }
                });
            }
        };
        CompanyUsersController.prototype.checkUserNameUnique = function () {
            var _this = this;
            this.scope.IsUsernameUniqueProcess = true;
            if (this.scope.IsEditMode) {
                var uname = this.scope.companyPrefix + "-" + this.edituser.UserName;
                this.lservice.getUserDetailsbyUsername(uname).then(function (result) {
                    _this.scope.IsUsernameUniqueProcess = false;
                    if (result.data != "") {
                        if (result.data.UserId !== _this.edituser.UserId) {
                            _this.scope.IsUsernameUnique = false;
                            document.getElementById("user_input_username").valid = false;
                        }
                        else {
                            _this.scope.IsUsernameUnique = true;
                            document.getElementById("user_input_username").valid = true;
                        }
                    }
                    else {
                        _this.scope.IsUsernameUnique = true;
                        document.getElementById("user_input_username").valid = true;
                    }
                });
            }
            else {
                var uname = this.scope.companyPrefix + "-" + this.newuser.UserName;
                this.lservice.getUserDetailsbyUsername(uname).then(function (result) {
                    _this.scope.IsUsernameUniqueProcess = false;
                    if (result.data != "") {
                        _this.scope.IsUsernameUnique = false;
                        document.getElementById("user_input_username").valid = false;
                    }
                    else {
                        _this.scope.IsUsernameUnique = true;
                        document.getElementById("user_input_username").valid = true;
                    }
                });
            }
        };
        CompanyUsersController.prototype.getParameterByName = function (name) {
            var url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        return CompanyUsersController;
    }());
    CompanyUsersController.$inject = ["$scope", "$rootScope", "companyService", "$compile", "$filter", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "loginService"];
    angular.module("culamaApp")
        .controller("companyUsersController", CompanyUsersController);
})(culamaApp || (culamaApp = {}));
