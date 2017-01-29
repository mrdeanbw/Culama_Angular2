angular
    .module('altairApp')
    .controller('top_menuCtrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        function ($rootScope,$scope,$timeout) {

            $rootScope.toBarActive = true;
            $rootScope.topMenuActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
                $rootScope.topMenuActive = false;
            });
            
        }
    ]);