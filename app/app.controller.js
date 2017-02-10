/*
 *  Altair Admin angularjs
 *  controller
 */

angular
    .module('altairApp')
    .controller('mainCtrl', ['$rootScope',
        '$scope',
        function($rootScope, $scope) {

            var result =  localStorage.getItem("loggeduser");
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

            $scope.logout = function () {
                localStorage.removeItem("loggeduser");
                $rootScope.isloggedin = false;
                $rootScope.LoggedUser = null;
                window.location.href = "#/login";
            };

        }
    ]);
