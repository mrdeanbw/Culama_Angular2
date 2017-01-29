angular
    .module('altairApp')
    .controller('chatboxesCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        'utils',
        function ($scope,$rootScope,$timeout,utils) {

            $rootScope.secondarySidebarPersistent = true;
            $rootScope.secondarySidebarActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.secondarySidebarPersistent = false;
                $rootScope.secondarySidebarActive = false;
            });

            var $chatbox_wrapper = $('#chatbox_wrapper');

            // disable page scroll when scrolling chatbox content
            $chatbox_wrapper.on( 'mousewheel DOMMouseScroll', '.chatbox_content', function (e) {
                var e0 = e.originalEvent;
                var delta = e0.wheelDelta || -e0.detail;
                this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                e.preventDefault();
            });

            $scope.chat_users = [
                {
                    id: 1,
                    name: 'Asia Kovacek',
                    avatar: 'assets/img/avatars/avatar_04_tn.png',
                    status: 'online',
                    info: 'Non tenetur atque eius',
                    conversation: [
                        {
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'lorem ipsum dolor sit amet...'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Enim, est, quasi. Accusamus adipisci consequuntur exercitationem inventore itaque'
                                }
                            ]
                        },
                        {
                            own: true,
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'Accusamus adipisci consequuntur exercitationem inventore itaque'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'consequuntur exercitationem inventore itaque'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'Max Bernhard',
                    avatar: 'assets/img/avatars/avatar_05_tn.png',
                    status: 'offline',
                    info: 'Repudiandae aperiam et consequunt',
                    conversation: [
                        {
                            own: true,
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'Accusamus adipisci consequuntur exercitationem inventore itaque'
                                }
                            ]
                        },
                        {
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, est, quasi. Accusamus adipisci consequuntur exercitationem inventore itaque'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Enim, est, quasi. Accusamus adipisci consequuntur exercitationem inventore itaque'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 3,
                    name: 'Gabriella Emard',
                    avatar: 'assets/img/avatars/avatar_08_tn.png',
                    status: 'busy',
                    info: 'Officiis et fugiat reiciendis ut',
                    conversation: [
                        {
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'lorem ipsum dolor sit amet...'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, est, quasi. Accusamus adipisci consequuntur exercitationem inventore itaque'
                                }
                            ]
                        },
                        {
                            own: true,
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 4,
                    name: 'Opal Swaniawski',
                    avatar: 'assets/img/avatars/avatar_07_tn.png',
                    status: 'online',
                    info: 'Nihil animi nulla ea',
                    conversation: [
                        {
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'lorem ipsum dolor sit amet...'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, est, quasi. Accusamus adipisci consequuntur exercitationem inventore itaque'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Enim, est, quasi. Accusamus adipisci consequuntur exercitationem inventore itaque'
                                }
                            ]
                        },
                        {
                            own: true,
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'Accusamus adipisci consequuntur exercitationem inventore itaque'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'consequuntur exercitationem inventore itaque'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 5,
                    name: 'Morton Hammes',
                    avatar: 'assets/img/avatars/avatar_09_tn.png',
                    status: 'online',
                    info: 'Unde assumenda voluptatem',
                    conversation: [
                        {
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'lorem ipsum dolor sit amet...'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, est, quasi. Accusamus adipisci consequuntur exercitationem inventore itaque'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Enim, est, quasi. Accusamus adipisci consequuntur exercitationem inventore itaque'
                                }
                            ]
                        },
                        {
                            own: true,
                            messages: [
                                {
                                    time: 1473940165000,
                                    text: 'Accusamus adipisci consequuntur exercitationem inventore itaque'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'consequuntur exercitationem inventore itaque'
                                },
                                {
                                    time: 1473940165000,
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
                                }
                            ]
                        }
                    ]
                }
            ];

            $scope.startChat = function($event,id) {
                $event.preventDefault();
                $scope.activeUser = utils.findById($scope.chat_users, id);
                if(!$scope.activeUser.active) {
                    $scope.activeUser.active = true;
                    $scope.makeActive(null,id);
                }
            };

            $scope.makeActive = function($event,id) {
                $chatbox_wrapper.find('.cb_active').removeClass('cb_active');
                if($event) {
                    $event.preventDefault();
                    if($($event.target).closest('.chatbox_close').length) {
                        return;
                    }
                    $($event.currentTarget)
                        .addClass('cb_active')
                        .find('.message_input').focus();
                } else {
                    $timeout(function() {
                        var $chatbox = $chatbox_wrapper.find('.chatbox[data-id="'+id+'"]');

                            $chatbox
                                .addClass('cb_active')
                                .find('.message_input').focus();

                        var $chatbox_content = $chatbox.find('.chatbox_content');

                        $chatbox_content.scrollTop($chatbox_content[0].scrollHeight);

                    })
                }
            };

            $(document).on('click',function(e) {
                if(!$(e.target).closest('.chatbox').length) {
                    $chatbox_wrapper.find('.cb_active').removeClass('cb_active');
                }
            });

            $scope.closeChatbox = function($event,id) {
                $event.preventDefault();
                $($event.target).closest('.chatbox').addClass('removing');
                $scope.activeUser = utils.findById($scope.chat_users, id);
                $timeout(function() {
                    delete $scope.activeUser.active;
                },280);
            };

            $scope.sendMessage = function($event,id,index) {
                $event.preventDefault();

                $scope.activeUser = utils.findById($scope.chat_users, id);

                var code = $event.keyCode || $event.which,
                    inptVal = $scope.activeUser.inptMessage;

                if (code == 13 && inptVal != '') {

                    var $chatbox = $($event.target).closest('.chatbox'),
                        $chatbox_content = $chatbox.find('.chatbox_content');

                    var conversation = $scope.activeUser.conversation,
                        last_conversation = conversation[conversation.length-1];

                    if(last_conversation.own) {
                        last_conversation.messages.push({
                            'text': inptVal,
                            'time': new Date().getTime()
                        });
                    } else {
                        conversation.push({
                            'own': true,
                            'messages': [
                                {
                                    'text': inptVal,
                                    'time': new Date().getTime()
                                }
                            ]
                        });
                    }

                    delete $scope.activeUser.inptMessage;

                    $timeout(function() {
                        $chatbox_content.scrollTop($chatbox_content[0].scrollHeight);
                    })

                }
            }

        }
    ]);