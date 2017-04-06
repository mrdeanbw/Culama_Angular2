altairApp
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
            $urlRouterProvider
                .when('/dashboard', '/')
                .otherwise('/');

            $stateProvider
                // -- ERROR PAGES --
                .state("error",
                {
                    url: "/error",
                    templateUrl: 'app/views/error.html',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_uikit'
                                ]);
                            }
                        ]
                    }
                })
                .state("error.404",
                {
                    url: "/404",
                    templateUrl: 'app/components/pages/error_404View.html'
                })
                .state("error.500",
                {
                    url: "/500",
                    templateUrl: 'app/components/pages/error_500View.html'
                })
                // -- LOGIN PAGE --
                .state("login",
                {
                    url: "/login",
                    templateUrl: 'app/views/loginView.html',
                    controller: 'loginController',
                    controllerAs: 'vm',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_uikit',
                                    'lazy_iCheck',
                                    'lazy_selectizeJS',
                                     'lazy_parsleyjs',
                                    'app/services/loginservice.js',
                                    'app/models/LoginUser.js',
                                    'app/models/User.js',
                                    'app/controllers/loginController.js'
                                ]);
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Login'
                    }
                })
                // -- My PROFILE PAGE --
                .state("restricted.myprofile",
                {
                    url: "/myprofile",
                    templateUrl: 'app/views/account/myProfile.html',
                    controller: 'myProfileController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_uikit',
                                    'lazy_iCheck',
                                    'lazy_parsleyjs',
                                    'app/services/loginservice.js',
                                    'app/services/CommonService.js',
                                    'app/models/Customer.js',
                                    'app/models/UserDetails.js',
                                    'app/models/LoginUser.js',
                                    'app/models/User.js',
                                    'app/controllers/myProfileController.js'
                                ]);
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'MyProfile'
                    }
                })
                // -- My ACCOUNT PAGE --
                .state("restricted.myaccount",
                {
                    url: "/myaccount",
                    templateUrl: 'app/views/account/myAccountInfo.html',
                    controller: 'myProfileController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                      'lazy_uikit',
                                    'lazy_iCheck',
                                    'lazy_parsleyjs',
                                    'app/services/loginservice.js',
                                    'app/services/CommonService.js',
                                    'app/models/Customer.js',
                                    'app/models/UserDetails.js',
                                    'app/models/LoginUser.js',
                                    'app/models/User.js',
                                    'app/controllers/myProfileController.js'
                                ]);
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'MyAccount'
                    }
                })
                // -- RESTRICTED --
                .state("restricted",
                {
                    abstract: true,
                    url: "",
                    templateUrl: 'app/views/restricted.html',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_uikit',
                                    'lazy_selectizeJS',
                                    'lazy_switchery',
                                    'lazy_prismJS',
                                    'lazy_autosize',
                                    'lazy_iCheck',
                                    'lazy_themes'
                                ]);
                            }
                        ]
                    }
                })
                // -- DASHBOARD --
                .state("restricted.dashboard",
                {
                    url: "/",
                    templateUrl: 'app/views/dashboard/adminDashboardView.html',
                    controller: 'administratorDashboardController',
                    controllerAs: 'vm',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        // ocLazyLoad config (app/app.js)
                                        'lazy_countUp',
                                        'lazy_charts_peity',
                                        'lazy_charts_easypiechart',
                                        'lazy_charts_metricsgraphics',
                                        'lazy_charts_chartist',
                                        'lazy_weathericons',
                                        'lazy_clndr',
                                        'lazy_google_maps',
                                        'app/controllers/administratorDashboardController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Dashboard'
                    },
                    ncyBreadcrumb: {
                        label: 'Home'
                    }
                })
                // --COMPANY DASHBOARD --
                .state("restricted.companydashboard",
                {
                    url: "/company_dashboard",
                    templateUrl: 'app/views/dashboard/CompanyDashboardView.html',
                    controller: 'companyDashBoardCtrl',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        // ocLazyLoad config (app/app.js)
                                        'lazy_countUp',
                                        'lazy_charts_peity',
                                        'lazy_charts_easypiechart',
                                        'lazy_charts_metricsgraphics',
                                        'lazy_charts_chartist',
                                        'lazy_weathericons',
                                        'lazy_clndr',
                                        'lazy_google_maps',
                                        'app/controllers/companyDashboardController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Company Dashboard'
                    }
                })
                // --CUSTOMER ADMIN DASHBOARD --
                .state("restricted.customeradmindashboard",
                {
                    url: "/customer_admin_dashboard",
                    templateUrl: 'app/views/dashboard/customerAdminDashboardView.html',
                    controller: 'customerAdminDashBoardCtrl',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        // ocLazyLoad config (app/app.js)
                                        'lazy_countUp',
                                        'lazy_charts_peity',
                                        'lazy_charts_easypiechart',
                                        'lazy_charts_metricsgraphics',
                                        'lazy_charts_chartist',
                                        'lazy_weathericons',
                                        'lazy_clndr',
                                        'lazy_google_maps',
                                        'app/controllers/customerAdminDashboardController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Customer Admin Dashboard'
                    }
                })
                // --USER DASHBOARD --
                .state("restricted.userdashboard",
                {
                    url: "/user_dashboard",
                    templateUrl: 'app/views/dashboard/userDashboardView.html',
                    controller: 'userDashboardController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        // ocLazyLoad config (app/app.js)
                                        'lazy_countUp',
                                        'lazy_charts_peity',
                                        'lazy_charts_easypiechart',
                                        'lazy_charts_metricsgraphics',
                                        'lazy_charts_chartist',
                                        'lazy_weathericons',
                                        'lazy_clndr',
                                        'lazy_google_maps',
                                        'app/services/companyService.js',
                                         'app/services/messagesService.js',
                                         'app/services/loginService.js',
                                        'app/controllers/userDashboardController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Customer Admin Dashboard'
                    }
                })
                // --  COMPANY USERS PAGE --        
                .state("restricted.companyusers",
                {
                    url: "/companyusers",
                    templateUrl: 'app/views/account/companyUsers.html',
                    controller: 'companyUsersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                       'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/models/Customer.js',
                                        'app/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        'app/controllers/companyUsersController.js'
                                ],
                                    { serie: true });
                            }
                        ],
                        contact_list: function ($http) {
                            return $http({ method: 'GET', url: 'data/contact_list.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Company Users'
                    }
                })

                // --  MANAGE USERS PAGE --        
                .state("restricted.manageusers",
                {
                    url: "/manageusers",
                    templateUrl: 'app/views/account/manageUsers.html',
                    controller: 'manageUsersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                          'app/models/Customer.js',
                                    'app/models/UserDetails.js',
                                    'app/services/loginservice.js',
                                         'app/services/companyService.js',
                                        'app/controllers/manageUsersController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Manage Users'
                    }
                })

                // --  MANAGE COMPANIES PAGE --        
                .state("restricted.managecompanies",
                {
                    url: "/managecompanies",
                    templateUrl: 'app/views/company/manageCompaniesView.html',
                    controller: 'manageCustomersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                          'app/models/Customer.js',
                                    'app/models/UserDetails.js',
                                    'app/services/loginservice.js',
                                         'app/services/companyService.js',
                                        'app/controllers/manageCustomersController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Manage Companies'
                    }
                })

                 // --  CREATE COMPANY PAGE --        
                .state("restricted.createcompany",
                {
                    url: "/create_company",
                    templateUrl: 'app/views/company/createCompanyView.html',
                    controller: 'manageCustomersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/models/Customer.js',
                                        'app/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        'app/controllers/manageCustomersController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Create Company'
                    }
                })

                // --  EDIT COMPANY PAGE --        
                .state("restricted.editcompany",
                {
                    url: "/edit_company",
                    templateUrl: 'app/views/company/editCompanyView.html',
                    controller: 'manageCustomersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/models/Customer.js',
                                        'app/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        'app/controllers/manageCustomersController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Edit Company'
                    }
                })

                // --  CREATE ADMIN USERS PAGE --        
                .state("restricted.createusers",
                {
                    url: "/create_users",
                    templateUrl: 'app/views/account/createUserView.html',
                    controller: 'manageUsersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                          'app/models/Customer.js',
                                    'app/models/UserDetails.js',
                                    'app/services/loginservice.js',
                                         'app/services/companyService.js',
                                        'app/controllers/manageUsersController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Create Users'
                    }
                })

                  // --  ADMIN EDIT USERS PAGE --        
                .state("restricted.editusers",
                {
                    url: "/edit_users",
                    templateUrl: 'app/views/account/editUserView.html',
                    controller: 'manageUsersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                          'app/models/Customer.js',
                                    'app/models/UserDetails.js',
                                    'app/services/loginservice.js',
                                         'app/services/companyService.js',
                                        'app/controllers/manageUsersController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Edit Users'
                    }
                })

                   // --  CREATE COMPANY USERS PAGE --        
                .state("restricted.createcompanyusers",
                {
                    url: "/create_companyusers",
                    templateUrl: 'app/views/account/createCompanyUsersView.html',
                    controller: 'companyUsersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/models/Customer.js',
                                        'app/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        'app/controllers/companyUsersController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Create Users'
                    }
                })


               // --  EDIT COMPANY USERS PAGE --        
                .state("restricted.editcompanyusers",
                {
                    url: "/edit_companyusers",
                    templateUrl: 'app/views/account/editCompanyUsersView.html',
                    controller: 'companyUsersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/models/Customer.js',
                                        'app/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        'app/controllers/companyUsersController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Edit Users'
                    }
                })

                // --  COMPANY MESSAGE SETTING PAGE --        
                .state("restricted.companymessagesetting",
                {
                    url: "/company_manage_setting",
                    templateUrl: 'app/views/setting/messageSettingView.html',
                    controller: 'companyMessageSettingController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                       'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/models/Customer.js',
                                        'app/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        'app/controllers/companyMessageSettingController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Message Setting'
                    }
                })

                 // --  USER MESSAGE PAGE --        
                .state("restricted.usermessages",
                {
                    url: "/user_messages",
                    templateUrl: 'app/views/messages/messagesView.html',
                    controller: 'userMessagesController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'app/services/companyService.js',
                                         'app/services/messagesService.js',
                                         'app/services/loginService.js',
                                        'app/controllers/userMessagesController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'User Messages'
                    }
                })

            // --  USER CREATE MESSAGE PAGE --        
            .state("restricted.usercreatemessage",
            {
                url: "/create_user_messages",
                templateUrl: 'app/views/messages/createMessageView.html',
                controller: 'userMessagesController',
                resolve: {
                    deps: [
                        '$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'app/services/companyService.js',
                                     'app/services/messagesService.js',
                                     'app/services/loginService.js',
                                    'app/controllers/userMessagesController.js'
                            ],
                                { serie: true });
                        }
                    ]
                },
                data: {
                    pageTitle: 'Create Messages'
                }
            });

        }
    ]);
