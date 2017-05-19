/// <reference path="../assets/js/custom/uikit_fileinput.js" />
/// <reference path="../assets/js/custom/uikit_fileinput.js" />
culamaApp
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
                    //templateUrl: 'app/views/loginView.html',
                    templateUrl: 'app/areas/login/views/loginView.html',
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
<<<<<<< HEAD
                                    //'app/models/LoginUser.js',
                                    //'app/models/User.js',
=======
>>>>>>> master
                                    'app/areas/login/models/LoginUser.js',
                                    'app/areas/login/models/User.js',
                                    //'app/controllers/loginController.js'
                                    'app/areas/login/controllers/loginController.js'
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
                    //templateUrl: 'app/views/account/myProfile.html',
                    templateUrl: 'app/areas/manageUsers/views/myProfile.html',
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
                                    'app/areas/manageUsers/models/Customer.js',
                                    'app/areas/manageUsers/models/UserDetails.js',
                                    'app/areas/manageUsers/models/LoginUser.js',
                                    'app/areas/manageUsers/models/User.js',
                                    //'app/controllers/myProfileController.js'
                                    'app/areas/manageUsers/controllers/myProfileController.js',
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
                    //templateUrl: 'app/views/account/myAccountInfo.html',
                    templateUrl: 'app/areas/manageUsers/views/myAccountInfo.html',
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
                                    'app/areas/manageUsers/models/Customer.js',
                                    'app/areas/manageUsers/models/UserDetails.js',
                                    'app/areas/manageUsers/models/LoginUser.js',
                                    'app/areas/manageUsers/models/User.js',
                                    //'app/controllers/myProfileController.js'
                                    'app/areas/manageUsers/controllers/myProfileController.js'
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
                    //templateUrl: 'app/views/dashboard/adminDashboardView.html',
                    templateUrl: 'app/areas/dashboard/views/adminDashboardView.html',
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
                                        //'app/controllers/administratorDashboardController.js'
                                        'app/areas/dashboard/controllers/administratorDashboardController.js'
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
                    //templateUrl: 'app/views/dashboard/CompanyDashboardView.html',
                    templateUrl: 'app/areas/dashboard/views/CompanyDashboardView.html',
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
                                        //'app/controllers/companyDashboardController.js'
                                        'app/areas/dashboard/controllers/companyDashboardController.js'
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
                    //templateUrl: 'app/views/dashboard/customerAdminDashboardView.html',
                    templateUrl: 'app/areas/dashboard/views/customerAdminDashboardView.html',
                    controller: 'customerAdminDashboardController',
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
                                        'app/services/messageService.js',
                                        'app/services/loginservice.js',
                                        //'app/controllers/customerAdminDashboardController.js'
                                        'app/areas/dashboard/controllers/customerAdminDashboardController.js'
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
                    //templateUrl: 'app/views/dashboard/userDashboardView.html',
                    templateUrl: 'app/areas/dashboard/views/userDashboardView.html',
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
                                        'app/services/messageService.js',
                                        'app/services/loginservice.js',
                                        //'app/controllers/userDashboardController.js'
                                        'app/areas/dashboard/controllers/userDashboardController.js' 
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
                    //templateUrl: 'app/views/account/companyUsers.html',
                    templateUrl: 'app/areas/manageUsers/views/companyUsers.html',
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
                                        'app/areas/manageUsers/models/Customer.js',
                                        'app/areas/manageUsers/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        //'app/controllers/companyUsersController.js'
                                        'app/areas/manageUsers/controllers/companyUsersController.js'
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
                    //templateUrl: 'app/views/account/manageUsers.html',
                    templateUrl: 'app/areas/manageUsers/views/manageUsers.html',
                    controller: 'manageUsersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'app/areas/manageUsers/models/Customer.js',
                                        'app/areas/manageUsers/models/UserDetails.js',
                                        'app/services/loginservice.js',
<<<<<<< HEAD
                                        'app/services/companyService.js',
=======
                                         'app/services/companyService.js',
>>>>>>> master
                                        //'app/controllers/manageUsersController.js'
                                        'app/areas/manageUsers/controllers/manageUsersController.js'
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
                    //templateUrl: 'app/views/company/manageCompaniesView.html',
                    templateUrl: 'app/areas/manageCompanies/views/manageCompaniesView.html',
                    controller: 'manageCustomersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'app/areas/manageCompanies/models/Customer.js',
                                        'app/areas/manageCompanies/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        // 'app/controllers/manageCustomersController.js'
                                        'app/areas/manageCompanies/controllers/manageCustomersController.js'
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
                    //templateUrl: 'app/views/company/createCompanyView.html',
                    templateUrl: 'app/areas/manageCompanies/views/createCompanyView.html',
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
                                        'assets/js/custom/uikit_fileinput.js',
                                        'app/areas/manageCompanies/models/Customer.js',
                                        'app/areas/manageCompanies/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        //'app/controllers/manageCustomersController.js'
                                        'app/areas/manageCompanies/controllers/manageCustomersController.js'
                                        
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
                    //templateUrl: 'app/views/company/editCompanyView.html',
                    templateUrl: 'app/areas/manageCompanies/views/editCompanyView.html',
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
                                        'assets/js/custom/uikit_fileinput.js',
                                        'app/areas/manageCompanies/models/Customer.js',
                                        'app/areas/manageCompanies/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        //'app/controllers/manageCustomersController.js'
                                        'app/areas/manageCompanies/controllers/manageCustomersController.js'
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
                    //templateUrl: 'app/views/account/createUserView.html',
                    templateUrl: 'app/areas/manageUsers/views/createUserView.html',
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
                                        'assets/js/custom/uikit_fileinput.js',
                                        'app/areas/manageUsers/models/Customer.js',
                                        'app/areas/manageUsers/models/UserDetails.js',
                                        'app/services/loginservice.js',
<<<<<<< HEAD
                                        'app/services/companyService.js',
=======
                                         'app/services/companyService.js',
>>>>>>> master
                                        //'app/controllers/manageUsersController.js'
                                        'app/areas/manageUsers/controllers/manageUsersController.js'
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
                    //templateUrl: 'app/views/account/editUserView.html',
                    templateUrl: 'app/areas/manageUsers/views/editUserView.html',
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
                                        'assets/js/custom/uikit_fileinput.js',
                                        'app/areas/manageUsers/models/Customer.js',
                                        'app/areas/manageUsers/models/UserDetails.js',
                                        'app/services/loginservice.js',
<<<<<<< HEAD
                                        'app/services/companyService.js',
=======
                                         'app/services/companyService.js',
>>>>>>> master
                                        //'app/controllers/manageUsersController.js'
                                        'app/areas/manageUsers/controllers/manageUsersController.js'
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
                    //templateUrl: 'app/views/account/createCompanyUsersView.html',
                    templateUrl: 'app/areas/manageUsers/views/createCompanyUsersView.html',
                    
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
                                        'assets/js/custom/uikit_fileinput.js',
                                        'app/areas/manageUsers/models/Customer.js',
                                        'app/areas/manageUsers/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        //'app/controllers/companyUsersController.js'
                                        'app/areas/manageUsers/controllers/companyUsersController.js'
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
                    //templateUrl: 'app/views/account/editCompanyUsersView.html',
                    templateUrl: 'app/areas/manageUsers/views/editCompanyUsersView.html',
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
                                        'assets/js/custom/uikit_fileinput.js',
                                        'app/areas/manageUsers/models/Customer.js',
                                        'app/areas/manageUsers/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        //'app/controllers/companyUsersController.js'
                                        'app/areas/manageUsers/controllers/companyUsersController.js'
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
                    //templateUrl: 'app/views/setting/messageSettingView.html',
                    templateUrl: 'app/areas/setting/views/messageSettingView.html',
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
                                        'app/areas/setting/models/Customer.js',
                                        'app/areas/setting/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
                                        //'app/controllers/companyMessageSettingController.js'
                                        'app/areas/setting/controllers/companyMessageSettingController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Message Setting'
                    }
                })

                .state("restricted.managecompanymessagesetting",
                {
                    url: "/manage_company_manage_setting",
                    //templateUrl: 'app/views/account/manageCompanySetting.html',
                    templateUrl: 'app/areas/setting/views//manageCompanySetting.html',
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
                                        'app/areas/setting/models/Customer.js',
                                        'app/areas/setting/models/UserDetails.js',
                                        'app/services/loginservice.js',
                                        'app/services/companyService.js',
<<<<<<< HEAD
                                        //'app/controllers/companyMessageSettingController.js'
                                        'app/areas/setting/controllers/companyMessageSettingController.js'

                                        
=======
                                        'app/areas/setting/controllers/companyMessageSettingController.js'
>>>>>>> master
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
                    templateUrl: 'app/areas/messaging/views/messagesView.html',
                    controller: 'userMessagesController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'assets/js/jquery.signalR-2.2.1.js',
                                        'app/services/companyService.js',
                                        'app/services/messageService.js',
                                        'app/services/loginService.js',
                                        'app/areas/messaging/controllers/userMessagesController.js'
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
                templateUrl: 'app/areas/messaging/views/createMessageView.html',
                controller: 'userMessagesController',
                resolve: {
                    deps: [
                        '$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'app/services/companyService.js',
                                    'app/services/messageService.js',
                                    'app/services/loginService.js',
                                    'app/areas/messaging/controllers/userMessagesController.js'
                            ],
                                { serie: true });
                        }
                    ]
                },
                data: {
                    pageTitle: 'Create Messages'
                }
            })

                 // --  MANAGE COMPANY WALL PAGE -- 
            .state("restricted.managecompanywalls",
                {
                    url: "/companywalls",
                    templateUrl: 'app/areas/company_walls/views/manageCompanyWalls.html',
                    controller: 'companyWallController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                       'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/areas/company_walls/models/Wall.js',
                                        'assets/js/custom/uikit_fileinput.js',
                                        'app/services/companyWallService.js',
                                        'app/areas/company_walls/controllers/companyWallController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Company walls'
                    }
                })

            // --  MANAGE COMPANY WALL POSTS -- 
            .state("restricted.managewallposts",
                {
                    url: "/managecompanywallposts",
                    templateUrl: 'app/areas/company_walls/views/manageCompanyWallPosts.html',
                    controller: 'companyWallPostController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                       'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/areas/company_walls/models/WallPost.js',
                                        'app/services/companyWallPostService.js',
                                        'app/areas/company_walls/controllers/companyWallPostController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Company walls'
                    }
                })

            // --  CREATE COMPANY WALL POST -- 
            .state("restricted.createwallposts",
                {
                    url: "/createcompanywallposts",
                    templateUrl: 'app/areas/company_walls/views/createCompanyWallPost.html',
                    controller: 'companyWallPostController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                       'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_parsleyjs',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/areas/company_walls/models/WallPost.js',
                                        'app/services/companyWallPostService.js',
                                        'app/areas/company_walls/controllers/companyWallPostController.js'
                                ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Company walls'
                    }
                });

        }
    ]);
