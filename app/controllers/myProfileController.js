/// <reference path="../views/error.html" />
angular
    .module('altairApp')
    .controller('myProfileCtrl', [
        '$scope',
        '$rootScope',
        'utils',
        function ($scope, $rootScope, utils) {

            $scope.selectize_a_options = ["English", "Chinese", "Russian", "French"];

            $scope.selectize_a = "English";

            $scope.selectize_a_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };

            $scope.selectize_b_options = ["English", "Chinese", "Russian", "French"];

            $scope.selectize_b = "Russian";

            $scope.selectize_b_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };

        }
    ]);