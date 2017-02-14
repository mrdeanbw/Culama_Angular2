angular
    .module('altairApp')
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        function ($timeout, $scope, $rootScope) {

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function () {
                    if (!$rootScope.miniSidebarActive) {
                        // activate current section
                        $('#sidebar_main').find('.current_section > a').trigger('click');
                    } else {
                        // add tooltips to mini sidebar
                        var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                        tooltip_elem.each(function () {
                            var $this = $(this);

                            $this.attr('title', $this.find('.menu_title').text());
                            UIkit.tooltip($this, {
                                pos: 'right'
                            });
                        });
                    }
                })
            });

            // language switcher
            $scope.langSwitcherModel = 'gb';
            var langData = $scope.langSwitcherOptions = [
                { id: 1, title: 'English', value: 'gb' },
                { id: 2, title: 'French', value: 'fr' },
                { id: 3, title: 'Chinese', value: 'cn' },
                { id: 4, title: 'Dutch', value: 'nl' },
                { id: 5, title: 'Italian', value: 'it' },
                { id: 6, title: 'Spanish', value: 'es' },
                { id: 7, title: 'German', value: 'de' },
                { id: 8, title: 'Polish', value: 'pl' }
            ];
            $scope.langSwitcherConfig = {
                maxItems: 1,
                render: {
                    option: function (langData, escape) {
                        return '<div class="option">' +
                            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function (langData, escape) {
                        return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                onInitialize: function (selectize) {
                    $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly', true);
                }
            };

            
            if ($rootScope.LoggedUser.UserGroupId === 1) {
                // Administrator menu entries
                $scope.sections = [
                   {
                       id: 0,
                       title: 'Dashboard',
                       icon: '&#xE871;',
                       link: 'restricted.dashboard'
                   },
                   {
                       id: 1,
                       title: 'Manage Users',
                       icon: '&#xE87C;',
                       link: 'restricted.manageusers'
                   }
                ];
            } else if ($rootScope.LoggedUser.UserGroupId === 2) {
                // CustomerAdmin menu entries
                $scope.sections = [
                         {
                             id: 0,
                             title: 'Dashboard',
                             icon: '&#xE871;',
                             link: 'restricted.customeradmindashboard'
                         },
                         {
                             id: 1,
                             title: 'Users',
                             icon: '&#xE87C;',
                             link: 'restricted.companyusers'
                         }
                ];
            }
            else if ($rootScope.LoggedUser.UserGroupId === 3) {
                // User menu entries
                $scope.sections = [
                     {
                         id: 0,
                         title: 'Dashboard',
                         icon: '&#xE871;',
                         link: 'restricted.userdashboard'
                     }
                ];
            }
        }
    ]);