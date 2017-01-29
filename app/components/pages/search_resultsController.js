angular
    .module('altairApp')
    .controller('search_resultsCtrl', [
        '$rootScope',
        '$scope',
        '$window',
        'NgMap',
        'utils',
        '$timeout',
        function ($rootScope,$scope,$window,NgMap,utils,$timeout) {

            $rootScope.headerDoubleHeightActive = true;
            // persistent search form
            $rootScope.mainSearchPersistent = true;

            $scope.$on('$destroy', function() {
                $rootScope.mainSearchPersistent = false;
                $rootScope.headerDoubleHeightActive = false;
            });

            // all
                $scope.allPages = [
                    {
                        title: 'Accordions',
                        link: 'restricted.components.accordion',
                        image: 'assets/img/gallery/Image01.jpg'
                    },
                    {
                        title: 'Breadcrumbs',
                        link: 'restricted.components.breadcrumbs',
                        image: 'assets/img/gallery/Image02.jpg'
                    },
                    {
                        title: 'Buttons',
                        link: 'restricted.components.buttons',
                        image: 'assets/img/gallery/Image03.jpg'
                    },
                    {
                        title: 'Buttons: FAB',
                        link: 'restricted.components.buttons_fab',
                        image: 'assets/img/gallery/Image04.jpg'
                    },
                    {
                        title: 'Cards',
                        link: 'restricted.components.cards',
                        image: 'assets/img/gallery/Image05.jpg'
                    },
                    {
                        title: 'Colors',
                        link: 'restricted.components.colors',
                        image: 'assets/img/gallery/Image06.jpg'
                    },
                    {
                        title: 'Common',
                        link: 'restricted.components.common',
                        image: 'assets/img/gallery/Image07.jpg'
                    },
                    {
                        title: 'Dropdowns',
                        link: 'restricted.components.dropdowns',
                        image: 'assets/img/gallery/Image08.jpg'
                    },
                    {
                        title: 'Dynamic Grid',
                        link: 'restricted.components.dynamic_grid',
                        image: 'assets/img/gallery/Image09.jpg'
                    },
                    {
                        title: 'Footer',
                        link: 'restricted.components.footer',
                        image: 'assets/img/gallery/Image10.jpg'
                    },
                    {
                        title: 'Grid',
                        link: 'restricted.components.grid',
                        image: 'assets/img/gallery/Image11.jpg'
                    },
                    {
                        title: 'Icons',
                        link: 'restricted.components.icons',
                        image: 'assets/img/gallery/Image12.jpg'
                    },
                    {
                        title: 'Lightbox/Modal',
                        link: 'restricted.components.modal',
                        image: 'assets/img/gallery/Image13.jpg'
                    },
                    {
                        title: 'Lists',
                        link: 'restricted.components.lists',
                        image: 'assets/img/gallery/Image14.jpg'
                    },
                    {
                        title: 'Nestable',
                        link: 'restricted.components.nestable',
                        image: 'assets/img/gallery/Image15.jpg'
                    },
                    {
                        title: 'Notifications',
                        link: 'restricted.components.notifications',
                        image: 'assets/img/gallery/Image16.jpg'
                    },
                    {
                        title: 'Panels',
                        link: 'restricted.components.panels',
                        image: 'assets/img/gallery/Image17.jpg'
                    },
                    {
                        title: 'Preloaders',
                        link: 'restricted.components.preloaders',
                        image: 'assets/img/gallery/Image18.jpg'
                    },
                    {
                        title: 'Slideshow',
                        link: 'restricted.components.slideshow',
                        image: 'assets/img/gallery/Image19.jpg'
                    },
                    {
                        title: 'Sortable',
                        link: 'restricted.components.sortable',
                        image: 'assets/img/gallery/Image20.jpg'
                    },
                    {
                        title: 'Tables',
                        link: 'restricted.components.tables',
                        image: 'assets/img/gallery/Image21.jpg'
                    },
                    {
                        title: 'Tables Examples',
                        link: 'restricted.components.tables_examples',
                        image: 'assets/img/gallery/Image22.jpg'
                    },
                    {
                        title: 'Tabs',
                        link: 'restricted.components.tabs',
                        image: 'assets/img/gallery/Image23.jpg'
                    },
                    {
                        title: 'Tooltips',
                        link: 'restricted.components.tooltips',
                        image: 'assets/img/gallery/Image24.jpg'
                    },
                    {
                        title: 'Typography',
                        link: 'restricted.components.typography',
                        image: 'assets/img/gallery/Image12.jpg'
                    }
                ];

            // map

            $timeout(function() {

                $scope.map = {
                    zoom: 7,
                    lat: '40.85167',
                    lon: '-93.259932',
                    center: '40.85167, -93.259932',
                    styles: [
                        {
                            "featureType": "water",
                            "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
                        }, {"featureType": "landscape", "stylers": [{"color": "#f2f2f2"}]}, {
                            "featureType": "road",
                            "stylers": [{"saturation": -100}, {"lightness": 45}]
                        }, {
                            "featureType": "road.highway",
                            "stylers": [{"visibility": "simplified"}]
                        }, {
                            "featureType": "road.arterial",
                            "elementType": "labels.icon",
                            "stylers": [{"visibility": "off"}]
                        }, {
                            "featureType": "administrative",
                            "elementType": "labels.text.fill",
                            "stylers": [{"color": "#444444"}]
                        }, {"featureType": "transit", "stylers": [{"visibility": "off"}]}, {
                            "featureType": "poi",
                            "stylers": [{"visibility": "off"}]
                        }
                    ],
                    marker_size: utils.isHighDensity ? [48,48] : [24,24]
                };

                $scope.markers = [
                    {
                        id: 1,
                        lat: '38.35894188',
                        lon: '-92.8538577',
                        company: 'Schroeder, Prohaska and Torphy',
                        address: '72270 Ferry River Apt. 799 Kielview, TN 41930'
                    },
                    {
                        id: 2,
                        lat: '41.05874774',
                        lon: '-92.26713263',
                        company: 'Hintz Inc',
                        address: '1246 O\'Kon Creek Ricechester, IL 57457-2586'
                    },
                    {
                        id: 3,
                        lat: '42.30281602',
                        lon: '-92.06810153',
                        company: 'Koelpin Inc',
                        address: '9105 Stoltenberg Ranch Suite 082 New Halieshire, MA 25245'
                    },
                    {
                        id: 4,
                        lat: '41.68463522',
                        lon: '-91.3404159',
                        company: 'Rowe PLC',
                        address: '445 Alexander Cliff Port Fletcher, OH 82991-9304'
                    },
                    {
                        id: 5,
                        lat: '41.04467876',
                        lon: '-90.08450673',
                        company: 'Lindgren Group',
                        address: '4866 Jabari Summit Joanniefort, OR 85007'
                    },
                    {
                        id: 6,
                        lat: '40.26186925',
                        lon: '-91.03261997',
                        company: 'Haley-Breitenberg',
                        address: '240 Elsie Branch Suite 590 Rowemouth, OK 98400'
                    },
                    {
                        id: 7,
                        lat: '39.09442555',
                        lon: '-96.19775663',
                        company: 'Morar-Gusikowski',
                        address: '97035 Russ Wells Apt. 644 Lake Mustafamouth, WY 68218-8738'
                    },
                    {
                        id: 8,
                        lat: '42.54209076',
                        lon: '-95.22660793',
                        company: 'Baumbach Inc',
                        address: '3875 Giovanna Road Marksfurt, AZ 62188-5926'
                    },
                    {
                        id: 9,
                        lat: '38.50327702',
                        lon: '-91.50773766',
                        company: 'Mueller, Ullrich and Littel',
                        address: '100 Pacocha Corners Suite 216 West Dayton, AK 53585'
                    },
                    {
                        id: 10,
                        lat: '41.40112452',
                        lon: '-90.10399142',
                        company: 'Pouros Inc',
                        address: '592 Victor Wells North Zellabury, MD 35847-1567'
                    },
                    {
                        id: 11,
                        lat: '42.12120442',
                        lon: '-92.29305971',
                        company: 'Tromp-Rodriguez',
                        address: '43744 Jazmyne Canyon Blockborough, AL 00004-6373'
                    },
                    {
                        id: 12,
                        lat: '39.88599415',
                        lon: '-96.61950196',
                        company: 'Renner-Kilback',
                        address: '533 Tess Island North Toneymouth, IA 33513'
                    }
                ];

                // ngmap
                var vm = this;
                vm.initMap = function(mapId) {
                    vm.map = NgMap.initMap(mapId);
                    google.maps.event.trigger(vm.map,'resize');

                    function updateMap() {
                        updateheight();
                        google.maps.event.trigger(vm.map,'resize');
                    }

                    angular.element($window).on('resize', updateMap);

                    $scope.$on("$destroy", function() {
                        $(window).off('resize', updateMap);
                    });

                    // show/hide map locations panel
                    $scope.toogle_places = function($event) {
                        $event.preventDefault();
                        $('.map_search_wrapper').toggleClass('map_search_list_active');
                        updateMap();
                    };

                };

                // show info window
                $scope.showLoc = function(e, marker) {
                    $scope.marker = marker;
                    vm.map.setZoom(12);
                    vm.map.setCenter(new google.maps.LatLng(marker.lat,marker.lon));
                    vm.map.showInfoWindow('marker-iw', this);
                };

                $scope.showMarkeronMap = function($event, marker) {
                    var $this = $($event.currentTarget);
                    $this
                        .addClass('md-list-item-active')
                        .siblings()
                        .removeClass('md-list-item-active');

                    $scope.marker = marker;
                    vm.map.setZoom(12);
                    vm.map.setCenter(new google.maps.LatLng(marker.lat,marker.lon));
                    vm.map.showInfoWindow('marker-iw', vm.map.markers['m_'+marker.id]);
                };

                // set min height for map
                function updateheight() {
                    $('#map_search').css({
                        minHeight: $($window).height() - $('#header_main').height() - 59
                    });
                }
                updateheight();


                // initialize/update map when tab content is visible
                $(".map_search_wrapper").on('display.uk.check', function(){
                    var $this = $(this);
                    if(!$this.hasClass('map_initialized')) {
                        updateheight();
                        vm.initMap('map_search');
                        $this.addClass('map_initialized');
                    }
                });

            })

        }
    ]);