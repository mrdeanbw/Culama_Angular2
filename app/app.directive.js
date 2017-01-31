/*
*  Altair Admin AngularJS
*  directives
*/
;'use strict';

altairApp
    // page title
    .directive('pageTitle', [
        '$rootScope',
        '$timeout',
        function($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function() {
                    var listener = function(event, toState) {
                        var default_title = 'Altair Admin';
                        $timeout(function() {
                            $rootScope.page_title = (toState.data && toState.data.pageTitle)
                                ? default_title + ' - ' + toState.data.pageTitle : default_title;
                        });
                    };
                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            }
        }
    ])
    // add width/height properities to Image
    .directive('addImageProp', [
        '$timeout',
        'utils',
        function ($timeout,utils) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.on('load', function () {
                        $timeout(function() {
                            var w = !utils.isHighDensity() ? $(elem).actual('width') : $(elem).actual('width')/2,
                                h = !utils.isHighDensity() ? $(elem).actual('height') : $(elem).actual('height')/2;
                            $(elem).attr('width',w).attr('height',h);
                        })
                    });
                }
            };
        }
    ])
    // print page
    .directive('printPage', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var message = attrs['printMessage'];
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        UIkit.modal.confirm(message ? message : 'Do you want to print this page?', function () {
                            // hide sidebar
                            $rootScope.primarySidebarActive = false;
                            $rootScope.primarySidebarOpen = false;
                            // wait for dialog to fully hide
                            $timeout(function () {
                                window.print();
                            }, 300)
                        }, {
                            labels: {
                                'Ok': 'print'
                            }
                        });
                    });
                }
            };
        }
    ])
    // full screen
    .directive('fullScreenToggle', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        screenfull.toggle();
                        $(window).resize();
                    });
                }
            };
        }
    ])
    // single card
    .directive('singleCard', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    var $md_card_single = $(elem),
                        w = angular.element($window);

                    function md_card_content_height() {
                        var content_height = w.height() - ((48 * 2) + 12);
                        $md_card_single.find('.md-card-content').innerHeight(content_height);
                    }

                    $timeout(function() {
                        md_card_content_height();
                    },100);

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_card_content_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // outside list
    .directive('listOutside', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $md_list_outside_wrapper = $(elem),
                        w = angular.element($window);

                    function md_list_outside_height() {
                        var content_height = w.height() - ((48 * 2) + 10);
                        $md_list_outside_wrapper.height(content_height);
                    }

                    md_list_outside_height();

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_list_outside_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // callback on last element in ng-repeat
    .directive('onLastRepeat', function ($timeout) {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $timeout(function () {
                    scope.$emit('onLastRepeat', element, attrs);
                })
            }
        };
    })
    // check table row
    .directive('tableCheckAll', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $checkRow = $(elem).closest('table').find('.check_row');

                    $(elem)
                        .on('ifChecked',function() {
                            $checkRow.iCheck('check');
                        })
                        .on('ifUnchecked',function() {
                            $checkRow.iCheck('uncheck');
                        });

                }
            }
        }
    ])
    // table row check
    .directive('tableCheckRow', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attr, ngModel) {

                    var $this = $(elem);

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function(newValue) {
                        if(newValue) {
                            $this.closest('tr').addClass('row_checked');
                        } else {
                            $this.closest('tr').removeClass('row_checked');
                        }
                    });

                }
            }
        }
    ])
    // dynamic form fields
    .directive('formDynamicFields', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr, ngModel) {

                    var $this = $(elem);
                    // clone section
                    $this.on('click','.btnSectionClone', function(e) {
                        e.preventDefault();
                        var $this = $(this),
                            section_to_clone = $this.attr('data-section-clone'),
                            section_number = $(section_to_clone).parent().children('[data-section-added]:last').attr('data-section-added') ? parseInt($(section_to_clone).parent().children('[data-section-added]:last').attr('data-section-added')) + 1 : 1,
                            cloned_section = $(section_to_clone).clone();

                        cloned_section
                            .attr('data-section-added',section_number)
                            .removeAttr('id')
                            // inputs
                            .find('.md-input').each(function(index) {
                                var $thisInput = $(this),
                                    name = $thisInput.attr('name');

                                $thisInput
                                    .val('')
                                    .attr('name',name ? name + '[s_'+section_number +':i_'+ index +']' : '[s_'+section_number +':i_'+ index +']')

                                //altair_md.update_input($thisInput);
                            })
                            .end()
                            // replace clone button with remove button
                            .find('.btnSectionClone').replaceWith('<a href="#" class="btnSectionRemove"><i class="material-icons md-24">&#xE872;</i></a>')
                            .end()
                            // clear checkboxes
                            .find('[data-md-icheck]:checkbox').each(function(index) {
                                var $thisInput = $(this),
                                    name = $thisInput.attr('name'),
                                    id = $thisInput.attr('id'),
                                    $inputLabel = cloned_section.find('label[for="'+ id +'"]'),
                                    newName = name ? name + '-s'+section_number +':cb'+ index +'' : 's'+section_number +':cb'+ index,
                                    newId = id ? id + '-s'+section_number +':cb'+ index +'' : 's'+section_number +':cb'+ index;

                                $thisInput
                                    .attr('name', newName)
                                    .attr('id', newId)
                                    .removeAttr('style').removeAttr('checked').unwrap().next('.iCheck-helper').remove();

                                $inputLabel.attr('for', newId);
                            })
                            .end()
                            // clear radio
                            .find('.dynamic_radio').each(function(index) {
                                var $this = $(this),
                                    thisIndex = index;

                                $this.find('[data-md-icheck]').each(function(index) {
                                    var $thisInput = $(this),
                                        name = $thisInput.attr('name'),
                                        id = $thisInput.attr('id'),
                                        $inputLabel = cloned_section.find('label[for="'+ id +'"]'),
                                        newName = name ? name + '-s'+section_number +':cb'+ thisIndex +'' : '[s'+section_number +':cb'+ thisIndex,
                                        newId = id ? id + '-s'+section_number +':cb'+ index +'' : 's'+section_number +':cb'+ index;

                                    $thisInput
                                        .attr('name', newName)
                                        .attr('id', newId)
                                        .attr('data-parsley-multiple', newName)
                                        .removeAttr('data-parsley-id')
                                        .removeAttr('style').removeAttr('checked').unwrap().next('.iCheck-helper').remove();

                                    $inputLabel.attr('for', newId);
                                })
                            })
                            .end()
                            // switchery
                            .find('[data-switchery]').each(function(index) {
                                var $thisInput = $(this),
                                    name = $thisInput.attr('name'),
                                    id = $thisInput.attr('id'),
                                    $inputLabel = cloned_section.find('label[for="'+ id +'"]'),
                                    newName = name ? name + '-s'+section_number +':sw'+ index +'' : 's'+section_number +':sw'+ index,
                                    newId = id ? id + '-s'+section_number +':sw'+ index +'' : 's'+section_number +':sw'+ index;

                                $thisInput
                                    .attr('name', newName)
                                    .attr('id', newId)
                                    .removeAttr('style').removeAttr('checked').next('.switchery').remove();

                                $inputLabel.attr('for', newId);

                            })
                            .end()
                            // selectize
                            .find('[data-md-selectize]').each(function(index) {
                            var $thisSelect = $(this),
                                name = $thisSelect.attr('name'),
                                id = $thisSelect.attr('id'),
                                orgSelect = $('#'+id),
                                newName = name ? name + '-s'+section_number +':sel'+ index +'' : 's'+section_number +':sel'+ index,
                                newId = id ? id + '-s'+section_number +':sel'+ index +'' : 's'+section_number +':sel'+ index;

                            // destroy selectize
                            var selectize = orgSelect[0].selectize;
                            if(selectize) {
                                selectize.destroy();
                                orgSelect.val('').next('.selectize_fix').remove();
                                var clonedOptions = orgSelect.html();
                                altair_forms.select_elements(orgSelect.parent());

                                $thisSelect
                                    .html(clonedOptions)
                                    .attr('name', newName)
                                    .attr('id', newId)
                                    .removeClass('selectized')
                                    .next('.selectize-control').remove()
                                    .end()
                                    .next('.selectize_fix').remove();
                            }

                        });

                        $(section_to_clone).before(cloned_section);

                        var $newSection = $(section_to_clone).prev();

                        if($newSection.hasClass('form_section_separator')) {
                            $newSection.after('<hr class="form_hr">')
                        }

                        // reinitialize checkboxes
                        //altair_md.checkbox_radio($newSection.find('[data-md-icheck]'));
                        // reinitialize switches
                        //altair_forms.switches($newSection);
                        // reinitialize selectize
                        //altair_forms.select_elements($newSection);

                    });

                    // remove section
                    $this.on('click', '.btnSectionRemove', function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        $this
                            .closest('.form_section')
                            .next('hr').remove()
                            .end()
                            .remove();
                    })

                }
            }
        }
    ])
    // content sidebar
    .directive('contentSidebar', [
        '$rootScope',
        '$document',
        function ($rootScope,$document) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    if(!$rootScope.header_double_height) {
                        $rootScope.$watch('hide_content_sidebar', function() {
                            if($rootScope.hide_content_sidebar) {
                                $('#page_content').css('max-height', $('html').height() - 40);
                                $('html').css({
                                    'paddingRight': scrollbarWidth(),
                                    'overflow': 'hidden'
                                });
                            } else {
                                $('#page_content').css('max-height','');
                                $('html').css({
                                    'paddingRight': '',
                                    'overflow': ''
                                });
                            }
                        });

                    }
                }
            }
        }
    ])
    // attach events to document
    .directive('documentEvents', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    var hidePrimarySidebar = function() {
                        $rootScope.primarySidebarActive = false;
                        $rootScope.primarySidebarOpen = false;
                        $rootScope.hide_content_sidebar = false;
                        $rootScope.primarySidebarHiding = true;
                        $timeout(function() {
                            $rootScope.primarySidebarHiding = false;
                        },280);
                    };

                    var hideSecondarySidebar = function() {
                        $rootScope.secondarySidebarActive = false;
                    };

                    var hideMainSearch = function() {
                        var $header_main = $('#header_main');
                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });
                    };

                    // hide components on $document click
                    scope.onClick = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$($event.target).closest('#sidebar_main').length && !$($event.target).closest('#sSwitch_primary').length && !$rootScope.largeScreen) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( ($rootScope.secondarySidebarActive && !$($event.target).closest('#sidebar_secondary').length && !$($event.target).closest('#sSwitch_secondary').length) && !$rootScope.secondarySidebarPersistent) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && !$($event.target).closest('.header_main_search_form').length && !$($event.target).closest('#main_search_btn').length) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && !$($event.target).closest('#style_switcher').length) {
                            $rootScope.styleSwitcherActive = false;
                        }
                        // sticky notes form
                        if( $rootScope.noteFormActive && !$($event.target).closest('#note_form').length) {
                            $rootScope.noteFormActive = false;
                        }
                    };

                    // hide components on key press (esc)
                    scope.onKeyUp = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$rootScope.largeScreen && $event.keyCode == 27) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( !$rootScope.secondarySidebarPersistent && $rootScope.secondarySidebarActive && $event.keyCode == 27) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && $event.keyCode == 27) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && $event.keyCode == 27) {
                            $rootScope.styleSwitcherActive = false;
                        }
                        // sticky notes form
                        if( $rootScope.noteFormActive && $event.keyCode == 27) {
                            $rootScope.noteFormActive = false;
                        }
                    };

                }
            };
        }
    ])
    // main search show
    .directive('mainSearchShow', [
        '$rootScope',
        '$window',
        'variables',
        '$timeout',
        function ($rootScope, $window, variables, $timeout) {
            return {
                restrict: 'E',
                template: '<a id="main_search_btn" class="user_action_icon" ng-click="showSearch()"><i class="material-icons md-24 md-light">&#xE8B6;</i></a>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.showSearch = function() {

                        $('#header_main')
                            .children('.header_main_content')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $rootScope.mainSearchActive = true;
                                },
                                complete: function() {
                                    $('#header_main')
                                        .children('.header_main_search_form')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').focus();
                                            }
                                        })
                                }
                            });
                    };
                }
            };
        }
    ])
    // main search hide
    .directive('mainSearchHide', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                template: '<i class="md-icon header_main_search_close material-icons" ng-click="hideSearch()">&#xE5CD;</i>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.hideSearch = function () {

                        var $header_main = $('#header_main');

                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });

                    };
                }
            };
        }
    ])

    // primary sidebar
    .directive('sidebarPrimary', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                scope: 'true',
                link: function(scope,el,attr) {

                    var $sidebar_main = $('#sidebar_main');

                    scope.submenuToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $($event.currentTarget),
                            slideToogle = $this.next('ul').is(':visible') ? 'slideUp' : 'slideDown';

                        $this.next('ul')
                            .velocity(slideToogle, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    if(slideToogle == 'slideUp') {
                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                    } else {
                                        if($rootScope.menuAccordionMode) {
                                            $this.closest('li').siblings('.submenu_trigger').each(function() {
                                                $(this).children('ul').velocity('slideUp', {
                                                    duration: 500,
                                                    easing: variables.easing_swiftOut,
                                                    begin: function() {
                                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                                    }
                                                })
                                            })
                                        }
                                        $(this).closest('.submenu_trigger').addClass('act_section')
                                    }
                                },
                                complete: function() {
                                    if(slideToogle !== 'slideUp') {
                                        var scrollContainer = $sidebar_main.find(".scroll-content").length ? $sidebar_main.find(".scroll-content") :  $sidebar_main.find(".scrollbar-inner");
                                        $this.closest('.act_section').velocity("scroll", {
                                            duration: 500,
                                            easing: variables.easing_swiftOut,
                                            container: scrollContainer
                                        });
                                    }
                                }
                            });
                    };

                    $rootScope.$watch('slimSidebarActive', function ( status ) {
                        if(status) {
                            var $body = $('body');
                            $sidebar_main
                                .mouseenter(function() {
                                    $body.removeClass('sidebar_slim_inactive');
                                    $body.addClass('sidebar_slim_active');
                                })
                                .mouseleave(function() {
                                    $body.addClass('sidebar_slim_inactive');
                                    $body.removeClass('sidebar_slim_active');
                                })
                       }
                    });

                }
            };
        }
    ])
    // toggle primary sidebar
    .directive('sidebarPrimaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<a id="sSwitch_primary" href="#" class="sSwitch sSwitch_left" ng-click="togglePrimarySidebar($event)" ng-hide="miniSidebarActive || slimSidebarActive || topMenuActive"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.togglePrimarySidebar = function ($event) {

                        $event.preventDefault();

                        if($rootScope.primarySidebarActive) {
                            $rootScope.primarySidebarHiding = true;
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $rootScope.primarySidebarHiding = false;
                                    $(window).resize();
                                },290);
                            }
                        } else {
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $(window).resize();
                                },290);
                            }
                        }

                        $rootScope.primarySidebarActive = !$rootScope.primarySidebarActive;

                        if( !$rootScope.largeScreen ) {
                            $rootScope.hide_content_sidebar = $rootScope.primarySidebarActive ? true : false;
                        }

                        if($rootScope.primarySidebarOpen) {
                            $rootScope.primarySidebarOpen = false;
                            $rootScope.primarySidebarActive = false;
                        }
                    };

                }
            };
        }
    ])
    // secondary sidebar
    .directive('sidebarSecondary', [
        '$rootScope',
        '$timeout',
        'variables',
        function ($rootScope,$timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attrs) {
                    $rootScope.sidebar_secondary = true;
                    if(attrs.toggleHidden == 'large') {
                        $rootScope.secondarySidebarHiddenLarge = true;
                    }

                    // chat
                    var $sidebar_secondary = $(el);
                    if($sidebar_secondary.find('.md-list.chat_users').length) {

                        $('.md-list.chat_users').on('click', 'li', function() {
                            $('.md-list.chat_users').velocity("transition.slideRightBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $sidebar_secondary
                                        .find('.chat_box_wrapper')
                                        .addClass('chat_box_active')
                                        .velocity("transition.slideRightBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            begin: function() {
                                                $sidebar_secondary.addClass('chat_sidebar')
                                            }
                                        })
                                }
                            });
                        });

                        $sidebar_secondary
                            .find('.chat_sidebar_close')
                            .on('click',function() {
                                $sidebar_secondary
                                    .find('.chat_box_wrapper')
                                    .removeClass('chat_box_active')
                                    .velocity("transition.slideRightBigOut", {
                                        duration: 280,
                                        easing: variables.easing_swiftOut,
                                        complete: function () {
                                            $sidebar_secondary.removeClass('chat_sidebar');
                                            $('.md-list.chat_users').velocity("transition.slideRightBigIn", {
                                                duration: 280,
                                                easing: variables.easing_swiftOut
                                            })
                                        }
                                    })
                            });

                        if($sidebar_secondary.find('.uk-tab').length) {
                            $sidebar_secondary.find('.uk-tab').on('change.uk.tab',function(event, active_item, previous_item) {
                                if($(active_item).hasClass('chat_sidebar_tab') && $sidebar_secondary.find('.chat_box_wrapper').hasClass('chat_box_active')) {
                                    $sidebar_secondary.addClass('chat_sidebar')
                                } else {
                                    $sidebar_secondary.removeClass('chat_sidebar')
                                }
                            })
                        }
                    }

                }
            };
        }
    ])
    // toggle secondary sidebar
    .directive('sidebarSecondaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                template: '<a href="#" id="sSwitch_secondary" class="sSwitch sSwitch_right" ng-show="sidebar_secondary" ng-click="toggleSecondarySidebar($event)"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.toggleSecondarySidebar = function ($event) {
                        $event.preventDefault();
                        $rootScope.secondarySidebarActive = !$rootScope.secondarySidebarActive;
                    };
                }
            };
        }
    ])
    // activate card fullscreen
    .directive('cardFullscreenActivate', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-fullscreen-activate" ng-click="cardFullscreenActivate($event)">&#xE5D0;</i>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenActivate = function ($event) {
                        $event.preventDefault();

                        var $thisCard = $(el).closest('.md-card'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdCard_offset = $thisCard.offset();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add overflow hidden to #page_content (fix for ios)
                        //$body.addClass('md-card-fullscreen-active');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h,
                                'left': mdCard_offset.left,
                                'top': mdCard_offset.top - body_scroll_top
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    //$thisCard.find('.md-card-toolbar').prepend('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left">&#xE5C4;</span>');
                                    //altair_page_content.hide_content_sidebar();
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // activate onResize callback for some js plugins
                                    //$(window).resize();
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    }
                }
            }
        }
    ])
    // deactivate card fullscreen
    .directive('cardFullscreenDeactivate', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                replace: true,
                template: '<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left" ng-show="card_fullscreen" ng-click="cardFullscreenDeactivate($event)">&#xE5C4;</span>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenDeactivate = function ($event) {
                        $event.preventDefault();

                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top - body_scroll_top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                            // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    }
                }
            }
        }
    ])
    // fullscren on card click
    .directive('cardFullscreenWhole', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'A',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    $(el).on('click',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSActivate();
                        }
                    });

                    $(el).on('click','.cardFSDeactivate',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSDeactivate();
                        }
                    });

                    scope.cardFSActivate = function () {
                        var $thisCard = $(el),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    $thisCard.append('<span class="md-icon material-icons uk-position-top-right cardFSDeactivate" style="margin:10px 10px 0 0">&#xE5CD;</span>')
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            }, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    };
                    scope.cardFSDeactivate = function () {
                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                        // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                    $thisCard.find('.cardFSDeactivate').remove();
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    };
                }
            }
        }
    ])
    // card close
    .directive('cardClose', [
        'utils',
        function (utils) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-close" ng-click="cardClose($event)">&#xE14C;</i>',
                link: function (scope, el, attrs) {
                    scope.cardClose = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card'),
                            removeCard = function() {
                                $(thisCard).remove();
                                $(window).resize();
                            };

                        utils.card_show_hide(thisCard,undefined,removeCard);

                    }
                }
            }
        }
    ])
    // card toggle
    .directive('cardToggle', [
        'variables',
        function (variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-toggle" ng-click="cardToggle($event)">&#xE316;</i>',
                link: function (scope, el, attrs) {

                    scope.cardToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card');

                        $(thisCard).toggleClass('md-card-collapsed').children('.md-card-content').slideToggle('280', variables.bez_easing_swiftOut);

                        $this.velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                $(thisCard).hasClass('md-card-collapsed') ? $this.html('&#xE313;') : $this.html('&#xE316;');
                                $this.velocity('reverse');
                                $(window).resize();
                            }
                        });
                    };

                    // hide card content on page load
                    var thisCard = $(el).closest('.md-card');
                    if(thisCard.hasClass('md-card-collapsed')) {
                        var $this_toggle = thisCard.find('.md-card-toggle');

                        $this_toggle.html('&#xE313;');
                        thisCard.children('.md-card-content').hide();
                    }

                }
            }
        }
    ])
    // card overlay toggle
    .directive('cardOverlayToggle', [
        function () {
            return {
                restrict: 'E',
                template: '<i class="md-icon material-icons" ng-click="toggleOverlay($event)">&#xE5D4;</i>',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    if(el.closest('.md-card').hasClass('md-card-overlay-active')) {
                        el.html('&#xE5CD;')
                    }

                    scope.toggleOverlay = function ($event) {

                        $event.preventDefault();

                        if(!el.closest('.md-card').hasClass('md-card-overlay-active')) {
                            el
                                .html('&#xE5CD;')
                                .closest('.md-card').addClass('md-card-overlay-active');

                        } else {
                            el
                                .html('&#xE5D4;')
                                .closest('.md-card').removeClass('md-card-overlay-active');
                        }

                    }
                }
            }
        }
    ])
    // card toolbar progress
    .directive('cardProgress', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    var $this = $(el).children('.md-card-toolbar'),
                        bg_percent = parseInt(attrs.cardProgress);


                    function updateCard(percent) {
                        var bg_color_default = $this.attr('card-bg-default');

                        var bg_color = !bg_color_default ? $this.css('backgroundColor') : bg_color_default;
                        if(!bg_color_default) {
                            $this.attr('card-bg-default',bg_color)
                        }

                        $this
                            .css({ 'background': '-moz-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': '-webkit-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': 'linear-gradient(to right,  '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'});


                        scope.cardPercentage = percent;
                    }

                    updateCard(bg_percent);

                    scope.$watch(function() {
                        return $(el).attr('card-progress')
                    }, function(newValue) {
                        updateCard(newValue);
                    });

                }
            }
        }
    ])
    // custom scrollbar
    .directive('customScrollbar', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    // check if mini sidebar is enabled
                    if(attrs['id'] == 'sidebar_main' && $rootScope.miniSidebarActive) {
                        return;
                    }

                    $(el)
                        .addClass('uk-height-1-1')
                        .wrapInner("<div class='scrollbar-inner'></div>");

                    if(Modernizr.touch) {
                        $(el).children('.scrollbar-inner').addClass('touchscroll');
                    } else {
                        $timeout(function() {
                            $(el).children('.scrollbar-inner').scrollbar({
                                disableBodyScroll: true,
                                scrollx: false,
                                duration: 100
                            });
                        })
                    }

                }
            }
        }
    ])
    // material design inputs
    .directive('mdInput',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                controller: function ($scope,$element) {
                    var $elem = $($element);
                    $scope.updateInput = function() {
                        // clear wrapper classes
                        $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

                        if($elem.hasClass('md-input-danger')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
                        }
                        if($elem.hasClass('md-input-success')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
                        }
                        if($elem.prop('disabled')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
                        }
                        if($elem.hasClass('label-fixed')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                        if($elem.val() != '') {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                    };
                },
                link: function (scope, elem, attrs) {

                    var $elem = $(elem);

                    $timeout(function() {
                        if(!$elem.hasClass('md-input-processed')) {

                            var extraClass = '';
                            if($elem.is('[class*="uk-form-width-"]')) {
                                var elClasses = $elem.attr('class').split (' ');
                                for(var i = 0; i < elClasses.length; i++){
                                    var classPart = elClasses[i].substr(0,14);
                                    if(classPart == "uk-form-width-"){
                                        var extraClass = elClasses[i];
                                    }
                                }
                            }

                            if ($elem.prev('label').length) {
                                $elem.prev('label').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else if ($elem.siblings('[data-uk-form-password]').length) {
                                $elem.siblings('[data-uk-form-password]').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else {
                                $elem.wrap('<div class="md-input-wrapper"/>');
                            }
                            $elem
                                .addClass('md-input-processed')
                                .closest('.md-input-wrapper')
                                .append('<span class="md-input-bar '+extraClass+'"/>');
                        }

                        scope.updateInput();

                    });

                    scope.$watch(function() {
                        return $elem.attr('class'); },
                        function(newValue,oldValue){
                            if(newValue != oldValue) {
                                scope.updateInput();
                            }
                        }
                    );

                    scope.$watch(function() {
                        return $elem.val(); },
                        function(newValue,oldValue){
                            if( !$elem.is(':focus') && (newValue != oldValue) ) {
                                scope.updateInput();
                            }
                        }
                    );

                    $elem
                        .on('focus', function() {
                            $elem.closest('.md-input-wrapper').addClass('md-input-focus')
                        })
                        .on('blur', function() {
                            $timeout(function() {
                                $elem.closest('.md-input-wrapper').removeClass('md-input-focus');
                                if($elem.val() == '') {
                                    $elem.closest('.md-input-wrapper').removeClass('md-input-filled')
                                } else {
                                    $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                }
                            },100)
                        });

                }
            }
        }
    ])
    // material design fab speed dial
    .directive('mdFabSpeedDial',[
        'variables',
        function (variables) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    $(elem)
                        .append('<i class="material-icons md-fab-action-close" style="display:none">&#xE5CD;</i>')
                        .on('click',function(e) {
                            e.preventDefault();

                            var $this = $(this),
                                $this_wrapper = $this.closest('.md-fab-wrapper');

                            if(!$this_wrapper.hasClass('md-fab-active')) {
                                $this_wrapper.addClass('md-fab-active');
                            } else {
                                $this_wrapper.removeClass('md-fab-active');
                            }

                            $this.velocity({
                                scale: 0
                            },{
                                duration: 140,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $this.children().toggle();
                                    $this.velocity({
                                        scale: 1
                                    },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                }
                            })
                        })
                        .closest('.md-fab-wrapper').find('.md-fab-small')
                        .on('click',function() {
                            $(elem).trigger('click');
                        });
                }
            }
        }
    ])
    // material design fab toolbar
    .directive('mdFabToolbar',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $fab_toolbar = $(elem);

                    $fab_toolbar
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var toolbarItems = $fab_toolbar.children('.md-fab-toolbar-actions').children().length;

                            $fab_toolbar.addClass('md-fab-animated');

                            var FAB_padding = !$fab_toolbar.hasClass('md-fab-small') ? 16 : 24,
                                FAB_size = !$fab_toolbar.hasClass('md-fab-small') ? 64 : 44;

                            setTimeout(function() {
                                $fab_toolbar
                                    .width((toolbarItems*FAB_size + FAB_padding))
                            },140);

                            setTimeout(function() {
                                $fab_toolbar.addClass('md-fab-active');
                            },420);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_toolbar.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_toolbar).length) {

                                $fab_toolbar
                                    .css('width','')
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_toolbar.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // material design fab sheet
    .directive('mdFabSheet',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    var $fab_sheet = $(elem);

                    $fab_sheet
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var sheetItems = $fab_sheet.children('.md-fab-sheet-actions').children('a').length;

                            $fab_sheet.addClass('md-fab-animated');

                            setTimeout(function() {
                                $fab_sheet
                                    .width('240px')
                                    .height(sheetItems*40 + 8);
                            },140);

                            setTimeout(function() {
                                $fab_sheet.addClass('md-fab-active');
                            },280);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_sheet.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_sheet).length) {

                                $fab_sheet
                                    .css({
                                        'height':'',
                                        'width':''
                                    })
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_sheet.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // hierarchical show
    .directive('hierarchicalShow', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {


                    var parent_el = $(elem),
                        baseDelay = 60;


                    var add_animation = function(children,length) {
                        children
                            .each(function(index) {
                                $(this).css({
                                    '-webkit-animation-delay': (index * baseDelay) + "ms",
                                    'animation-delay': (index * baseDelay) + "ms"
                                })
                            })
                            .end()
                            .waypoint({
                                element: elem[0],
                                handler: function() {
                                    parent_el.addClass('hierarchical_show_inView');
                                    setTimeout(function() {
                                        parent_el
                                            .removeClass('hierarchical_show hierarchical_show_inView fast_animation')
                                            .children()
                                            .css({
                                                '-webkit-animation-delay': '',
                                                'animation-delay': ''
                                            });
                                    }, (length*baseDelay)+1200 );
                                    this.destroy();
                                },
                                context: window,
                                offset: '90%'
                            });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                       if($rootScope.pageLoaded) {
                           var children = parent_el.children(),
                               children_length = children.length;

                           $timeout(function() {
                               add_animation(children,children_length)
                           },560)

                       }
                    });

                }
            }
        }
    ])
    // hierarchical slide in
    .directive('hierarchicalSlide', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $this = $(elem),
                        baseDelay = 100;

                    var add_animation = function(children,context,childrenLength) {
                        children.each(function(index) {
                            $(this).css({
                                '-webkit-animation-delay': (index * baseDelay) + "ms",
                                'animation-delay': (index * baseDelay) + "ms"
                            })
                        });
                        $this.waypoint({
                            handler: function() {
                                $this.addClass('hierarchical_slide_inView');
                                $timeout(function() {
                                    $this.removeClass('hierarchical_slide hierarchical_slide_inView');
                                    children.css({
                                        '-webkit-animation-delay': '',
                                        'animation-delay': ''
                                    });
                                }, (childrenLength*baseDelay)+1200 );
                                this.destroy();
                            },
                            context: context[0],
                            offset: '90%'
                        });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                        if($rootScope.pageLoaded) {
                            var thisChildren = attrs['slideChildren'] ? $this.children(attrs['slideChildren']) : $this.children(),
                                thisContext = attrs['slideContext'] ? $this.closest(attrs['slideContext']) : 'window',
                                thisChildrenLength = thisChildren.length;

                            if(thisChildrenLength >= 1) {
                                $timeout(function() {
                                    add_animation(thisChildren,thisContext,thisChildrenLength)
                                },560)
                            }
                        }
                    });

                }
            }
        }
    ])
    // preloaders
    .directive('mdPreloader',[
        function () {
            return {
                restrict: 'E',
                scope: {
                    width: '=?',
                    height: '=?',
                    strokeWidth: '=?',
                    style: '@?'
                },
                template: '<div class="md-preloader{{style}}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" ng-attr-height="{{ height }}" ng-attr-width="{{ width }}" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" ng-attr-stroke-width="{{ strokeWidth }}"/></svg></div>',
                link: function (scope, elem, attr) {

                    scope.width = scope.width ? scope.width : 48;
                    scope.height = scope.height ? scope.height : 48;
                    scope.strokeWidth = scope.strokeWidth ? scope.strokeWidth : 4;

                    attr.$observe('warning', function() {
                        scope.style = ' md-preloader-warning'
                    });

                    attr.$observe('success', function() {
                        scope.style = ' md-preloader-success'
                    });

                    attr.$observe('danger', function() {
                        scope.style = ' md-preloader-danger'
                    });

                }
            }
        }
    ])
    .directive('preloader',[
        '$rootScope',
        'utils',
        function ($rootScope,utils) {
            return {
                restrict: 'E',
                scope: {
                    width: '=?',
                    height: '=?',
                    style: '@?'
                },
                template: '<img src="assets/img/spinners/{{style}}{{imgDensity}}.gif" alt="" ng-attr-width="{{width}}" ng-attr-height="{{height}}">',
                link: function (scope, elem, attrs) {

                    scope.width = scope.width ? scope.width : 32;
                    scope.height = scope.height ? scope.height : 32;
                    scope.style = scope.style ? scope.style : 'spinner';
                    scope.imgDensity = utils.isHighDensity() ? '@2x' : '' ;

                    attrs.$observe('warning', function() {
                        scope.style = 'spinner_warning'
                    });

                    attrs.$observe('success', function() {
                        scope.style = 'spinner_success'
                    });

                    attrs.$observe('danger', function() {
                        scope.style = 'spinner_danger'
                    });

                    attrs.$observe('small', function() {
                        scope.style = 'spinner_small'
                    });

                    attrs.$observe('medium', function() {
                        scope.style = 'spinner_medium'
                    });

                    attrs.$observe('large', function() {
                        scope.style = 'spinner_large'
                    });

                }
            }
        }
    ])
    // uikit components
    .directive('ukHtmlEditor',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function() {
                        UIkit.htmleditor(elem[0], {
                            'toolbar': '',
                            'height': '240'
                        });
                    });
                }
            }
        }
    ])
    .directive('ukNotification',[
        '$window',
        function ($window) {
            return {
                restrict: 'A',
                scope: {
                    message: '@',
                    status: '@?',
                    timeout: '@?',
                    group: '@?',
                    position: '@?',
                    callback: '&?'
                },
                link: function (scope, elem, attrs) {

                    var w = angular.element($window),
                        $element = $(elem);

                    scope.showNotify = function() {
                        var thisNotify = UIkit.notify({
                            message: scope.message,
                            status: scope.status ? scope.status : '',
                            timeout: scope.timeout ? scope.timeout : 5000,
                            group: scope.group ? scope.group : '',
                            pos: scope.position ? scope.position : 'top-center',
                            onClose: function() {
                                $('body').find('.md-fab-wrapper').css('margin-bottom','');
                                clearTimeout(thisNotify.timeout);

                                if(scope.callback) {
                                    if( angular.isFunction(scope.callback()) ) {
                                        scope.$apply(scope.callback());
                                    } else {
                                        console.log('Callback is not a function');
                                    }
                                }

                            }
                        });
                        if(
                            ( (w.width() < 768) && (
                                (scope.position == 'bottom-right')
                                || (scope.position == 'bottom-left')
                                || (scope.position == 'bottom-center')
                            ) )
                            || (scope.position == 'bottom-right')
                        ) {
                            var thisNotify_height = $(thisNotify.element).outerHeight(),
                                spacer = (w.width() < 768) ? -6 : 8;
                            $('body').find('.md-fab-wrapper').css('margin-bottom',thisNotify_height + spacer);
                        }
                    };

                    $element.on("click", function(){
                        if($('body').find('.uk-notify-message').length) {
                            $('body').find('.uk-notify-message').click();
                            setTimeout(function() {
                                scope.showNotify()
                            },450)
                        } else {
                            scope.showNotify()
                        }
                    });

                }
            }
        }
    ])
;