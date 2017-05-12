angular
    .module('culamaApp')
       .filter("lantitlefilter",
        function () {
            return function (x, input) {
                return x["title_" + input];
            };
        })
    .controller('main_sidebarCtrl',
    [
        '$timeout',
        '$scope',
        '$rootScope', '$controller',
        function ($timeout, $scope, $rootScope, $controller) {

            $scope.$on('onLastRepeat',
                function (scope, element, attrs) {
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
                                UIkit.tooltip($this,
                                {
                                    pos: 'right'
                                });
                            });
                        }
                    })
                });

            // language switcher
            $scope.langSwitcherModel = $rootScope.CurrentLocaleLanguage.toLowerCase();
            var langData = $scope.langSwitcherOptions = [
                { id: 1, title: 'English', value: 'US' },
                { id: 2, title: 'Hindi', value: 'IN' }
            ];
            $scope.langSwitcherConfig = {
                maxItems: 1,
                render: {
                    option: function (langData, escape) {
                        return '<div class="option">' +
                            '<i class="item-icon flag-' +
                            escape(langData.value).toUpperCase() +
                            '"></i>' +
                            '<span>' +
                            escape(langData.title) +
                            '</span>' +
                            '</div>';
                    },
                    item: function (langData, escape) {
                        return '<div class="item"><i class="item-icon flag-' +
                            escape(langData.value).toUpperCase() +
                            '"></i></div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                onInitialize: function (selectize) {
                    $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly', true);
                },
                onChange: function (value) {
                    $rootScope.$emit("changeLanguage", value);
                }
            };


            if ($rootScope.LoggedUser.UserGroupId === 1) {
                // Administrator menu entries
                $scope.sections = [
                    {
                        id: 0,
                        title_us: 'Dashboard',
                        title_in: 'डैशबोर्ड',
                        icon: '&#xE871;',
                        link: 'restricted.dashboard'
                    }
                ];
            } else if ($rootScope.LoggedUser.UserGroupId === 2) {
                // CustomerAdmin menu entries
                $scope.sections = [
                    {
                        id: 0,
                        title_us: 'Dashboard',
                        title_in: 'डैशबोर्ड',
                        icon: '&#xE871;',
                        link: 'restricted.customeradmindashboard'
                    },
                    {
                        id: 1,
                        title_us: 'Users',
                        title_in: 'उपयोगकर्ता',
                        icon: '&#xE87C;',
                        link: 'restricted.companyusers'
                    },
                     {
                         id: 2,
                         title_us: 'Messages',
                         title_in: 'संदेश',
                         icon: '&#xE0B9;',
                         link: 'restricted.usermessages'
                     },
                    {
                        id: 3,
                        title_us: 'Setting',
                        title_in: 'सेटिंग',
                        icon: '&#xE241;',
                        //submenu: [
                        //     {
                        //         title_us: 'Message Setting',
                        //         title_in: 'संदेश सेटिंग',
                        //         link: 'restricted.companymessagesetting'
                        //     }
                        //]
                    },
                    {
                        id: 3,
                        title_us: 'Wall',
                        title_in: 'दीवार',
                        icon: '&#xE241;',
                        submenu: [
                             {
                                 title_us: 'Manage Wall',
                                 title_in: 'दीवार का प्रबंधन करें',
                                 link: 'restricted.managecompanywalls'
                             }
                        ]
                    }
                ];
            } else if ($rootScope.LoggedUser.UserGroupId === 3) {
                // User menu entries
                $scope.sections = [
                    {
                        id: 0,
                        title_us: 'Dashboard',
                        title_in: 'डैशबोर्ड',
                        icon: '&#xE871;',
                        link: 'restricted.userdashboard'
                    },
                     {
                         id: 1,
                         title_us: 'Messages',
                         title_in: 'संदेश',
                         icon: '&#xE0B9;',
                         link: 'restricted.usermessages'
                     }
                ];
            }
        }
    ])
