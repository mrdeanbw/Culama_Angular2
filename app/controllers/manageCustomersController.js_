/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var ascope;
var mainCobj;
var culamaApp;
(function (culamaApp) {
    var ManageCustomersController = (function () {
        function ManageCustomersController(scope, $rootScope, $compile, $filter, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, commonService, companyService, loginService) {
            this.scope = scope;
            this.$rootScope = $rootScope;
            this.$compile = $compile;
            this.$filter = $filter;
            this.$timeout = $timeout;
            this.$resource = $resource;
            this.DTOptionsBuilder = DTOptionsBuilder;
            this.DTColumnDefBuilder = DTColumnDefBuilder;
            this.commonService = commonService;
            this.companyService = companyService;
            this.loginService = loginService;
            this.newuser = new culamaApp.UserDetail();
            this.newcompany = new culamaApp.Customer();
            this.editcompany = new culamaApp.Customer();
            this.lservice = loginService;
            this.cservice = commonService;
            this.compSrv = companyService;
            this.scope.CompanyUsers = [];
            this.scope.Customer = new culamaApp.Customer();
            if ($rootScope.LoggedUser.UserGroupId !== 1) {
                window.location.href = "#/error";
            }
            var cmobj = this;
            // Start Point
            this.scope.cmpPhoto = "";
            this.scope.SelectedUser = "";
            this.scope.recipientUsers = "";
            this.newcompany.logoBase64String = null;
            // This is the fixed or Default [white] color for the Background color
            this.newcompany.UiBackgroundContrastColor = "#ffffff";
            this.scope.selectize_users_notAllowed_Msg = [];
            this.scope.allowedUsers = [];
            this.scope.selectize_allrecipient_users = [];
            this.scope.recipients_users = [];
            this.scope.recipients_user_ids = [];
            this.scope.selectize_all_users_config = {
                plugins: {
                    'tooltip': ''
                },
                create: true,
                maxItems: 1,
                placeholder: 'Select...',
                valueField: 'UserId',
                labelField: 'FullIdentityName'
            };
            scope.allowEveryonetoMessage = function () {
                var ccheck = cmobj.scope.Customer.IsAllowMsgAllToEveryone;
                if (ccheck == true) {
                    cmobj.scope.Customer.RecipientList = null;
                }
                else {
                    cmobj.scope.selectize_users_notAllowed_Msg = cmobj.scope.CompanyUsers;
                    cmobj.scope.allowedUsers = [];
                }
                //cmobj.saveCompany("", "");
            };
            this.scope.addUser = function (selecteduserid, isAllowMessage) {
                //cmobj.getSelectedUserInfo(selecteduserid, isAllowMessage);
                if (isAllowMessage == true) {
                    var notAllowedUsers = cmobj.scope.selectize_users_notAllowed_Msg;
                    for (var t = 0; t < notAllowedUsers.length; t++) {
                        if (notAllowedUsers[t].UserId == selecteduserid) {
                            cmobj.scope.allowedUsers.push(notAllowedUsers[t]);
                            cmobj.scope.selectize_users_notAllowed_Msg.splice(t, 1);
                            break;
                        }
                    }
                }
                else {
                    var AllowedUsers = cmobj.scope.allowedUsers;
                    for (var t = 0; t < AllowedUsers.length; t++) {
                        if (AllowedUsers[t].UserId == selecteduserid) {
                            cmobj.scope.selectize_users_notAllowed_Msg.push(AllowedUsers[t]);
                            cmobj.scope.allowedUsers.splice(t, 1);
                            break;
                        }
                    }
                }
                //cmobj.scope.allowedUsers = newaddedMember;
            };
            this.scope.recipientAction = function (selectedrecipientid, ActionName) {
                if (cmobj.scope.Customer.RecipientList != null) {
                    var alreadyExistRecipients = cmobj.scope.Customer.RecipientList.toString().split(',');
                    cmobj.scope.recipients_user_ids = alreadyExistRecipients;
                }
                if (ActionName == "add") {
                    cmobj.scope.recipients_user_ids.push(selectedrecipientid);
                    var AllUsers = cmobj.scope.selectize_allrecipient_users;
                    for (var t = 0; t < AllUsers.length; t++) {
                        if (AllUsers[t].UserId == selectedrecipientid) {
                            cmobj.scope.recipients_users.push(AllUsers[t]);
                            cmobj.scope.selectize_allrecipient_users.splice(t, 1);
                            break;
                        }
                    }
                }
                else if (ActionName == "remove") {
                    // Remove it
                    for (var i = 0; i < cmobj.scope.recipients_user_ids.length; i++) {
                        if (cmobj.scope.recipients_user_ids[i] == selectedrecipientid)
                            cmobj.scope.recipients_user_ids.splice(i, 1);
                    }
                    for (var i = 0; i < cmobj.scope.recipients_users.length; i++) {
                        if (cmobj.scope.recipients_users[i].UserId == selectedrecipientid)
                            cmobj.scope.recipients_users.splice(i, 1);
                    }
                    // Push it
                    var AllUsers = cmobj.scope.CompanyUsers;
                    for (var t = 0; t < AllUsers.length; t++) {
                        if (AllUsers[t].UserId == selectedrecipientid) {
                            cmobj.scope.selectize_allrecipient_users.push(AllUsers[t]);
                            break;
                        }
                    }
                }
                //cmobj.scope.recipients_user_ids.push(selectedrecipientid);
                cmobj.scope.Customer.RecipientList = cmobj.scope.recipients_user_ids.toString();
                if (cmobj.scope.Customer.RecipientList == "")
                    cmobj.scope.Customer.RecipientList = null;
                //cmobj.saveCompany(selectedrecipientid, ActionName);
            };
            // End Point
            scope.vm = this;
            scope.vm.dt_data = [];
            scope.vm.editcompanyUsers = [];
            this.scope.IsEditMode = false;
            this.scope.editcompanyid = this.getParameterByName("id");
            if (this.scope.editcompanyid != "" && this.scope.editcompanyid != null && this.scope.editcompanyid != undefined) {
                this.scope.IsEditMode = true;
                this.getCompanyDetail(this.scope.editcompanyid);
            }
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
            scope.vm.dtuserOptions = DTOptionsBuilder
                .newOptions()
                .withDisplayLength(10)
                .withOption('initComplete', function () {
                $timeout(function () {
                    $compile($('.dt-uikit .md-input'))(scope);
                });
            });
            scope.vm.dtuserColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5)
            ];
            var $formValidate = $('#createCompanyForm');
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
            $formValidate = $('#editCompanyForm');
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
            this.getCompanies();
            var cobj = this;
            mainCobj = this;
            ascope = this.scope;
            scope.allowEveryonetoMessage = function () {
                var ccheck = cmobj.editcompany.IsAllowMsgAllToEveryone;
                if (ccheck == true) {
                    cmobj.scope.Customer.RecipientList = null;
                }
                else {
                    cmobj.scope.selectize_users_notAllowed_Msg = cmobj.scope.CompanyUsers;
                    cmobj.scope.allowedUsers = [];
                }
                //cmobj.saveCompany("", "");
            };
            scope.vm.deleteCompany = function (id) {
                UIkit.modal.confirm('Are you sure you want to delete?', function () {
                    cobj.DeleteCompany(id);
                });
            };
            scope.vm.getOtherCompanyUsers = function (um) {
                var selectize_userlist = [];
                $.each(ascope.vm.editcompanyUsers, function () {
                    if (this.UserId != um.UserId) {
                        selectize_userlist.push(this);
                    }
                });
                return selectize_userlist;
            };
            scope.vm.selectize_users_config = {
                plugins: {
                    'remove_button': {
                        label: ''
                    }
                },
                maxItems: null,
                valueField: 'UserId',
                labelField: 'FullIdentityName',
                searchField: 'FullIdentityName',
                create: true,
                placeholder: "Choose Users to send messages",
                render: {
                    option: function (planets_data, escape) {
                        return '<div class="option">' +
                            '<span class="title">' + escape(planets_data.FullIdentityName) + '</span>' +
                            '</div>';
                    },
                    item: function (planets_data, escape) {
                        return '<div class="item">' + escape(planets_data.FullIdentityName) + '</div>';
                    }
                },
                onItemAdd: function (input) {
                    var targetUserid = this.$input.attr("target");
                    var targetUser;
                    if (!isNaN(targetUserid)) {
                        $.each(ascope.vm.editcompanyUsers, function (index) {
                            if (this.UserId == parseInt(targetUserid)) {
                                targetUser = ascope.vm.editcompanyUsers[index];
                            }
                        });
                        var userMsgs = targetUser.UserMessages;
                        var isExsits = false;
                        $.each(userMsgs, function () {
                            if (this.AllowSendUserId == parseInt(input)) {
                                isExsits = true;
                            }
                        });
                        if (!isExsits) {
                            var msgu = new Object();
                            msgu.UserId = parseInt(targetUserid);
                            msgu.AllowSendUserId = parseInt(input);
                            targetUser.UserMessages.push(msgu);
                            mainCobj.saveCompanyUser(targetUser);
                        }
                    }
                },
                onItemRemove: function (input) {
                    var targetUserid = this.$input.attr("target");
                    var targetUser;
                    if (!isNaN(targetUserid)) {
                        $.each(ascope.vm.editcompanyUsers, function (index) {
                            if (this.UserId == parseInt(targetUserid)) {
                                targetUser = ascope.vm.editcompanyUsers[index];
                            }
                        });
                        var userMsgs = targetUser.UserMessages;
                        $.each(userMsgs, function (index) {
                            if (this.AllowSendUserId == parseInt(input)) {
                                userMsgs.splice(index, 1);
                            }
                        });
                        mainCobj.saveCompanyUser(targetUser);
                    }
                },
                onInitialize: function (planets_data) {
                }
            };
            scope.saveCompanyMsgSetting = function (isAllowMsgAllToEveryone) {
                if (isAllowMsgAllToEveryone == true)
                    cmobj.UpdateUserInformation(isAllowMsgAllToEveryone, "");
                else {
                    var allowedUserList = cmobj.scope.allowedUsers;
                    cmobj.UpdateUserInformation(isAllowMsgAllToEveryone, allowedUserList);
                }
            };
            scope.cancelRequest = function () {
                location.reload();
            };
        }
        ManageCustomersController.prototype.getCompanies = function () {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.getCompanies().then(function (result) {
                _this.scope.vm.dt_data = result.data;
                _this.$rootScope.$emit("toggleLoader", false);
                if (_this.scope.IsEditMode) {
                    var ecid = _this.scope.editcompanyid;
                    var findobj;
                    $.each(_this.scope.vm.dt_data, function (index) {
                        if (this.Id.toString() === ecid) {
                            findobj = this;
                        }
                    });
                    _this.editcompany = findobj;
                    _this.getCompanyUsers(_this.editcompany.Id);
                }
            });
        };
        ManageCustomersController.prototype.getCompanyDetail = function (companyid) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.compSrv.getCompanyById(companyid).then(function (result) {
                _this.scope.Customer = result.data;
                if (result.data.logoBase64String != null)
                    _this.scope.logosrc = "data:image/jpeg;base64," + result.data.logoBase64String.toString();
                else
                    _this.scope.logosrc = "assets/img/avatars/user.png";
                if (result.data.UiBackgroundContrastColor == null)
                    _this.editcompany.UiBackgroundContrastColor = "#ffffff";
                if (result.data.RecipientList != null)
                    _this.getRecipients(result.data.RecipientList);
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        ManageCustomersController.prototype.CreateCompany = function () {
            var _this = this;
            var base64Arr = [];
            if (createCompanyForm.checkValidity()) {
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
                    }
                }
                this.newcompany.CustomerLogo = base64Arr;
                this.companyService.createCompany(this.newcompany).then(function (result) {
                    if (result.data) {
                        _this.$rootScope.$emit("successnotify", { msg: "Company is created successfully", status: "success" });
                    }
                    else {
                        _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                    _this.$rootScope.$emit("toggleLoader", false);
                    _this.newcompany = new culamaApp.Customer();
                    window.location.href = "/#/managecompanies";
                });
            }
        };
        ManageCustomersController.prototype.EditCompany = function () {
            var _this = this;
            if (editCompanyForm.checkValidity()) {
                var base64Arr = [];
                var ConvertedBase64String = "";
                this.$rootScope.$emit("toggleLoader", true);
                var checkLogoIsModified = document.getElementById("uploaded_Image1");
                if (checkLogoIsModified != null || checkLogoIsModified != undefined) {
                    var editlogo = document.getElementById("uploaded_Image1").getAttribute("src");
                    if (editlogo != this.editcompany.logoBase64String) {
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
                    ConvertedBase64String = this.editcompany.logoBase64String;
                }
                // to create and add the String array of the Base64 String
                for (var i = 0; i < ConvertedBase64String.length; i++) {
                    base64Arr.push(ConvertedBase64String[i]);
                }
                this.editcompany.CustomerLogo = base64Arr;
                this.editcompany.logoBase64String = null;
                this.companyService.saveCompanyDetail(this.editcompany).then(function (result) {
                    _this.$rootScope.$emit("toggleLoader", false);
                    if (result.data != "") {
                        _this.editcompany = result.data;
                        _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                        window.location.href = "/#/managecompanies";
                    }
                    else {
                        _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                    }
                });
            }
        };
        ManageCustomersController.prototype.saveCompany = function (RecipientID, actionname) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.saveCompanyDetail(this.editcompany).then(function (result) {
                _this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    _this.editcompany = result.data;
                    _this.scope.Customer = result.data;
                    var cmobj = _this;
                    var ccheck = _this.editcompany.IsAllowMsgAllToEveryone;
                    var allcompanyusers = [];
                    $.each(_this.scope.CompanyUsers, function () {
                        var u = this;
                        allcompanyusers.push(u);
                        if (RecipientID == "") {
                            u.IsAllowMsgToEveryone = ccheck;
                            cmobj.saveCompanyUser(u);
                        }
                        else {
                            if (actionname == "add") {
                                if (u.UserId == RecipientID) {
                                    cmobj.scope.recipients_users.push(u);
                                    var AllUsers = cmobj.scope.selectize_allrecipient_users;
                                    for (var t = 0; t < AllUsers.length; t++) {
                                        if (AllUsers[t].UserId == RecipientID) {
                                            cmobj.scope.selectize_allrecipient_users.splice(t, 1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });
                    if (ccheck == true) {
                        _this.scope.selectize_allrecipient_users = allcompanyusers;
                        cmobj.scope.recipients_users = [];
                    }
                    if (ccheck == false) {
                        _this.scope.selectize_users_notAllowed_Msg = allcompanyusers;
                    }
                    _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
            });
        };
        ManageCustomersController.prototype.saveCompanyUser = function (user) {
            var _this = this;
            if (user.IsAllowMsgToEveryone) {
                user.UserMessages = [];
            }
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.saveUserDetail(user).then(function (result) {
                _this.$rootScope.$emit("toggleLoader", false);
                if (result.data != "") {
                    var tCusers = _this.scope.vm.editcompanyUsers;
                    $.each(tCusers, function (index) {
                        var u = this;
                        if (u.UserId == user.UserId) {
                            tCusers[index] = result.data;
                        }
                    });
                    _this.scope.CompanyUsers = tCusers;
                    _this.scope.vm.editcompanyUsers = tCusers;
                    //$.each(this.scope.vm.editcompanyUsers, function (index) {
                    //    var u = this;
                    //    if (u.UserId == user.UserId) {
                    //        u = result.data;
                    //    }
                    //})
                    _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
            });
        };
        ManageCustomersController.prototype.DeleteCompany = function (id) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.companyService.deleteCompany(id).then(function (result) {
                _this.$rootScope.$emit("toggleLoader", false);
                if (result.data) {
                    var companylist = _this.scope.vm.dt_data;
                    $.each(companylist, function (index) {
                        if (this.Id === id) {
                            companylist.splice(index, 1);
                            return false;
                        }
                    });
                    _this.scope.vm.dt_data = companylist;
                    _this.$rootScope.$emit("successnotify", { msg: "Company is deleted successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
            });
        };
        ManageCustomersController.prototype.getCompanyUsers = function (companyid) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            var ft = this.$filter;
            this.companyService.getUsersByCompanyId(companyid).then(function (result) {
                var notAllowedMsg = [];
                var allowedmsg = [];
                // This code for the date formate
                $.each(result.data, function () {
                    if (typeof this.PhoneActivatedOn === 'string' || typeof this.LastActivationAttempt === 'string') {
                        var activationon = new Date(parseInt(this.PhoneActivatedOn.substr(6)));
                        var lastactivation = new Date(parseInt(this.LastActivationAttempt.substr(6)));
                        this.PhoneActivatedOn = ft('date')(activationon, "MMM dd yyyy HH:mm");
                        this.LastActivationAttempt = ft('date')(lastactivation, "MMM dd yyyy HH:mm");
                    }
                });
                _this.scope.vm.editcompanyUsers = result.data;
                _this.scope.CompanyUsers = result.data;
                _this.scope.allowedUsers = result.data.slice();
                _this.scope.selectize_allrecipient_users = result.data.slice();
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].IsAllowMsgToEveryone == false)
                        notAllowedMsg.push(result.data[i]);
                    else
                        allowedmsg.push(result.data[i]);
                }
                if (_this.scope.Customer.RecipientList != null) {
                    var alreadyExistRecipients = _this.scope.Customer.RecipientList.toString().split(',');
                    for (var x = 0; x < _this.scope.selectize_allrecipient_users.length; x++) {
                        for (var m = 0; m < alreadyExistRecipients.length; m++) {
                            if (alreadyExistRecipients[m] == _this.scope.selectize_allrecipient_users[x].UserId)
                                _this.scope.selectize_allrecipient_users.splice(x, 1);
                        }
                    }
                }
                _this.scope.selectize_users_notAllowed_Msg = notAllowedMsg;
                _this.scope.allowedUsers = allowedmsg;
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        ManageCustomersController.prototype.getParameterByName = function (name) {
            var url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        ManageCustomersController.prototype.getSelectedUserInfo = function (selecteduserid, isAllowMessage) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            this.lservice.getUserDetailsbyId(selecteduserid).then(function (result) {
                if (result.data != "" || result.data != null) {
                    if (isAllowMessage == true)
                        result.data.IsAllowMsgToEveryone = true;
                    else if (isAllowMessage == false)
                        result.data.IsAllowMsgToEveryone = false;
                    _this.saveCompanyUser(result.data);
                }
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        ManageCustomersController.prototype.getRecipients = function (recipientUserIDs) {
            this.$rootScope.$emit("toggleLoader", true);
            var Recipients = [];
            var splitedUsers = recipientUserIDs.toString().split(',');
            for (var i = 0; i < splitedUsers.length; i++) {
                this.lservice.getUserDetailsbyId(splitedUsers[i]).then(function (result) {
                    Recipients.push(result.data);
                });
            }
            this.scope.recipients_users = Recipients;
            this.$rootScope.$emit("toggleLoader", false);
        };
        ManageCustomersController.prototype.UpdateUserInformation = function (isAllowMsgAllToEveryone, allowedUserList) {
            var _this = this;
            this.$rootScope.$emit("toggleLoader", true);
            var userupdatedinfo = [];
            $.each(this.scope.Customer.Users, function () {
                var x = this;
                var allowmsg = false;
                if (isAllowMsgAllToEveryone == false) {
                    for (var i = 0; i < allowedUserList.length; i++) {
                        if (x.UserId == allowedUserList[i].UserId) {
                            allowmsg = true;
                            break;
                        }
                    }
                }
                else {
                    allowmsg = true;
                }
                x.IsAllowMsgToEveryone = allowmsg;
                userupdatedinfo.push(x);
            });
            this.scope.Customer.IsAllowMsgAllToEveryone = isAllowMsgAllToEveryone;
            this.scope.Customer.Users = userupdatedinfo;
            this.compSrv.saveCompanyDetail(this.scope.Customer).then(function (result) {
                if (result.data != "") {
                    _this.$rootScope.$emit("successnotify", { msg: "Your information is updated successfully", status: "success" });
                }
                else {
                    _this.$rootScope.$emit("successnotify", { msg: "Something went wrong. Please try again.", status: "danger" });
                }
                _this.$rootScope.$emit("toggleLoader", false);
            });
        };
        ManageCustomersController.$inject = ["$scope", "$rootScope", "$compile", "$filter", "$timeout", "$resource", "DTOptionsBuilder", "DTColumnDefBuilder", "commonService", "companyService", "loginService"];
        return ManageCustomersController;
    }());
    function myFilter() {
        return function (um) {
            //  filter stuff here
            var selectize_userlist = [];
            if (um.length > 0) {
                $.each(um, function () {
                    selectize_userlist.push(this.AllowSendUserId.toString());
                });
            }
            return selectize_userlist;
        };
    }
    culamaApp.myFilter = myFilter;
    function customFilterForAllowMessage() {
        return function (user) {
            var filtered = [];
            for (var i = 0; i < user.length; i++) {
                if (user[i].IsAllowMsgToEveryone == true)
                    filtered.push(user[i]);
            }
            return filtered;
        };
    }
    culamaApp.customFilterForAllowMessage = customFilterForAllowMessage;
    angular.module("culamaApp")
        .controller("manageCustomersController", ManageCustomersController);
    angular.module("culamaApp")
        .filter("myFilter", culamaApp.myFilter);
    angular.module("culamaApp")
        .filter("customFilterForAllowMessage", culamaApp.customFilterForAllowMessage);
})(culamaApp || (culamaApp = {}));
