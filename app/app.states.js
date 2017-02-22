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
                            '$ocLazyLoad', function($ocLazyLoad) {
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
                            '$ocLazyLoad', function($ocLazyLoad) {
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
                            '$ocLazyLoad', function($ocLazyLoad) {
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
                            '$ocLazyLoad', function($ocLazyLoad) {
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
                            '$ocLazyLoad', function($ocLazyLoad) {
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
                            '$ocLazyLoad', function($ocLazyLoad) {
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
                    templateUrl: 'app/views/dashboard/compnayDashboardView.html',
                    controller: 'companyDashBoardCtrl',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function($ocLazyLoad) {
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
                            '$ocLazyLoad', function($ocLazyLoad) {
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
                    controller: 'userDashBoardCtrl',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function($ocLazyLoad) {
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
                    controller: 'companyusersCtrl',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'app/controllers/companyUsersController.js'
                                    ],
                                    { serie: true });
                            }
                        ],
                        contact_list: function($http) {
                            return $http({ method: 'GET', url: 'data/contact_list.json' })
                                .then(function(data) {
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
                            '$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
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

                // --  Create USERS PAGE --        
                .state("restricted.createusers",
                {
                    url: "/create_users",
                    templateUrl: 'app/views/account/createUserView.html',
                    controller: 'manageUsersController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                        'bower_components/angular-resource/angular-resource.min.js',
                                        'lazy_datatables',
                                        'lazy_uikit',
                                        'lazy_iCheck',
                                        'app/controllers/manageUsersController.js'
                                    ],
                                    { serie: true });
                            }
                        ]
                    },
                    data: {
                        pageTitle: 'Create Users'
                    }
                });

        }
    ]);
