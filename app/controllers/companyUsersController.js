/// <reference path="../views/error.html" />
angular
    .module('altairApp')
    .controller('companyusersCtrl', [
        '$rootScope',
        '$scope',
        '$window',
        'contact_list',
       function ($rootScope, $scope, $window, contact_list) {
           $scope.cardview = true;
           $scope.contact_list = contact_list;

           // get all companies from array
           var all_companies = contact_list.map(function (a) {
               return a.company;
           });

           // remove duplicate companies
           function eliminateDuplicates(arr) {
               var i,
                   len = arr.length,
                   out = [],
                   obj = {};

               for (i = 0; i < len; i++) {
                   obj[arr[i]] = 0;
               }
               for (i in obj) {
                   out.push(i);
               }
               return out;
           }

           $scope.contact_list_companies = eliminateDuplicates(all_companies);

           $scope.$on('onLastRepeat', function (scope, element, attrs) {
               $scope.$apply(function () {
                   UIkit.grid($('#contact_list'), {
                       controls: '#contact_list_filter',
                       gutter: 20
                   });
               });
           })

           $scope.changeView = function (view) {
               if (view != "card") {
                   $scope.cardview = false;
               } else {
                   $scope.cardview = true;
               }
               
           };

       }
    ])
  .controller('dt_default',
        function ($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
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