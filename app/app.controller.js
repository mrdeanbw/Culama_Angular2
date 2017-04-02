/*
 *  Altair Admin angularjs
 *  controller
 */

angular
    .module('culamaApp')
    .controller('mainCtrl', ['$rootScope',
        '$scope', 'commonService',
        function ($rootScope, $scope, commonService) {
            $rootScope.CurrentLocaleLanguage = commonService.getLanguage();
            if ($rootScope.CurrentLocaleLanguage == undefined || $rootScope.CurrentLocaleLanguage === "") {
                localStorage.setItem("localelanguage", "US");
            }
            var result = localStorage.getItem("loggeduser");
            $rootScope.LoggedUser = JSON.parse(result);
            if ($rootScope.LoggedUser != null && $rootScope.LoggedUser != undefined) {
                $rootScope.isloggedin = true;
            } else {
                $rootScope.isloggedin = false;
                window.location.href = "#/login";
            }

            $rootScope.$on("logout", function () {
                $scope.logout();
            });

            $rootScope.$on("successnotify", function (events, args) {
                $scope.showNotification(args.msg, args.status);
            });

            $rootScope.$on("changeLanguage", function (events, args) {
                if (args !== "") {
                    if ($rootScope.CurrentLocaleLanguage !== args) {
                        $scope.setLanguage(args);
                        window.location.reload();
                    }
                }
            });


            $rootScope.$on("toggleLoader", function (events, args) {
                $scope.toggleLoader(args);
            });

            $scope.showNotification = function (message, status) {
                $scope.notifymsg = message;
                $scope.notfifystatus = status;
                setTimeout(function () {
                    $("#successnotifybtn").click();
                }, 500);

            };

            $scope.logout = function () {
                localStorage.removeItem("loggeduser");
                localStorage.removeItem("localelanguage");
                $rootScope.isloggedin = false;
                $rootScope.LoggedUser = null;
                window.location.href = "#/login";
            };

            $scope.toggleLoader = function (status) {
                if (status) {
                    $rootScope.pageLoading = true;
                    $rootScope.pageLoaded = false;
                } else {
                    $rootScope.pageLoading = false;
                    $rootScope.pageLoaded = true;
                }

            };

            $scope.setLanguage = function (lan) {
                commonService.setLanguage(lan);
            }

            //$scope.getLanguage = function () {
            //    return commonService.getLanguage();
            //}
        }
    ]);
