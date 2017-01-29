angular
    .module('altairApp')
    .controller('todoCtrl', [
        '$rootScope',
        '$scope',
        'todo_data',
        function ($rootScope,$scope,todo_data) {

            $rootScope.page_full_height = true;
            $rootScope.headerDoubleHeightActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
                $rootScope.headerDoubleHeightActive = false;
            });
            
            $scope.todo_data = todo_data;

            $scope.todo_length = $scope.todo_data.length;

        }
    ]);