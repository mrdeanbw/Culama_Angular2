/// <reference path="../views/error.html" />
angular
    .module('altairApp')
  .controller('manageusersCtrl',
        function ($compile, $scope,$rootScope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;

            if ($rootScope.LoggedUser.UserGroupId !== 1) {
                window.location.href = "#/error";
            }

            vm.selectize_c_options = ["Admin", "Customer Admin", "User"];

            vm.selectize_c = "Admin";

            vm.selectize_c_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };


            vm.selectize_a_options = ["English", "Chinese", "Russian", "French"];

            vm.selectize_a = "English";

            vm.selectize_a_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };

            vm.selectize_b_options = ["English", "Chinese", "Russian", "French"];

            vm.selectize_b = "Russian";

            vm.selectize_b_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };

            vm.dt_data = [];
            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDisplayLength(10)
                .withOption('initComplete', function () {
                    $timeout(function () {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5)
            ];
            $resource('data/dt_data.json')
                .query()
                .$promise
                .then(function (dt_data) {
                    vm.dt_data = dt_data;
                });
        }
    );